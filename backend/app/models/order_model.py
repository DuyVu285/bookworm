import datetime
from typing import List
from sqlmodel import BigInteger, Column, Field, Numeric, Relationship, SQLModel

from backend.app.models.order_item_model import OrderItem
from backend.models.user_model import User


class Order(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True, sa_column=Column(BigInteger))
    user_id: int = Field(foreign_key="user.id")
    order_date: datetime
    order_amount: float = Field(sa_column=Column(Numeric(10, 2)))

    user: User = Relationship(back_populates="orders")
    items: List["OrderItem"] = Relationship(back_populates="order")
