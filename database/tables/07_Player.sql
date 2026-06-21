CREATE TABLE "Player" (
  "PlayerId" integer PRIMARY KEY,
  "playerCode" varchar UNIQUE,
  "name" varchar,
  "lifeLineAskClass" bool,
  "lifeLineAskClassResult" varchar,
  "lifeLine5050" bool,
  "lifeLinePhone" bool,
  "lifeLinePhoneResult" integer,
  "lifeLineNotes" bool,
  "lifeLineNotesResult" integer
);