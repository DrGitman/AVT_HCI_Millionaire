from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.player import Player
from app.schemas.lifeline import (
    FiftyFiftyResponse, SageHintResponse, PhoneAPeerResponse,
    AskTheClassVoteRequest, AskTheClassResultResponse,
)
from app.services.lifeline_service import (
    use_fifty_fifty, use_sage_hint, use_phone_a_peer,
    submit_ask_the_class_vote, get_ask_the_class_results,
)
from app.security.dependencies import get_current_player

router = APIRouter()


@router.get("/fifty-fifty/{question_id}", response_model=FiftyFiftyResponse)
def fifty_fifty(
    question_id: int,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    return use_fifty_fifty(question_id, current_player, db)


@router.get("/sage/{question_id}", response_model=SageHintResponse)
def sage_hint(
    question_id: int,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    return use_sage_hint(question_id, current_player, db)


@router.get("/phone-a-peer/{question_id}", response_model=PhoneAPeerResponse)
def phone_a_peer(
    question_id: int,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    return use_phone_a_peer(question_id, current_player, db)


@router.post("/ask-the-class", response_model=AskTheClassResultResponse)
def ask_the_class_vote(
    request: AskTheClassVoteRequest,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    return submit_ask_the_class_vote(request, current_player, db)


@router.get("/ask-the-class/{game_id}/{question_id}", response_model=AskTheClassResultResponse)
def ask_the_class_results(
    game_id: int,
    question_id: int,
    _: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    return get_ask_the_class_results(game_id, question_id, db)
