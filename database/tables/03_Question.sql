CREATE TABLE "Question" (
  "QuestionId" integer PRIMARY KEY,
  "questionCode" varchar UNIQUE,
  "question" varchar,
  "CategoryId" integer,
  "PrizeLevelId" integer,
  "isActive" bool DEFAULT true
);