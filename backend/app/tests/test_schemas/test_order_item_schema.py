import pytest
from pydantic import ValidationError
from app.schemas.order_item_schema import (
    OrderItemBase,
    OrderItemCreate,
    OrderItemUpdate,
    OrderItemRead,
)


def test_order_item_base_valid():
    item = OrderItemBase(quantity=2, price=19.99)
    assert item.quantity == 2
    assert item.price == 19.99


def test_order_item_base_invalid_quantity():
    with pytest.raises(ValidationError):
        OrderItemBase(quantity="two", price=10.0)  # invalid type for quantity


def test_order_item_create_valid():
    item = OrderItemCreate(quantity=3, price=29.99, order_id=1, book_id=101)
    assert item.order_id == 1
    assert item.book_id == 101


def test_order_item_create_missing_fields():
    with pytest.raises(ValidationError):
        OrderItemCreate(quantity=1, price=15.0)  # missing order_id and book_id


def test_order_item_read_model():
    item = OrderItemRead(id=5, quantity=4, price=45.50)
    assert item.id == 5
    assert item.quantity == 4
    assert item.price == 45.50
