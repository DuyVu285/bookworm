from typing import TYPE_CHECKING, List, Optional
from sqlmodel import Column, Field, Numeric, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.order_item_model import OrderItem
    from app.models.category_model import Category
    from backend.app.models.author_model import Author
    from app.models.discount_model import Discount
    from app.models.review_model import Review

class Book(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    category_id: int = Field(foreign_key="category.id")
    author_id: int = Field(foreign_key="author.id")
    book_title: str = Field(max_length=255)
    book_summary: str
    book_price: float = Field(sa_column=Column(Numeric(5, 2)))
    book_cover_photo: str = Field(default=None, max_length=20)

    category: Optional["Category"] = Relationship(back_populates="books")
    author: Optional["Author"] = Relationship(back_populates="books")
    order_items: List["OrderItem"] = Relationship(back_populates="book")
    discounts: List["Discount"] = Relationship(back_populates="book")
    reviews: List["Review"] = Relationship(back_populates="book")
