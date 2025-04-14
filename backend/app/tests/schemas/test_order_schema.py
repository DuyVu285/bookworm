import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))


import pytest
from datetime import datetime, timezone
from pydantic import ValidationError
from app.schemas.order_schema import OrderBase, OrderCreate, OrderRead


def test_order_base_valid():
    order = OrderBase(order_date=datetime(2024, 1, 1, 10, 0, 0), order_amount=99.99)
    assert order.order_amount == 99.99
    assert order.order_date == datetime(2024, 1, 1, 10, 0, 0)


def test_order_base_invalid_date():
    with pytest.raises(ValidationError) as exc_info:
        OrderBase(order_date="invalid-date", order_amount=49.99)
    assert "Input should be a valid datetime" in str(exc_info.value)


def test_order_create_valid():
    order = OrderCreate(order_date=datetime.now(timezone.utc), order_amount=150.75, user_id=1)
    assert order.user_id == 1
    assert order.order_amount == 150.75


def test_order_create_missing_user_id():
    with pytest.raises(ValidationError) as exc_info:
        OrderCreate(order_date=datetime.now(timezone.utc), order_amount=20.0)
    assert "user_id" in str(exc_info.value)


def test_order_read_model_validate():
    class OrderORM:
        def __init__(self, id, order_date, order_amount):
            self.id = id
            self.order_date = order_date
            self.order_amount = order_amount

    fake_order = OrderORM(101, datetime(2024, 2, 2, 14, 0, 0), 199.99)
    order = OrderRead.model_validate(fake_order)

    assert order.id == 101
    assert order.order_amount == 199.99
