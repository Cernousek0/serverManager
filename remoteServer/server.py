from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session


app = FastAPI()

@app.get("/user/create")
def create_user():
    return {"status": "user created"}

@app.get("/user/login")

def login_user():
    return {"status": "logged in"} 


