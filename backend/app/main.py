from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager

from app.config import get_settings
from app.database import engine, Base

from app.routes import auth, users, questions, game, lifelines, leaderboard
from app.websockets.game_ws import router as ws_router

settings = get_settings()
security = HTTPBearer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    print(f"Database tables verified — env: {settings.app_env}")
    yield
    print("Shutting down HCI Millionaire API")


app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    description=(
        "Backend API for Who Wants to Be an HCI Millionaire? — "
        "a gamified quiz platform grounded in African values and HCI theory."
    ),
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan,
    swagger_ui_parameters={"persistAuthorization": True},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,        prefix="/auth",        tags=["Auth"])
app.include_router(users.router,       prefix="/users",       tags=["Users"])
app.include_router(questions.router,   prefix="/questions",   tags=["Questions"])
app.include_router(game.router,        prefix="/game",        tags=["Game"])
app.include_router(lifelines.router,   prefix="/lifelines",   tags=["Lifelines"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["Leaderboard"])
app.include_router(ws_router,          prefix="/ws",          tags=["WebSocket"])


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "version": settings.app_version}