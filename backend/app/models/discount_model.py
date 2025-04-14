from sqlmodel import Numeric, SQLModel, Field, Column, Relationship
from typing import TYPE_CHECKING, List, Optional
from datetime import datetime, timezone

if TYPE_CHECKING:
    from app.models.book_model import Book


class Discount(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    book_id: int = Field(foreign_key="book.id")
    discount_start_date: datetime = Field(
        default_factory=datetime.now(timezone.utc)
    )
    discount_end_date: datetime = Field(
        default_factory=datetime.now(timezone.utc)
    )
    discount_price: float = Field(sa_column=Column(Numeric(5, 2)))

    book: Optional["Book"] = Relationship(back_populates="category")
