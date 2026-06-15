import uuid
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
import random
from app.models.game import Game
from app.models.player import Player
from app.models.player_game_lifeline import PlayerGameLifeline
from app.models.question import Question
from app.models.answer import Answer
from app.models.player_game_answer import PlayerGameAnswer
from app.models.game_category import GameCategory
from app.models.leaderboard import Leaderboard
from app.schemas.game import GameCreateRequest, GameResponse, GameStateResponse, GameEndResponse
from app.schemas.question import QuestionResponse, AnswerResponse
from app.schemas.question import AnswerSubmitRequest, AnswerSubmitResponse, AnswerRevealResponse

BADGES = [
    {"threshold": 3,  "code": "BADGE_3",  "name": "First Steps",        "description": "3 correct answers in a game"},
    {"threshold": 5,  "code": "BADGE_5",  "name": "Safety Net Reached",  "description": "5 correct answers — first safety net"},
    {"threshold": 8,  "code": "BADGE_8",  "name": "Halfway Hero",        "description": "8 correct answers in a game"},
    {"threshold": 10, "code": "BADGE_10", "name": "Knowledge Keeper",    "description": "10 correct answers — second safety net"},
    {"threshold": 13, "code": "BADGE_13", "name": "Sage in Training",    "description": "13 correct answers in a game"},
    {"threshold": 15, "code": "BADGE_15", "name": "HCI Millionaire",     "description": "All 15 correct — you are an HCI Millionaire!"},
]


def _compute_badges(total_correct: int) -> list[dict]:
    return [b for b in BADGES if total_correct >= b["threshold"]]

def create_game(request: GameCreateRequest, player: Player, db: Session) -> GameResponse:
    # Use stored procedure:
    # CALL sp_CreateGame(p_player1, p_player2, p_player3, p_player4, p_category_ids, p_maxPlayers, p_gameMode, p_timeLimit, OUT p_GameId, OUT p_gameCode)
    cat_ids = request.categoryIds if request.categoryIds else [1, 2, 3, 4, 5]

    result = db.execute(
        text("CALL sp_CreateGame(:p1, :p2, :p3, :p4, :cats, :max, :mode, :limit, NULL, NULL)"),
        {
            "p1": player.PlayerId,
            "p2": request.player2Id,
            "p3": request.player3Id,
            "p4": request.player4Id,
            "cats": cat_ids,
            "max": request.maxPlayers,
            "mode": request.gameMode,
            "limit": request.timeLimit
        }
    ).fetchone()

    game_id = result[0]

    game = db.query(Game).filter(Game.GameId == game_id).first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve game after creation"
        )

    return GameResponse.model_validate(game)


def join_game(room_code: str, player: Player, db: Session) -> GameResponse:
    game = db.query(Game).filter(Game.gameCode == room_code, Game.status == "waiting").first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active lobby with this code not found"
        )

    if player.PlayerId in [game.player1, game.player2, game.player3, game.player4]:
        return GameResponse.model_validate(game)

    if not game.player2:
        game.player2 = player.PlayerId
    elif not game.player3:
        game.player3 = player.PlayerId
    elif not game.player4:
        game.player4 = player.PlayerId
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Game lobby is full"
        )

    db.commit()
    db.refresh(game)
    return GameResponse.model_validate(game)


def get_game_state(game_id: int, player: Player, db: Session) -> GameStateResponse:
    game = _get_game_or_404(game_id, db)
    _check_player_in_game(game, player.PlayerId)

    answered_ids = [
        row.QuestionId for row in db.query(PlayerGameAnswer).filter(
            PlayerGameAnswer.GameId == game_id,
            PlayerGameAnswer.PlayerId == player.PlayerId,
        ).all()
    ]

    category_ids = [gc.CategoryId for gc in game.game_categories]
    next_question = (
        db.query(Question)
        .filter(
            Question.CategoryId.in_(category_ids),
            Question.isActive == True,
            Question.QuestionId.notin_(answered_ids),
        )
        .order_by(Question.PrizeLevelId)
        .first()
    )

    current_sequence = len(answered_ids) + 1
    prize_won = _calculate_prize(answered_ids, game_id, player.PlayerId, db)

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
                    answer=a.answer,
                )
                for a in random.sample(next_question.answers, len(next_question.answers))
            ],
        )

    pgl = db.query(PlayerGameLifeline).filter(PlayerGameLifeline.GameId == game_id, PlayerGameLifeline.PlayerId == player.PlayerId).first()
    lifelines = {
        "askClass":    pgl.lifeLineAskClass if pgl else False,
        "fiftyFifty":  pgl.lifeLine5050 if pgl else False,
        "phoneAPeer":  pgl.lifeLinePhone if pgl else False,
        "courseNotes": pgl.lifeLineNotes if pgl else False,
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

    if game.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Game is not active",
        )

    # Use stored procedure:
    # CALL sp_RecordAnswer(IN p_GameId, IN p_PlayerId, IN p_QuestionId, IN p_AnswerId, IN p_questionSequence,
    #   OUT p_isCorrect, OUT p_justification, OUT p_prizeValue, OUT p_isSafetyNet, OUT p_playerEliminated)
    try:
        result = db.execute(
            text("CALL sp_RecordAnswer(:gid, :pid, :qid, :aid, :seq, NULL, NULL, NULL, NULL, NULL)"),
            {
                "gid": request.GameId,
                "pid": player.PlayerId,
                "qid": request.QuestionId,
                "aid": request.AnswerId,
                "seq": request.questionSequence
            }
        ).fetchone()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    is_correct = result[0]
    justification = result[1]
    prize_value = result[2]
    # is_safety_net = result[3]
    player_eliminated = result[4]

    correct_answer = db.query(Answer).filter(
        Answer.QuestionId == request.QuestionId,
        Answer.isCorrect == True,
    ).first()

    next_question = None
    if is_correct and not player_eliminated:
        state = get_game_state(request.GameId, player, db)
        next_question = state.currentQuestion
        if next_question is None:
            player_eliminated = True

    if player_eliminated or (is_correct and next_question is None):
        end_game(request.GameId, player, db)

    return AnswerSubmitResponse(
        isCorrect=is_correct,
        correctAnswer=AnswerRevealResponse(
            AnswerId=correct_answer.AnswerId,
            answerCode=correct_answer.answerCode,
            answer=correct_answer.answer,
            isCorrect=True,
            justification=justification,
        ),
        justification=justification,
        prizeWon=prize_value,
        gameOver=player_eliminated,
        nextQuestion=next_question,
    )


