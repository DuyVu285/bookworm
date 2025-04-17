from sqlmodel import Session, select
from app.models.discount_model import Discount


class DiscountRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_discount_by_id(self, discount_id: Discount) -> Discount:
        query = select(Discount).where(Discount.id == discount_id)
        return self.session.exec(query).one_or_none()

    def create_discount(self, discount: Discount) -> Discount:
        discount = Discount(**discount.model_dump())
        self.session.add(discount)
        self.session.commit()
        self.session.refresh(discount)
        return discount

    def update_discount(self, discount_id: int, updated_data: Discount)-> Discount:
        discount = self.get_discount_by_id(discount_id)
        data = updated_data.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(discount, key, value)
        self.session.commit()
        self.session.refresh(discount)
        return discount

    def delete_discount(self, discount_id: int) -> None:
        self.session.delete(self.get_discount_by_id(discount_id))
        self.session.commit()

    def get_discount_price_by_book_id(self, book_id: int) -> int:
        query = select(Discount.discount_price).where(Discount.book_id == book_id)
        return self.session.exec(query).one_or_none()
