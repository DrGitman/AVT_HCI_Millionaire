from pydantic import BaseModel
from datetime import datetime

class NotificationResponse(BaseModel):
    NotificationId: int
    title: str
    message: str
    type: str
    isRead: bool
    createdAt: datetime
    linkRoute: str | None

    class Config:
        from_attributes = True

class NotificationUpdate(BaseModel):
    isRead: bool
