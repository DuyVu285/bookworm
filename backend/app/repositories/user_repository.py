from sqlmodel import Session, select, func
from app.models.user_model import User


class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_user_by_id(self, user_id: int):
        return self.session.get(User, user_id)

    def get_user_by_email(self, email: str):
        query = select(User).where(User.email == email)
        
        return self.session.exec(query).one_or_none()

    def create_user(self, user: User):
        user = User(**user.model_dump())
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def update_user(self, user: User):
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def delete_user(self, user_id: int):
        user = self.session.get(User, user_id)
        if user:
            self.session.delete(user)
            self.session.commit()
        return user
