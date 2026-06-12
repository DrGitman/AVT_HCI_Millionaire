from sqlalchemy import Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class CourseNoteHint(Base):
    __tablename__ = "CourseNoteHint"

    CourseNoteHintId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    courseNoteHintCode: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    QuestionId: Mapped[int] = mapped_column(
        Integer, ForeignKey("Question.QuestionId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    noteText: Mapped[str] = mapped_column(String, nullable=False)
    isActive: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    question: Mapped["Question"] = relationship(
        "Question", back_populates="course_note_hints"
    )
    players_used: Mapped[list["Player"]] = relationship(
        "Player", back_populates="notes_hint_result",
        foreign_keys="Player.lifeLineNotesResult"
    )

    def __repr__(self) -> str:
        return f"<CourseNoteHint id={self.CourseNoteHintId}>"
