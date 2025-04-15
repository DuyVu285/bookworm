from sqlmodel import Session, select
from app.models.book_model import Book


def get_all_books(session: Session):
    return session.exec(select(Book)).all()


def get_book_by_id(session: Session, book_id: int):
    stmt = select(Book).where(Book.id == book_id)
    return session.exec(stmt).one_or_none()


def create_book(session: Session, book: Book):
    session.add(book)
    session.commit()
    session.refresh(book)
    return book


def update_book(session: Session, book_id: int, book: Book):
    book = get_book_by_id(session, book_id)
    if book:
        update_data = book.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(book, key, value)
        session.add(book)
        session.commit()
        session.refresh(book)
    return book


def delete_book(session: Session, book_id: int):
    stmt = select(Book).where(Book.id == book_id)
    book = session.exec(stmt).one_or_none()
    if not book:
        return None
    session.delete(book)
    session.commit()
    return book
