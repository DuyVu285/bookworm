from fastapi import HTTPException
from app.models.user_model import User
from app.schemas.user_schema import UserCreate
from sqlmodel import Session, select
from passlib.context import CryptContext
from app.repositories.user_repository import UserRepository


class UserService:
    def __init__(self, session: Session):
        self.session = session
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def verify_password(self, plain: str, hashed: str) -> bool:
        return self.pwd_context.verify(plain, hashed)

    def get_user_by_email(self, email: str) -> User:
        return UserRepository(self.session).get_user_by_email(email)

    def authenticate_user(self, email: str, password: str) -> User:
        user = self.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if not self.verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Incorrect password")
        return user 

    def create_user(self, user: User, session: Session) -> User:
        user = UserRepository(session).create_user(user)
        return user
