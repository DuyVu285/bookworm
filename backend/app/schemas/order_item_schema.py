from pydantic import BaseModel


class OrderItemBase(BaseModel):
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    order_id: int
    book_id: int


class OrderItemUpdate(OrderItemBase):
    pass


class OrderItemRead(OrderItemBase):
    id: int

    class Config:
        orm_mode = True
