from pydantic import BaseModel
from datetime import datetime


class LeaderboardEntryResponse(BaseModel):
    rank: int
    PlayerId: int
    username: str
    name: str
    totalGames: int
    totalWins: int
    totalCorrect: int
    bestScore: int
    updatedAt: datetime

    model_config = {"from_attributes": True}


class LeaderboardResponse(BaseModel):
    entries: list[LeaderboardEntryResponse]
    total: int
