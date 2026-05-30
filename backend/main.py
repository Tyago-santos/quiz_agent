from fastapi import FastAPI
from routers.quiz import router as quiz_router
from routers.auth import router as auth_router

app = FastAPI(title="Quiz AI API")
app.include_router(quiz_router)
app.include_router(auth_router)