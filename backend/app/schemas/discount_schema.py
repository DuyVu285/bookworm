from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import Optional

class DiscountBase(BaseModel):
    discount_start_date: datetime 
    discount_end_date: datetime
    discount_price: float

    @model_validator(mode="before")
    def check_discount_dates(cls, values):
        start_date = values.get("discount_start_date")
        end_date = values.get("discount_end_date")

        if start_date and end_date and start_date > end_date:
            raise ValueError("Discount start date must be before discount end date.")
        return values

class DiscountCreate(DiscountBase):
    book_id: int

class DiscountUpdate(DiscountBase):
    pass

class DiscountRead(DiscountBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)