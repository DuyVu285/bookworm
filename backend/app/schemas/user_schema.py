from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    
class UserSignIn(BaseModel):
    email: str
    password: str
    
class UserRead(UserBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)