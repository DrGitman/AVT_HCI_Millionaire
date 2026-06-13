from sqlalchemy import Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class PrizeLevel(Base):
    __tablename__ = "PrizeLevel"

    PrizeLevelId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    prizeLevelCode: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    prizeValue: Mapped[int] = mapped_column(Integer, nullable=False)
    isSafetyNet: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    questions: Mapped[list["Question"]] = relationship(
        "Question", back_populates="prize_level"
    )

    def __repr__(self) -> str:
        return (
            f"<PrizeLevel id={self.PrizeLevelId} "
            f"value={self.prizeValue} safetyNet={self.isSafetyNet}>"
        )
