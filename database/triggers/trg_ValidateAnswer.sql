-- Description : Fires on INSERT and UPDATE to Answer table. Enforces:
--               1. Max 4 answers per question
--               2. Max 1 correct answer per question

CREATE OR REPLACE FUNCTION fn_ValidateAnswer()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_answerCount INTEGER;
    v_correctCount INTEGER;
BEGIN
    -- Check total answer count for this question
    -- Exclude current row on UPDATE to avoid false positive
    SELECT COUNT(*)
    INTO v_answerCount
    FROM Answer
    WHERE QuestionId = NEW.QuestionId
    AND AnswerId != COALESCE(NEW.AnswerId, -1);

    IF v_answerCount >= 4 THEN
        RAISE EXCEPTION 
            'Question % already has 4 answers. No more answers can be added.',
            NEW.QuestionId;
    END IF;

    -- Check correct answer count for this question
    -- Only relevant if the incoming row is marked correct
    IF NEW.isCorrect = TRUE THEN
        SELECT COUNT(*)
        INTO v_correctCount
        FROM Answer
        WHERE QuestionId = NEW.QuestionId
        AND isCorrect = TRUE
        AND AnswerId != COALESCE(NEW.AnswerId, -1);

        IF v_correctCount >= 1 THEN
            RAISE EXCEPTION
                'Question % already has a correct answer. Only one correct answer is allowed.',
                NEW.QuestionId;
        END IF;
    END IF;

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'fn_ValidateAnswer failed: %', SQLERRM;
END;
$$;

-- =============================================
-- Attach trigger to Answer table
-- =============================================

CREATE OR REPLACE TRIGGER trg_ValidateAnswer
    BEFORE INSERT OR UPDATE
    ON Answer
    FOR EACH ROW
    EXECUTE FUNCTION fn_ValidateAnswer();