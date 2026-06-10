CREATE TABLE "PhoneAPeerHint" (
  "PhoneAPeerHintId" integer PRIMARY KEY,
  "phoneAPeerHintCode" varchar UNIQUE,
  "QuestionId" integer,
  "avatarName" varchar,
  "hintText" varchar,
  "isActive" bool DEFAULT true
);