import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websockets.connection_manager import ConnectionManager

router = APIRouter()
manager = ConnectionManager()


@router.websocket("/game/{room_code}")
async def game_websocket(websocket: WebSocket, room_code: str):
    await manager.connect(websocket, room_code)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            event = message.get("event")

            if event == "player_answered":
                await manager.broadcast(room_code, {
                    "event": "player_answered",
                    "playerId": message.get("playerId"),
                    "isCorrect": message.get("isCorrect"),
                    "questionSequence": message.get("questionSequence"),
                })

            elif event == "ask_class_vote":
                await manager.broadcast(room_code, {
                    "event": "vote_update",
                    "votes": message.get("votes"),
                    "totalVotes": message.get("totalVotes"),
                })

            elif event == "game_over":
                await manager.broadcast(room_code, {
                    "event": "game_over",
                    "winnerId": message.get("winnerId"),
                    "finalScores": message.get("finalScores"),
                })

            else:
                await manager.broadcast(room_code, message)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_code)
        await manager.broadcast(room_code, {
            "event": "player_disconnected",
            "message": "A player has left the game"
        })
