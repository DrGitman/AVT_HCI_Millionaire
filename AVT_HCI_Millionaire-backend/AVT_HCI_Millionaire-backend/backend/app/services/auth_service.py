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

    player = Player(
        playerCode=str(uuid.uuid4()),
        username=request.username,
        email=request.email,
        passwordHash=hash_password(request.password),
        name=request.name,
    )
    db.add(player)
    db.flush()  # get PlayerId before commit

    # Create leaderboard entry for new player
    leaderboard = Leaderboard(PlayerId=player.PlayerId)
    db.add(leaderboard)
    db.commit()
    db.refresh(player)

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
