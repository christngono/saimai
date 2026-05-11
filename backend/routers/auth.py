"""
Routes d'authentification :
  POST /auth/register   → créer un compte
  POST /auth/login      → connexion, retourne access + refresh token
  POST /auth/refresh    → renouveler l'access token
  GET  /auth/me         → profil de l'utilisateur connecté
  PUT  /auth/me         → mettre à jour nom ou mot de passe
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth_utils import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    decode_token, get_current_user,
)
from database import get_db, User

router = APIRouter(prefix="/auth", tags=["auth"])


# ─── Schémas Pydantic ────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def email_lowercase(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("name")
    @classmethod
    def name_strip(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Le nom doit contenir au moins 2 caractères")
        return v

    @field_validator("password")
    @classmethod
    def password_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def email_lowercase(cls, v: str) -> str:
        return v.strip().lower()


class RefreshRequest(BaseModel):
    refresh_token: str


class UpdateMeRequest(BaseModel):
    name: str | None = None
    password: str | None = None

    @field_validator("password")
    @classmethod
    def password_length(cls, v: str | None) -> str | None:
        if v is not None and len(v) < 8:
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères")
        return v


# ─── Helpers ────────────────────────────────────────────────────────────────

def _user_payload(user: User) -> dict:
    return {
        "id":            user.id,
        "email":         user.email,
        "name":          user.name,
        "plan":          user.plan,
        "credits_used":  user.credits_used,
        "credits_limit": user.credits_limit,
        "created_at":    user.created_at.isoformat() if user.created_at else None,
    }


def _auth_response(user: User) -> dict:
    return {
        "access_token":  create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
        "token_type":    "bearer",
        "user":          _user_payload(user),
    }


# ─── Endpoints ───────────────────────────────────────────────────────────────

@router.post("/register", summary="Créer un compte")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    user = User(
        email=req.email,
        name=req.name,
        password_hash=hash_password(req.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _auth_response(user)


@router.post("/login", summary="Se connecter")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    # Mettre à jour la date de dernière connexion
    user.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
    db.commit()

    return _auth_response(user)


@router.post("/refresh", summary="Renouveler l'access token")
def refresh(req: RefreshRequest):
    payload = decode_token(req.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Token de rafraîchissement invalide")
    return {
        "access_token": create_access_token(payload["sub"]),
        "token_type":   "bearer",
    }


@router.get("/me", summary="Profil de l'utilisateur connecté")
def me(current_user: User = Depends(get_current_user)):
    return _user_payload(current_user)


@router.put("/me", summary="Mettre à jour le profil")
def update_me(
    req: UpdateMeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if req.name is not None:
        current_user.name = req.name.strip()
    if req.password is not None:
        current_user.password_hash = hash_password(req.password)

    current_user.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
    db.commit()
    db.refresh(current_user)
    return _user_payload(current_user)
