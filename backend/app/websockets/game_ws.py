"""
game_ws.py — Multiplayer WebSocket handler for HCI Millionaire
==============================================================

Connection URL:
    ws://localhost:8000/ws/game/{room_code}?token={jwt_access_token}

room_code is the gameCode returned by POST /game/start.

── Client → Server events ────────────────────────────────────────────────────

    { "event": "player_ready" }
    { "event": "start_game" }               ← host only
    { "event": "player_answered",
      "questionSequence": 3,
      "isCorrect": true, "prizeWon": 300 }
    { "event": "ask_class_vote",
      "questionId": 5, "answerId": 12 }
    { "event": "lifeline_used", "lifeline": "fiftyFifty" }
    { "event": "game_over",
      "finalScores": {"1": 300, "2": 200} }
    { "event": "ping" }

── Server → Client events ────────────────────────────────────────────────────

    { "event": "room_state",
      "players": [...], "hostId": 1, "canStart": false }
    { "event": "player_joined",
      "playerId": 1, "username": "Amaury", "playerCount": 2 }
    { "event": "player_ready",
      "playerId": 1, "allReady": false }
    { "event": "game_starting",
      "players": [...], "message": "..." }
    { "event": "player_answered",
      "playerId": 1, "username": "...",
      "questionSequence": 3, "isCorrect": true, "prizeWon": 300 }
    { "event": "vote_update",
      "questionId": 5, "votes": {"12": 2, "14": 1}, "totalVotes": 3 }
    { "event": "lifeline_used",
      "playerId": 1, "username": "...", "lifeline": "fiftyFifty" }
    { "event": "game_over",
      "winnerId": 1, "finalScores": {"1": 300, "2": 200} }
    { "event": "player_disconnected",
      "playerId": 1, "username": "...", "remainingPlayers": 1 }
    { "event": "room_closed", "message": "Host left the game" }
    { "event": "error", "message": "..." }
    { "event": "pong" }
"""

import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.player import Player
from app.websockets.connection_manager import ConnectionManager
from app.security.jwt_handler import decode_token

router = APIRouter()
manager = ConnectionManager()

# Per-room vote tallies: { room_code: { question_id: { answer_id: count } } }
_vote_store: dict[str, dict[int, dict[int, int]]] = {}

async def _send_error(ws: WebSocket, message: str):
    await manager.send_personal(ws, {"event": "error", "message": message})


async def _send_room_state(ws: WebSocket, room_code: str):
    players = manager.get_players(room_code)
    host = manager.get_host(room_code)
    await manager.send_personal(ws, {
        "event": "room_state",
        "players": players,
        "hostId": host["playerId"] if host else None,
        "canStart": manager.all_ready(room_code),
    })


def _tally(room_code: str, question_id: int, answer_id: int) -> dict:
    _vote_store.setdefault(room_code, {}).setdefault(question_id, {})
    votes = _vote_store[room_code][question_id]
    votes[answer_id] = votes.get(answer_id, 0) + 1
    return {"votes": votes, "totalVotes": sum(votes.values())}


@router.websocket("/game/{room_code}")
async def game_websocket(
    websocket: WebSocket,
    room_code: str,
    token: str = Query(..., description="JWT access token"),
):
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        await websocket.accept()
        await websocket.send_text(json.dumps({
            "event": "error",
            "message": "Invalid or expired token. Connection refused.",
        }))
        await websocket.close(code=4001)
        return

    player_id = int(payload["sub"])

    from app.database import SessionLocal
    db: Session = SessionLocal()
    try:
        player = db.query(Player).filter(Player.PlayerId == player_id).first()
        if not player or not player.isActive:
            await websocket.accept()
            await websocket.send_text(json.dumps({
                "event": "error",
                "message": "Player not found or inactive.",
            }))
            await websocket.close(code=4001)
            return
        username = player.username
    finally:
        db.close()

    if manager.player_count(room_code) >= 4:
        await websocket.accept()
        await websocket.send_text(json.dumps({
            "event": "error",
            "message": "Room is full (max 4 players).",
        }))
        await websocket.close(code=4002)
        return

    await manager.connect(websocket, room_code, player_id, username)

    await _send_room_state(websocket, room_code)

    await manager.broadcast_except(room_code, websocket, {
        "event": "player_joined",
        "playerId": player_id,
        "username": username,
        "playerCount": manager.player_count(room_code),
    })

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                message = json.loads(raw)
            except json.JSONDecodeError:
                await _send_error(websocket, "Invalid JSON")
                continue

            event = message.get("event")

            if event == "ping":
                await manager.send_personal(websocket, {"event": "pong"})

            elif event == "player_ready":
                manager.set_ready(websocket, room_code, True)
                await manager.broadcast(room_code, {
                    "event": "player_ready",
                    "playerId": player_id,
                    "username": username,
                    "allReady": manager.all_ready(room_code),
                })

            elif event == "start_game":
                if not manager.is_host(websocket, room_code):
                    await _send_error(websocket, "Only the host can start the game")
                    continue
                if not manager.all_ready(room_code):
                    await _send_error(websocket, "Not all players are ready yet")
                    continue
                await manager.broadcast(room_code, {
                    "event": "game_starting",
                    "message": "All players ready — the game begins!",
                    "players": manager.get_players(room_code),
                })

            elif event == "player_answered":
                await manager.broadcast(room_code, {
                    "event": "player_answered",
                    "playerId": player_id,
                    "username": username,
                    "questionSequence": message.get("questionSequence"),
                    "isCorrect": message.get("isCorrect"),
                    "prizeWon": message.get("prizeWon", 0),
                })

            elif event == "ask_class_vote":
                question_id = message.get("questionId")
                answer_id   = message.get("answerId")
                if not question_id or not answer_id:
                    await _send_error(websocket, "questionId and answerId are required")
                    continue
                tally = _tally(room_code, int(question_id), int(answer_id))
                await manager.broadcast(room_code, {
                    "event": "vote_update",
                    "questionId": question_id,
                    **tally,
                })

            elif event == "lifeline_used":
                await manager.broadcast_except(room_code, websocket, {
                    "event": "lifeline_used",
                    "playerId": player_id,
                    "username": username,
                    "lifeline": message.get("lifeline"),
                })

            elif event == "game_over":
                await manager.broadcast(room_code, {
                    "event": "game_over",
                    "winnerId": message.get("winnerId"),
                    "finalScores": message.get("finalScores", {}),
                })
                _vote_store.pop(room_code, None)

            else:
                await _send_error(websocket, f"Unknown event: {event}")

    except WebSocketDisconnect:
        was_host = manager.is_host(websocket, room_code)
        manager.disconnect(websocket, room_code)

        if was_host and manager.player_count(room_code) > 0:
            await manager.broadcast(room_code, {
                "event": "room_closed",
                "message": f"{username} (host) left the game. Room closed.",
            })
            for p in list(manager.rooms.get(room_code, [])):
                try:
                    await p["ws"].close(code=4003)
                except Exception:
                    pass
            manager.rooms.pop(room_code, None)
            _vote_store.pop(room_code, None)
        else:
            await manager.broadcast(room_code, {
                "event": "player_disconnected",
                "playerId": player_id,
                "username": username,
                "remainingPlayers": manager.player_count(room_code),
            })
