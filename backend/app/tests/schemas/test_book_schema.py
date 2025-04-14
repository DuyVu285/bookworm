import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

import pytest
from pydantic import ValidationError
from app.schemas.book_schema import BookBase, BookCreate, BookUpdate, BookRead


def test_book_base_valid():
    book = BookBase(
        book_title="The Great Gatsby",
        book_summary="A classic novel set in the Roaring Twenties.",
        book_price=12.99,
        book_cover_photo="cover.jpg",
    )
    assert book.book_title == "The Great Gatsby"
    assert book.book_price == 12.99


def test_book_base_invalid_price_type():
    with pytest.raises(ValidationError):
        BookBase(
            book_title="Test Book",
            book_summary="Summary",
            book_price="free",  # invalid type
            book_cover_photo="cover.jpg",
        )


def test_book_create_valid():
    book = BookCreate(
        book_title="1984",
        book_summary="Dystopian novel.",
        book_price=10.0,
        book_cover_photo="1984.jpg",
        category_id=1,
        author_id=2,
    )
    assert book.category_id == 1
    assert book.author_id == 2


def test_book_create_missing_required_fields():
    with pytest.raises(ValidationError):
        BookCreate(
            book_title="No Category",
            book_summary="No category or author ID",
            book_price=8.5,
            book_cover_photo="nocat.jpg",
            # missing category_id and author_id
        )


def test_book_read_model():
    book = BookRead(
        id=101,
        book_title="Brave New World",
        book_summary="Another dystopian novel.",
        book_price=15.75,
        book_cover_photo="brave.jpg",
    )
    assert book.id == 101
    assert book.book_title == "Brave New World"
