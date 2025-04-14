from pydantic import BaseModel, ConfigDict


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

    model_config = ConfigDict(from_attributes=True)

