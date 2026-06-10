from pydantic import BaseModel, EmailStr
from datetime import datetime


class PlayerResponse(BaseModel):
    PlayerId: int
    username: str
    email: EmailStr
    name: str
    isActive: bool
    createdAt: datetime

    model_config = {"from_attributes": True}


class PlayerProfileResponse(BaseModel):
    PlayerId: int
    username: str
    name: str
    lifeLineAskClass: bool
    lifeLine5050: bool
    lifeLinePhone: bool
    lifeLineNotes: bool

    model_config = {"from_attributes": True}


class PlayerUpdateRequest(BaseModel):
    name: str | None = None
    username: str | None = None
