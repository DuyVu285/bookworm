from pydantic import BaseModel


class AuthorBase(BaseModel):
    author_name: str
    author_bio: str


class AuthorCreate(AuthorBase):
    pass


class AuthorUpdate(AuthorBase):
    pass


class AuthorRead(AuthorBase):
    id: int

    class Config:
        orm_mode = True
