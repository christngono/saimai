"""
Routes historique :
  GET    /api/sessions                        → liste des sessions
  POST   /api/sessions                        → créer une session
  DELETE /api/sessions/{id}                   → supprimer une session
  GET    /api/sessions/{id}/messages          → messages d'une session
  POST   /api/sessions/{id}/messages          → sauvegarder un message
  PUT    /api/sessions/{id}/title             → renommer une session
"""

import json
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth_utils import get_current_user
from database import get_db, User, ChatSession, ChatMessage

router = APIRouter(prefix="/api", tags=["history"])


# ─── Schémas Pydantic ────────────────────────────────────────────────────────

class CreateSessionRequest(BaseModel):
    title: str = "Nouvelle conversation"
    agent_type: str = "fiscal"


class SaveMessageRequest(BaseModel):
    role: str                          # "user" | "assistant"
    content: str
    sources: Optional[list] = None


class RenameTitleRequest(BaseModel):
    title: str


# ─── Helpers ────────────────────────────────────────────────────────────────

def _now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _session_payload(s: ChatSession, include_last: bool = True) -> dict:
    last_msg = s.messages[-1].content[:80] if s.messages else None
    return {
        "id":            s.id,
        "title":         s.title,
        "agent_type":    s.agent_type,
        "message_count": len(s.messages),
        "last_message":  last_msg if include_last else None,
        "created_at":    s.created_at.isoformat(),
        "updated_at":    s.updated_at.isoformat(),
    }


def _message_payload(m: ChatMessage) -> dict:
    return {
        "id":         m.id,
        "role":       m.role,
        "content":    m.content,
        "sources":    json.loads(m.sources) if m.sources else [],
        "created_at": m.created_at.isoformat(),
    }


# ─── Sessions ────────────────────────────────────────────────────────────────

@router.get("/sessions", summary="Liste des conversations")
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sessions = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .all()
    )
    return [_session_payload(s) for s in sessions]


@router.post("/sessions", summary="Créer une conversation")
def create_session(
    req: CreateSessionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = ChatSession(
        user_id=current_user.id,
        title=req.title.strip() or "Nouvelle conversation",
        agent_type=req.agent_type,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return _session_payload(session)


@router.delete("/sessions/{session_id}", summary="Supprimer une conversation")
def delete_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = (
        db.query(ChatSession)
        .filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session introuvable")
    db.delete(session)
    db.commit()
    return {"ok": True, "deleted_id": session_id}


@router.put("/sessions/{session_id}/title", summary="Renommer une conversation")
def rename_session(
    session_id: str,
    req: RenameTitleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = (
        db.query(ChatSession)
        .filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session introuvable")
    session.title = req.title.strip()[:80]
    session.updated_at = _now()
    db.commit()
    return {"id": session.id, "title": session.title}


# ─── Messages ────────────────────────────────────────────────────────────────

@router.get("/sessions/{session_id}/messages", summary="Messages d'une conversation")
def get_messages(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = (
        db.query(ChatSession)
        .filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session introuvable")
    return [_message_payload(m) for m in session.messages]


@router.post("/sessions/{session_id}/messages", summary="Sauvegarder un message")
def save_message(
    session_id: str,
    req: SaveMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if req.role not in ("user", "assistant"):
        raise HTTPException(status_code=400, detail="role doit être 'user' ou 'assistant'")

    session = (
        db.query(ChatSession)
        .filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session introuvable")

    msg = ChatMessage(
        session_id=session_id,
        user_id=current_user.id,
        role=req.role,
        content=req.content,
        sources=json.dumps(req.sources) if req.sources else None,
    )
    db.add(msg)

    # Auto-titre depuis le premier message utilisateur
    if req.role == "user" and session.title in ("Nouvelle conversation", "New conversation"):
        session.title = req.content[:60] + ("…" if len(req.content) > 60 else "")

    # Mise à jour timestamp session
    session.updated_at = _now()

    # Compteur de crédits (seulement les messages utilisateur = 1 question = 1 crédit)
    if req.role == "user":
        current_user.credits_used = (current_user.credits_used or 0) + 1

    db.commit()
    db.refresh(msg)
    return _message_payload(msg)


# ─── Statistiques utilisateur ────────────────────────────────────────────────

@router.get("/stats", summary="Statistiques de l'utilisateur")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).count()
    total_messages = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).count()

    # Comptage par agent
    from sqlalchemy import func
    by_agent = (
        db.query(ChatSession.agent_type, func.count(ChatSession.id))
        .filter(ChatSession.user_id == current_user.id)
        .group_by(ChatSession.agent_type)
        .all()
    )

    return {
        "total_sessions":  total_sessions,
        "total_messages":  total_messages,
        "credits_used":    current_user.credits_used,
        "credits_limit":   current_user.credits_limit,
        "credits_left":    max(0, current_user.credits_limit - (current_user.credits_used or 0)),
        "by_agent":        {agent: count for agent, count in by_agent},
    }
