import datetime
from pydantic import BaseModel

class DiscountBase(BaseModel):
    discount_start_date: datetime
    discount_end_date: datetime
    discount_price: float
    
class DiscountCreate(DiscountBase):
    book_id: int

class DiscountUpdate(DiscountBase):
    pass

class DiscountRead(DiscountBase):
    id: int
    
    class Config:
        orm_mode = True