from sqlmodel import Session, select, func
from app.models.order_item_model import OrderItem


class OrderItemRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_order_item(self, order_item: OrderItem) -> OrderItem:
        order_item = OrderItem(**order_item.model_dump())
        self.session.add(order_item)
        self.session.commit()
        self.session.refresh(order_item)
        return order_item

    def get_order_item_by_id(self, order_item_id: int) -> OrderItem:
        query = select(OrderItem).where(OrderItem.id == order_item_id)
        return self.session.exec(query).one_or_none()

    def get_order_items_by_order_id(self, order_id: int) -> list[OrderItem]:
        query = select(OrderItem).where(OrderItem.order_id == order_id)
        return self.session.exec(query).all()

    def get_order_items_by_book_id(self, book_id: int) -> list[OrderItem]:
        query = select(OrderItem).where(OrderItem.book_id == book_id)
        return self.session.exec(query).all()

    def delete_order_item(self, order_item_id: int) -> None:
        self.session.delete(self.get_order_item_by_id(order_item_id))
        self.session.commit()

    def delete_order_items_by_order_id(self, order_id: int) -> None:
        self.session.delete(self.get_order_items_by_order_id(order_id))
        self.session.commit()

    def delete_order_items_by_book_id(self, book_id: int) -> None:
        self.session.delete(self.get_order_items_by_book_id(book_id))
        self.session.commit()

    def update_order_item(
        self, order_item_id: int, updated_data: OrderItem
    ) -> OrderItem | None:
        order_item = self.get_order_item_by_id(order_item_id)
        data = updated_data.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(order_item, key, value)
        self.session.commit()
        self.session.refresh(order_item)
        return order_item

    def get_order_items_count_by_order_id(self, order_id: int) -> int:
        query = (
            select(func.count(OrderItem.id))
            .where(OrderItem.order_id == order_id)
            .scalar_subquery()
        )
        return self.session.exec(query).one()

    def get_order_items_count_by_book_id(self, book_id: int) -> int:
        query = (
            select(func.count(OrderItem.id))
            .where(OrderItem.book_id == book_id)
            .scalar_subquery()
        )
        return self.session.exec(query).one()

    def get_order_item_by_order_id_and_book_id(
        self, order_id: int, book_id: int
    ) -> OrderItem:
        query = select(OrderItem).where(
            OrderItem.order_id == order_id, OrderItem.book_id == book_id
        )
        return self.session.exec(query).one_or_none()

    def update_order_item_quantity(self, order_item_id: int, quantity: int) -> None:
        order_item = self.get_order_item_by_id(order_item_id)
        order_item.quantity = quantity
        self.session.commit()
        self.session.refresh(order_item)
        return

    def delete_order_item_by_order_id_and_book_id(
        self, order_id: int, book_id: int
    ) -> None:
        self.session.delete(
            self.get_order_item_by_order_id_and_book_id(order_id, book_id)
        )
        self.session.commit()

    def delete_order_items_by_order_id(self, order_id: int) -> None:
        self.session.delete(self.get_order_items_by_order_id(order_id))
        self.session.commit()

    def delete_order_items_by_book_id(self, book_id: int) -> None:
        self.session.delete(self.get_order_items_by_book_id(book_id))
        self.session.commit()
