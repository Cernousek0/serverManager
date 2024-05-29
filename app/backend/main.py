from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
import os
import json
import uuid
import requests
import re
import time
import subprocess
import docker
import shutil

app = FastAPI()

serverFilesPath = "app/servers/"
remoteServerUrl = "http://localhost:2895/"


@app.get("/")

@app.get("/server/all")
# get all servers
def getAllServers():
    servers = []
    for folder in os.listdir(serverFilesPath):
        configFile = os.path.join(serverFilesPath, folder, "config.json")
        if os.path.exists(configFile):
           servers.append(json.load(open(configFile, "r")))

    return servers
            
@app.get("/server/{server_id}")
# get selected server console
def get_server(server_id : str):

    if not isServerValid(server_id):
        return {"error": "Server not found, try restarting the app or selecting a different server. If the problem persists, get server confing from backup."}

    serverConfig = getServerConfig(server_id)
    return serverConfig

@app.get("/server/{server_id}/logs")
# get selected server logs
def get_server_logs(server_id : str):
    try:
        # Get the logs from the Docker container
        logs = subprocess.check_output(['docker', 'logs', server_id]).decode('utf-8')
        return logs
    except subprocess.CalledProcessError as e:
        return {"error": "Failed to get logs"}

@app.get("/server/{server_id}/performance")
# get selected server performance
def get_server_performance(server_id : str):
    client = docker.from_env()
    server_id = "mc-server"
    try:
        container = client.containers.get(server_id)
        stats = container.stats(stream=False)
        
        # CPU usage calculation
        cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - stats['precpu_stats']['cpu_usage']['total_usage']
        system_delta = stats['cpu_stats']['system_cpu_usage'] - stats['precpu_stats']['system_cpu_usage']
        number_cpus = len(stats['cpu_stats']['cpu_usage']['percpu_usage'])
        cpu_usage = (cpu_delta / system_delta) * number_cpus * 100.0
        
        # Memory usage
        mem_usage = stats['memory_stats']['usage']
        mem_limit = stats['memory_stats']['limit']
        mem_percentage = (mem_usage / mem_limit) * 100.0

        # Get disk usage inside the container
        disk_usage = subprocess.check_output([
            'docker', 'exec', server_id, 'du', '-sh', '/data'
        ]).decode('utf-8').split()[0]
        
        return {
        'cpu_usage': cpu_usage,              # Percentage of CPU usage (%)
        'mem_percentage': mem_percentage,    # Percentage of memory usage (%)
        'disk_usage': disk_usage             # Disk usage in the container (M)
    }
    except docker.errors.NotFound:
        return {"error": "Container not found"}
    except Exception as e:
        return {"error": "An error occurred"}


@app.get("/server/{server_id}/players")
# get selected server players
def get_server_players(server_id : str):

    client = docker.from_env()
    container = client.containers.get(server_id)

    # Use the 'rcon-cli' command to execute Minecraft server commands
    result = container.exec_run('rcon-cli list')
    output = result.output.decode('utf-8').strip()

    # Print the raw output for debugging
    print(f"Raw output: {output}")

    # Example output: "There are 1 of a max 20 players online: player1"
    # Or: "There are 0 of a max 20 players online:"
    # We need to extract player names from the output
    if ":" in output:
        player_part = output.split(":")[1].strip()
        if player_part:
            player_list = player_part.split(", ")
        else:
            player_list = []
    else:
        player_list = []
    
    # get number of players joined
    player_count = len(player_list)

    return json.dumps({"players": player_list, "total": player_count})

@app.post("/server/create")
# create server
async def create_server(request: Request):
    payload = await request.json()

    config = createServerConfig(payload["user_id"], payload["name"], payload["game"], payload["version"], "2021-09-01", payload["type"] ,payload["mods"], payload["plugins"])
    if("error" in config):
        return config
    
    # downloadServerFiles(config['serverId'], payload["game"], payload["version"], payload["type"])
    if(payload["type"] == "Vanilla"):
        return createMinecraftVanilla(config["server_id"]), config["server_id"]

@app.post("/server/{server_id}/delete")
# delete server
def delete_server(server_id: str):
    return {"status": "server deleted", "server_id": server_id}

@app.get("/server/{server_id}/start")
# server controller
def start_server(server_id: str):
    # server_directory = os.path.join(serverFilesPath, server_id)
    # try:
    #     subprocess.run(['docker-compose', 'up', '-d'], cwd=server_directory, check=True)
    #     return {"status": "Server started successfully"}
    # except subprocess.CalledProcessError as e:
    #     return {"error": "Failed to start the server"}
    return

@app.post("/server/{server_id}/config/upload")
# upload server configuration
async def upload_config(server_id: str):
    with open(f"{serverFilesPath}/{server_id}/config.json", 'rb') as file:
        # Send the file via POST request
        print(f"{remoteServerUrl}/config/upload")
        response = requests.post(f"{remoteServerUrl}/config/upload", files={'file': file}, data={'server_id': server_id})

    return response.json()
@app.get("/server/{server_id}/stop")
def stop_server(server_id: str):
    return {"status": "server stopped"}

@app.get("/server/{server_id}/restart")
def restart_server(server_id: str):
    stop_server(server_id)
    time.sleep(5)
    start_server(server_id)





# ------ Functions  ---------- #

# check if server exists in filestructure
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
    if type not in ["Forge", "Vanilla", "Fabric"]:
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
    

def createMinecraftVanilla(server_id):
    
     # Ensure the server directory exists
    server_directory = os.path.join(serverFilesPath, server_id)
    os.makedirs(server_directory, exist_ok=True)

    # Create a docker-compose.yml file in the server directory
    docker_compose_content = f"""
version: '3'

services:
    minecraft:
        image: itzg/minecraft-server
        container_name: {server_id}
        ports:
            - "25565:25565"
        environment:
            EULA: "TRUE"
            VERSION: "LATEST"
        volumes:
            - ./data:/data
    """
    docker_compose_path = os.path.join(server_directory, 'docker-compose.yml')
    with open(docker_compose_path, 'w') as file:
        file.write(docker_compose_content)

    # Run docker-compose up to start the server
    try:
        print(server_directory)
        subprocess.run(['docker-compose', 'up', '-d'], cwd=server_directory, check=True)
        print(f"Minecraft server '{server_id}' created and started at {server_directory}")
    except subprocess.CalledProcessError as e:
        print(f"Error starting the Minecraft server: {e}")
        # removeUnsuccesfullServer(server_id)
        return {"error": "Failed to start the server"}

    # Verify the container is running
    try:
        container_status = subprocess.check_output(['docker', 'ps', '-f', f"name={server_id}"], cwd=server_directory).decode('utf-8')
        if server_id not in container_status:
            removeUnsuccesfullServer(server_id)
            return {"error": "Server container is not running"}
    except subprocess.CalledProcessError as e:
        removeUnsuccesfullServer(server_id)
        return {"error": "Failed to check container status"}

    return {"status": "Server started successfully"}

def removeUnsuccesfullServer(server_id: str):
    path = os.path.join(serverFilesPath, server_id)
    try:
        shutil.rmtree(path)
        print(f"Složka {path} byla úspěšně smazána.")
    except PermissionError as e:
        print(f"Přístup byl odepřen: {e}")
    except FileNotFoundError as e:
        print(f"Složka nebyla nalezena: {e}")
    except Exception as e:
        print(f"Došlo k chybě při mazání složky: {e}")



    






