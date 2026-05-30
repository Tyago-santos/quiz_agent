from fastapi import APIRouter
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse)
def register(body: RegisterRequest):
    return auth_service.register(body.username, body.email, body.password)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    return auth_service.login(body.email, body.password)
