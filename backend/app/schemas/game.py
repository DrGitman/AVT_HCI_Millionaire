from __future__ import annotations
from pydantic import BaseModel
from datetime import datetime
from app.schemas.question import QuestionResponse


class GameCreateRequest(BaseModel):
    player2Id: int | None = None
    player3Id: int | None = None
    player4Id: int | None = None
    categoryIds: list[int] = []

class GameResponse(BaseModel):
    GameId: int
    gameCode: str
    status: str
    player1: int
    player2: int | None
    player3: int | None
    player4: int | None
    winner: int | None
    startTime: datetime | None
    endTime: datetime | None

    model_config = {"from_attributes": True}


class GameStateResponse(BaseModel):
    GameId: int
    gameCode: str
    status: str
    currentQuestion: QuestionResponse | None
    currentSequence: int
    prizeWon: int
    lifelinesAvailable: dict[str, bool]

    model_config = {"from_attributes": True}


class BadgeSchema(BaseModel):
    threshold: int
    code: str
    name: str
    description: str


class GameEndResponse(BaseModel):
    GameId: int
    winnerId: int | None
    finalScore: int
    totalCorrect: int
    totalQuestions: int
    badgesEarned: list[dict]
