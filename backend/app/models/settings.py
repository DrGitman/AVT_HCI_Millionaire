from sqlalchemy import Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class PlayerSettings(Base):
    __tablename__ = "PlayerSettings"

    PlayerId: Mapped[int] = mapped_column(Integer, ForeignKey("Player.PlayerId", ondelete="CASCADE"), primary_key=True)
    allowSpeedInvites: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    themePreference: Mapped[str] = mapped_column(String(50), default="Heritage Earth", nullable=False)
    volumeLevel: Mapped[int] = mapped_column(Integer, default=85, nullable=False)

    player: Mapped["Player"] = relationship("Player")
