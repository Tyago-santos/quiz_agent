from fastapi import HTTPException
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable
from agent.langchain import app as agent_app
from repository.quiz_repository import save_question


def answer_question(message: str) -> dict:
    try:
        result = agent_app.invoke({"message": message})
        save_question(message, result["response"], result["lesson"])
        return {
            "response": result["response"],
            "lesson": result["lesson"],
        }
    except ResourceExhausted:
        raise HTTPException(
            status_code=429,
            detail="Créditos da IA acabou, tente novamente mais tarde",
        )
    except ServiceUnavailable:
        raise HTTPException(
            status_code=503,
            detail="Servidor ocupado, tente novamente mais tarde",
        )
