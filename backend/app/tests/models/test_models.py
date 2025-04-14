import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
import random
import string
from datetime import datetime, timedelta, timezone

from app.models.user_model import User
from app.models.order_model import Order
from app.models.order_item_model import OrderItem
from app.models.book_model import Book
from app.models.category_model import Category
from app.models.author_model import Author
from app.models.discount_model import Discount
from app.models.review_model import Review
from app.db.db import get_session

def generate_random_email():
    return (
        "".join(random.choices(string.ascii_lowercase + string.digits, k=10))
        + "@example.com"
    )

@pytest.fixture
def session():
    with next(get_session()) as s:
        yield s


def test_create_category(session):
    category = Category(
        category_name="Science Fiction",
        category_description="Books based on futuristic concepts.",
    )
    session.add(category)
    session.commit()
    session.refresh(category)

    assert category.id is not None

    # Cleanup
    session.delete(category)
    session.commit()


def test_create_author(session):
    author = Author(
        author_name="Isaac Asimov",
        author_bio="Famous for his works in science fiction.",
    )
    session.add(author)
    session.commit()
    session.refresh(author)

    assert author.id is not None

    # Cleanup
    session.delete(author)
    session.commit()


def test_create_book(session):
    category = Category(
        category_name="Science Fiction",
        category_description="Books based on futuristic concepts.",
    )
    author = Author(
        author_name="Isaac Asimov",
        author_bio="Famous for his works in science fiction.",
    )
    session.add(category)
    session.add(author)
    session.commit()

    book = Book(
        category_id=category.id,
        author_id=author.id,
        book_title="Foundation",
        book_summary="A complex saga of humans scattered on planets.",
        book_price=19.99,
        book_cover_photo="foundation.jpg",
    )
    session.add(book)
    session.commit()
    session.refresh(book)

    assert book.id is not None

    # Cleanup
    session.delete(book)
    session.delete(author)
    session.delete(category)
    session.commit()


def test_create_discount(session):
    # Ensure the category and author are created first
    category = Category(
        category_name="Science Fiction",
        category_description="Books based on futuristic concepts.",
    )
    author = Author(
        author_name="Isaac Asimov",
        author_bio="Famous for his works in science fiction.",
    )
    session.add(category)
    session.add(author)
    session.commit()  # Ensure both are committed before using them

    book = Book(
        category_id=category.id,
        author_id=author.id,
        book_title="Foundation",
        book_summary="A complex saga of humans scattered on planets.",
        book_price=19.99,
        book_cover_photo="foundation.jpg",
    )
    session.add(book)
    session.commit()

    discount = Discount(
        book_id=book.id,
        discount_price=14.99,
        discount_start_date=datetime.now(timezone.utc),
        discount_end_date=datetime.now(timezone.utc) + timedelta(days=7),
    )
    session.add(discount)
    session.commit()
    session.refresh(discount)

    assert discount.id is not None

    # Cleanup
    session.delete(discount)
    session.delete(book)
    session.delete(author)
    session.delete(category)
    session.commit()


def test_create_review(session):
    # Ensure the category and author are created first
    category = Category(
        category_name="Science Fiction",
        category_description="Books based on futuristic concepts.",
    )
    author = Author(
        author_name="Isaac Asimov",
        author_bio="Famous for his works in science fiction.",
    )
    session.add(category)
    session.add(author)
    session.commit()  # Ensure both are committed before using them

    book = Book(
        category_id=category.id,
        author_id=author.id,
        book_title="Foundation",
        book_summary="A complex saga of humans scattered on planets.",
        book_price=19.99,
        book_cover_photo="foundation.jpg",
    )
    session.add(book)
    session.commit()

    review = Review(
        book_id=book.id,
        review_title="Amazing Read!",
        review_details="Couldn't put it down. Fantastic storytelling.",
        rating_star="5",
    )
    session.add(review)
    session.commit()
    session.refresh(review)

    assert review.id is not None

    # Cleanup
    session.delete(review)
    session.delete(book)
    session.delete(author)
    session.delete(category)
    session.commit()


def test_create_order(session):
    # Ensure the category and author are created first
    category = Category(
        category_name="Science Fiction",
        category_description="Books based on futuristic concepts.",
    )
    author = Author(
        author_name="Isaac Asimov",
        author_bio="Famous for his works in science fiction.",
    )
    session.add(category)
    session.add(author)
    session.commit()  # Ensure both are committed before using them

    book = Book(
        category_id=category.id,
        author_id=author.id,
        book_title="Foundation",
        book_summary="A complex saga of humans scattered on planets.",
        book_price=19.99,
        book_cover_photo="foundation.jpg",
    )
    session.add(book)
    session.commit()

    user = User(
        first_name="Jane",
        last_name="Doe",
        email=generate_random_email(),
        password="securepassword",
    )
    session.add(user)
    session.commit()

    order = Order(
        user_id=user.id, order_amount=book.book_price, order_date=datetime.now()
    )
    session.add(order)
    session.commit()
    session.refresh(order)

    assert order.id is not None

    # Cleanup
    session.delete(order)
    session.delete(book)
    session.delete(user)
    session.delete(author)
    session.delete(category)
    session.commit()


def test_create_order_item(session):
    # Ensure the category and author are created first
    category = Category(
        category_name="Science Fiction",
        category_description="Books based on futuristic concepts.",
    )
    author = Author(
        author_name="Isaac Asimov",
        author_bio="Famous for his works in science fiction.",
    )
    session.add(category)
    session.add(author)
    session.commit()  # Ensure both are committed before using them

    book = Book(
        category_id=category.id,
        author_id=author.id,
        book_title="Foundation",
        book_summary="A complex saga of humans scattered on planets.",
        book_price=19.99,
        book_cover_photo="foundation.jpg",
    )
    session.add(book)
    session.commit()

    user = User(
        first_name="Jane",
        last_name="Doe",
        email=generate_random_email(),
        password="securepassword",
    )
    session.add(user)
    session.commit()

    order = Order(
        user_id=user.id, order_amount=book.book_price, order_date=datetime.now()
    )
    session.add(order)
    session.commit()

    order_item = OrderItem(
        order_id=order.id, book_id=book.id, quantity=1, price=book.book_price
    )
    session.add(order_item)
    session.commit()
    session.refresh(order_item)

    assert order_item.id is not None

    # Cleanup
    session.delete(order_item)
    session.delete(order)
    session.delete(book)
    session.delete(user)
    session.delete(author)
    session.delete(category)
    session.commit()
