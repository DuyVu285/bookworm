from pydantic import BaseModel, ConfigDict


class AuthorBase(BaseModel):
    author_name: str
    author_bio: str


class AuthorCreate(AuthorBase):
    pass


class AuthorUpdate(AuthorBase):
    pass


class AuthorRead(AuthorBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

