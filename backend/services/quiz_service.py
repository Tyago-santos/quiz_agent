from agent.langchain import app as agent_app
from repository.quiz_repository import save_question


def answer_question(message: str) -> dict:
    result = agent_app.invoke({"message": message})
    save_question(message, result["response"], result["lesson"])
    return {
        "response": result["response"],
        "lesson": result["lesson"],
    }
