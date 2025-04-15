from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db.db import get_session
from app.models.book_model import Book
from app.schemas.book_schema import BookBase, BookCreate, BookUpdate, BookRead
from app.services.book_service import (
    get_all_books,
    get_book_by_id,
    create_book,
    update_book,
    delete_book,
)

router = APIRouter(
    prefix="/books", tags=["books"], responses={404: {"description": "Not found"}}
)


@router.get("/", response_model=list[BookBase], status_code=status.HTTP_200_OK)
async def get_books(session: Session = Depends(get_session)):
    books = get_all_books(session)
    if not books:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Books not found"
        )
    return books


@router.get("/{book_id}", response_model=BookRead, status_code=status.HTTP_200_OK)
async def get_book(book_id: int, session: Session = Depends(get_session)):
    book = get_book_by_id(session, book_id)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    return book


@router.post("/", response_model=BookCreate, status_code=status.HTTP_201_CREATED)
async def create_book(book: BookCreate, session: Session = Depends(get_session)):
    new_book = create_book(session, book)
    return new_book


@router.put("/{book_id}", response_model=BookUpdate, status_code=status.HTTP_200_OK)
async def update_book(
    book_id: int, book: BookUpdate, session: Session = Depends(get_session)
):
    updated_book = update_book(session, book_id, book)
    if not updated_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    return updated_book


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: int, session: Session = Depends(get_session)):
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    session.delete(book)
    session.commit()
    return
