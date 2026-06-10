from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_code: str):
        await websocket.accept()
        if room_code not in self.rooms:
            self.rooms[room_code] = []
        self.rooms[room_code].append(websocket)

    def disconnect(self, websocket: WebSocket, room_code: str):
        if room_code in self.rooms:
            self.rooms[room_code].remove(websocket)
            if not self.rooms[room_code]:
                del self.rooms[room_code]

    async def broadcast(self, room_code: str, message: dict):
        if room_code not in self.rooms:
            return
        import json
        text = json.dumps(message)
        for connection in self.rooms[room_code]:
            await connection.send_text(text)

    async def send_personal(self, websocket: WebSocket, message: dict):
        import json
        await websocket.send_text(json.dumps(message))
