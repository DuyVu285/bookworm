from sqlmodel import SQLModel, Field, Column, Relationship
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from app.models.book_model import Book


class Category(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    category_name: str = Field(max_length=120)
    category_description: str = Field(max_length=255)

    books: List["Book"] = Relationship(back_populates="category")
