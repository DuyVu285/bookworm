from typing import Literal, Optional
from pydantic import BaseModel, Field


class BookRead(BaseModel):
    id: int
    book_title: str
    book_price: float
    book_cover_photo: str
    sub_price: float
    author_name: str


class TopBooksRead(BaseModel):
    books: list[BookRead]


class BooksRead(BaseModel):
    books: list[BookRead]
    page: int
    limit: int
    total_pages: int
    total_items: int
    start_item: int
    end_item: int


class BookQueryParams(BaseModel):
    page: int = Field(1, ge=1)
    limit: int = Field(10, ge=1, le=100)
    sort: Literal["on sale", "price_asc", "price_desc", "rating"] = "on sale"
    category: Optional[int]
    author: Optional[int]
    rating: Optional[int] = Field(1, ge=1, le=5)


class Top8BooksQueryParams(BaseModel):
    sort: Literal["recomended", "popular"] = "recomended"
