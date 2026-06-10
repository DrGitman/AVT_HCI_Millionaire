from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.player import Player
from app.models.player_game_answer import PlayerGameAnswer
from app.security.dependencies import get_current_player
from app.services.game_service import BADGES

router = APIRouter()


@router.get("/")
def get_my_achievements(
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):

    answers = db.query(PlayerGameAnswer).filter(
        PlayerGameAnswer.PlayerId == current_player.PlayerId,
        PlayerGameAnswer.isCorrect == True,
    ).all()

    game_counts: dict[int, int] = {}
    for a in answers:
        game_counts[a.GameId] = game_counts.get(a.GameId, 0) + 1

    best_in_one_game = max(game_counts.values(), default=0)
    total_correct_all_time = len(answers)

    earned = [b for b in BADGES if best_in_one_game >= b["threshold"]]
    pending = [b for b in BADGES if best_in_one_game < b["threshold"]]

    return {
        "bestSingleGame": best_in_one_game,
        "totalCorrectAllTime": total_correct_all_time,
        "badgesEarned": earned,
        "badgesPending": pending,
    }


@router.get("/all")
def get_all_badges(_: Player = Depends(get_current_player)):
    return {"badges": BADGES}
