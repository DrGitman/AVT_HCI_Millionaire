from sqlalchemy import Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base


class Notification(Base):
    __tablename__ = "Notification"

    NotificationId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    PlayerId: Mapped[int] = mapped_column(Integer, ForeignKey("Player.PlayerId", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    message: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    isRead: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    createdAt: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    linkRoute: Mapped[str | None] = mapped_column(String(100), nullable=True)

    player: Mapped["Player"] = relationship("Player")
