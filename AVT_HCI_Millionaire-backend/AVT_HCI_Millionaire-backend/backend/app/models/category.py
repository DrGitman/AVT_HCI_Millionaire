from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Category(Base):
    __tablename__ = "Category"

    CategoryId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    categoryCode: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)

    # Relationships
    questions: Mapped[list["Question"]] = relationship(
        "Question", back_populates="category"
    )
    game_categories: Mapped[list["GameCategory"]] = relationship(
        "GameCategory", back_populates="category"
    )

    def __repr__(self) -> str:
        return f"<Category id={self.CategoryId} code={self.categoryCode} name={self.name}>"
