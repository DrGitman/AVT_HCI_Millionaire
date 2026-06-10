from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.question import QuestionResponse, CategoryResponse, PrizeLevelResponse
from app.services.question_service import (
    get_all_categories, get_all_prize_levels,
    get_questions, get_question_by_id,
)
from app.security.dependencies import get_current_player

router = APIRouter()


@router.get("/categories", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return get_all_categories(db)


@router.get("/prize-levels", response_model=list[PrizeLevelResponse])
def list_prize_levels(db: Session = Depends(get_db)):
    return get_all_prize_levels(db)


@router.get("/", response_model=list[QuestionResponse])
def list_questions(
    category_id: int | None = Query(default=None),
    prize_level_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    _=Depends(get_current_player),
):
    return get_questions(db, category_id, prize_level_id)


@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_player),
):
    return get_question_by_id(question_id, db)
