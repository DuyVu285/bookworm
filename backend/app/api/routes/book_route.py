from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.db.db import get_session
from app.schemas.book_schema import BookCreate, BookUpdate, BookRead, BooksDetailsReturn
from app.services.book_service import BookService

router = APIRouter(
    prefix="/books", tags=["books"], responses={404: {"description": "Not found"}}
)


@router.get("/", response_model=BooksDetailsReturn, status_code=status.HTTP_200_OK)
async def get_books(
    page: int = 1,
    limit: int = 20,
    sort: str = "on sale",
    category_id: Optional[int] = None,
    author_id: Optional[int] = None,
    min_rating: Optional[float] = None,
    session: Session = Depends(get_session),
):
    service = BookService(session)
    results = service.get_books(page, limit, sort, category_id, author_id, min_rating)
    return results

@router.get("/{book_id}", response_model=BookRead, status_code=status.HTTP_200_OK)
async def get_book_by_id(book_id: int, session: Session = Depends(get_session)):
    service = BookService(session)
    return service.get_book_by_id(book_id)


@router.get(
    "/title/{book_title}", response_model=list[BookRead], status_code=status.HTTP_200_OK
)
async def get_book_by_title(book_title: str, session: Session = Depends(get_session)):
    service = BookService(session)
    return service.get_book_by_title(book_title)


@router.post("/", response_model=BookCreate, status_code=status.HTTP_201_CREATED)
async def create_book(book: BookCreate, session: Session = Depends(get_session)):
    service = BookService(session)
    return service.create_book(book)


@router.put("/{book_id}", response_model=BookUpdate, status_code=status.HTTP_200_OK)
async def update_book(
    book_id: int, book: BookUpdate, session: Session = Depends(get_session)
):
    service = BookService(session)
    return service.update_book(book_id, book)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: int, session: Session = Depends(get_session)):
    service = BookService(session)
    return service.delete_book(book_id)
