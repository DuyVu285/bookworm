from fastapi import HTTPException, status
from sqlmodel import Session
from app.repositories.author_repository import AuthorRepository
from app.schemas.author_schema import AuthorsRead, AuthorRead


class AuthorService:
    def __init__(self, db_session: Session):
        self.author_repository = AuthorRepository(db_session)

    def get_all_authors(self) -> AuthorsRead:
        authors = self.author_repository.get_all_authors()
        if not authors:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Authors not found"
            )

        authors = [
            AuthorRead(
                id=author.id,
                author_name=author.author_name,
            )
            for author in authors
        ]
        return AuthorsRead(authors=authors)

    def get_author_by_id(self, author_id: int) -> AuthorRead:
        author = self.author_repository.get_author_by_id(author_id)
        if not author:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Author with id {author_id} not found",
            )
        return AuthorRead(
            id=author.id,
            author_name=author.author_name,
        )
