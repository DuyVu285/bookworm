from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db.db import get_session
from app.models.book_model import Book
from app.schemas.book_schema import BookBase, BookCreate, BookUpdate, BookRead

router = APIRouter(
    prefix="/books", tags=["books"], responses={404: {"description": "Not found"}}
)


@router.get("/", response_model=list[BookBase], status_code=status.HTTP_200_OK)
async def get_books(session: Session = Depends(get_session)):
    stmt = select(Book)
    books = session.exec(stmt).all()
    if not books:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Books not found"
        )
    return books


@router.get("/{book_id}", response_model=BookRead, status_code=status.HTTP_200_OK)
async def get_book(book_id: int, session: Session = Depends(get_session)):
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    return book


@router.post("/", response_model=BookCreate, status_code=status.HTTP_201_CREATED)
async def create_book(book: BookBase, session: Session = Depends(get_session)):
    new_book = Book.model_validate(book)
    session.add(new_book)
    session.commit()
    session.refresh(new_book)
    return new_book


@router.put("/{book_id}", response_model=BookUpdate, status_code=status.HTTP_200_OK)
async def update_book(
    book_id: int, book: BookUpdate, session: Session = Depends(get_session)
):
    db_book = session.get(Book, book_id)
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    update_data = book.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book


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
