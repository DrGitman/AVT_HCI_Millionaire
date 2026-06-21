-- Description : Handles all four lifeline types for a player in a game session. lifelineType accepted values:
--               'AskClass', '5050', 'Phone', 
--               'Notes'

CREATE OR REPLACE PROCEDURE sp_UseLifeline(
    IN p_GameId INTEGER,
    IN p_PlayerId INTEGER,
    IN p_QuestionId INTEGER,
    IN p_lifelineType VARCHAR,
    OUT p_result TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_hintId INTEGER;
    v_hintText TEXT;
    v_avatarName VARCHAR;
    v_wrongAnswer1 INTEGER;
    v_wrongAnswer2 INTEGER;
    v_askClassResult TEXT;
BEGIN
    -- Validate game exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM Game
        WHERE GameId = p_GameId
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Game with ID % does not exist or is not active', p_GameId;
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

    -- Validate lifeline type
    IF p_lifelineType NOT IN ('AskClass', '5050', 'Phone', 'Notes') THEN
        RAISE EXCEPTION 'Invalid lifeline type: %. Must be AskClass, 5050, Phone, or Notes', 
            p_lifelineType;
    END IF;

    -- Handle each lifeline type
    IF p_lifelineType = 'AskClass' THEN

        -- Validate lifeline is still available
        IF NOT EXISTS (
            SELECT 1 FROM Player
            WHERE PlayerId = p_PlayerId
            AND lifeLineAskClass = TRUE
        ) THEN
            RAISE EXCEPTION 'AskClass lifeline has already been used by player %', p_PlayerId;
        END IF;

        -- Generate simulated poll percentages
        -- Correct answer weighted higher for authenticity
        v_askClassResult := json_build_object(
            'A', (FLOOR(RANDOM() * 20) + 5)::TEXT || '%',
            'B', (FLOOR(RANDOM() * 20) + 5)::TEXT || '%',
            'C', (FLOOR(RANDOM() * 40) + 30)::TEXT || '%',
            'D', (FLOOR(RANDOM() * 20) + 5)::TEXT || '%'
        )::TEXT;

        -- Mark lifeline as used and store result
        UPDATE Player
        SET lifeLineAskClass = FALSE,
            lifeLineAskClassResult = v_askClassResult
        WHERE PlayerId = p_PlayerId;

        p_result := v_askClassResult;

    ELSIF p_lifelineType = '5050' THEN

        -- Validate lifeline is still available
        IF NOT EXISTS (
            SELECT 1 FROM Player
            WHERE PlayerId = p_PlayerId
            AND lifeLine5050 = TRUE
        ) THEN
            RAISE EXCEPTION '5050 lifeline has already been used by player %', p_PlayerId;
        END IF;

        -- Get two wrong answer IDs to remove
        -- Always keeps the correct answer visible
        SELECT AnswerId
        INTO v_wrongAnswer1
        FROM Answer
        WHERE QuestionId = p_QuestionId
        AND isCorrect = FALSE
        ORDER BY RANDOM()
        LIMIT 1;

        SELECT AnswerId
        INTO v_wrongAnswer2
        FROM Answer
        WHERE QuestionId = p_QuestionId
        AND isCorrect = FALSE
        AND AnswerId != v_wrongAnswer1
        ORDER BY RANDOM()
        LIMIT 1;

        -- Mark lifeline as used
        UPDATE Player
        SET lifeLine5050 = FALSE
        WHERE PlayerId = p_PlayerId;

        p_result := json_build_object(
            'removeAnswer1', v_wrongAnswer1,
            'removeAnswer2', v_wrongAnswer2
        )::TEXT;

    ELSIF p_lifelineType = 'Phone' THEN

        -- Validate lifeline is still available
        IF NOT EXISTS (
            SELECT 1 FROM Player
            WHERE PlayerId = p_PlayerId
            AND lifeLinePhone = TRUE
        ) THEN
            RAISE EXCEPTION 'Phone lifeline has already been used by player %', p_PlayerId;
        END IF;

        -- Get a random active hint for this question
        SELECT PhoneAPeerHintId, avatarName, hintText
        INTO v_hintId, v_avatarName, v_hintText
        FROM PhoneAPeerHint
        WHERE QuestionId = p_QuestionId
        AND isActive = TRUE
        ORDER BY RANDOM()
        LIMIT 1;

        IF v_hintId IS NULL THEN
            RAISE EXCEPTION 'No active Phone a Peer hints available for question %', 
                p_QuestionId;
        END IF;

        -- Mark lifeline as used and store hint reference
        UPDATE Player
        SET lifeLinePhone = FALSE,
            lifeLinePhoneResult = v_hintId
        WHERE PlayerId = p_PlayerId;

        p_result := json_build_object(
            'avatarName', v_avatarName,
            'hint', v_hintText
        )::TEXT;

    ELSIF p_lifelineType = 'Notes' THEN

        -- Validate lifeline is still available
        IF NOT EXISTS (
            SELECT 1 FROM Player
            WHERE PlayerId = p_PlayerId
            AND lifeLineNotes = TRUE
        ) THEN
            RAISE EXCEPTION 'Notes lifeline has already been used by player %', p_PlayerId;
        END IF;

        -- Get a random active course note for this question
        SELECT CourseNoteHintId, noteText
        INTO v_hintId, v_hintText
        FROM CourseNoteHint
        WHERE QuestionId = p_QuestionId
        AND isActive = TRUE
        ORDER BY RANDOM()
        LIMIT 1;

        IF v_hintId IS NULL THEN
            RAISE EXCEPTION 'No active Course Note hints available for question %', 
                p_QuestionId;
        END IF;

        -- Mark lifeline as used and store hint reference
        UPDATE Player
        SET lifeLineNotes = FALSE,
            lifeLineNotesResult = v_hintId
        WHERE PlayerId = p_PlayerId;

        p_result := json_build_object(
            'note', v_hintText
        )::TEXT;

    END IF;

    RAISE NOTICE 'Lifeline % used by player % in game %', 
        p_lifelineType, p_PlayerId, p_GameId;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'sp_UseLifeline failed: %', SQLERRM;
END;
$$;