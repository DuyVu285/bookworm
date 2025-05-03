from sqlmodel import Session, select
from app.models.category_model import Category


class CategoryRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all_categories(self):
        query = select(Category.id, Category.category_name).order_by(
            Category.category_name
        )
        return self.session.exec(query).all()

    def get_category_by_id(self, category_id: int):
        query = select(Category).where(Category.id == category_id)
        return self.session.exec(query).one_or_none()
