from fastapi import HTTPException, status
from sqlmodel import Session
from app.repositories.category_repository import CategoryRepository
from app.schemas.category_schema import CategoriesRead, CategoryRead


class CategoryService:
    def __init__(self, db_session: Session):
        self.author_repository = CategoryRepository(db_session)

    def get_all_categories(self) -> CategoriesRead:
        categories = self.author_repository.get_all_categories()
        if not categories:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Categories not found"
            )

        categories = [
            CategoryRead(id=category.id, category_name=category.category_name)
            for category in categories
        ]
        return CategoriesRead(categories=categories)

    def get_category_by_id(self, category_id: int) -> CategoryRead:
        category = self.author_repository.get_category_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found",
            )
        return CategoryRead(
            id=category.id,
            category_name=category.category_name,
        )
