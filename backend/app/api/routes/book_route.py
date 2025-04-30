from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.db.db import get_session
from app.schemas.book_schema import BookRead, TopBooksRead, BooksRead
from app.services.book_service import BookService

router = APIRouter(
    prefix="/books", tags=["books"], responses={404: {"description": "Not found"}}
)


@router.get("/", response_model=BooksRead, status_code=status.HTTP_200_OK)
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


@router.get(
    "/top_10_most_discounted",
    response_model=TopBooksRead,
    status_code=status.HTTP_200_OK,
)
async def get_top_10_books(
    session: Session = Depends(get_session),
):
    service = BookService(session)
    data = service.get_top_10_most_discounted_books()
    return data


@router.get("/top_8", response_model=TopBooksRead, status_code=status.HTTP_200_OK)
async def get_top_8_books(
    sort: str,
    session: Session = Depends(get_session),
):
    service = BookService(session)
    data = service.get_top_8_books(sort)
    return data


@router.get("/{book_id}", response_model=BookRead, status_code=status.HTTP_200_OK)
async def get_book_by_id(book_id: int, session: Session = Depends(get_session)):
    service = BookService(session)
    return service.get_book_by_id(book_id)
