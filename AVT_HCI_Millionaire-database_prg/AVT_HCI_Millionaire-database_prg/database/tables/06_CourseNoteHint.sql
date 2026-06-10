CREATE TABLE "CourseNoteHint" (
  "CourseNoteHintId" integer PRIMARY KEY,
  "courseNoteHintCode" varchar UNIQUE,
  "QuestionId" integer,
  "noteText" varchar,
  "isActive" bool DEFAULT true
);