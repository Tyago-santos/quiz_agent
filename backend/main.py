from fastapi import FastAPI
from routers.quiz import router as quiz_router

app = FastAPI(title="Quiz AI API")
app.include_router(quiz_router)