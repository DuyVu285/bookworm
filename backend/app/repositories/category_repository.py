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
