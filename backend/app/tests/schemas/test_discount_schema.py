import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

import pytest
from datetime import datetime, timedelta
from pydantic import ValidationError
from app.schemas.discount_schema import (
    DiscountBase,
    DiscountCreate,
    DiscountUpdate,
    DiscountRead,
)


# Helper to get a valid date
def get_valid_date():
    return datetime.now() + timedelta(days=1)


# Test valid DiscountBase
def test_discount_base_valid():
    discount = DiscountBase(
        discount_start_date=datetime.now(),
        discount_end_date=datetime.now() + timedelta(days=7),
        discount_price=9.99,
    )
    assert discount.discount_price == 9.99
    assert discount.discount_end_date > discount.discount_start_date


# Test invalid DiscountBase with end date before start date
def test_discount_base_invalid_dates():
    with pytest.raises(ValidationError):
        DiscountBase(
            discount_start_date=datetime.now(),
            discount_end_date=datetime.now()
            - timedelta(days=1),  # end date before start date
            discount_price=9.99,
        )


# Test DiscountCreate with valid data
def test_discount_create_valid():
    discount = DiscountCreate(
        discount_start_date=datetime.now(),
        discount_end_date=datetime.now() + timedelta(days=5),
        discount_price=5.99,
        book_id=1,
    )
    assert discount.book_id == 1
    assert discount.discount_price == 5.99


# Test DiscountUpdate with valid data (no change)
def test_discount_update_valid():
    discount = DiscountUpdate(
        discount_start_date=datetime.now(),
        discount_end_date=datetime.now() + timedelta(days=10),
        discount_price=7.99,
    )
    assert discount.discount_price == 7.99
    assert discount.discount_end_date > discount.discount_start_date


# Test DiscountRead model
def test_discount_read_model():
    discount = DiscountRead(
        id=1,
        discount_start_date=datetime.now(),
        discount_end_date=datetime.now() + timedelta(days=5),
        discount_price=4.99,
    )
    assert discount.id == 1
    assert discount.discount_price == 4.99
    assert discount.discount_end_date > discount.discount_start_date
