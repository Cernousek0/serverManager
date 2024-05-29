from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import json
from database import init_db, get_db
from dotenv import load_dotenv
import os
from models import Game, Type, Version, User, Config
from sqlalchemy.orm import Session
from fastapi.requests import Request
import bcrypt
import re
from fastapi import File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException


server = FastAPI()

configs_path = "serverManager/remoteServer/configs"

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

# List of allowed origins
origins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:2895",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:2895"
]

# Add CORSMiddleware
server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# user management
@server.post("/user/create")
    # register user
async def create_user(request: Request, db: Session = Depends(get_db)):
    data = await request.json()

    email = data["email"]
    password = data["password"]
    passwordConfirm = data["passwordConfirm"]

    # check if email is valid
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return {"error": "Invalid email"}
    
    if(password != passwordConfirm):
        return {"error": "Passwords do not match"}
    
    # check if user exists
    user = db.query(User).filter(User.email == email).first()
    if user:
        return {"error": "User already exists"}
    
    # hash password
    password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # create user
    user = User(email=email, password=password)
    db.add(user)
    db.commit()

    return  {"status": "User created"}

@server.post("/user/login")
    # login user
async def login_user(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    
    email = data["email"]
    password = data["password"]

    # get user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"error": "User not found"}
    
    # check password
    if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        return {"error": "Invalid password"}
    
    return {"status": "logged in"}

@server.get("/user/logout")
# logout user
async def logout_user():
    return {"status": "logged out"}


@server.get("/api/games/all")
# get all games
def getAllGames(db: Session = Depends(get_db)):
    games = db.query(Game).all()
    return [game.toArray() for game in games]

@server.get("/api/types/{game_id}")
# get server types depending on the game
def getServerTypes(game_id: str, db: Session = Depends(get_db)):
    return db.query(Type).filter(Type.game_id == game_id).all()

@server.get("/api/versions/{type_id}")
# get available versions, depending on the game and type
def get_versions(type_id: str, db: Session = Depends(get_db)):
    return db.query(Version).filter(Version.type_id == type_id).all()

@server.post("/config/upload")
# upload server configuration
async def upload_config(file: UploadFile = File(...), db: Session = Depends(get_db), server_id: str = Form(...)):
    contents = await file.read()

    # Ensure the file is not empty
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    
     # Convert the file to a  JSON object
    try:
        data = json.loads(contents)
        game = data[0].get("game")
        
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {str(e)}")
    


    # Save the file to the server
    os.makedirs(f"{configs_path}/{server_id}", exist_ok=True)
    file_path = os.path.join(f"{configs_path}/{server_id}", f"uploaded_{file.filename}")
    with open(file_path, "wb") as f:
        f.write(contents)


    

    game_id = db.query(Game).filter(Game.name == game).first().id
    if not game_id:
        return JSONResponse({"error": "Game is not valid!"})
    print(game_id)
    db.add(Config(url=file_path, user_id=4, game_id=game_id.id))
    # db.commit()
    return JSONResponse({"status": "File uploaded successfully"})


