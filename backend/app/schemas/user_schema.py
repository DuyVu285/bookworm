from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class UserRead(UserBase):
    id: int


class UserInDB(UserBase):
    id: int
    hashed_password: str


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
