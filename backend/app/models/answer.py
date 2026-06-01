from sqlalchemy import Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Answer(Base):
    __tablename__ = "Answer"

    AnswerId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    answerCode: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    answer: Mapped[str] = mapped_column(String, nullable=False)
    QuestionId: Mapped[int] = mapped_column(
        Integer, ForeignKey("Question.QuestionId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    isCorrect: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    justification: Mapped[str | None] = mapped_column(String, nullable=True)

    # Relationships
    question: Mapped["Question"] = relationship("Question", back_populates="answers")
    player_answers: Mapped[list["PlayerGameAnswer"]] = relationship(
        "PlayerGameAnswer", back_populates="answer"
    )
    ask_the_class_votes: Mapped[list["AskTheClassVote"]] = relationship(
        "AskTheClassVote",
        back_populates="answer"
    )

    def __repr__(self) -> str:
        return (
            f"<Answer id={self.AnswerId} code={self.answerCode} correct={self.isCorrect}>"
        )
