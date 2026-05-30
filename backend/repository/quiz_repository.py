from database import SessionLocal, engine
from models import Base, QuizHistory

Base.metadata.create_all(bind=engine)


def save_question(question: str, answer: str, lesson: str) -> None:
    with SessionLocal() as db:
        db.add(QuizHistory(question=question, answer=answer, lesson=lesson))
        db.commit()


def list_history() -> list[dict]:
    with SessionLocal() as db:
        rows = db.query(QuizHistory).order_by(QuizHistory.created_at.desc()).all()
        return [
            {
                "id": row.id,
                "question": row.question,
                "answer": row.answer,
                "lesson": row.lesson,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            }
            for row in rows
        ]
