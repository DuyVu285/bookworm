from fastapi import HTTPException
from app.models.user_model import User
from sqlmodel import Session
from passlib.context import CryptContext
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserCreate


class UserService:
    def __init__(self, session: Session):
        self.userRepository = UserRepository(session)
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

    # Create a new user to test and hash the password
    def hash_password(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def create_user(self, user: UserCreate) -> User:
        # Check if email already exists
        if self.userRepository.get_user_by_email(user.email):
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create the SQLAlchemy User object
        new_user = User(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password=self.hash_password(user.password),  # hash the password
        )

        # Save to DB via the repository
        created_user = self.userRepository.create_user(new_user)

        return created_user
