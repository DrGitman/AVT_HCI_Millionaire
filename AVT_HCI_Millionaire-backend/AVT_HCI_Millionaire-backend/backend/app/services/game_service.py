import uuid
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import random
from app.models.game import Game
from app.models.player import Player
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
    player.lifeLine5050 = True
    player.lifeLinePhone = True
    player.lifeLineNotes = True
    player.lifeLineAskClass = True

    game = Game(
        gameCode=str(uuid.uuid4()),
        player1=player.PlayerId,
        player2=request.player2Id,
        player3=request.player3Id,
        player4=request.player4Id,
        status="active",
    )
    db.add(game)
    db.flush()

    # If no categories specified, use all 5
    cat_ids = request.categoryIds if request.categoryIds else [1, 2, 3, 4, 5]
    for cat_id in cat_ids:
        gc = GameCategory(
            gameCategoryCode=str(uuid.uuid4()),
            GameId=game.GameId,
            CategoryId=cat_id,
        )
        db.add(gc)

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

    lifelines = {
        "askClass":    player.lifeLineAskClass,
        "fiftyFifty":  player.lifeLine5050,
        "phoneAPeer":  player.lifeLinePhone,
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

    if game.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Game is not active",
        )

    # Validate answer belongs to question
    answer = db.query(Answer).filter(Answer.AnswerId == request.AnswerId).first()
    if not answer or answer.QuestionId != request.QuestionId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid answer for this question",
        )

    already = db.query(PlayerGameAnswer).filter(
        PlayerGameAnswer.GameId == request.GameId,
        PlayerGameAnswer.PlayerId == player.PlayerId,
        PlayerGameAnswer.QuestionId == request.QuestionId,
    ).first()
    if already:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question already answered",
        )

    pga = PlayerGameAnswer(
        playerGameAnswerCode=str(uuid.uuid4()),
        GameId=request.GameId,
        PlayerId=player.PlayerId,
        QuestionId=request.QuestionId,
        AnswerId=request.AnswerId,
        isCorrect=answer.isCorrect,
        questionSequence=request.questionSequence,
    )
    db.add(pga)
    db.commit()

    correct_answer = db.query(Answer).filter(
        Answer.QuestionId == request.QuestionId,
        Answer.isCorrect == True,
    ).first()

    question = db.query(Question).filter(
        Question.QuestionId == request.QuestionId
    ).first()

    is_correct = answer.isCorrect
    prize_value = question.prize_level.prizeValue if is_correct else 0
    game_over = not is_correct and not _has_safety_net(request.GameId, player.PlayerId, db)

    next_question = None
    if is_correct and not game_over:
        state = get_game_state(request.GameId, player, db)
        next_question = state.currentQuestion
        if next_question is None:
            game_over = True

    if game_over or (is_correct and next_question is None):
        end_game(request.GameId, player, db)

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
        prizeWon=prize_value,
        gameOver=game_over,
        nextQuestion=next_question,
    )


def end_game(game_id: int, player: Player, db: Session) -> GameEndResponse:
    game = _get_game_or_404(game_id, db)

    answers = db.query(PlayerGameAnswer).filter(
        PlayerGameAnswer.GameId == game_id,
        PlayerGameAnswer.PlayerId == player.PlayerId,
    ).all()

    total_correct = sum(1 for a in answers if a.isCorrect)
    final_score = _calculate_prize(
        [a.QuestionId for a in answers], game_id, player.PlayerId, db
    )

    if game.status != "completed":
        game.status = "completed"
        game.winner = player.PlayerId if total_correct == 15 else None
        db.commit()

    _update_leaderboard(player.PlayerId, final_score, total_correct, db)

    badges_earned = _compute_badges(total_correct)

    return GameEndResponse(
        GameId=game_id,
        winnerId=game.winner,
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
