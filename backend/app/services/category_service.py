from fastapi import HTTPException, status
from sqlmodel import Session
from app.repositories.category_repository import CategoryRepository
from app.models.author_model import Author


class CategoryService:
    def __init__(self, db_session: Session):
        self.author_repository = CategoryRepository(db_session)

    def get_all_categories(self) -> list[Author]:
        authors = self.author_repository.get_all_categories()
        if not authors:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Categories not found"
            )
        return authors
