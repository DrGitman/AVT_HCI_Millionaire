import uuid
import random
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.game import Game
from app.models.player import Player
from app.models.question import Question
from app.models.answer import Answer
from app.models.player_game_answer import PlayerGameAnswer
from app.models.game_category import GameCategory
from app.schemas.game import GameCreateRequest, GameResponse, GameStateResponse, GameEndResponse
from app.schemas.question import QuestionResponse, AnswerResponse
from app.schemas.question import AnswerSubmitRequest, AnswerSubmitResponse, AnswerRevealResponse


def create_game(request: GameCreateRequest, player: Player, db: Session) -> GameResponse:
    p1 = player.PlayerId
    p2 = request.player2Id
    p3 = request.player3Id
    p4 = request.player4Id
    db.execute(
        text("CALL sp_CreateGame(:p1, :p2, :p3, :p4, NULL, NULL)"),
        {"p1": p1, "p2": p2, "p3": p3, "p4": p4}
    )
    db.commit()

    game = db.query(Game).filter(
        Game.player1 == p1,
        Game.status == "waiting"
    ).order_by(Game.GameId.desc()).first()

    if not game:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Game could not be created"
        )

    for cat_id in request.categoryIds:
        gc = GameCategory(
            gameCategoryCode=str(uuid.uuid4()),
            GameId=game.GameId,
            CategoryId=cat_id
        )
        db.add(gc)

    game.status = "active"
    db.commit()
    db.refresh(game)
    return GameResponse.model_validate(game)


def get_game_state(game_id: int, player: Player, db: Session) -> GameStateResponse:
    game = _get_game_or_404(game_id, db)
    _check_player_in_game(game, player.PlayerId)

    answered_ids = [
        row.QuestionId for row in db.query(PlayerGameAnswer).filter(
            PlayerGameAnswer.GameId == game_id,
            PlayerGameAnswer.PlayerId == player.PlayerId
        ).all()
    ]

    category_ids = [gc.CategoryId for gc in game.game_categories]
    next_question = (
        db.query(Question)
        .filter(
            Question.CategoryId.in_(category_ids),
            Question.isActive == True,
            Question.QuestionId.notin_(answered_ids)
        )
        .order_by(Question.PrizeLevelId)
        .first()
    )

    current_sequence = len(answered_ids) + 1
    prize_won = _calculate_prize(answered_ids, game_id, db)

    question_schema = None
    if next_question:
        question_schema = QuestionResponse(
            QuestionId=next_question.QuestionId,
            questionCode=next_question.questionCode,
            question=next_question.question,
            CategoryId=next_question.CategoryId,
            PrizeLevelId=next_question.PrizeLevelId,
            answers=[
                AnswerResponse(
                    AnswerId=a.AnswerId,
                    answerCode=a.answerCode,
                    answer=a.answer
                )
                for a in next_question.answers
            ]
        )

    lifelines = {
        "askClass": player.lifeLineAskClass,
        "fiftyFifty": player.lifeLine5050,
        "phoneAPeer": player.lifeLinePhone,
        "courseNotes": player.lifeLineNotes,
    }

    return GameStateResponse(
        GameId=game.GameId,
        gameCode=game.gameCode,
        status=game.status,
        currentQuestion=question_schema,
        currentSequence=current_sequence,
        prizeWon=prize_won,
        lifelinesAvailable=lifelines,
    )


