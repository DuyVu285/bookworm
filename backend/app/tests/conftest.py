from app.models.author_model import Author
from app.models.book_model import Book
from app.models.category_model import Category
from app.models.discount_model import Discount
from app.models.review_model import Review

import pytest
from app.db.db import get_session

import pytest
from sqlmodel import delete


@pytest.fixture(autouse=True)
def clean_database(session):
    session.exec(delete(Review))
    session.exec(delete(Discount))
    session.exec(delete(Book))
    session.exec(delete(Category))
    session.exec(delete(Author))
    session.commit()


@pytest.fixture
def session():
    with next(get_session()) as s:
        yield s
