from typing import Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from app.repositories.book_repository import BookRepository
from app.models.book_model import Book


class BookService:
    def __init__(self, session: Session):
        self.book_repository = BookRepository(session)

    def get_book_by_id(self, book_id: int) -> Book:
        book = self.book_repository.get_book_by_id(book_id)
        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
            )
        return book

    def get_book_by_title(self, book_title: str) -> list[Book]:
        book = self.book_repository.get_book_by_title(book_title)
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

    def get_books(
        self,
        page: int = 1,
        limit: int = 20,
        sort: str = "on sale",
        category_id: Optional[int] = None,
        author_id: Optional[int] = None,
        min_rating: Optional[float] = None,
    ) -> dict:
        books = self.book_repository.get_books(
            page, limit, sort, category_id, author_id, min_rating
        )
        if not books:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Books not found"
            )
        return books

    def get_top_10_most_discounted_books(self) -> list[Book]:
        books = self.book_repository.get_top_10_most_discounted_books()
        if not books:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Books not found"
            )
        return books

    def get_top_8_books(self, sort: str = "recommended") -> list[Book]:
        books = self.book_repository.get_top_8_books(sort)
        if not books:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Books not found"
            )
        return books
