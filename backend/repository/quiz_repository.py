from typing import TypedDict


class HistoryEntry(TypedDict):
    question: str
    answer: str
    lesson: str


_history: list[HistoryEntry] = []


def save_question(question: str, answer: str, lesson: str) -> None:
    _history.append({
        "question": question,
        "answer": answer,
        "lesson": lesson,
    })


def list_history() -> list[HistoryEntry]:
    return list(_history)
