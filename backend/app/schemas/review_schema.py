import datetime
from pydantic import BaseModel

class ReviewBase(BaseModel):
    review_title: str
    review_details: str
    review_date: datetime
    rating_star: str
    
class ReviewCreate(ReviewBase):
    book_id: int
    
class ReviewUpdate(ReviewBase):
    pass

class ReviewRead(ReviewBase):
    id: int
    
    class Config:
        orm_mode = True