from fastapi import HTTPException, status
from sqlmodel import Session
from app.schemas.order_schema import OrderCreate, OrderRead
from app.models.order_model import Order
from app.repositories.order_repository import OrderRepository


class OrderService:
    def __init__(self, session: Session):
        self.repository = OrderRepository(session)

    def create_order(self, order_data: OrderCreate) -> OrderRead:
        order = self.repository.create_order(order_data)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create order",
            )

        order = OrderRead(
            id=order.id,
            order_date=order.order_date,
            order_amount=order.order_amount,
            user_id=order.user_id,
        )
        return order
