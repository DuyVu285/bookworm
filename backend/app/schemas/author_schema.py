from pydantic import BaseModel


class AuthorRead(BaseModel):
    author_name: str
    id: int


class AuthorsRead(BaseModel):
    data: list[AuthorRead]
