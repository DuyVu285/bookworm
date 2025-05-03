from datetime import datetime
from pydantic import BaseModel


class OrderBase(BaseModel):
    order_date: datetime
    order_amount: float


class OrderCreate(OrderBase):
    user_id: int


class OrderUpdate(OrderBase):
    pass


class OrderRead(OrderBase):
    id: int
    user_id: int
