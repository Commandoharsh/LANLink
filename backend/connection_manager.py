from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.active_connections[websocket] = username

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            del self.active_connections[websocket]

    def get_users(self):
        return list(self.active_connections.values())

    async def send_personal_message(
        self,
        message: dict,
        websocket: WebSocket
    ):
        await websocket.send_json(message)

    async def broadcast(self, message: dict):
        disconnected = []

        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)

        for connection in disconnected:
            self.disconnect(connection)