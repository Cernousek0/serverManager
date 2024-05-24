from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
import os
import json
import uuid

app = FastAPI()

serverFilesPath = "app/servers/"
## home page (create or select server)
@app.get("/")
def index():
    return {"index"}   

## get selected server console
@app.get("/server/{server_id}")
def get_server(server_id : str):

    if not isServerValid(server_id):
        return {"error": "Server not found, try restarting the app or selecting a different server. If the problem persists, get server confing from backup."}

    serverConfig = getServerConfig(server_id)
    return serverConfig

## create or delete server
@app.post("/server/create")
async def create_server(request: Request):
    payload = await request.json()

    server = createServerConfig(payload["user_id"], payload["name"], payload["game"], payload["version"], "2021-09-01", payload["type"] ,payload["mods"], payload["plugins"])
    return server

@app.post("/server/{server_id}/delete")
def delete_server(server_id: str):
    return {"status": "server deleted", "server_id": server_id}


## server controller
@app.get("/server/{server_id}/start")
def start_server(server_id: str):
    return {"status": "server started", "server_id": server_id}

@app.get("/server/{server_id}/stop")
def stop_server(server_id: str):
    return {"status": "server stopped"}

@app.get("/server/{server_id}/restart")
def restart_server(server_id: str):
    return {"status": "server restarted"}


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

    return server_id


