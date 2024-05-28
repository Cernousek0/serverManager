from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
import os
import json
import uuid
import requests
import re
import time

app = FastAPI()

serverFilesPath = "app/servers/"
remoteServerUrl = "http://localhost:6000/"


@app.get("/")
# get all servers
@app.get("/server/all")
def getAllServers():
    servers = []
    for folder in os.listdir(serverFilesPath):
        configFile = os.path.join(serverFilesPath, folder, "config.json")
        if os.path.exists(configFile):
           servers.append(json.load(open(configFile, "r")))

    return servers
            
# get selected server console
@app.get("/server/{server_id}")
def get_server(server_id : str):

    if not isServerValid(server_id):
        return {"error": "Server not found, try restarting the app or selecting a different server. If the problem persists, get server confing from backup."}

    serverConfig = getServerConfig(server_id)
    return serverConfig

# create server
@app.post("/server/create")
async def create_server(request: Request):
    payload = await request.json()

    config = createServerConfig(payload["user_id"], payload["name"], payload["game"], payload["version"], "2021-09-01", payload["type"] ,payload["mods"], payload["plugins"])
    if("error" in config):
        return config
    
    return downloadServerFiles(config['serverId'], payload["game"], payload["version"], payload["type"])


# delete server
@app.post("/server/{server_id}/delete")
def delete_server(server_id: str):
    return {"status": "server deleted", "server_id": server_id}


# server controller
@app.get("/server/{server_id}/start")
def start_server(server_id: str):
    return {"status": "server started", "server_id": server_id}

@app.get("/server/{server_id}/stop")
def stop_server(server_id: str):
    return {"status": "server stopped"}

@app.get("/server/{server_id}/restart")
def restart_server(server_id: str):
    stop_server(server_id)
    time.sleep(5)
    start_server(server_id)


# json = {
#     "status": 200,
#     "server_info": {
#         "id": "1fd4",
#         "name": "kar",
#         "game": "Minecraft"
#     }

# }


# ------ Functions  ---------- #

# check if server exists in files
def isServerValid(server_id: str):
    if server_id in os.listdir(serverFilesPath):
        return True


# gets server config file
def getServerConfig(server_id: str):
    path = os.path.join(serverFilesPath, server_id, "config.json")
    return json.load(open(path, "r"))


# create server
def createServerConfig(user_id, name, game, version, created_at, type, mods, plugins):

   ## check if game is valid
    if game not in ["Minecraft"]:
        return {"error": "Game not supported"}
    
        ## check if server type is valid
    if type not in ["forge", "vanilla", "fabric"]:
        return {"error": "Server type not supported"}
    
    ## check if version is valid
    if not isValidVersion(game, version):
        return {"error": "Invalid version"}
    
    server_id = str(uuid.uuid4())[:8]
    path = serverFilesPath + server_id

    # create server folder
    os.makedirs(path, exist_ok=True)

    # setup config file
    config_file = os.path.join(path, "config.json")
    cofing_data = {
        "created_by": user_id,
        "name": name,
        "game" : game,
        "version": version,
        "created_at": created_at,
        "type": type,
        "mods": mods,
        "plugins": plugins
    }

    # write config file
    with open(config_file, "w") as f:
        json.dump(cofing_data, f, indent=3)

    return {"server_id": server_id}


def downloadServerFiles(server_id: str, game: str, version: str, type: str):

    

    
    url = f"https://mcutils.com/api/server-jars/{type}/{version}/download"
    
    # default filename incase download doesn't have it
    filename = server_id    

    try:
        response = requests.get(url)
        response.raise_for_status()
        content_disposition = response.headers.get('content-disposition')
        if content_disposition:
            filename = re.findall('filename="(.+)"', content_disposition)[0]

        file_path = os.path.join(f"{serverFilesPath}/{server_id}", f"{filename}.jar")

        if response.status_code != 200:
            return {"error": "Server files not found"}
        
        ## save the file
        with open(file_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

    except requests.RequestException as e:
        return {"error": str(e)}
    except PermissionError as e:
        return {"error": f"Permission denied: {e}"}
    except Exception as e:
        return {"error": f"An error occurred: {e}"}
    
    return {"success": True, "path": file_path}

def isValidVersion(game: str, version: str):

    try:
        ## get versions from server
        response = requests.get(remoteServerUrl + "api/versions/" + game)
        data = response.json()
        return version in data["versions"]
    except Exception as e:
        return {"error": f"An error occurred: {e}"}


    






