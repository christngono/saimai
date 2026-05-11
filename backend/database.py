"""
Modèles SQLAlchemy — Users, Sessions, Messages.
SQLite en dev → PostgreSQL en production (changer DATABASE_URL dans .env).
"""

import os
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    create_engine, Column, String, Integer, Text,
    DateTime, ForeignKey, Index,
)
from sqlalchemy.orm import DeclarativeBase, sessionmaker, relationship

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./saim.db")

# SQLite : désactiver check_same_thread (non nécessaire pour PostgreSQL)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


# ─── Modèles ───────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id             = Column(String, primary_key=True, default=_uuid)
    email          = Column(String, unique=True, nullable=False, index=True)
    name           = Column(String, nullable=False)
    password_hash  = Column(String, nullable=False)
    plan           = Column(String, default="free")       # free / starter / pro / business
    credits_used   = Column(Integer, default=0)
    credits_limit  = Column(Integer, default=300)         # ~10 questions/jour × 30j
    created_at     = Column(DateTime, default=_now)
    updated_at     = Column(DateTime, default=_now)

    sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")


class ChatSession(Base):
    """Une conversation dans un agent donné."""
    __tablename__ = "sessions"

    id         = Column(String, primary_key=True, default=_uuid)
    user_id    = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title      = Column(String, default="Nouvelle conversation")
    agent_type = Column(String, default="fiscal")         # fiscal / marketing / hr / sales / legal / docs
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now)

    user     = relationship("User", back_populates="sessions")
    messages = relationship(
        "ChatMessage",
        back_populates="session",
        order_by="ChatMessage.created_at",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_sessions_user_updated", "user_id", "updated_at"),
    )


class ChatMessage(Base):
    __tablename__ = "messages"

    id         = Column(String, primary_key=True, default=_uuid)
    session_id = Column(String, ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    user_id    = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role       = Column(String, nullable=False)           # user | assistant
    content    = Column(Text, nullable=False)
    sources    = Column(Text, nullable=True)              # JSON list de sources RAG
    created_at = Column(DateTime, default=_now)

    session = relationship("ChatSession", back_populates="messages")

    __table_args__ = (
        Index("ix_messages_session", "session_id", "created_at"),
    )


# ─── Helpers ───────────────────────────────────────────────────────────────

def create_tables():
    """Crée toutes les tables si elles n'existent pas encore."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency FastAPI — fournit une session BDD et la ferme proprement."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
