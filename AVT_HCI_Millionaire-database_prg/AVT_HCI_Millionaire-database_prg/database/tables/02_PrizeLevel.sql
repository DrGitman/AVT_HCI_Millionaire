CREATE TABLE "PrizeLevel" (
  "PrizeLevelId" integer PRIMARY KEY,
  "prizeLevelCode" varchar UNIQUE,
  "prizeValue" integer,
  "isSafetyNet" bool DEFAULT false
);