# HCI Millionaire — Backend

REST API built with FastAPI and PostgreSQL, containerised with Docker.
You do not install anything on your machine except Docker. Python, FastAPI, and PostgreSQL all run inside containers.


## Prerequisites

Install Docker Desktop for your operating system.

- Ubuntu — https://docs.docker.com/engine/install/ubuntu
- Windows — https://docs.docker.com/desktop/install/windows-install
- Mac — https://docs.docker.com/desktop/install/mac-install

Confirm the installation worked before going further.

    docker --version
    docker compose version


## Step 1 — Clone the repository and switch to the backend branch

    git clone https://github.com/DrGitman/AVT_HCI_Millionaire.git
    cd AVT_HCI_Millionaire
    git checkout backend
    git pull origin backend


## Step 2 — Create the .env file

The .env file holds secret configuration values such as the database credentials and the JWT key.
It is not versioned, so you have to create it manually from the provided template.

    cp backend/.env.example backend/.env

The file must contain exactly the following. Do not change any of these values.

    DATABASE_URL=postgresql://hci_user:hci_pass@db:5432/hci_millionaire
    JWT_SECRET_KEY=xxxxxxxxxx
    JWT_ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    REFRESH_TOKEN_EXPIRE_DAYS=7
    APP_ENV=development
    APP_TITLE=HCI Millionaire API
    APP_VERSION=0.1.0
    CORS_ORIGINS=http://localhost:5173,http://localhost:3000

One important detail: the host in DATABASE_URL is "db", not "localhost". Docker resolves
that name internally to the database container. If you write localhost there, the backend
will fail to connect.


## Step 3 — Stop any local PostgreSQL instance

The backend uses ports 5432 for the database, 8000 for the API, and 9090 for Adminer.
If PostgreSQL is already installed and running on your machine, it is holding port 5432
and Docker will not be able to bind to it. You need to stop it before launching.

On Ubuntu and Mac, run the following.

    sudo systemctl stop postgresql
    sudo systemctl disable postgresql

On Windows, open the Services panel by pressing Win + R, typing services.msc, and pressing
Enter. Find the service named postgresql-x64-XX, right-click it, and select Stop.

The disable command on Ubuntu and Mac prevents PostgreSQL from starting again automatically
on the next reboot. You only need to run it once.

## Running migrations for the first time

Start the containers, open a shell inside the backend container, set the
PYTHONPATH, then generate and apply the migration.

    docker compose up -d db adminer backend
    docker compose exec backend bash

    export PYTHONPATH=/app

    alembic revision --autogenerate -m "initial schema from Leonard design"
    alembic upgrade head
    python seed_data.py
    exit

Open Adminer at http://localhost:9090 and confirm that all 10 tables are
visible in the hci_millionaire database.

    Category
    PrizeLevel
    Question
    Answer
    PhoneAPeerHint
    CourseNoteHint
    Player
    Game
    GameCategory
    PlayerGameAnswer


## Step 4 — First launch

This command builds the backend image and installs all Python dependencies listed in
requirements.txt. It takes two to three minutes the first time because Docker downloads
the base Python image and runs pip install.

    docker compose up --build db adminer backend

Run this from the root of the project, where docker-compose.yaml is located.

When the setup is complete you should see the following lines in the terminal output.

    db-1       | database system is ready to accept connections
    backend-1  | Database tables verified, environment: development
    backend-1  | Uvicorn running on http://0.0.0.0:8000


## Step 5 — Verify that everything is running

Open a second terminal and run the following command.

    curl http://localhost:8000/health

The expected response is the following.

    {"status": "ok", "version": "0.1.0"}

You can also open these addresses directly in a browser.

    http://localhost:8000/health    API health check
    http://localhost:8000/docs      Swagger UI with all available endpoints
    http://localhost:9090           Adminer, a web interface for the database

To log in to Adminer, use the following credentials.

    System      PostgreSQL
    Server      db
    Username    hci_user
    Password    hci_pass
    Database    hci_millionaire


## Step 6 — Daily usage

Once the first build is done, you do not need --build anymore. Use the following commands
for your daily workflow.

Start the services.

    docker compose up db adminer backend

Start the services in the background so the terminal remains free.

    docker compose up -d db adminer backend

Follow the backend logs when running in the background.

    docker compose logs -f backend

Stop all running services.

    docker compose down


## Step 7 — Editing the code

The backend folder on your machine is mounted directly into the container via a Docker
volume. Every time you save a Python file, Uvicorn detects the change and reloads
automatically. You do not need to restart Docker or rebuild the image.

You edit a file in backend/app/routes/auth.py, save it, and within one second the
change is live at http://localhost:8000/docs.


## Step 8 — Adding a Python dependency

If you need to add a new package, add it to backend/requirements.txt first, then rebuild
the image. Never run pip install directly inside the container because the change will be
lost the next time the container restarts.

    # Add the package to requirements.txt, then rebuild
    docker compose up --build backend


## Step 9 — Database migrations with Alembic

Whenever you add or modify a SQLAlchemy model, you need to generate a migration file and
apply it to the database. Do this from inside the backend container.

Open a shell inside the container.

    docker compose exec backend bash

Generate a migration file automatically from your model changes.

    alembic revision --autogenerate -m "short description of what changed"

Apply all pending migrations to the database.

    alembic upgrade head

Roll back the last migration if something went wrong.

    alembic downgrade -1

Exit the container shell when you are done.

    exit


## Step 10 — Other useful commands

Open an interactive shell inside the backend container.

    docker compose exec backend bash

Check the status of all running containers.

    docker compose ps

Stop all services and delete the database volume to start fresh.

    docker compose down -v

Rebuild only the backend image after modifying requirements.txt.

    docker compose up --build backend


## Project structure

    backend/
    |-- Dockerfile
    |-- requirements.txt          Python dependencies
    |-- .env                      Environment variables, not versioned
    |-- .env.example              Template for .env, versioned
    |-- alembic.ini               Alembic configuration
    |-- alembic/
    |   |-- env.py                Alembic runtime environment
    |   +-- versions/             Generated migration files
    +-- app/
        |-- main.py               FastAPI application entry point
        |-- config.py             Reads settings from .env
        |-- database.py           PostgreSQL connection and session
        |-- models/               SQLAlchemy ORM models
        |-- schemas/              Pydantic DTOs for requests and responses
        |-- repositories/         Database access layer
        |-- services/             Business logic
        |-- routes/               HTTP endpoint definitions
        |-- security/             JWT handling and password hashing
        |-- mappers/              Conversion between ORM models and DTOs
        |-- websockets/           Real-time multiplayer via WebSocket
        +-- utils/                Custom exceptions and shared utilities