def end_game(game_id: int, player: Player, db: Session) -> GameEndResponse:
    # Use stored procedure:
    # CALL sp_EndGame(IN p_GameId, IN p_status, OUT p_winnerId, OUT p_winnerCode, OUT p_finalScore)
    result = db.execute(
        text("CALL sp_EndGame(:gid, 'completed', NULL, NULL, NULL)"),
        {"gid": game_id}
    ).fetchone()

    winner_id = result[0]
    final_score = result[2]

    answers = db.query(PlayerGameAnswer).filter(
        PlayerGameAnswer.GameId == game_id,
        PlayerGameAnswer.PlayerId == player.PlayerId,
    ).all()
    total_correct = sum(1 for a in answers if a.isCorrect)

    badges_earned = _compute_badges(total_correct)

    return GameEndResponse(
        GameId=game_id,
        winnerId=winner_id,
        finalScore=final_score,
        totalCorrect=total_correct,
        totalQuestions=len(answers),
        badgesEarned=badges_earned,
    )


def _get_game_or_404(game_id: int, db: Session) -> Game:
    game = db.query(Game).filter(Game.GameId == game_id).first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found",
        )
    return game


def _check_player_in_game(game: Game, player_id: int) -> None:
    if player_id not in [game.player1, game.player2, game.player3, game.player4]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not part of this game",
        )


def _calculate_prize(
    answered_question_ids: list, game_id: int, player_id: int, db: Session
) -> int:
    if not answered_question_ids:
        return 0
    correct_answers = db.query(PlayerGameAnswer).filter(
        PlayerGameAnswer.GameId == game_id,
        PlayerGameAnswer.PlayerId == player_id,
        PlayerGameAnswer.QuestionId.in_(answered_question_ids),
        PlayerGameAnswer.isCorrect == True,
    ).all()
    if not correct_answers:
        return 0
    last_correct = max(correct_answers, key=lambda a: a.questionSequence)
    return last_correct.question.prize_level.prizeValue


def _has_safety_net(game_id: int, player_id: int, db: Session) -> bool:
    answers = db.query(PlayerGameAnswer).filter(
        PlayerGameAnswer.GameId == game_id,
        PlayerGameAnswer.PlayerId == player_id,
        PlayerGameAnswer.isCorrect == True,
    ).all()
    return any(a.question.prize_level.isSafetyNet for a in answers)


def _update_leaderboard(player_id: int, score: int, correct: int, db: Session) -> None:
    entry = db.query(Leaderboard).filter(Leaderboard.PlayerId == player_id).first()
    if entry:
        entry.totalGames += 1
        if score == 1_000_000:
            entry.totalWins += 1
        entry.totalCorrect += correct
        if score > entry.bestScore:
            entry.bestScore = score
    else:
        entry = Leaderboard(
            PlayerId=player_id,
            totalGames=1,
            totalWins=1 if score == 1_000_000 else 0,
            totalCorrect=correct,
            bestScore=score,
            rank=0,
        )
        db.add(entry)
    db.commit()
    _recompute_ranks(db)


def _recompute_ranks(db: Session) -> None:
    entries = db.query(Leaderboard).order_by(Leaderboard.bestScore.desc()).all()
    for i, entry in enumerate(entries, start=1):
        entry.rank = i
    db.commit()

def activate_game(game_id: int, current_player: Player, db: Session):
    game = _get_game_or_404(game_id, db)
    if game.player1 != current_player.PlayerId:
        raise HTTPException(status_code=403, detail="Only host can start the game")
    game.status = "active"
    db.commit()
    return {"message": "Game activated"}

def leave_game(game_id: int, current_player: Player, db: Session):
    game = _get_game_or_404(game_id, db)
    if game.player1 == current_player.PlayerId:
        game.status = "abandoned"
    elif game.player2 == current_player.PlayerId:
        game.player2 = None
    elif game.player3 == current_player.PlayerId:
        game.player3 = None
    elif game.player4 == current_player.PlayerId:
        game.player4 = None
    db.commit()
    return {"message": "Left game"}

def get_game_review(game_id: int, db: Session):
    from app.models.player_game_answer import PlayerGameAnswer
    from app.models.answer import Answer
    from app.models.question import Question

    pga = db.query(PlayerGameAnswer).filter(PlayerGameAnswer.GameId == game_id).all()
    review = []
    for user_ans in pga:
        # Find correct answer for this question
        correct_ans = db.query(Answer).filter(
            Answer.QuestionId == user_ans.QuestionId,
            Answer.isCorrect == True
        ).first()

        review.append({
            "question_num": user_ans.questionSequence,
            "question_text": user_ans.question.question,
            "user_answer": user_ans.answer.answer,
            "correct_answer": correct_ans.answer if correct_ans else "Unknown",
            "is_correct": user_ans.isCorrect,
            "justification": correct_ans.justification if correct_ans else "",
            "source": user_ans.question.category.categoryName # Using category as a placeholder for source
        })
    return review
