from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.player import Player
from app.schemas.game import GameCreateRequest, GameResponse, GameStateResponse, GameEndResponse
from app.schemas.question import AnswerSubmitRequest, AnswerSubmitResponse
from app.services.game_service import create_game, join_game, get_game_state, submit_answer, end_game
from app.security.dependencies import get_current_player

router = APIRouter()


@router.post("/join/{room_code}", response_model=GameResponse)
def join_lobby(
    room_code: str,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    return join_game(room_code, current_player, db)


@router.post("/start", response_model=GameResponse, status_code=201)
def start_game(
    request: GameCreateRequest,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    return create_game(request, current_player, db)


@router.get("/{game_id}/state", response_model=GameStateResponse)
def game_state(
    game_id: int,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    return get_game_state(game_id, current_player, db)


@router.post("/{game_id}/answer", response_model=AnswerSubmitResponse)
def answer_question(
    game_id: int,
    request: AnswerSubmitRequest,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    request.GameId = game_id
    return submit_answer(request, current_player, db)


@router.post("/{game_id}/end", response_model=GameEndResponse)
def finish_game(
    game_id: int,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    return end_game(game_id, current_player, db)


@router.post("/{game_id}/activate")
def activate_game(
    game_id: int,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    from app.services.game_service import activate_game as svc_activate
    return svc_activate(game_id, current_player, db)


@router.post("/{game_id}/leave")
def leave_lobby(
    game_id: int,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    from app.services.game_service import leave_game as svc_leave
    return svc_leave(game_id, current_player, db)


@router.get("/{game_id}/review")
def get_review(
    game_id: int,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    from app.services.game_service import get_game_review
    return get_game_review(game_id, db)
