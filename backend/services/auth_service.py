import os
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from repository.user_repository import create_user, get_by_username, get_by_email

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.now(timezone.utc)
        + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def register(username: str, email: str, password: str) -> dict:
    if get_by_username(username):
        raise HTTPException(status_code=409, detail="Usuário já existe")
    if get_by_email(email):
        raise HTTPException(status_code=409, detail="Email já cadastrado")
    user = create_user(username, email, hash_password(password))
    return {"id": user.id, "username": user.username, "email": user.email}


def login(username: str, password: str) -> dict:
    user = get_by_username(username)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
        )
    token = create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = get_by_username(username)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return {"id": user.id, "username": user.username, "email": user.email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
