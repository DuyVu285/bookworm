from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column, Relationship
from typing import TYPE_CHECKING, List, Optional

if TYPE_CHECKING:
    from app.models.book_model import Book

class Review(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    book_id: int = Field(foreign_key="book.id")
    review_title: str = Field(max_length=120)
    review_details: str
    review_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    rating_start: str = Field(max_length=255)
    
    book: Optional["Book"] = Relationship(back_populates="reviews")