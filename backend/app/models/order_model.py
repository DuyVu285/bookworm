from typing import List, TYPE_CHECKING, Optional
from sqlmodel import Column, Field, Numeric, Relationship, SQLModel
from datetime import datetime

if TYPE_CHECKING:
    from app.models.user_model import User
    from app.models.order_item_model import OrderItem


class Order(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    order_date: datetime = Field(default_factory=datetime.utcnow)
    order_amount: float = Field(sa_column=Column(Numeric(10, 2)))

    user: Optional["User"] = Relationship(back_populates="orders")
    order_items: List["OrderItem"] = Relationship(back_populates="order")
