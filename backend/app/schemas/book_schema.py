from typing import Optional
from pydantic import BaseModel


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
