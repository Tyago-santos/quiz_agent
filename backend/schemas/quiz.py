from pydantic import BaseModel


class QuestionRequest(BaseModel):
    message: str


class QuestionResponse(BaseModel):
    response: str
    lesson: str
