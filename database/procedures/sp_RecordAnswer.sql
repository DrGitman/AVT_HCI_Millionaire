-- Description : Records a player's answer for a question in a game session. Handles elimination if answer is incorrect.

CREATE OR REPLACE PROCEDURE sp_RecordAnswer(
    IN p_GameId INTEGER,
    IN p_PlayerId INTEGER,
    IN p_QuestionId INTEGER,
    IN p_AnswerId INTEGER,
    IN p_questionSequence INTEGER,
    OUT p_isCorrect BOOLEAN,
    OUT p_justification VARCHAR,
    OUT p_prizeValue INTEGER,
    OUT p_isSafetyNet BOOLEAN,
    OUT p_playerEliminated BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_sequence INTEGER;
    v_playerGameAnswerCode VARCHAR;
    v_correctAnswerId INTEGER;
    v_safetyNetValue INTEGER;
    v_activePlayers INTEGER;
BEGIN
    -- Validate game exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM Game
        WHERE GameId = p_GameId
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Game with ID % does not exist or is not active', p_GameId;
    END IF;

    -- Validate player exists and belongs to this game
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
        RAISE EXCEPTION 'Player with ID % does not belong to game %', p_PlayerId, p_GameId;
    END IF;

    -- Validate question exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM Question
        WHERE QuestionId = p_QuestionId
        AND isActive = TRUE
    ) THEN
        RAISE EXCEPTION 'Question with ID % does not exist or is not active', p_QuestionId;
    END IF;

    -- Validate answer belongs to the question
    IF NOT EXISTS (
        SELECT 1 FROM Answer
        WHERE AnswerId = p_AnswerId
        AND QuestionId = p_QuestionId
    ) THEN
        RAISE EXCEPTION 'Answer with ID % does not belong to question %', p_AnswerId, p_QuestionId;
    END IF;

    -- Validate player has not already answered this question in this game
    IF EXISTS (
        SELECT 1 FROM PlayerGameAnswer
        WHERE GameId = p_GameId
        AND PlayerId = p_PlayerId
        AND QuestionId = p_QuestionId
    ) THEN
        RAISE EXCEPTION 'Player % has already answered question % in game %', 
            p_PlayerId, p_QuestionId, p_GameId;
    END IF;

    -- Determine if answer is correct
    SELECT isCorrect, justification
    INTO p_isCorrect, p_justification
    FROM Answer
    WHERE AnswerId = p_AnswerId;

    -- Get correct answer for reference
    SELECT AnswerId
    INTO v_correctAnswerId
    FROM Answer
    WHERE QuestionId = p_QuestionId
    AND isCorrect = TRUE;

    -- Get prize level details for this question
    SELECT pl.prizeValue, pl.isSafetyNet
    INTO p_prizeValue, p_isSafetyNet
    FROM Question q
    INNER JOIN PrizeLevel pl
        ON q.PrizeLevelId = pl.PrizeLevelId
    WHERE q.QuestionId = p_QuestionId;

    -- Get next sequence value for code generation
    SELECT COALESCE(MAX(PlayerGameAnswerId), 0) + 1
    INTO v_sequence
    FROM PlayerGameAnswer;

    -- Generate player game answer code
    v_playerGameAnswerCode := 'PGA' || LPAD(v_sequence::TEXT, 3, '0');

    -- Insert answer record
    INSERT INTO PlayerGameAnswer (
        playerGameAnswerCode,
        GameId,
        PlayerId,
        QuestionId,
        AnswerId,
        isCorrect,
        questionSequence,
        answeredAt
    )
    VALUES (
        v_playerGameAnswerCode,
        p_GameId,
        p_PlayerId,
        p_QuestionId,
        p_AnswerId,
        p_isCorrect,
        p_questionSequence,
        NOW()
    );

    -- Handle elimination if answer is incorrect
    p_playerEliminated := FALSE;

    IF p_isCorrect = FALSE THEN
        p_playerEliminated := TRUE;

        -- Get the highest safety net value the player reached
        SELECT COALESCE(MAX(pl.prizeValue), 0)
        INTO v_safetyNetValue
        FROM PlayerGameAnswer pga
        INNER JOIN Question q
            ON pga.QuestionId = q.QuestionId
        INNER JOIN PrizeLevel pl
            ON q.PrizeLevelId = pl.PrizeLevelId
        WHERE pga.GameId = p_GameId
        AND pga.PlayerId = p_PlayerId
        AND pga.isCorrect = TRUE
        AND pl.isSafetyNet = TRUE;

        -- Override prize value with safety net floor
        p_prizeValue := v_safetyNetValue;

        -- Check how many active players remain
        SELECT COUNT(DISTINCT pga2.PlayerId)
        INTO v_activePlayers
        FROM Game g
        LEFT JOIN PlayerGameAnswer pga2
            ON pga2.GameId = g.GameId
        WHERE g.GameId = p_GameId
        AND pga2.PlayerId != p_PlayerId
        AND pga2.isCorrect = TRUE;

        -- If only one player remains after elimination, end the game
        IF v_activePlayers = 1 THEN
            CALL sp_EndGame(p_GameId, 'completed');
        ELSIF v_activePlayers = 0 THEN
            CALL sp_EndGame(p_GameId, 'completed');
        END IF;
    END IF;

    RAISE NOTICE 'Answer recorded for player % in game %. Correct: %', 
        p_PlayerId, p_GameId, p_isCorrect;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'sp_RecordAnswer failed: %', SQLERRM;
END;
$$;