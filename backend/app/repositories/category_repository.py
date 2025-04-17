from sqlmodel import Session, select
from app.models.category_model import Category


class CategoryRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_category_by_id(self, category_id) -> Category:
        query = select(Category).where(Category.id == category_id)
        return self.session.exec(query).one_or_none()
