from sqlalchemy import Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base


class Achievement(Base):
    __tablename__ = "Achievement"

    AchievementId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    icon: Mapped[str] = mapped_column(String(50), nullable=False)


class PlayerAchievement(Base):
    __tablename__ = "PlayerAchievement"

    PlayerAchievementId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    PlayerId: Mapped[int] = mapped_column(Integer, ForeignKey("Player.PlayerId", ondelete="CASCADE"), nullable=False)
    AchievementId: Mapped[int] = mapped_column(Integer, ForeignKey("Achievement.AchievementId", ondelete="CASCADE"), nullable=False)
    unlockedAt: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    player: Mapped["Player"] = relationship("Player")
    achievement: Mapped["Achievement"] = relationship("Achievement")
