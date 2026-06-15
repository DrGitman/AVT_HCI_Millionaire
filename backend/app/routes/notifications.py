from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.notification import Notification
from app.models.player import Player
from app.schemas.notification import NotificationResponse
from app.security.dependencies import get_current_player

router = APIRouter()

@router.get("/", response_model=list[NotificationResponse])
def get_notifications(
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db)
):
    return db.query(Notification).filter(Notification.PlayerId == current_player.PlayerId).order_by(Notification.createdAt.desc()).all()

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_read(
    notification_id: int,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db)
):
    notif = db.query(Notification).filter(Notification.NotificationId == notification_id, Notification.PlayerId == current_player.PlayerId).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.isRead = True
    db.commit()
    db.refresh(notif)
    return notif

@router.patch("/read-all")
def mark_all_read(
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db)
):
    db.query(Notification).filter(Notification.PlayerId == current_player.PlayerId).update({"isRead": True})
    db.commit()
    return {"message": "All marked read"}
