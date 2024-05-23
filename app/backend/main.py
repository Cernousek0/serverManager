from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

## home page (create or select server)
@app.get("/")
def index():
    return {"index"}   

## get selected server console
@app.get("/server/{server_id}")
def get_server(server_id: str):
    return {"server_id": server_id}

## create or delete server
@app.post("/server/create/{userid}")
def create_server(userid: str, game: str):
    return {"status": "server created", "userid": userid, "game": game}

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

