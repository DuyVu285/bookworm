from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class UserLogIn(BaseModel):
    email: str
    password: str


class UserCreate(UserBase):
    admin: bool = False


class UserCreateResponse(BaseModel):
    id: int

    model_config = ConfigDict(from_attributes=True)


class UserRead(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
