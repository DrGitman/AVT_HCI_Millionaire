-- Description : Ends a game session, determines the winner, and sets the final status. Handles both completed and abandoned states.
--               status accepted values:
--               'completed', 'abandoned'

CREATE OR REPLACE PROCEDURE sp_EndGame(
    IN p_GameId INTEGER,
    IN p_status VARCHAR DEFAULT 'completed',
    OUT p_winnerId INTEGER,
    OUT p_winnerCode VARCHAR,
    OUT p_finalScore INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_player1 INTEGER;
    v_player2 INTEGER;
    v_player3 INTEGER;
    v_player4 INTEGER;
BEGIN
    -- Validate game exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM Game
        WHERE GameId = p_GameId
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Game with ID % does not exist or is not active', p_GameId;
    END IF;

    -- Validate status value
    IF p_status NOT IN ('completed', 'abandoned') THEN
        RAISE EXCEPTION 'Invalid status: %. Must be completed or abandoned', p_status;
    END IF;

    -- Get all players in this game
    SELECT player1, player2, player3, player4
    INTO v_player1, v_player2, v_player3, v_player4
    FROM Game
    WHERE GameId = p_GameId;

    -- Determine winner based on highest score
    -- Winner is the player with the most correct answers
    -- In a tie, the player who answered faster wins
    IF p_status = 'completed' THEN
        SELECT pga.PlayerId
        INTO p_winnerId
        FROM PlayerGameAnswer pga
        INNER JOIN Question q
            ON pga.QuestionId = q.QuestionId
        INNER JOIN PrizeLevel pl
            ON q.PrizeLevelId = pl.PrizeLevelId
        WHERE pga.GameId = p_GameId
        AND pga.isCorrect = TRUE
        AND pga.PlayerId IN (
            v_player1, v_player2, v_player3, v_player4
        )
        GROUP BY pga.PlayerId
        ORDER BY 
            SUM(pl.prizeValue) DESC,
            MAX(pga.answeredAt) ASC
        LIMIT 1;

        -- Get winner final score
        SELECT SUM(pl.prizeValue)
        INTO p_finalScore
        FROM PlayerGameAnswer pga
        INNER JOIN Question q
            ON pga.QuestionId = q.QuestionId
        INNER JOIN PrizeLevel pl
            ON q.PrizeLevelId = pl.PrizeLevelId
        WHERE pga.GameId = p_GameId
        AND pga.PlayerId = p_winnerId
        AND pga.isCorrect = TRUE;

        -- Get winner code
        SELECT playerCode
        INTO p_winnerCode
        FROM Player
        WHERE PlayerId = p_winnerId;

    ELSE
        -- Game abandoned, no winner
        p_winnerId := NULL;
        p_winnerCode := NULL;
        p_finalScore := 0;
    END IF;

    -- Update game record
    UPDATE Game
    SET status = p_status,
        winner = p_winnerId,
        endTime = NOW()
    WHERE GameId = p_GameId;

    RAISE NOTICE 'Game % ended with status: %. Winner: %', 
        p_GameId, p_status, p_winnerCode;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'sp_EndGame failed: %', SQLERRM;
END;
$$;