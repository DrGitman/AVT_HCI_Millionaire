from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.security.jwt_handler import decode_token
from app.models.player import Player

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_player(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Player:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise credentials_exception

    player_id: int | None = payload.get("sub")
    if player_id is None:
        raise credentials_exception

    player = db.query(Player).filter(
        Player.PlayerId == int(player_id),
        Player.isActive == True
    ).first()

    if player is None:
        raise credentials_exception

    return player
