from typing import Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from app.repositories.discount_repository import DiscountRepository
from app.models.discount_model import Discount


class DiscountService:
    def __init__(self, session: Session):
        self.discount_repository = DiscountRepository(session)

    def get_discount_by_id(self, discount_id: int) -> Discount:
        discount = self.discount_repository.get_discount_by_id(discount_id)
        if not discount:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Discount not found"
            )
        return discount

    def create_discount(self, discount: Discount) -> Discount:
        existing_discount = self.discount_repository.get_discount_by_id(discount.id)
        if existing_discount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Discount with this ID already exists",
            )
        return self.discount_repository.create_discount(discount)

    def update_discount(self, discount_id: int, discount: Discount) -> Discount:
        existing_discount = self.discount_repository.get_discount_by_id(discount_id)
        if not existing_discount:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Discount not found"
            )
        return self.discount_repository.update_discount(discount_id, discount)

    def delete_discount(self, discount_id: int) -> None:
        existing_discount = self.discount_repository.get_discount_by_id(discount_id)
        if not existing_discount:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Discount not found"
            )
        return self.discount_repository.delete_discount(discount_id)
