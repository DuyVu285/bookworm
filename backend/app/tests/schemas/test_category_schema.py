import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

import pytest
from pydantic import ValidationError
from app.schemas.category_schema import (
    CategoryBase,
    CategoryCreate,
    CategoryUpdate,
    CategoryRead,
)


def test_category_base_valid():
    category = CategoryBase(
        category_name="Fiction",
        category_description="Books that contain fictional stories.",
    )
    assert category.category_name == "Fiction"
    assert category.category_description.startswith("Books")


def test_category_base_invalid_name_type():
    with pytest.raises(ValidationError):
        CategoryBase(
            category_name=123,  # invalid type
            category_description="This is a description",
        )


def test_category_create_valid():
    category = CategoryCreate(
        category_name="Science", category_description="Books about scientific concepts."
    )
    assert isinstance(category, CategoryCreate)


def test_category_update_valid():
    category = CategoryUpdate(
        category_name="Updated Category", category_description="Updated description"
    )
    assert category.category_name == "Updated Category"


def test_category_read_model():
    category = CategoryRead(
        id=1,
        category_name="Adventure",
        category_description="Books about thrilling experiences.",
    )
    assert category.id == 1
    assert category.category_name == "Adventure"
