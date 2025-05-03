from typing import Annotated
from fastapi import APIRouter, HTTPException, Request, Response, status, Depends
from sqlmodel import Session, select
from fastapi.security import OAuth2PasswordRequestForm

from app.db.db import get_session
from app.models.user_model import User
from app.schemas.user_schema import UserRead, UserCreate
from app.schemas.token_schema import Token
from app.services.user_service import UserService
from app.auth.auth_handler import AuthHandler
from app.auth.auth_bearer import AuthBearer

router = APIRouter(
    prefix="/users", tags=["users"], responses={404: {"description": "Not found"}}
)


@router.get("/user/{user_id}", response_model=UserRead, status_code=status.HTTP_200_OK)
async def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.post("/token", response_model=Token, status_code=status.HTTP_200_OK)
async def login_for_access_token(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Session = Depends(get_session),
):
    service = UserService(session)
    email = form_data.username
    password = form_data.password
    user = service.authenticate_user(email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    access_token = AuthHandler().create_access_token(data={"sub": user.email})
    refresh_token = AuthHandler().create_refresh_token(data={"sub": user.email})

    # Set refresh token in HTTP-only cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,  # only set this True if using HTTPS
        samesite="strict",
        max_age=7 * 24 * 60 * 60,  # 7 days
    )

    return Token(access_token=access_token, token_type="bearer")


@router.post("/users/refresh", response_model=Token)
def refresh_token(
    request: Request,
    session: Session = Depends(get_session),
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    try:
        payload = AuthHandler().verify_token(refresh_token)
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except HTTPException as e:
        raise e

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    access_token = AuthHandler().create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserRead, status_code=status.HTTP_200_OK)
async def read_users_me(current_user: User = Depends(AuthBearer().get_current_user)):
    return current_user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"msg": "Logged out"}


# Create a new user for testing
@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, session: Session = Depends(get_session)):
    service = UserService(session)
    try:
        created_user = service.create_user(user)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    return created_user
