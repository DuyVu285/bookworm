from pydantic import BaseModel

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
    
    class Config:
        orm_mode = True