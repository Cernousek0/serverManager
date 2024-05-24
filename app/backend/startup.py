import uvicorn
import webview
import subprocess
import threading

APP_PORT = 3000
APP_IP = "http://127.0.0.1"
APP_URL = APP_IP + ":" + str(APP_PORT)

def startApp():
    print("Starting App...")
    # startUvicorn()
    
    ## starting React in different thread
    WebViewThread = threading.Thread(target=startReact).start()
    startWebView()


def startReact():
    print("React App started...")
    subprocess.run(["npm", "start"], cwd="app/frontend", shell=True)

def stopReact():
    print("React App stopped...")
    subprocess.run(["npm", "stop"], cwd="app/frontend", shell=True)


def startWebView():
    window = webview.create_window('ServerSphere | Host All You Want!', APP_URL, width=900, height=600)
    window.events.closing += stopReact
    webview.start()
    


def startUvicorn():
    uvicorn.run("main:app", port=5000, log_level="debug", reload=True)



if __name__ == "__main__":
    startApp() 