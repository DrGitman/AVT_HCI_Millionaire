from sqlalchemy import Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base


class Game(Base):
    __tablename__ = "Game"

    GameId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    gameCode: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    player1: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("Player.PlayerId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    player2: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("Player.PlayerId", deferrable=True, initially="IMMEDIATE"),
        nullable=True
    )
    player3: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("Player.PlayerId", deferrable=True, initially="IMMEDIATE"),
        nullable=True
    )
    player4: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("Player.PlayerId", deferrable=True, initially="IMMEDIATE"),
        nullable=True
    )
    winner: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("Player.PlayerId", deferrable=True, initially="IMMEDIATE"),
        nullable=True
    )

    # status: 'waiting' | 'active' | 'completed' | 'abandoned'
    status: Mapped[str] = mapped_column(String, default="waiting", nullable=False)
    startTime: Mapped[DateTime | None] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    endTime: Mapped[DateTime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    player1_ref: Mapped["Player"] = relationship("Player", foreign_keys=[player1])
    player2_ref: Mapped["Player | None"] = relationship("Player", foreign_keys=[player2])
    player3_ref: Mapped["Player | None"] = relationship("Player", foreign_keys=[player3])
    player4_ref: Mapped["Player | None"] = relationship("Player", foreign_keys=[player4])
    winner_ref: Mapped["Player | None"] = relationship("Player", foreign_keys=[winner])
    game_categories: Mapped[list["GameCategory"]] = relationship(
        "GameCategory", back_populates="game", cascade="all, delete-orphan"
    )
    player_answers: Mapped[list["PlayerGameAnswer"]] = relationship(
        "PlayerGameAnswer", back_populates="game", cascade="all, delete-orphan"
    )
    ask_the_class_votes: Mapped[list["AskTheClassVote"]] = relationship(
        "AskTheClassVote", back_populates="game", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Game id={self.GameId} code={self.gameCode} status={self.status}>"
