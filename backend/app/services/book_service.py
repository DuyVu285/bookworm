from typing import Optional
from fastapi import HTTPException, status
from sqlmodel import Session
from app.core.config import settings
from app.repositories.book_repository import BookRepository
from app.schemas.book_schema import BookRead, TopBooksRead, BooksRead


class BookService:
    def __init__(self, session: Session):
        self.book_repository = BookRepository(session)
        self.server_url = settings.SERVER_URL

    def get_book_by_id(self, book_id: int) -> BookRead:
        book = self.book_repository.get_book_by_id(book_id)
        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
            )
        return book

    def get_books(
        self,
        page: int = 1,
        limit: int = 20,
        sort: str = "on sale",
        category_id: Optional[int] = None,
        author_id: Optional[int] = None,
        min_rating: Optional[float] = None,
    ) -> BooksRead:
        books = self.book_repository.get_books(
            page, limit, sort, category_id, author_id, min_rating
        )
        if not books:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Books not found"
            )

        books_with_sort_and_filters = [
            BookRead(
                id=book[0],  # id
                book_title=book[1],  # book_title
                book_price=book[2],  # book_price
                book_cover_photo=self.server_url
                + f"/static/book_covers/{book[3]}",  # book_cover_photo
                author_name=book[4],  # author_name
                sub_price=book[5],  # sub_price
            )
            for book in books
        ]

        total_items = books[0][-1]
        total_pages = (total_items + limit - 1) // limit
        start_item = (page - 1) * limit + 1
        end_item = min(page * limit, total_items)

        return BooksRead(
            books=books_with_sort_and_filters,
            page=page,
            limit=limit,
            total_pages=total_pages,
            total_items=total_items,
            start_item=start_item,
            end_item=end_item,
        )

    def get_top_10_most_discounted_books(self) -> TopBooksRead:
        results = self.book_repository.get_top_10_most_discounted_books()

        if not results:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Books not found"
            )

        books_with_discount = [
            BookRead(
                id=id,
                book_title=book_title,
                book_price=book_price,
                book_cover_photo=self.server_url
                + f"/static/book_covers/{book_cover_photo}",
                sub_price=sub_price,
                author_name=author_name,
            )
            for id, book_title, book_price, book_cover_photo, sub_price, author_name in results
        ]

        return TopBooksRead(books=books_with_discount)

    def get_top_8_books(self, sort: str) -> TopBooksRead:
        books = self.book_repository.get_top_8_books(sort)
        if not books:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Books not found"
            )

        books_with_sort = [
            BookRead(
                id=id,
                book_title=book_title,
                book_price=book_price,
                book_cover_photo=self.server_url
                + f"/static/book_covers/{book_cover_photo}",
                sub_price=sub_price,
                author_name=author_name,
            )
            for id, book_title, book_price, book_cover_photo, sub_price, author_name in books
        ]
        return TopBooksRead(books=books_with_sort)
