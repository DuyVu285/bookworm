import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

import pytest
from pydantic import ValidationError
from app.schemas.author_schema import AuthorBase, AuthorCreate, AuthorUpdate, AuthorRead


def test_author_base_valid():
    author = AuthorBase(
        author_name="J.K. Rowling",
        author_bio="British author best known for the Harry Potter series.",
    )
    assert author.author_name == "J.K. Rowling"
    assert "Harry Potter" in author.author_bio


def test_author_base_invalid_name_type():
    with pytest.raises(ValidationError):
        AuthorBase(author_name=123, author_bio="Some biography")  # invalid type


def test_author_create_valid():
    author = AuthorCreate(
        author_name="George Orwell", author_bio="Author of 1984 and Animal Farm."
    )
    assert isinstance(author, AuthorCreate)
    assert author.author_name == "George Orwell"


def test_author_update_valid():
    author = AuthorUpdate(author_name="Updated Author", author_bio="Updated biography")
    assert author.author_bio.startswith("Updated")


def test_author_read_model():
    author = AuthorRead(
        id=1,
        author_name="Isaac Asimov",
        author_bio="Prolific science fiction author and professor.",
    )
    assert author.id == 1
    assert author.author_name == "Isaac Asimov"
