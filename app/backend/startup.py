import uvicorn
import webview

def startApp():
    print("Starting App...")
    # startUvicorn()
    startReact()
    return


def startReact():
    webview.create_window('My React App', 'http://127.0.0.1:3000')
    webview.start()

def startUvicorn():
    uvicorn.run("main:app", port=5000, log_level="debug", reload=True)



if __name__ == "__main__":
    startApp() 