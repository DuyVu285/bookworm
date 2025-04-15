from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class BookBase(BaseModel):
    book_title: str = Field(..., min_length=1, max_length=255)
    book_summary: str = Field(..., max_length=1000)
    book_price: float = Field(..., ge=0)
    book_cover_photo: str = Field(..., max_length=500)


class BookCreate(BookBase):
    category_id: int = Field(..., gt=0)
    author_id: int = Field(..., gt=0)


class BookUpdate(BookBase):
    pass

class BookRead(BookBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
