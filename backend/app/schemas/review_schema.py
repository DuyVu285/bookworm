from pydantic import BaseModel, field_validator
from datetime import datetime


class ReviewRead(BaseModel):
    book_id: int
    review_title: str
    review_details: str
    review_date: datetime
    rating_star: int


class ReviewsRead(BaseModel):
    reviews: list[ReviewRead]
    page: int
    limit: int
    total_pages: int
    total_items: int
    start_item: int
    end_item: int


class ReviewCreate(BaseModel):
    book_id: int
    review_title: str
    review_details: str
    review_date: datetime
    rating_star: int

    @field_validator("rating_star")
    def validate_rating_star(cls, value):
        allowed_values = [1, 2, 3, 4, 5]
        if value not in allowed_values:
            raise ValueError("rating_star must be an int between 1 and 5")
        return value

    @field_validator("review_date")
    def validate_review_date(cls, value):
        if not isinstance(value, datetime):
            raise ValueError("review_date must be a valid datetime")
        return value
