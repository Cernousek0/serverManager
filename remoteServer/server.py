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

@app.get("/user/logout")
def logout_user():
    return {"status": "logged out"}

@app.get("/api/versions")
def get_versions():
    return {"versions": [
        {"id": "1fd4", "name": "1.17.1"},
        {"id": "2fd4", "name": "1.16.5"},
        {"id": "3fd4", "name": "1.15.2"},
        {"id": "4fd4", "name": "1.14.4"},
        {"id": "5fd4", "name": "1.13.2"},
        {"id": "6fd4", "name": "1.12.2"},
        {"id": "7fd4", "name": "1.11.2"},
        {"id": "8fd4", "name": "1.10.2"},
        {"id": "9fd4", "name": "1.9.4"},
        {"id": "10fd4", "name": "1.8.9"},
        {"id": "11fd4", "name": "1.7.10"},
        {"id": "12fd4", "name": "1.6.4"},
        {"id": "13fd4", "name": "1.5.2"},
        {"id": "14fd4", "name": "1.4.7"},
        {"id": "15fd4", "name": "1.3.2"},
        {"id": "16fd4", "name": "1.2.5"},
        {"id": "17fd4", "name": "1.1.2"},
        {"id": "18fd4", "name": "1.0.0"}
    ]}



