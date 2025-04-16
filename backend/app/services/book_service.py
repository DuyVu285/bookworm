from typing import Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from app.repositories.book_repository import BookRepository
from app.models.book_model import Book


class BookService:
    def __init__(self, session: Session):
        self.book_repository = BookRepository(session)

    def get_book_by_id(self, book_id: int) -> Optional[Book]:
        book = self.book_repository.get_book_by_id(book_id)
        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
            )
        return book

    def create_book(self, book: Book) -> Book:
        existing_book = self.book_repository.get_book_by_title(book.book_title)
        if existing_book:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Book already exists"
            )
        return self.book_repository.create_book(book)

    def update_book(self, book_id: int, book: Book) -> Book:
        existing_book = self.book_repository.get_book_by_id(book_id)
        if not existing_book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
            )
        book.id = book_id
        return self.book_repository.update_book(book)

    def delete_book(self, book_id: int) -> Book:
        existing_book = self.book_repository.get_book_by_id(book_id)
        if not existing_book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
            )
        return self.book_repository.delete_book(book_id)
