from typing import TYPE_CHECKING, List, Optional
from sqlmodel import Column, Field, Numeric, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.order_item_model import OrderItem


class Book(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    book_title: str = Field(max_length=255)
    book_summary: str
    book_price: float = Field(sa_column=Column(Numeric(5, 2)))
    book_cover_photo: str = Field(default=None, max_length=20)

    order_items: List["OrderItem"] = Relationship(back_populates="book")
