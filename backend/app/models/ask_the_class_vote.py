from sqlalchemy import Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base


class AskTheClassVote(Base):
    __tablename__ = "AskTheClassVote"

    VoteId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    voteCode: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    GameId: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("Game.GameId", deferrable=True, initially="IMMEDIATE"),
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
    PlayerId: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("Player.PlayerId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    votedAt: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    game: Mapped["Game"] = relationship("Game", back_populates="ask_the_class_votes")
    question: Mapped["Question"] = relationship("Question", back_populates="ask_the_class_votes")
    answer: Mapped["Answer"] = relationship("Answer", back_populates="ask_the_class_votes")
    player: Mapped["Player"] = relationship("Player", back_populates="ask_the_class_votes")

    def __repr__(self) -> str:
        return (
            f"<AskTheClassVote id={self.VoteId} "
            f"game={self.GameId} answer={self.AnswerId}>"
        )
