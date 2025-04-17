import pytest
from datetime import datetime
from pydantic import ValidationError
from app.schemas.review_schema import ReviewBase, ReviewCreate, ReviewRead


def test_review_base_valid():
    review = ReviewBase(
        review_title="Great Book",
        review_details="I really enjoyed this book!",
        review_date=datetime(2023, 4, 14, 15, 30),
        rating_star="5",
    )
    assert review.review_title == "Great Book"
    assert review.review_details == "I really enjoyed this book!"
    assert review.review_date == datetime(2023, 4, 14, 15, 30)
    assert review.rating_star == "5"


def test_review_base_invalid_rating_star():
    with pytest.raises(ValidationError) as exc_info:
        ReviewBase(
            review_title="Great Book",
            review_details="I really enjoyed this book!",
            review_date=datetime(2023, 4, 14, 15, 30),
            rating_star="6",  # Invalid rating
        )
    assert "rating_star must be a string between 1 and 5" in str(exc_info.value)


def test_review_base_invalid_review_date():
    with pytest.raises(ValidationError) as exc_info:
        ReviewBase(
            review_title="Great Book",
            review_details="I really enjoyed this book!",
            review_date="invalid_date",  # Invalid date
            rating_star="5",
        )
    assert "Input should be a valid datetime" in str(exc_info.value)


def test_review_create_valid():
    review = ReviewCreate(
        review_title="Amazing Story",
        review_details="The story kept me hooked until the end.",
        review_date=datetime.now(),
        rating_star="4",
        book_id=123,
    )
    assert review.book_id == 123
    assert review.review_title == "Amazing Story"
    assert review.rating_star == "4"
    assert review.review_date is not None


def test_review_create_missing_book_id():
    with pytest.raises(ValidationError) as exc_info:
        ReviewCreate(
            review_title="Amazing Story",
            review_details="The story kept me hooked until the end.",
            review_date=datetime.now(),
            rating_star="4",
        )
    assert "book_id" in str(exc_info.value)


def test_review_read_model_validate():
    class ReviewORM:
        def __init__(self, id, review_title, review_details, review_date, rating_star):
            self.id = id
            self.review_title = review_title
            self.review_details = review_details
            self.review_date = review_date
            self.rating_star = rating_star

    fake_review = ReviewORM(
        101, "Fantastic Read", "I loved it!", datetime(2023, 5, 1, 12, 0), "5"
    )
    review = ReviewRead.model_validate(fake_review)

    assert review.id == 101
    assert review.review_title == "Fantastic Read"
    assert review.review_details == "I loved it!"
    assert review.review_date == datetime(2023, 5, 1, 12, 0)
    assert review.rating_star == "5"
