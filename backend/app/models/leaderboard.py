from sqlalchemy import Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base


class Leaderboard(Base):
    __tablename__ = "Leaderboard"

    LeaderboardId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    PlayerId: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("Player.PlayerId", deferrable=True, initially="IMMEDIATE"),
        unique=True,
        nullable=False
    )
    totalGames: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    totalWins: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    totalCorrect: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    bestScore: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    rank: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    updatedAt: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationships
    player: Mapped["Player"] = relationship("Player", back_populates="leaderboard")

    def __repr__(self) -> str:
        return (
            f"<Leaderboard id={self.LeaderboardId} "
            f"player={self.PlayerId} rank={self.rank} bestScore={self.bestScore}>"
        )
