CREATE OR REPLACE FUNCTION fn_ValidateAnswer()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_answer_count INTEGER;
  v_correct_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_answer_count
  FROM "Answer"
  WHERE "QuestionId" = NEW."QuestionId"
    AND "AnswerId" <> COALESCE(NEW."AnswerId", -1);

  IF v_answer_count >= 4 THEN
    RAISE EXCEPTION 'Question % already has 4 answers.', NEW."QuestionId";
  END IF;

  IF NEW."isCorrect" THEN
    SELECT COUNT(*)
    INTO v_correct_count
    FROM "Answer"
    WHERE "QuestionId" = NEW."QuestionId"
      AND "isCorrect" = true
      AND "AnswerId" <> COALESCE(NEW."AnswerId", -1);

    IF v_correct_count >= 1 THEN
      RAISE EXCEPTION 'Question % already has a correct answer.', NEW."QuestionId";
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ValidateAnswer ON "Answer";
CREATE TRIGGER trg_ValidateAnswer
BEFORE INSERT OR UPDATE ON "Answer"
FOR EACH ROW
EXECUTE FUNCTION fn_ValidateAnswer();
