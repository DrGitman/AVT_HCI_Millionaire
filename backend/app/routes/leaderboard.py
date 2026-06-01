from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.leaderboard import LeaderboardResponse
from app.services.leaderboard_service import get_global_leaderboard
from app.security.dependencies import get_current_player

router = APIRouter()


@router.get("/", response_model=LeaderboardResponse)
def global_leaderboard(
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0),
    db: Session = Depends(get_db),
    _=Depends(get_current_player),
):
    return get_global_leaderboard(db, limit, offset)
