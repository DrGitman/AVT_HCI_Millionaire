CREATE TABLE "PlayerGameAnswer" (
  "PlayerGameAnswerId" integer PRIMARY KEY,
  "playerGameAnswerCode" varchar UNIQUE,
  "GameId" integer,
  "PlayerId" integer,
  "QuestionId" integer,
  "AnswerId" integer,
  "isCorrect" bool,
  "questionSequence" integer,
  "answeredAt" datetime
);