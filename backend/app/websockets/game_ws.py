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

            elif event == "chat_message":
                await manager.broadcast(room_code, {
                    "event": "chat_message",
                    "playerId": message.get("playerId"),
                    "playerName": message.get("playerName"),
                    "text": message.get("text"),
                    "timestamp": message.get("timestamp"),
                })

            elif event == "emoji_reaction":
                await manager.broadcast(room_code, {
                    "event": "emoji_reaction",
                    "playerId": message.get("playerId"),
                    "emoji": message.get("emoji"),
                })

            elif event == "webrtc_signal":
                # WebRTC signaling for voice chat
                await manager.broadcast(room_code, {
                    "event": "webrtc_signal",
                    "senderId": message.get("senderId"),
                    "signal": message.get("signal"),
                    "targetId": message.get("targetId"),
                })

            elif event == "game_over":
                await manager.broadcast(room_code, {
                    "event": "game_over",
                    "winnerId": message.get("winnerId"),
                    "finalScores": message.get("finalScores"),
                })

            elif event == "player_ready":
                await manager.broadcast(room_code, {
                    "event": "player_ready",
                    "playerId": message.get("playerId"),
                    "isReady": message.get("isReady"),
                })

            else:
                await manager.broadcast(room_code, message)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_code)
        await manager.broadcast(room_code, {
            "event": "player_disconnected",
            "message": "A player has left the game"
        })
