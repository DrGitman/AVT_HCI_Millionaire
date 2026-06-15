from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.player import Player
from app.models.settings import PlayerSettings
from app.schemas.player import PlayerResponse, PlayerProfileResponse, PlayerUpdateRequest
from app.schemas.settings import PlayerSettingsResponse, PlayerSettingsUpdate
from app.security.dependencies import get_current_player
from app.services.leaderboard_service import get_player_rank

router = APIRouter()


@router.get("/me", response_model=PlayerResponse)
def get_me(current_player: Player = Depends(get_current_player)):
    return current_player


@router.get("/me/profile", response_model=PlayerProfileResponse)
def get_my_profile(current_player: Player = Depends(get_current_player)):
    return current_player


@router.get("/me/rank")
def get_my_rank(
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    return get_player_rank(current_player.PlayerId, db)


@router.patch("/me", response_model=PlayerResponse)
def update_me(
    request: PlayerUpdateRequest,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    if request.name:
        current_player.name = request.name
    if request.username:
        current_player.username = request.username
    db.commit()
    db.refresh(current_player)
    return current_player


@router.get("/me/settings", response_model=PlayerSettingsResponse)
def get_settings(
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    settings = db.query(PlayerSettings).filter(PlayerSettings.PlayerId == current_player.PlayerId).first()
    if not settings:
        settings = PlayerSettings(PlayerId=current_player.PlayerId)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.patch("/me/settings", response_model=PlayerSettingsResponse)
def update_settings(
    request: PlayerSettingsUpdate,
    current_player: Player = Depends(get_current_player),
    db: Session = Depends(get_db),
):
    settings = db.query(PlayerSettings).filter(PlayerSettings.PlayerId == current_player.PlayerId).first()
    if not settings:
        settings = PlayerSettings(PlayerId=current_player.PlayerId)
        db.add(settings)

    if request.allowSpeedInvites is not None:
        settings.allowSpeedInvites = request.allowSpeedInvites
    if request.themePreference is not None:
        settings.themePreference = request.themePreference
    if request.volumeLevel is not None:
        settings.volumeLevel = request.volumeLevel

    db.commit()
    db.refresh(settings)
    return settings
