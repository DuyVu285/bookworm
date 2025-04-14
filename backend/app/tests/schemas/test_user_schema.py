import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

import pytest
from pydantic import ValidationError
from app.schemas.user_schema import UserBase, UserSignIn, UserRead


def test_user_base_valid():
    user = UserBase(
        first_name="John",
        last_name="Doe",
        email="john@example.com",
        password="securepassword",
    )
    assert user.first_name == "John"
    assert user.email == "john@example.com"


def test_user_base_missing_field():
    with pytest.raises(ValidationError) as exc_info:
        UserBase(
            first_name="John", email="john@example.com", password="securepassword"
        )  # missing last_name
    assert "last_name" in str(exc_info.value)


def test_user_base_invalid_email_type():
    with pytest.raises(ValidationError) as exc_info:
        UserBase(
            first_name="John",
            last_name="Doe",
            email=123,  # invalid type
            password="securepassword",
        )
    assert "Input should be a valid string" in str(exc_info.value)


def test_user_signin_valid():
    signin = UserSignIn(email="john@example.com", password="securepassword")
    assert signin.email == "john@example.com"


def test_user_read_orm_mode():
    class UserORM:
        def __init__(self, id, first_name, last_name, email, password):
            self.id = id
            self.first_name = first_name
            self.last_name = last_name
            self.email = email
            self.password = password

    fake_user = UserORM(1, "Jane", "Doe", "jane@example.com", "pass123")
    user = UserRead.model_validate(fake_user)

    assert user.id == 1
    assert user.first_name == "Jane"
