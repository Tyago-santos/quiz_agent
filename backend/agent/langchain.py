import os
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv


load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY")
)


class State(TypedDict):
    message: str
    lesson: str
    response: str   
    
    
    

def classify(state: State):

    prompt = f"""
    Classifique a pergunta abaixo em uma das categorias.

    Categorias:
    - matematica
    - portugues
    - historia
    - geografia

    Mensagem:
    {state['message']}

    Retorne apenas o nome da categoria.
    """

    result = llm.invoke(prompt)

    return {
        "lesson": result.content.strip().lower()
    }
    
    
    
    
def matematica(state):
    prompt = f"Responda a pergunta abaixo como um professor de matematica:\n\n{state['message']}"
    result = llm.invoke(prompt)
    return {"response": result.content}

def portugues(state):
    prompt = f"Responda a pergunta abaixo como um professor de portugues:\n\n{state['message']}"
    result = llm.invoke(prompt)
    return {"response": result.content}

def historia(state):
    prompt = f"Responda a pergunta abaixo como um professor de historia:\n\n{state['message']}"
    result = llm.invoke(prompt)
    return {"response": result.content}

def geografia(state):
    prompt = f"Responda a pergunta abaixo como um professor de geografia:\n\n{state['message']}"
    result = llm.invoke(prompt)
    return {"response": result.content}
    
    
    
    
def router(state):

    categoria = state["lesson"]

    if "matematica" in categoria:
        return "matematica"

    if "portugues" in categoria:
        return "portugues"

    if "historia" in categoria:
        return "historia"

    if "geografia" in categoria:
        return "geografia"

    return "matematica"






graph = StateGraph(State)

graph.add_node("classifier", classify)

graph.add_node("matematica", matematica)
graph.add_node("portugues", portugues)
graph.add_node("historia", historia)
graph.add_node("geografia", geografia)

graph.add_edge( START,"classifier")

graph.add_conditional_edges(
    "classifier",
    router,
    {
        "matematica": "matematica",
        "portugues": "portugues",
        "historia": "historia",
        "geografia": "geografia"
    }
)

graph.add_edge("matematica", END)
graph.add_edge("portugues", END)
graph.add_edge("historia", END)
graph.add_edge("geografia", END)

app = graph.compile()


resultado = app.invoke({
    "message":"Quem foi pelé?"
})

print(resultado["response"])