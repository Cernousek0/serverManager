from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import json
from database import init_db, get_db
from dotenv import load_dotenv
import os
from models import Game, Type, Version, User
from sqlalchemy.orm import Session

server = FastAPI()

@server.on_event("startup")
def onLoad():
    load_dotenv()
    init_db(
        user=os.getenv("DB_USER"),
        host=os.getenv("DB_HOST"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=os.getenv("DB_PORT")
    )

server.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


@server.get("/api/games/all")
def getAllGames(db: Session = Depends(get_db)):
    games = db.query(Game).all()
    return [game.toArray() for game in games]

# get server types depending on the game
@server.get("/api/types/{game_id}")
def getServerTypes(game_id: str, db: Session = Depends(get_db)):
    return db.query(Type).filter(Type.game_id == game_id).all()

# get available versions, depending on the game and type
@server.get("/api/versions/{type_id}")
def get_versions(type_id: str, db: Session = Depends(get_db)):
    return db.query(Version).filter(Version.type_id == type_id).all()

# get Minecraft versions depending on the type
@server.get("/api/minecraft_versions/{type}")
def getMinecraftVersions(type: str):
    with open(f"remoteServer/minecraft/{type}.json", "r") as file:
        versions = json.load(file)
    return versions["versions"]
