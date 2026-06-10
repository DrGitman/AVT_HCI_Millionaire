import json
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, list[dict]] = {}

    async def connect(self, websocket: WebSocket, room_code: str, player_id: int, username: str):
        await websocket.accept()
        if room_code not in self.rooms:
            self.rooms[room_code] = []
        self.rooms[room_code].append({
            "ws": websocket,
            "playerId": player_id,
            "username": username,
            "ready": False,
        })

    def disconnect(self, websocket: WebSocket, room_code: str):
        if room_code not in self.rooms:
            return None
        player = next(
            (p for p in self.rooms[room_code] if p["ws"] is websocket), None
        )
        if player:
            self.rooms[room_code].remove(player)
        if not self.rooms[room_code]:
            del self.rooms[room_code]
        return player

    def get_players(self, room_code: str) -> list[dict]:
        if room_code not in self.rooms:
            return []
        return [
            {"playerId": p["playerId"], "username": p["username"], "ready": p["ready"]}
            for p in self.rooms[room_code]
        ]

    def get_host(self, room_code: str) -> dict | None:
        """First player to join is the host."""
        players = self.rooms.get(room_code, [])
        return players[0] if players else None

    def is_host(self, websocket: WebSocket, room_code: str) -> bool:
        host = self.get_host(room_code)
        return host is not None and host["ws"] is websocket

    def player_count(self, room_code: str) -> int:
        return len(self.rooms.get(room_code, []))

    def set_ready(self, websocket: WebSocket, room_code: str, ready: bool):
        for p in self.rooms.get(room_code, []):
            if p["ws"] is websocket:
                p["ready"] = ready
                break

    def all_ready(self, room_code: str) -> bool:
        players = self.rooms.get(room_code, [])
        return len(players) >= 2 and all(p["ready"] for p in players)

    def find_by_player_id(self, room_code: str, player_id: int) -> dict | None:
        for p in self.rooms.get(room_code, []):
            if p["playerId"] == player_id:
                return p
        return None

    async def broadcast(self, room_code: str, message: dict):
        if room_code not in self.rooms:
            return
        text = json.dumps(message)
        for p in list(self.rooms[room_code]):
            try:
                await p["ws"].send_text(text)
            except Exception:
                pass

    async def broadcast_except(self, room_code: str, exclude: WebSocket, message: dict):
        if room_code not in self.rooms:
            return
        text = json.dumps(message)
        for p in list(self.rooms[room_code]):
            if p["ws"] is not exclude:
                try:
                    await p["ws"].send_text(text)
                except Exception:
                    pass

    async def send_personal(self, websocket: WebSocket, message: dict):
        await websocket.send_text(json.dumps(message))
