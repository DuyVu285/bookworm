from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select

from app.db.db import get_session
from app.models.user_model import User
from app.schemas.user_schema import UserBase, UserRead, UserSignIn

router = APIRouter(
    prefix="/users", tags=["users"], responses={404: {"description": "Not found"}}
)

@router.get("/", response_model=list[UserBase], status_code=status.HTTP_200_OK)
async def get_users(session: Session = Depends(get_session)):
    stmt = select(User)
    users = session.exec(stmt).all()
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

#This route is for future development