from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from app.auth.auth_handler import AuthHandler

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class AuthBearer:
    def get_current_user(self, token: str = Depends(oauth2_scheme)):
        user = AuthHandler().verify_token(token)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )
        return user
