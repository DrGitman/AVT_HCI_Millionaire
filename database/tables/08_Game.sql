CREATE TABLE "Game" (
  "GameId" integer PRIMARY KEY,
  "gameCode" varchar UNIQUE,
  "player1" integer NOT NULL,
  "player2" integer,
  "player3" integer,
  "player4" integer,
  "winner" integer,
  "status" varchar DEFAULT 'active',
  "startTime" datetime,
  "endTime" datetime
);