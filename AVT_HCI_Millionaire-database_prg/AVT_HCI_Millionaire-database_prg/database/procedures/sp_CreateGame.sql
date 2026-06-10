-- Description : Creates a new Game record and assigns between 1 and 4 players

CREATE OR REPLACE PROCEDURE sp_CreateGame(
    IN p_player1 INTEGER,
    IN p_player2 INTEGER DEFAULT NULL,
    IN p_player3 INTEGER DEFAULT NULL,
    IN p_player4 INTEGER DEFAULT NULL,
    OUT p_GameId INTEGER,
    OUT p_gameCode VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_sequence INTEGER;
BEGIN
    -- Validate that player1 exists as it is mandatory
    IF NOT EXISTS (SELECT 1 FROM Player WHERE PlayerId = p_player1) THEN
        RAISE EXCEPTION 'Player 1 with ID % does not exist', p_player1;
    END IF;

    -- Validate optional players if provided
    IF p_player2 IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM Player WHERE PlayerId = p_player2
    ) THEN
        RAISE EXCEPTION 'Player 2 with ID % does not exist', p_player2;
    END IF;

    IF p_player3 IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM Player WHERE PlayerId = p_player3
    ) THEN
        RAISE EXCEPTION 'Player 3 with ID % does not exist', p_player3;
    END IF;

    IF p_player4 IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM Player WHERE PlayerId = p_player4
    ) THEN
        RAISE EXCEPTION 'Player 4 with ID % does not exist', p_player4;
    END IF;

    -- Validate no duplicate players
    IF (p_player2 IS NOT NULL AND p_player2 = p_player1) OR
       (p_player3 IS NOT NULL AND p_player3 = p_player1) OR
       (p_player3 IS NOT NULL AND p_player3 = p_player2) OR
       (p_player4 IS NOT NULL AND p_player4 = p_player1) OR
       (p_player4 IS NOT NULL AND p_player4 = p_player2) OR
       (p_player4 IS NOT NULL AND p_player4 = p_player3)
    THEN
        RAISE EXCEPTION 'Duplicate players are not allowed in the same game';
    END IF;

    -- Get next sequence value for code generation
    SELECT COALESCE(MAX(GameId), 0) + 1
    INTO v_sequence
    FROM Game;

    -- Generate game code
    p_gameCode := 'GAM' || LPAD(v_sequence::TEXT, 3, '0');

    -- Insert new game record
    INSERT INTO Game (
        gameCode,
        player1,
        player2,
        player3,
        player4,
        winner,
        status,
        startTime,
        endTime
    )
    VALUES (
        p_gameCode,
        p_player1,
        p_player2,
        p_player3,
        p_player4,
        NULL,
        'active',
        NOW(),
        NULL
    )
    RETURNING GameId INTO p_GameId;

    RAISE NOTICE 'Game created: % with code %', p_GameId, p_gameCode;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'sp_CreateGame failed: %', SQLERRM;
END;
$$;