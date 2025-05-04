from typing import Literal, Optional
from pydantic import BaseModel, Field, field_validator
from datetime import datetime


class ReviewRead(BaseModel):
    id: int
    book_id: Optional[int]
    review_title: str
    review_details: str
    review_date: datetime
    rating_star: int


class ReviewsByIdRead(BaseModel):
    reviews: list[ReviewRead]
    page: int
    limit: int
    total_pages: int
    total_items: int
    start_item: int
    end_item: int


class ReviewsStarDistributionRead(BaseModel):
    rating_star: int
    count: int


class ReviewsStarsDistributionRead(BaseModel):
    reviews: list[ReviewsStarDistributionRead]


class ReviewCreate(BaseModel):
    book_id: int
    review_title: str = Field(..., min_length=1, max_length=120)
    review_details: Optional[str] = None
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


class ReviewsByIdQueryParams(BaseModel):
    book_id: int = Field(..., gt=0)
    page: int = Field(1, ge=1)
    limit: int = Field(20)
    sort: Literal["newest", "oldest"] = "latest"
    rating: int = Field(0, le=5)

    @field_validator("limit")
    def validate_limit(cls, v):
        allowed_limits = [5, 15, 20, 25]
        if v not in allowed_limits:
            raise ValueError(f"Limit must be one of {allowed_limits}")
        return v
