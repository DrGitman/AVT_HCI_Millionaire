CREATE TABLE "Answer" (
  "AnswerId" integer PRIMARY KEY,
  "answerCode" varchar UNIQUE,
  "answer" varchar,
  "QuestionId" integer,
  "isCorrect" bool DEFAULT false,
  "justification" varchar
);