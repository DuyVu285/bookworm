from typing import TYPE_CHECKING
from sqlmodel import SQLModel, Field, Column, Relationship

if TYPE_CHECKING:
    from app.models.book_model import Book


class Author(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    author_name: str = Field(max_length=255)
    author_bio: str

    books: list["Book"] = Relationship(back_populates="author")
