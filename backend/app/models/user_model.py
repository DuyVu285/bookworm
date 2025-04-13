from typing import TYPE_CHECKING, List
from sqlmodel import BigInteger, Column, Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.order_model import Order


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=50)
    email: str = Field(max_length=70, unique=True)
    password: str = Field(max_length=255)
    admin: bool = Field(default=False)

    orders: List["Order"] = Relationship(back_populates="user")
