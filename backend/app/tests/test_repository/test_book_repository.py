import pytest
from unittest.mock import MagicMock
from app.schemas.book_schema import TopBooksDetailsReturn
from app.repositories.book_repository import BookRepository

@pytest.fixture
def mock_service():
    # Create a mock service instance
    service = BookRepository()
    # Mock the session
    service.session = MagicMock()
    return service

def test_get_top_10_most_discounted_books(mock_service):
    # Mock query result
    mock_book_1 = MagicMock()
    mock_book_1.model_dump.return_value = {
        "id": 1,
        "book_title": "Book 1",
        "book_price": 200,
        "book_summary": "Summary 1",
        "book_cover_photo": "http://example.com/cover1"
    }
    
    mock_book_2 = MagicMock()
    mock_book_2.model_dump.return_value = {
        "id": 2,
        "book_title": "Book 2",
        "book_price": 150,
        "book_summary": "Summary 2",
        "book_cover_photo": "http://example.com/cover2"
    }
    
    # Mocking the result of the query (book, sub_price)
    mock_result = [
        (mock_book_1, 150),  # book_1 with sub_price 150
        (mock_book_2, 100)   # book_2 with sub_price 100
    ]
    
    # Mock the `exec` method to return the mocked result
    mock_service.session.exec.return_value.all.return_value = mock_result

    # Call the method
    result = mock_service.get_top_10_most_discounted_books()

    # Assert the expected result
    assert len(result) == 2
    assert result[0]["book_title"] == "Book 1"
    assert result[0]["sub_price"] == 150
    assert result[1]["book_title"] == "Book 2"
    assert result[1]["sub_price"] == 100
