from fastapi import HTTPException
from app.models.user_model import User
from sqlmodel import Session
from passlib.context import CryptContext
from app.repositories.user_repository import UserRepository


class UserService:
    def __init__(self, session: Session):
        self.userRepository = UserRepository(session)
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def verify_password(self, plain: str, hashed: str) -> bool:
        return self.pwd_context.verify(plain, hashed)

    def get_user_by_email(self, email: str) -> User:
        return self.userRepository.get_user_by_email(email)

    def authenticate_user(self, email: str, password: str) -> User:
        user = self.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if not self.verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Incorrect password")
        return user

    def create_user(self, user: User) -> User:
        user.password = self.hash_password(user.password)
        print("Registering user...", user)
        existing_user = self.userRepository.get_user_by_email(user.email)
        if existing_user:
            raise HTTPException(status_code=409, detail="User already exists")
        user = self.userRepository.create_user(user)
        return user
