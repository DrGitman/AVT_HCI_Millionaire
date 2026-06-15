from sqlalchemy import Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base


class PlayerGameLifeline(Base):
    __tablename__ = "PlayerGameLifeline"

    PlayerGameLifelineId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    PlayerId: Mapped[int] = mapped_column(Integer, ForeignKey("Player.PlayerId", ondelete="CASCADE"), nullable=False)
    GameId: Mapped[int] = mapped_column(Integer, ForeignKey("Game.GameId", ondelete="CASCADE"), nullable=False)

    lifeLineAskClass: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    lifeLineAskClassResult: Mapped[str | None] = mapped_column(String, nullable=True)
    lifeLine5050: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    lifeLinePhone: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    lifeLinePhoneResult: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("PhoneAPeerHint.PhoneAPeerHintId", ondelete="SET NULL"),
        nullable=True
    )
    lifeLineNotes: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    lifeLineNotesResult: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("CourseNoteHint.CourseNoteHintId", ondelete="SET NULL"),
        nullable=True
    )

    # Relationships
    player: Mapped["Player"] = relationship("Player")
    game: Mapped["Game"] = relationship("Game")
    phone_hint_result: Mapped["PhoneAPeerHint | None"] = relationship("PhoneAPeerHint")
    notes_hint_result: Mapped["CourseNoteHint | None"] = relationship("CourseNoteHint")
