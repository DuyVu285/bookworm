from fastapi import HTTPException, status
from sqlmodel import Session
from app.repositories.author_repository import AuthorRepository
from app.models.author_model import Author


class AuthorService:
    def __init__(self, db_session: Session):
        self.author_repository = AuthorRepository(db_session)

    def get_all_authors(self) -> list[Author]:
        authors = self.author_repository.get_all_authors()
        if not authors:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Authors not found"
            )
        return authors
