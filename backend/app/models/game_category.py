from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class GameCategory(Base):
    __tablename__ = "GameCategory"

    GameCategoryId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    gameCategoryCode: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    GameId: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("Game.GameId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )
    CategoryId: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("Category.CategoryId", deferrable=True, initially="IMMEDIATE"),
        nullable=False
    )

    # Relationships
    game: Mapped["Game"] = relationship("Game", back_populates="game_categories")
    category: Mapped["Category"] = relationship("Category", back_populates="game_categories")

    def __repr__(self) -> str:
        return (
            f"<GameCategory id={self.GameCategoryId} "
            f"game={self.GameId} category={self.CategoryId}>"
        )
