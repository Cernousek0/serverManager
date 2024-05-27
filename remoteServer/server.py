from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json


server = FastAPI()

# user management
@server.post("/user/create")
def create_user():
    return {"status": "user created"}

@server.post("/user/login")

def login_user():
    return {"status": "logged in"} 

@server.get("/user/logout")
def logout_user():
    return {"status": "logged out"}

# get available versions, depending on the game
@server.get("/api/versions/{game}/{type}")
def get_versions(game: str, type: str):

    if(game == "minecraft"):
        return getMinecraftVersions(type)
    elif(game == "terraria"):
        return

## get minecraft versions depending on the type
def getMinecraftVersions(type: str):
    with open (f"remoteServer/minecraft/{type}.json", "r") as file:
        versions = json.load(file)
    return versions["versions"]
        
    



