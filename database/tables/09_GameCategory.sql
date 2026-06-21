CREATE TABLE "GameCategory" (
  "GameCategoryId" integer PRIMARY KEY,
  "gameCategoryCode" varchar UNIQUE,
  "GameId" integer,
  "CategoryId" integer
);