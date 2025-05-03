# app/schemas/order_with_items_schema.py

from datetime import datetime
from typing import List
from pydantic import BaseModel
from app.schemas.order_item_schema import OrderItemForOrderCreate, OrderItemRead


class OrderWithItemsCreate(BaseModel):
    user_id: int
    order_date: datetime
    order_amount: float
    items: List[OrderItemForOrderCreate]


class OrderWithItemsRead(BaseModel):
    id: int
    user_id: int
    order_date: datetime
    order_amount: float
    items: List[OrderItemRead]
