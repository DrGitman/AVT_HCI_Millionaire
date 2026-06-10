import uuid
import random
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.player import Player
from app.models.question import Question
from app.models.answer import Answer
from app.models.phone_a_peer_hint import PhoneAPeerHint
from app.models.course_note_hint import CourseNoteHint
from app.models.ask_the_class_vote import AskTheClassVote
from app.schemas.lifeline import (
    FiftyFiftyResponse, SageHintResponse, PhoneAPeerResponse,
    AskTheClassVoteRequest, AskTheClassResultResponse,
)


def use_fifty_fifty(
    question_id: int, player: Player, db: Session
) -> FiftyFiftyResponse:
    if not player.lifeLine5050:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="50/50 lifeline already used",
        )

    _get_question_or_404(question_id, db)

    correct = db.query(Answer).filter(
        Answer.QuestionId == question_id,
        Answer.isCorrect == True,
    ).first()

    wrong_answers = db.query(Answer).filter(
        Answer.QuestionId == question_id,
        Answer.isCorrect == False,
    ).all()

    kept_wrong = random.choice(wrong_answers)
    remaining = [correct.AnswerId, kept_wrong.AnswerId]

    player.lifeLine5050 = False
    db.commit()

    return FiftyFiftyResponse(QuestionId=question_id, remainingAnswers=remaining)


def use_sage_hint(
    question_id: int, player: Player, db: Session
) -> SageHintResponse:
    if not player.lifeLineNotes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sayings of the Sage lifeline already used",
        )

    question = _get_question_or_404(question_id, db)

    hint = db.query(CourseNoteHint).filter(
        CourseNoteHint.QuestionId == question_id,
        CourseNoteHint.isActive == True,
    ).first()

    if not hint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No sage hint available for this question",
        )

    player.lifeLineNotes = False
    player.lifeLineNotesResult = hint.CourseNoteHintId
    db.commit()

    return SageHintResponse(
        QuestionId=question_id,
        hintText=hint.noteText,
        philosophy="Philosophical Sagacity",
        category=question.category.name,
    )


def use_phone_a_peer(
    question_id: int, player: Player, db: Session
) -> PhoneAPeerResponse:
    if not player.lifeLinePhone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone a Peer lifeline already used",
        )

    _get_question_or_404(question_id, db)

    hint = db.query(PhoneAPeerHint).filter(
        PhoneAPeerHint.QuestionId == question_id,
        PhoneAPeerHint.isActive == True,
    ).first()

    if not hint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No phone hint available for this question",
        )

    player.lifeLinePhone = False
    player.lifeLinePhoneResult = hint.PhoneAPeerHintId
    db.commit()

    return PhoneAPeerResponse(
        QuestionId=question_id,
        avatarName=hint.avatarName,
        hintText=hint.hintText,
    )


def submit_ask_the_class_vote(
    request: AskTheClassVoteRequest, player: Player, db: Session
) -> AskTheClassResultResponse:
    # Check if this player already voted for this question in this game
    existing = db.query(AskTheClassVote).filter(
        AskTheClassVote.GameId == request.GameId,
        AskTheClassVote.QuestionId == request.QuestionId,
        AskTheClassVote.PlayerId == player.PlayerId,
    ).first()

    if not existing:
        vote = AskTheClassVote(
            voteCode=str(uuid.uuid4()),
            GameId=request.GameId,
            QuestionId=request.QuestionId,
            AnswerId=request.AnswerId,
            PlayerId=player.PlayerId,
        )
        db.add(vote)

    if player.lifeLineAskClass:
        player.lifeLineAskClass = False

    db.commit()
    return get_ask_the_class_results(request.GameId, request.QuestionId, db)


def get_ask_the_class_results(
    game_id: int, question_id: int, db: Session
) -> AskTheClassResultResponse:
    votes = db.query(AskTheClassVote).filter(
        AskTheClassVote.GameId == game_id,
        AskTheClassVote.QuestionId == question_id,
    ).all()

    tally: dict[int, int] = {}
    for v in votes:
        tally[v.AnswerId] = tally.get(v.AnswerId, 0) + 1

    return AskTheClassResultResponse(
        QuestionId=question_id,
        votes=tally,
        totalVotes=len(votes),
    )


def _get_question_or_404(question_id: int, db: Session) -> Question:
    question = db.query(Question).filter(Question.QuestionId == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found",
        )
    return question
