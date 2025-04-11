from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(nullable=False, unique=True)
    email: str = Field(nullable=False, unique=True)
    hashed_password: str = Field(nullable=False)
    is_active: bool = Field(default=True)
