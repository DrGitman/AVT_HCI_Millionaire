from sqlalchemy.orm import Session
from app.models.leaderboard import Leaderboard
from app.models.player import Player
from app.schemas.leaderboard import LeaderboardEntryResponse, LeaderboardResponse


def get_global_leaderboard(
    db: Session, limit: int = 50, offset: int = 0
) -> LeaderboardResponse:
    # Ensure rankings are fresh
    db.execute("CALL sp_RecalculateLeaderboard()")

    entries = (
        db.query(Leaderboard, Player)
        .join(Player, Leaderboard.PlayerId == Player.PlayerId)
        .order_by(Leaderboard.rank.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    total = db.query(Leaderboard).count()
    result = []
    for lb, player in entries:
        result.append(
            LeaderboardEntryResponse(
                rank=lb.rank,
                PlayerId=player.PlayerId,
                username=player.username,
                name=player.name,
                totalGames=lb.totalGames,
                totalWins=lb.totalWins,
                totalCorrect=lb.totalCorrect,
                bestScore=lb.bestScore,
                updatedAt=lb.updatedAt,
            )
        )
    return LeaderboardResponse(entries=result, total=total)


def get_player_rank(player_id: int, db: Session) -> LeaderboardEntryResponse | None:
    # Ensure rankings are fresh
    db.execute("CALL sp_RecalculateLeaderboard()")

    lb_player = (
        db.query(Leaderboard, Player)
        .join(Player, Leaderboard.PlayerId == Player.PlayerId)
        .filter(Player.PlayerId == player_id)
        .first()
    )
    if lb_player:
        lb, player = lb_player
        return LeaderboardEntryResponse(
                rank=lb.rank,
                PlayerId=player.PlayerId,
                username=player.username,
                name=player.name,
                totalGames=lb.totalGames,
                totalWins=lb.totalWins,
                totalCorrect=lb.totalCorrect,
                bestScore=lb.bestScore,
                updatedAt=lb.updatedAt,
            )
    return None
