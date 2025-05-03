from pydantic import BaseModel, ConfigDict


class OrderItemBase(BaseModel):
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    order_id: int
    book_id: int


class OrderItemUpdate(OrderItemBase):
    pass


class OrderItemRead(OrderItemCreate):
    id: int


class OrderItemForOrderCreate(OrderItemBase):
    book_id: int
