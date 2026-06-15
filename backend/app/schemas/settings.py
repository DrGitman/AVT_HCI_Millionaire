from pydantic import BaseModel

class PlayerSettingsResponse(BaseModel):
    allowSpeedInvites: bool
    themePreference: str
    volumeLevel: int

    class Config:
        from_attributes = True

class PlayerSettingsUpdate(BaseModel):
    allowSpeedInvites: bool | None = None
    themePreference: str | None = None
    volumeLevel: int | None = None
