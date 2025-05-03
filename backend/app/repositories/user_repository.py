from sqlmodel import Session, select, func
from app.models.user_model import User


class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_user_by_id(self, user_id: int):
        return self.session.get(User, user_id)

    def get_user_by_email(self, email: str):
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).one_or_none()

    def create_user(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user
