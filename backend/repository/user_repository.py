from database import SessionLocal
from models import User


def create_user(username: str, hashed_password: str) -> User:
    with SessionLocal() as db:
        user = User(username=username, hashed_password=hashed_password)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user


def get_by_username(username: str) -> User | None:
    with SessionLocal() as db:
        return db.query(User).filter(User.username == username).first()
