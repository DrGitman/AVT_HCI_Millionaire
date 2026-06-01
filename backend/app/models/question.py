from sqlalchemy import Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Question(Base):
    __tablename__ = "Question"

    QuestionId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    questionCode: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    question: Mapped[str] = mapped_column(String, nullable=False)
    CategoryId: Mapped[int] = mapped_column(
        Integer, ForeignKey("Category.CategoryId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    PrizeLevelId: Mapped[int] = mapped_column(
        Integer, ForeignKey("PrizeLevel.PrizeLevelId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    isActive: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    category: Mapped["Category"] = relationship("Category", back_populates="questions")
    prize_level: Mapped["PrizeLevel"] = relationship("PrizeLevel", back_populates="questions")
    answers: Mapped[list["Answer"]] = relationship(
        "Answer", back_populates="question", cascade="all, delete-orphan"
    )
    phone_hints: Mapped[list["PhoneAPeerHint"]] = relationship(
        "PhoneAPeerHint", back_populates="question", cascade="all, delete-orphan"
    )
    course_note_hints: Mapped[list["CourseNoteHint"]] = relationship(
        "CourseNoteHint", back_populates="question", cascade="all, delete-orphan"
    )
    player_answers: Mapped[list["PlayerGameAnswer"]] = relationship(
        "PlayerGameAnswer", back_populates="question"
    )

    def __repr__(self) -> str:
        return f"<Question id={self.QuestionId} code={self.questionCode}>"