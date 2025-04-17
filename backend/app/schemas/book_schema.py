from typing import Optional
from pydantic import BaseModel, ConfigDict


class BookBase(BaseModel):
    book_title: str
    book_summary: str
    book_price: float
    book_cover_photo: str


class BookCreate(BookBase):
    category_id: int
    author_id: int


class BookUpdate(BookBase):
    pass


class BookRead(BookBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class BookReturn(BookBase):
    id: int
    category_id: int
    author_id: int


class BookPaginatedReturn(BookReturn):
    sub_price: float
    review_count: int
    avg_rating: float

    model_config = ConfigDict(from_attributes=True)


class BooksDetailsReturn(BaseModel):
    data: list[BookPaginatedReturn]
    page: int
    limit: int
    total_pages: int
    total_items: int
    start_item: int
    end_item: int
