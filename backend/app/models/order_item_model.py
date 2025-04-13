from typing import TYPE_CHECKING, Optional
from sqlmodel import SQLModel, Field, Column, Numeric, ForeignKey, Relationship

if TYPE_CHECKING:
    from app.models.order_model import Order
    from app.models.book_model import Book


class OrderItem(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    book_id: int = Field(foreign_key="book.id")
    quantity: int
    price: float = Field(sa_column=Column(Numeric(5, 2)))

    order: Optional["Order"] = Relationship(back_populates="order_items")
    book: Optional["Book"] = Relationship(back_populates="order_items")
