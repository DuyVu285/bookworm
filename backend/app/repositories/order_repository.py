from sqlmodel import Session, select
from app.models.order_model import Order


class OrderRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_order(self, order_create: Order) -> Order:
        new_order = Order(**order_create.model_dump())
        self.session.add(new_order)
        self.session.commit()
        self.session.refresh(new_order)
        return new_order

    def get_order_by_id(self, order_id: int) -> Order | None:
        return self.session.get(Order, order_id)

    def get_orders_by_user_id(self, user_id: int):
        query = select(Order).where(Order.user_id == user_id)
        return self.session.exec(query).all()
