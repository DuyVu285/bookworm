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
