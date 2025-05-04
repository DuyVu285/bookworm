from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.db.db import get_session
from app.schemas.book_schema import (
    TopBooksRead,
    BooksRead,
    BookDetailsRead,
    BookQueryParams,
    Top8BooksQueryParams,
)
from app.services.book_service import BookService

router = APIRouter(
    prefix="/books", tags=["books"], responses={404: {"description": "Not found"}}
)


@router.get("/", response_model=BooksRead, status_code=status.HTTP_200_OK)
async def get_books(
    params: BookQueryParams = Depends(),
    session: Session = Depends(get_session),
):
    service = BookService(session)
    data = service.get_books(
        page=params.page,
        limit=params.limit,
        sort=params.sort,
        category_id=params.category,
        author_id=params.author,
        min_rating=params.rating,
    )
    return data


@router.get(
    "/book/{book_id}", response_model=BookDetailsRead, status_code=status.HTTP_200_OK
)
async def get_book_by_id(book_id: int, session: Session = Depends(get_session)):
    service = BookService(session)
    data = service.get_book_by_id(book_id)
    return data


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
    params: Top8BooksQueryParams = Depends(),
    session: Session = Depends(get_session),
):
    service = BookService(session)
    data = service.get_top_8_books(sort=params.sort)
    return data
