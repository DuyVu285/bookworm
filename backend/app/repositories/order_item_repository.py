from sqlmodel import Session, select
from app.models.order_item_model import OrderItem


class OrderItemRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_order_item(self, order_item_create: OrderItem) -> OrderItem:
        order_item = OrderItem(**order_item_create.model_dump())
        self.session.add(order_item)
        self.session.commit()
        self.session.refresh(order_item)
        return order_item

    def create_multiple_order_items(self, items: list[OrderItem]) -> list[OrderItem]:
        created_items = []
        for item in items:
            order_item = OrderItem(**item.model_dump())
            self.session.add(order_item)
            created_items.append(order_item)
        self.session.commit()
        for item in created_items:
            self.session.refresh(item)
        return created_items

    def get_items_by_order_id(self, order_id: int) -> list[OrderItem]:
        query = select(OrderItem).where(OrderItem.order_id == order_id)
        items = self.session.exec(query).all()
        return items
