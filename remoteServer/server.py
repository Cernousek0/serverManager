from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from database import init_db
from dotenv import load_dotenv
import os
from models import Game

server = FastAPI()

# on server start
def onLoad():
    load_dotenv()
    global db
    db = init_db(os.getenv("DB_USER"), os.getenv("DB_HOST"), os.getenv("DB_PASSWORD"), os.getenv("DB_NAME"), os.getenv("DB_PORT"))()
    games = db.query(Game).all()

    print([game.output() for game in games])

server.add_event_handler("startup", onLoad)



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

# get available versions, depending on the game and type
@server.get("/api/versions/{game}/{type}")
def get_versions(game: str, type: str):
    
    return

## get minecraft versions depending on the type
def getMinecraftVersions(type: str):
    with open (f"remoteServer/minecraft/{type}.json", "r") as file:
        versions = json.load(file)
    return versions["versions"]
        
    



