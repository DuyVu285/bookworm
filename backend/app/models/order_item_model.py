# order_item_model.py

from typing import Optional
from sqlmodel import SQLModel, Field, Column, Numeric, ForeignKey, Relationship
from app.models.order_model import Order  

class OrderItem(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    quantity: int
    price: float = Field(sa_column=Column(Numeric(5, 2)))

    order: Optional["Order"] = Relationship(back_populates="order_items")
