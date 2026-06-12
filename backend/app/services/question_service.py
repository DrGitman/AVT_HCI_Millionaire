from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.question import Question
from app.models.category import Category
from app.models.prize_level import PrizeLevel
from app.schemas.question import (
    QuestionResponse, AnswerResponse,
    CategoryResponse, PrizeLevelResponse,
)


def get_all_categories(db: Session) -> list[CategoryResponse]:
    categories = db.query(Category).all()
    return [CategoryResponse.model_validate(c) for c in categories]


def get_all_prize_levels(db: Session) -> list[PrizeLevelResponse]:
    levels = db.query(PrizeLevel).order_by(PrizeLevel.PrizeLevelId).all()
    return [PrizeLevelResponse.model_validate(p) for p in levels]


def get_questions(
    db: Session,
    category_id: int | None = None,
    prize_level_id: int | None = None,
) -> list[QuestionResponse]:
    query = db.query(Question).filter(Question.isActive == True)
    if category_id:
        query = query.filter(Question.CategoryId == category_id)
    if prize_level_id:
        query = query.filter(Question.PrizeLevelId == prize_level_id)
    questions = query.order_by(Question.PrizeLevelId).all()
    return [_to_schema(q) for q in questions]


def get_question_by_id(question_id: int, db: Session) -> QuestionResponse:
    q = db.query(Question).filter(Question.QuestionId == question_id).first()
    if not q:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    return _to_schema(q)


def _to_schema(q: Question) -> QuestionResponse:
    return QuestionResponse(
        QuestionId=q.QuestionId,
        questionCode=q.questionCode,
        question=q.question,
        CategoryId=q.CategoryId,
        PrizeLevelId=q.PrizeLevelId,
        answers=[
            AnswerResponse(
                AnswerId=a.AnswerId,
                answerCode=a.answerCode,
                answer=a.answer,
            )
            for a in q.answers
        ],
    )
