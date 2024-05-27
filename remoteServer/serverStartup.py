import uvicorn
import os
from dotenv import load_dotenv

db = None

def startServer():

    # start server
    startUvicorn()


def startUvicorn():
    # start hosting
    print("Starting Server...")
    uvicorn.run("server:server", port=6000, log_level="debug", reload=True)


# Server Start
if __name__ == "__main__":
    startServer()