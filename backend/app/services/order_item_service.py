from fastapi import HTTPException, status
from sqlmodel import Session
from app.schemas.order_item_schema import OrderItemCreate, OrderItemRead
from app.models.order_item_model import OrderItem
from app.repositories.order_item_repository import OrderItemRepository


class OrderItemService:
    def __init__(self, session: Session):
        self.repository = OrderItemRepository(session)

    def create_order_item(self, item_data: OrderItemCreate) -> OrderItemRead:
        item = self.repository.create_order_item(item_data)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create order item",
            )
        item = OrderItemRead(
            id=item.id,
            quantity=item.quantity,
            price=item.price,
            order_id=item.order_id,
            book_id=item.book_id,
        )
        return item

    def create_multiple_order_items(
        self, items_data: list[OrderItemCreate]
    ) -> list[OrderItem]:
        items = self.repository.create_multiple_order_items(items_data)
        if not items:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create order items",
            )
        items = [
            OrderItemRead(
                id=item.id,
                quantity=item.quantity,
                price=item.price,
                order_id=item.order_id,
                book_id=item.book_id,
            )
            for item in items
        ]
        return items

    def get_items_by_order_id(self, order_id: int) -> list[OrderItemRead]:
        items = self.repository.get_items_by_order_id(order_id)
        if not items:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order items not found",
            )
        items = [
            OrderItemRead(
                id=item.id,
                quantity=item.quantity,
                price=item.price,
                order_id=item.order_id,
                book_id=item.book_id,
            )
            for item in items
        ]
        return items
