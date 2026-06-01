from sqlalchemy.orm import Session
from app.models.leaderboard import Leaderboard
from app.models.player import Player
from app.schemas.leaderboard import LeaderboardEntryResponse, LeaderboardResponse


def get_global_leaderboard(
    db: Session, limit: int = 50, offset: int = 0
) -> LeaderboardResponse:
    entries = (
        db.query(Leaderboard, Player)
        .join(Player, Leaderboard.PlayerId == Player.PlayerId)
        .order_by(Leaderboard.bestScore.desc(), Leaderboard.totalWins.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    total = db.query(Leaderboard).count()
    result = []
    for rank, (lb, player) in enumerate(entries, start=offset + 1):
        result.append(
            LeaderboardEntryResponse(
                rank=rank,
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
    all_entries = (
        db.query(Leaderboard, Player)
        .join(Player, Leaderboard.PlayerId == Player.PlayerId)
        .order_by(Leaderboard.bestScore.desc(), Leaderboard.totalWins.desc())
        .all()
    )
    for rank, (lb, player) in enumerate(all_entries, start=1):
        if player.PlayerId == player_id:
            return LeaderboardEntryResponse(
                rank=rank,
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
