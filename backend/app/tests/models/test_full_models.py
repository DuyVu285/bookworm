import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

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

def generate_random_email():
    return (
        "".join(random.choices(string.ascii_lowercase + string.digits, k=10))
        + "@example.com"
    )


def test_full_book_flow(session):
    # Create Category
    category = Category(
        category_name="Science Fiction",
        category_description="Books based on futuristic concepts.",
    )
    session.add(category)
    session.commit()
    session.refresh(category)

    # Create Author
    author = Author(
        author_name="Isaac Asimov",
        author_bio="Famous for his works in science fiction.",
    )
    session.add(author)
    session.commit()
    session.refresh(author)

    # Create Book
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

    # Create Discount for the book
    discount = Discount(
        book_id=book.id,
        discount_price=14.99,
        discount_start_date=datetime.now(timezone.utc),
        discount_end_date=datetime.now(timezone.utc) + timedelta(days=7),
    )
    session.add(discount)

    # Create Review for the book
    review = Review(
        book_id=book.id,
        review_title="Amazing Read!",
        review_details="Couldn't put it down. Fantastic storytelling.",
        rating_star="5",
    )
    session.add(review)
    session.commit()
    session.refresh(discount)
    session.refresh(review)

    # Create User
    user = User(
        first_name="Jane",
        last_name="Doe",
        email=generate_random_email(),
        password="securepassword",
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    # Create Order
    order = Order(
        user_id=user.id, order_amount=book.book_price, order_date=datetime.now()
    )
    session.add(order)
    session.commit()
    session.refresh(order)

    # Create Order Item
    order_item = OrderItem(
        order_id=order.id, book_id=book.id, quantity=1, price=book.book_price
    )
    session.add(order_item)
    session.commit()
    session.refresh(order_item)

    # Assertions
    assert category.id is not None
    assert author.id is not None
    assert book.id is not None
    assert discount.id is not None
    assert review.id is not None
    assert user.id is not None
    assert order.id is not None
    assert order_item.id is not None

    # Cleanup
    session.delete(order_item)
    session.delete(order)
    session.delete(user)
    session.delete(review)
    session.delete(discount)
    session.delete(book)
    session.delete(author)
    session.delete(category)
    session.commit()

    # Verify everything is deleted
    assert session.get(Book, book.id) is None
    assert session.get(Author, author.id) is None
    assert session.get(Category, category.id) is None
    assert session.get(User, user.id) is None
    assert session.get(Order, order.id) is None
    assert session.get(OrderItem, order_item.id) is None
    assert session.get(Discount, discount.id) is None
    assert session.get(Review, review.id) is None
