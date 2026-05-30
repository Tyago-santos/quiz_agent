from fastapi import APIRouter, Depends
from schemas.quiz import QuestionRequest, QuestionResponse
from services.quiz_service import answer_question
from services.auth_service import get_current_user

router = APIRouter(prefix="/quiz", tags=["Quiz"])


@router.post("/ask", response_model=QuestionResponse)
def ask(body: QuestionRequest, current_user: dict = Depends(get_current_user)):
    return answer_question(body.message)
