from typing import Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from app.repositories.author_repository import AuthorRepository
from app.models.author_model import Author


class AuthorService:
    def __init__(self, db_session: Session):
        self.author_repository = AuthorRepository(db_session)

    def get_author_by_id(self, author_id: int) -> Author:
        author = self.author_repository.get_author_by_id(author_id)
        if not author:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Author not found"
            )
        return author

    def get_author_by_name(self, author_name: str) -> Author:
        author = self.author_repository.get_author_by_name(author_name)
        if not author:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Author not found"
            )
        return author

    def get_all_authors(self) -> list[Author]:
        authors = self.author_repository.get_all_authors()
        if not authors:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Authors not found"
            )
        return authors

    def create_author(self, author: Author) -> Author:
        existing_author = self.author_repository.get_author_by_id(author.id)
        if existing_author:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Author with this ID already exists",
            )
        return self.author_repository.create_author(author)

    def update_author(self, author_id: int, updated_data: Author) -> Author:
        existing_author = self.author_repository.get_author_by_id(author_id)
        if not existing_author:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Author not found"
            )
        return self.author_repository.update_author(author_id, updated_data)

    def delete_author(self, author_id: int) -> None:
        existing_author = self.author_repository.get_author_by_id(author_id)
        if not existing_author:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Author not found"
            )
        return self.author_repository.delete_author(author_id)
