"""
Utilitaires d'authentification : hachage bcrypt, création/décodage JWT.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt as pyjwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db, User

# ─── Configuration ──────────────────────────────────────────────────────────

SECRET_KEY = os.environ.get("JWT_SECRET", "changez-ce-secret-en-production-!!!")
ALGORITHM  = "HS256"

ACCESS_TOKEN_HOURS   = 24
REFRESH_TOKEN_DAYS   = 30

# HTTPBearer : required=True pour les routes protégées, auto_error=False pour l'optionnel
_bearer_required = HTTPBearer(auto_error=True)
_bearer_optional = HTTPBearer(auto_error=False)


# ─── Mots de passe ──────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


# ─── JWT ────────────────────────────────────────────────────────────────────

def _make_token(user_id: str, token_type: str, expires_delta: timedelta) -> str:
    exp = datetime.now(timezone.utc) + expires_delta
    return pyjwt.encode(
        {"sub": user_id, "type": token_type, "exp": exp},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def create_access_token(user_id: str) -> str:
    return _make_token(user_id, "access", timedelta(hours=ACCESS_TOKEN_HOURS))


def create_refresh_token(user_id: str) -> str:
    return _make_token(user_id, "refresh", timedelta(days=REFRESH_TOKEN_DAYS))


def decode_token(token: str) -> dict:
    """Décode et valide un JWT. Lève HTTPException si invalide ou expiré."""
    try:
        return pyjwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré — reconnectez-vous")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")


# ─── Dependencies FastAPI ────────────────────────────────────────────────────

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_required),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency protégée : exige un JWT valide.
    Utiliser dans les routes qui nécessitent une connexion.
    """
    payload = decode_token(credentials.credentials)
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Token de type invalide")

    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return user


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer_optional),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    Dependency optionnelle : retourne l'utilisateur si JWT présent et valide,
    sinon None. Permet la rétro-compatibilité avec le web (sans JWT).
    """
    if not credentials:
        return None
    try:
        payload = decode_token(credentials.credentials)
        if payload.get("type") != "access":
            return None
        return db.query(User).filter(User.id == payload["sub"]).first()
    except HTTPException:
        return None
