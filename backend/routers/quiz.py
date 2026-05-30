from fastapi import APIRouter
from schemas.quiz import QuestionRequest, QuestionResponse
from services.quiz_service import answer_question

router = APIRouter(prefix="/quiz", tags=["Quiz"])


@router.post("/ask", response_model=QuestionResponse)
def ask(body: QuestionRequest):
    return answer_question(body.message)
