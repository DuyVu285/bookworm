from typing import Literal, Optional
from pydantic import BaseModel, Field, field_validator


class BookRead(BaseModel):
    id: int
    book_title: str
    book_price: float
    book_cover_photo: str
    sub_price: float
    author_name: str


class BookDetailsRead(BaseModel):
    book_title: str
    book_price: float
    book_summary: str
    book_cover_photo: str
    sub_price: float
    author_name: str
    category_name: str


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
    limit: int = Field(20)
    sort: Literal["on sale", "popular", "price_asc", "price_desc"] = "on sale"
    category: Optional[int] = None
    author: Optional[int] = None
    rating: Optional[int] = Field(None, le=5)

    @field_validator("limit")
    def validate_limit(cls, v):
        allowed_limits = [5, 15, 20, 25]
        if v not in allowed_limits:
            raise ValueError(f"Limit must be one of {allowed_limits}")
        return v


class Top8BooksQueryParams(BaseModel):
    sort: Literal["recommended", "popular"] = "recommended"


class BookSearchRead(BaseModel):
    id: int
    book_title: str
    book_cover_photo: str


class BooksSearchRead(BaseModel):
    books: list[BookSearchRead]
