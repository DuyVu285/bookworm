from sqlmodel import Session, select, func
from app.models.order_model import Order


class OrderRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_order(self, order: Order):
        order = Order(**order.model_dump())
        self.session.add(order)
        self.session.commit()
        self.session.refresh(order)
        return order

    def get_order_by_id(self, order_id: int):
        return self.session.get(Order, order_id)

    def get_all_orders(self):
        return self.session.exec(select(Order)).all()

    def delete_order(self, order_id: int):
        self.session.delete(self.get_order_by_id(order_id))
        self.session.commit()

    def update_order(self, order_id: int, updated_data: Order):
        order = self.get_order_by_id(order_id)
        data = updated_data.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(order, key, value)
        self.session.commit()
        self.session.refresh(order)
        return order

    def get_orders_count(self):
        query = select(func.count(Order.id)).scalar_subquery()
        return self.session.exec(query).one()

    def get_orders_count_by_user_id(self, user_id: int):
        query = (
            select(func.count(Order.id))
            .where(Order.user_id == user_id)
            .scalar_subquery()
        )
        return self.session.exec(query).one()
