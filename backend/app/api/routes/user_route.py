from typing import Annotated
from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select
from fastapi.security import OAuth2PasswordRequestForm

from app.db.db import get_session
from app.models.user_model import User
from app.schemas.user_schema import UserBase, UserRead
from app.schemas.token_schema import Token
from app.services.user_service import UserService
from app.auth.auth_handler import AuthHandler
from app.auth.auth_bearer import AuthBearer

router = APIRouter(
    prefix="/users", tags=["users"], responses={404: {"description": "Not found"}}
)


@router.get("/", response_model=list[UserBase], status_code=status.HTTP_200_OK)
async def get_users(session: Session = Depends(get_session)):
    query = select(User)
    users = session.exec(query).all()
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Users not found"
        )
    return users


@router.get("/{user_id}", response_model=UserRead, status_code=status.HTTP_200_OK)
async def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.post("/token", response_model=Token, status_code=status.HTTP_200_OK)
async def long_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
    email = form_data.username
    password = form_data.password
    user = UserService().authenticate_user(email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    access_token = AuthHandler().create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserRead, status_code=status.HTTP_200_OK)
async def read_users_me(current_user: User = Depends(AuthBearer().get_current_user)):
    return current_user


# This route is for future development
