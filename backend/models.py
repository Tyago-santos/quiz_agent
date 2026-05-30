from sqlalchemy import Column, Integer, String, Text, DateTime, func
from database import Base


class QuizHistory(Base):
    __tablename__ = "quiz_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    lesson = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