def submit_answer(
    request: AnswerSubmitRequest, player: Player, db: Session
) -> AnswerSubmitResponse:
    game = _get_game_or_404(request.GameId, db)
    _check_player_in_game(game, player.PlayerId)

    answer = db.query(Answer).filter(Answer.AnswerId == request.AnswerId).first()
    if not answer or answer.QuestionId != request.QuestionId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid answer for this question"
        )

    db.execute(
        text("CALL sp_RecordAnswer(:game_id, :player_id, :question_id, :answer_id, :seq)"),
        {
            "game_id": request.GameId,
            "player_id": player.PlayerId,
            "question_id": request.QuestionId,
            "answer_id": request.AnswerId,
            "seq": request.questionSequence,
        }
    )
    db.commit()

    correct_answer = db.query(Answer).filter(
        Answer.QuestionId == request.QuestionId,
        Answer.isCorrect == True
    ).first()

    question = db.query(Question).filter(
        Question.QuestionId == request.QuestionId
    ).first()

    prize_level = question.prize_level
    is_correct = answer.isCorrect
    game_over = not is_correct and not _has_safety_net(request.GameId, player.PlayerId, db)

    if game_over:
        end_game(request.GameId, player, db)

    next_question = None
    if is_correct and not game_over:
        state = get_game_state(request.GameId, player, db)
        next_question = state.currentQuestion

    return AnswerSubmitResponse(
        isCorrect=is_correct,
        correctAnswer=AnswerRevealResponse(
            AnswerId=correct_answer.AnswerId,
            answerCode=correct_answer.answerCode,
            answer=correct_answer.answer,
            isCorrect=True,
            justification=correct_answer.justification,
        ),
        justification=correct_answer.justification,
        prizeWon=prize_level.prizeValue if is_correct else 0,
        gameOver=game_over,
        nextQuestion=next_question,
    )


def end_game(game_id: int, player: Player, db: Session) -> GameEndResponse:
    game = _get_game_or_404(game_id, db)

    answers = db.query(PlayerGameAnswer).filter(
        PlayerGameAnswer.GameId == game_id,
        PlayerGameAnswer.PlayerId == player.PlayerId
    ).all()

    total_correct = sum(1 for a in answers if a.isCorrect)
    final_score = _calculate_prize(
        [a.QuestionId for a in answers], game_id, db
    )

    game.status = "completed"
    game.winner = player.PlayerId if total_correct == 15 else None
    db.commit()

    _update_leaderboard(player.PlayerId, final_score, total_correct, db)

    return GameEndResponse(
        GameId=game_id,
        winnerId=game.winner,
        finalScore=final_score,
        totalCorrect=total_correct,
        totalQuestions=len(answers),
    )


def _get_game_or_404(game_id: int, db: Session) -> Game:
    game = db.query(Game).filter(Game.GameId == game_id).first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    return game


def _check_player_in_game(game: Game, player_id: int) -> None:
    if player_id not in [game.player1, game.player2, game.player3, game.player4]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not part of this game"
        )


def _calculate_prize(answered_question_ids: list, game_id: int, db: Session) -> int:
    if not answered_question_ids:
        return 0
    correct_answers = db.query(PlayerGameAnswer).filter(
        PlayerGameAnswer.GameId == game_id,
        PlayerGameAnswer.QuestionId.in_(answered_question_ids),
        PlayerGameAnswer.isCorrect == True
    ).all()
    if not correct_answers:
        return 0
    last_correct = max(correct_answers, key=lambda a: a.questionSequence)
    return last_correct.question.prize_level.prizeValue


def _has_safety_net(game_id: int, player_id: int, db: Session) -> bool:
    answers = db.query(PlayerGameAnswer).filter(
        PlayerGameAnswer.GameId == game_id,
        PlayerGameAnswer.PlayerId == player_id,
        PlayerGameAnswer.isCorrect == True
    ).all()
    for a in answers:
        if a.question.prize_level.isSafetyNet:
            return True
    return False


def _update_leaderboard(player_id: int, score: int, correct: int, db: Session) -> None:
    from app.models.leaderboard import Leaderboard
    entry = db.query(Leaderboard).filter(Leaderboard.PlayerId == player_id).first()
    if entry:
        entry.totalGames += 1
        if score == 1000000:
            entry.totalWins += 1
        entry.totalCorrect += correct
        if score > entry.bestScore:
            entry.bestScore = score
        db.commit()
