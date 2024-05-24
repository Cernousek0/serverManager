from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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
@app.post("/server/create/{user_id}")
def create_server(user_id: str):


    return {"status": "server created", "userid": user_id}

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
    if server_id in ["server1", "server2", "server3"]:
        return True


# gets server config file
def getServerConfig(server_id: str):
    # return {"server1": {"game": "minecraft", "port": 25565}, "server2": {"game": "terraria", "port": 7777}, "server3": {"game": "factorio", "port": 34197}}
    return



# create 
def createServerFiles(game, version):
    

    return


