from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timedelta, timezone
from app.core.config import settings
from fastapi import HTTPException


class AuthHandler:
    def __init__(self):
        self.secret = settings.SECRET_KEY
        self.algorithm = settings.ALGORITHM

    def create_access_token(self, data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=30))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, self.secret, algorithm=self.algorithm)

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            return payload
        except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
