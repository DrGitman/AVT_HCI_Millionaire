import uuid
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.player import Player
from app.models.leaderboard import Leaderboard
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.security.password_handler import hash_password, verify_password
from app.security.jwt_handler import create_access_token, create_refresh_token, decode_token


def register_player(request: RegisterRequest, db: Session) -> TokenResponse:
    # Check duplicates
    if db.query(Player).filter(Player.email == request.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A player with this email already exists"
        )
    if db.query(Player).filter(Player.username == request.username).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already taken"
        )

    # Use stored procedure for player creation
    # CALL sp_CreatePlayer(p_name, p_username, p_email, p_passwordHash, OUT p_PlayerId, OUT p_playerCode)
    result = db.execute(
        "CALL sp_CreatePlayer(:name, :username, :email, :passwordHash, NULL, NULL)",
        {
            "name": request.name,
            "username": request.username,
            "email": request.email,
            "passwordHash": hash_password(request.password),
        }
    ).fetchone()

    # In PostgreSQL, CALL with OUT parameters returns a row
    player_id = result[0]

    player = db.query(Player).filter(Player.PlayerId == player_id).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve player after creation"
        )

    return _build_tokens(player)


def login_player(request: LoginRequest, db: Session) -> TokenResponse:
    player = db.query(Player).filter(Player.email == request.email).first()
    if not player or not verify_password(request.password, player.passwordHash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    if not player.isActive:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated"
        )
    return _build_tokens(player)


def refresh_tokens(refresh_token: str, db: Session) -> TokenResponse:
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    player = db.query(Player).filter(
        Player.PlayerId == int(payload["sub"]),
        Player.isActive == True
    ).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Player not found"
        )
    return _build_tokens(player)


def _build_tokens(player: Player) -> TokenResponse:
    data = {"sub": str(player.PlayerId)}
    return TokenResponse(
        access_token=create_access_token(data),
        refresh_token=create_refresh_token(data),
    )
