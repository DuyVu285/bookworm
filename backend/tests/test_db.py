
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
import random
import string
from datetime import datetime
from app.models.user_model import User
from app.models.order_model import Order
from app.models.order_item_model import OrderItem
from app.models.book_model import Book
from app.db.db import get_session
from sqlmodel import select


def generate_random_email():
    """Generate a random email for testing purposes."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=10)) + "@example.com"


@pytest.fixture
def session():
    """Yield a fresh session from get_session"""
    with next(get_session()) as s:
        yield s


def test_add_and_delete_user_order_orderitem(session):
    # 1. Add a user with a unique email
    unique_email = generate_random_email()
    user = User(first_name="John", last_name="Doe", email=unique_email, password="password123")
    session.add(user)
    session.commit()
    session.refresh(user)

    assert user.id is not None

    # 2. Add a book (provide a summary and a cover photo)
    book_summary = "This is a sample summary of the book."
    book_cover_photo = "sample_cover.jpg"  # Provide a value for book_cover_photo
    book = Book(
        book_title="Sample Book",
        author_id=1,
        book_price=29.99,
        book_summary=book_summary,
        book_cover_photo=book_cover_photo
    )
    session.add(book)
    session.commit()
    session.refresh(book)

    assert book.id is not None

    # 3. Add an order
    order = Order(user_id=user.id, order_amount=99.99, order_date=datetime.now())
    session.add(order)
    session.commit()
    session.refresh(order)

    assert order.id is not None

    # 4. Add an order item, now associating it with a book
    order_item = OrderItem(order_id=order.id, quantity=2, price=49.99, book_id=book.id)
    session.add(order_item)
    session.commit()
    session.refresh(order_item)

    assert order_item.id is not None

    # Verify they were added
    stmt = select(OrderItem).filter_by(order_id=order.id)
    result = session.exec(stmt).first()
    assert result is not None

    # Clean up
    session.delete(order_item)
    session.delete(order)
    session.delete(book)
    session.delete(user)
    session.commit()

    stmt = select(OrderItem).filter_by(order_id=order.id)
    result = session.exec(stmt).first()
    assert result is None
    assert session.get(User, user.id) is None
    assert session.get(Order, order.id) is None
    assert session.get(Book, book.id) is None
