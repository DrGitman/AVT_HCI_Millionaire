from sqlalchemy import Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class PhoneAPeerHint(Base):
    __tablename__ = "PhoneAPeerHint"

    PhoneAPeerHintId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    phoneAPeerHintCode: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    QuestionId: Mapped[int] = mapped_column(
        Integer, ForeignKey("Question.QuestionId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    avatarName: Mapped[str] = mapped_column(String, nullable=False)
    hintText: Mapped[str] = mapped_column(String, nullable=False)
    isActive: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    question: Mapped["Question"] = relationship("Question", back_populates="phone_hints")
    players_used: Mapped[list["Player"]] = relationship(
        "Player", back_populates="phone_hint_result",
        foreign_keys="Player.lifeLinePhoneResult"
    )

    def __repr__(self) -> str:
        return (
            f"<PhoneAPeerHint id={self.PhoneAPeerHintId} "
            f"avatar={self.avatarName}>"
        )
