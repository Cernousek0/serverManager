import uvicorn
from database import init_db
import os
from dotenv import load_dotenv


def startServer():
    ## load env variables
    load_dotenv()

    startDB()
    # startUvicorn()


def startUvicorn():
    ## start hosting
    print("Starting Server...")
    uvicorn.run("server:app", port=6000, log_level="debug", reload=True)

def startDB():
    ## db connection
    print("Starting DB...")
    init_db(os.getenv("DB_USER"), os.getenv("DB_HOST"), os.getenv("DB_PASSWORD"), os.getenv("DB_NAME"), os.getenv("DB_PORT"))



## Server Start
if __name__ == "__main__":
    startServer()