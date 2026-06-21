-- Description : Returns a player's earned score and safety net floor for a given game session

CREATE OR REPLACE FUNCTION fn_GetPlayerResult(
    p_GameId INTEGER,
    p_PlayerId INTEGER
)
RETURNS TABLE (
    earnedScore INTEGER,
    safetyNetFloor INTEGER,
    correctAnswers INTEGER,
    totalAnswers INTEGER,
    finalPrize INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_earnedScore INTEGER;
    v_safetyNetFloor INTEGER;
    v_correctAnswers INTEGER;
    v_totalAnswers INTEGER;
    v_finalPrize INTEGER;
BEGIN
    -- Validate game exists
    IF NOT EXISTS (
        SELECT 1 FROM Game
        WHERE GameId = p_GameId
    ) THEN
        RAISE EXCEPTION 'Game with ID % does not exist', p_GameId;
    END IF;

    -- Validate player belongs to this game
    IF NOT EXISTS (
        SELECT 1 FROM Game
        WHERE GameId = p_GameId
        AND (
            player1 = p_PlayerId OR
            player2 = p_PlayerId OR
            player3 = p_PlayerId OR
            player4 = p_PlayerId
        )
    ) THEN
        RAISE EXCEPTION 'Player with ID % does not belong to game %',
            p_PlayerId, p_GameId;
    END IF;

    -- Calculate total earned score from correct answers
    SELECT COALESCE(SUM(pl.prizeValue), 0)
    INTO v_earnedScore
    FROM PlayerGameAnswer pga
    INNER JOIN Question q
        ON pga.QuestionId = q.QuestionId
    INNER JOIN PrizeLevel pl
        ON q.PrizeLevelId = pl.PrizeLevelId
    WHERE pga.GameId = p_GameId
    AND pga.PlayerId = p_PlayerId
    AND pga.isCorrect = TRUE;

    -- Calculate safety net floor
    -- Highest safety net prize level the player correctly answered
    SELECT COALESCE(MAX(pl.prizeValue), 0)
    INTO v_safetyNetFloor
    FROM PlayerGameAnswer pga
    INNER JOIN Question q
        ON pga.QuestionId = q.QuestionId
    INNER JOIN PrizeLevel pl
        ON q.PrizeLevelId = pl.PrizeLevelId
    WHERE pga.GameId = p_GameId
    AND pga.PlayerId = p_PlayerId
    AND pga.isCorrect = TRUE
    AND pl.isSafetyNet = TRUE;

    -- Count correct answers
    SELECT COALESCE(COUNT(*), 0)
    INTO v_correctAnswers
    FROM PlayerGameAnswer
    WHERE GameId = p_GameId
    AND PlayerId = p_PlayerId
    AND isCorrect = TRUE;

    -- Count total answers
    SELECT COALESCE(COUNT(*), 0)
    INTO v_totalAnswers
    FROM PlayerGameAnswer
    WHERE GameId = p_GameId
    AND PlayerId = p_PlayerId;

    -- Determine final prize
    -- If player was eliminated, final prize is the safety net floor
    -- If player completed the game, final prize is the earned score
    IF v_earnedScore > v_safetyNetFloor THEN
        v_finalPrize := v_earnedScore;
    ELSE
        v_finalPrize := v_safetyNetFloor;
    END IF;

    -- Return result set
    RETURN QUERY
    SELECT
        v_earnedScore,
        v_safetyNetFloor,
        v_correctAnswers::INTEGER,
        v_totalAnswers::INTEGER,
        v_finalPrize;

    RAISE NOTICE 'Player % result in game %: earned %, safety net %, final %',
        p_PlayerId, p_GameId, v_earnedScore, v_safetyNetFloor, v_finalPrize;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'fn_GetPlayerResult failed: %', SQLERRM;
END;
$$;