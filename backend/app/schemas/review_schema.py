from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime

class ReviewBase(BaseModel):
    review_title: str
    review_details: str
    review_date: datetime
    rating_star: str
    
    @field_validator('rating_star')
    def validate_rating_star(cls, value):
        # Ensure rating_star is between 1 and 5
        if value not in {'1', '2', '3', '4', '5'}:
            raise ValueError('rating_star must be a string between 1 and 5')
        return value

    @field_validator('review_date')
    def validate_review_date(cls, value):
        # Ensure that the review_date is a valid datetime (already handled by Pydantic's default validation)
        if not isinstance(value, datetime):
            raise ValueError('review_date must be a valid datetime')
        return value

class ReviewCreate(ReviewBase):
    book_id: int
    
class ReviewUpdate(ReviewBase):
    pass

class ReviewRead(ReviewBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
