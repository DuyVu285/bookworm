from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from app.core.config import settings
from app.auth.auth_handler import AuthHandler
from app.db.db import get_session
from jose import JWTError, jwt

from app.services.user_service import UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")


class AuthBearer:
    def __init__(self):
        self.secret_key = settings.SECRET_KEY
        self.algorithm = settings.ALGORITHM
        self.auth_handler = AuthHandler()

    def get_current_user(
        self,
        token: str = Depends(oauth2_scheme),
        session: Session = Depends(get_session),
    ):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception

        user_service = UserService(session)
        user = user_service.get_user_by_email(email)
        if user is None:
            raise credentials_exception
        return user

    def get_refresh_token(self, token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception

        return token
