from typing import Optional
from pydantic import BaseModel


class BookBase(BaseModel):
    book_title: str
    book_summary: str
    book_price: float
    book_cover_photo: str
    category_id: int
    author_id: int


class BookRead(BookBase):
    id: int


class TopBookRead(BaseModel):
    id: int
    book_title: str
    book_price: float
    book_cover_photo: str
    sub_price: float
    author_name: str


class TopBooksRead(BaseModel):
    books: list[TopBookRead]


class BookPaginatedReturn(BookRead):
    sub_price: Optional[float]
    review_count: int
    avg_rating: float


class BooksDetailsReturn(BaseModel):
    data: list[BookRead]
    page: int
    limit: int
    total_pages: int
    total_items: int
    start_item: int
    end_item: int
