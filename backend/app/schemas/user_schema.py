from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict


class UserRead(BaseModel):
    id: int
    first_name: str
    last_name: str


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
