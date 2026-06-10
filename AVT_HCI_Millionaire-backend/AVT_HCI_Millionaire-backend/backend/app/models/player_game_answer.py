from sqlalchemy import Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base


class PlayerGameAnswer(Base):
    __tablename__ = "PlayerGameAnswer"

    PlayerGameAnswerId: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    playerGameAnswerCode: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    GameId: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("Game.GameId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    PlayerId: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("Player.PlayerId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    QuestionId: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("Question.QuestionId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    AnswerId: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("Answer.AnswerId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    isCorrect: Mapped[bool] = mapped_column(Boolean, nullable=False)
    questionSequence: Mapped[int] = mapped_column(Integer, nullable=False)
    answeredAt: Mapped[DateTime | None] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )

    # Relationships
    game: Mapped["Game"] = relationship("Game", back_populates="player_answers")
    player: Mapped["Player"] = relationship("Player", back_populates="player_answers")
    question: Mapped["Question"] = relationship("Question", back_populates="player_answers")
    answer: Mapped["Answer"] = relationship("Answer", back_populates="player_answers")

    def __repr__(self) -> str:
        return (
            f"<PlayerGameAnswer id={self.PlayerGameAnswerId} "
            f"player={self.PlayerId} game={self.GameId} correct={self.isCorrect}>"
        )