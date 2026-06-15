import uuid
import random
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.player import Player
from app.models.player_game_lifeline import PlayerGameLifeline
from app.models.question import Question
from app.models.answer import Answer
from app.models.phone_a_peer_hint import PhoneAPeerHint
from app.models.course_note_hint import CourseNoteHint
from app.models.ask_the_class_vote import AskTheClassVote
from app.schemas.lifeline import (
    FiftyFiftyResponse, SageHintResponse, PhoneAPeerResponse,
    AskTheClassVoteRequest, AskTheClassResultResponse,
)


import json

def use_fifty_fifty(
    game_id: int, question_id: int, player: Player, db: Session
) -> FiftyFiftyResponse:
    pgl = db.query(PlayerGameLifeline).filter(PlayerGameLifeline.GameId == game_id, PlayerGameLifeline.PlayerId == player.PlayerId).first()
    if not pgl or not pgl.lifeLine5050:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="50/50 lifeline already used or not available",
        )

    # Use stored procedure:
    # CALL sp_UseLifeline(IN p_GameId, IN p_PlayerId, IN p_QuestionId, IN p_lifelineType, OUT p_result)
    result = db.execute(
        text("CALL sp_UseLifeline(:gid, :pid, :qid, '5050', NULL)"),
        {"gid": game_id, "pid": player.PlayerId, "qid": question_id}
    ).fetchone()

    p_result = json.loads(result[0])

    correct = db.query(Answer).filter(
        Answer.QuestionId == question_id,
        Answer.isCorrect == True,
    ).first()

    remaining = [correct.AnswerId, p_result['removeAnswer1']] # Wait, sp_UseLifeline returns removeAnswer1 and 2?
    # Actually sp_UseLifeline for 5050:
    # p_result := json_build_object('removeAnswer1', v_wrong_answer1, 'removeAnswer2', v_wrong_answer2)::TEXT;
    # It returns the ones to REMOVE? Or the ones that REMAIN?
    # Usually 50/50 removes 2 wrong ones.

    # Let's check sp_UseLifeline again.
    # It picks 2 wrong answers and returns them as removeAnswer1 and 2.
    # So the remaining ones are correct + the one NOT in these two.

    all_wrong = db.query(Answer).filter(Answer.QuestionId == question_id, Answer.isCorrect == False).all()
    all_wrong_ids = [a.AnswerId for a in all_wrong]

    removed_ids = [p_result['removeAnswer1'], p_result['removeAnswer2']]
    kept_wrong_id = [wid for wid in all_wrong_ids if wid not in removed_ids][0]

    remaining = [correct.AnswerId, kept_wrong_id]

    return FiftyFiftyResponse(QuestionId=question_id, remainingAnswers=remaining)


def use_sage_hint(
    game_id: int, question_id: int, player: Player, db: Session
) -> SageHintResponse:
    pgl = db.query(PlayerGameLifeline).filter(PlayerGameLifeline.GameId == game_id, PlayerGameLifeline.PlayerId == player.PlayerId).first()
    if not pgl or not pgl.lifeLineNotes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sayings of the Sage lifeline already used or not available",
        )

    question = _get_question_or_404(question_id, db)

    result = db.execute(
        text("CALL sp_UseLifeline(:gid, :pid, :qid, 'Notes', NULL)"),
        {"gid": game_id, "pid": player.PlayerId, "qid": question_id}
    ).fetchone()

    p_result = json.loads(result[0])

    return SageHintResponse(
        QuestionId=question_id,
        hintText=p_result['note'],
        philosophy="Philosophical Sagacity",
        category=question.category.name,
    )


def use_phone_a_peer(
    game_id: int, question_id: int, player: Player, db: Session
) -> PhoneAPeerResponse:
    pgl = db.query(PlayerGameLifeline).filter(PlayerGameLifeline.GameId == game_id, PlayerGameLifeline.PlayerId == player.PlayerId).first()
    if not pgl or not pgl.lifeLinePhone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone a Peer lifeline already used or not available",
        )

    _get_question_or_404(question_id, db)

    result = db.execute(
        text("CALL sp_UseLifeline(:gid, :pid, :qid, 'Phone', NULL)"),
        {"gid": game_id, "pid": player.PlayerId, "qid": question_id}
    ).fetchone()

    p_result = json.loads(result[0])

    return PhoneAPeerResponse(
        QuestionId=question_id,
        avatarName=p_result['avatarName'],
        hintText=p_result['hint'],
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

    pgl = db.query(PlayerGameLifeline).filter(PlayerGameLifeline.GameId == request.GameId, PlayerGameLifeline.PlayerId == player.PlayerId).first()
    if pgl and pgl.lifeLineAskClass:
        pgl.lifeLineAskClass = False

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
