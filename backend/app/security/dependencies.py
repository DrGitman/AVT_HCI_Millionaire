from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.security.jwt_handler import decode_token
from app.models.player import Player

bearer_scheme = HTTPBearer()

def get_current_player(
        credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
        db: Session = Depends(get_db)
) -> Player:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise credentials_exception

    player_id = payload.get("sub")
    if player_id is None:
        raise credentials_exception

    player = db.query(Player).filter(
        Player.PlayerId == int(player_id),
        Player.isActive == True
    ).first()

    if player is None:
        raise credentials_exception

    return player