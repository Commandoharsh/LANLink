from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from backend.connection_manager import ConnectionManager


BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"


app = FastAPI(
    title="LAN Chat App",
    description="A simple real-time LAN chat application",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount(
    "/frontend",
    StaticFiles(directory=FRONTEND_DIR),
    name="frontend"
)


manager = ConnectionManager()


@app.get("/")
async def serve_frontend():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "users": len(manager.active_connections)
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    username = websocket.query_params.get("username")

    if not username:
        await websocket.close(code=1008)
        return

    username = username.strip()

    if not username or len(username) > 30:
        await websocket.close(code=1008)
        return

    if username in manager.get_users():

        await websocket.accept()

        await websocket.send_json({
            "type": "error",
            "message": "Username is already in use."
        })

        await websocket.close(code=1008)

        return

    await manager.connect(
        websocket,
        username
    )

    await manager.broadcast({
        "type": "system",
        "message": f"{username} joined the chat.",
        "timestamp": current_time()
    })

    await manager.broadcast({
        "type": "users",
        "users": manager.get_users()
    })

    try:

        while True:

            data = await websocket.receive_json()

            message = str(
                data.get("message", "")
            ).strip()

            if not message:
                continue

            if len(message) > 500:

                await manager.send_personal_message(
                    {
                        "type": "error",
                        "message": "Message is too long. Maximum 500 characters."
                    },
                    websocket
                )

                continue

            await manager.broadcast({
                "type": "message",
                "username": username,
                "message": message,
                "timestamp": current_time()
            })

    except WebSocketDisconnect:

        manager.disconnect(websocket)

        await manager.broadcast({
            "type": "system",
            "message": f"{username} left the chat.",
            "timestamp": current_time()
        })

        await manager.broadcast({
            "type": "users",
            "users": manager.get_users()
        })


def current_time():
    return datetime.now().strftime("%H:%M")