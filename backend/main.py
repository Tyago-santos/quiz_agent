from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import engine
from models import Base
from routers.quiz import router as quiz_router
from routers.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Quiz AI API", lifespan=lifespan)
app.include_router(quiz_router)
app.include_router(auth_router)