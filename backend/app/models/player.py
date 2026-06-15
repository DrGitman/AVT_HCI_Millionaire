from sqlalchemy import Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base


class Player(Base):
    __tablename__ = "Player"

    PlayerId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    playerCode: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    # Auth fields
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    passwordHash: Mapped[str] = mapped_column(String, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    isActive: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    createdAt: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    player_answers: Mapped[list["PlayerGameAnswer"]] = relationship(
        "PlayerGameAnswer", back_populates="player"
    )
    ask_the_class_votes: Mapped[list["AskTheClassVote"]] = relationship(
        "AskTheClassVote", back_populates="player"
    )
    leaderboard: Mapped["Leaderboard | None"] = relationship(
        "Leaderboard", back_populates="player", uselist=False
    )

    def __repr__(self) -> str:
        return f"<Player id={self.PlayerId} username={self.username}>"
