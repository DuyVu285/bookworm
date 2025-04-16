import pytest
from datetime import datetime, timedelta, timezone
from app.models.book_model import Book
from app.models.discount_model import Discount
from app.models.review_model import Review
from app.models.category_model import Category
from app.models.author_model import Author
from app.repositories.book_repository import BookRepository


@pytest.fixture
def sample_data(session):

    author1 = Author(author_name="Author 1", author_bio="Author 1 bio")
    author2 = Author(author_name="Author 2", author_bio="Author 2 bio")
    session.add_all([author1, author2])
    session.commit()

    category = Category(category_name="Fiction", category_description="Fiction books")
    session.add(category)
    session.commit()

    book1 = Book(
        book_title="Book 1",
        book_price=100.0,
        category_id=category.id,
        author_id=author1.id,
        book_summary="Book 1 summary",
        book_cover_photo="book1.jpg",
    )
    book2 = Book(
        book_title="Book 2",
        book_price=150.0,
        category_id=category.id,
        author_id=author2.id,
        book_summary="Book 2 summary",
        book_cover_photo="book2.jpg",
    )

    session.add_all([book1, book2])
    session.commit()
    session.refresh(book1)
    session.refresh(book2)

    now = datetime.now(timezone.utc)

    discount1 = Discount(
        book_id=book1.id,
        discount_price=30.0,
        discount_start_date=now - timedelta(days=1),
        discount_end_date=now + timedelta(days=1),
    )
    discount2 = Discount(
        book_id=book2.id,
        discount_price=50.0,
        discount_start_date=now - timedelta(days=1),
        discount_end_date=now + timedelta(days=1),
    )

    review1 = Review(
        book_id=book1.id,
        rating_star=4,
        review_title="Great book",
        review_details="I loved it!",
        review_date=datetime(2023, 5, 1, 12, 0),
    )
    review2 = Review(
        book_id=book1.id,
        rating_star=5,
        review_title="Amazing",
        review_details="I can't stop reading!",
        review_date=datetime(2023, 5, 1, 12, 0),
    )
    review3 = Review(
        book_id=book2.id,
        rating_star=3,
        review_title="Ok",
        review_details="Not bad",
        review_date=datetime(2023, 5, 1, 12, 0),
    )

    session.add_all([discount1, discount2, review1, review2, review3])
    session.commit()

    return {"category": category, "books": [book1, book2]}


def test_get_book_by_id(session, sample_data):
    book = sample_data["books"][0]
    found = session.get(Book, book.id)
    print(found)
    assert found is not None
    assert found.book_title == "Book 1"


def test_get_book_by_id_not_found(session):
    book_repository = BookRepository(session)
    book = book_repository.get_book_by_id(1)
    assert book is None


def test_get_book_by_title(session, sample_data):
    book = sample_data["books"][0]
    found = session.get(Book, book.id)
    assert found is not None
    assert found.book_title == "Book 1"


def test_get_book_by_title_not_found(session):
    book_repository = BookRepository(session)
    book = book_repository.get_book_by_title("Nonexistent Book")
    assert book is None


def test_get_books_with_filters_and_sorting(session, sample_data):
    book_repository = BookRepository(session)
    category = sample_data["category"]
    book1, book2 = sample_data["books"]

    # Basic fetch
    result = book_repository.get_books()
    assert result["total_items"] == 2
    assert len(result["data"]) == 2
    assert result["page"] == 1
    assert result["limit"] == 20
    assert result["start_item"] == 1
    assert result["end_item"] == 2
    assert result["total_pages"] == 1

    # Filter by category
    result = book_repository.get_books(category_id=category.id)
    assert result["total_items"] == 2

    # Filter by author_id
    result = book_repository.get_books(author_id=book1.author_id)
    assert result["total_items"] == 1
    assert result["data"][0][0].book_title == "Book 1"

    # Filter by min_rating (Book 1 has avg rating of 4.5, Book 2 has 3.0)
    result = book_repository.get_books(min_rating=4.0)
    assert result["total_items"] == 1
    assert result["data"][0][0].book_title == "Book 1"

    # Sort by avg_rating
    result = book_repository.get_books(sort="avg_rating")
    titles = [row[0].book_title for row in result["data"]]
    assert titles == ["Book 1", "Book 2"]

    # Sort by price_asc
    result = book_repository.get_books(sort="price_asc")
    prices = [row[0].book_price for row in result["data"]]
    assert prices == sorted(prices)

    # Sort by price_desc
    result = book_repository.get_books(sort="price_desc")
    prices_desc = [row[0].book_price for row in result["data"]]
    assert prices_desc == sorted(prices_desc, reverse=True)

    # Sort by on sale
    result = book_repository.get_books(sort="on sale")
    sub_prices = [row[1] for row in result["data"]]  # sub_price is at index 1
    assert sub_prices == sorted(sub_prices)

    # Pagination test
    result = book_repository.get_books(page=1, limit=1)
    assert result["page"] == 1
    assert result["limit"] == 5
    assert result["start_item"] == 1
    assert result["end_item"] == 2
    assert result["total_pages"] == 1

def test_get_top_10_most_discounted_books(session, sample_data):
    book_repository = BookRepository(session)
    result = book_repository.get_top_10_most_discounted_books()
    assert len(result) == 2

def test_get_top_8_books(session, sample_data):
    book_repository = BookRepository(session)
    result = book_repository.get_top_8_books("recommended")
    assert len(result) == 2
    
    result = book_repository.get_top_8_books("popularity")
    assert len(result) == 2