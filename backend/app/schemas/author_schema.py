from pydantic import BaseModel


class AuthorBase(BaseModel):
    author_name: str
    author_bio: str


class AuthorRead(AuthorBase):
    id: int

class AuthorsRead(BaseModel):
    data: list[AuthorRead]