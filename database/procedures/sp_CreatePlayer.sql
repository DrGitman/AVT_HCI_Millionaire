-- Creates a fresh Player record for a new game session

CREATE OR REPLACE PROCEDURE sp_CreatePlayer(
    IN p_name VARCHAR,
    OUT p_PlayerId INTEGER,
    OUT p_playerCode VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_sequence INTEGER;
BEGIN
    -- Get next sequence value for code generation
    SELECT COALESCE(MAX(PlayerId), 0) + 1 
    INTO v_sequence 
    FROM Player;

    -- Generate player code
    p_playerCode := 'PLY' || LPAD(v_sequence::TEXT, 3, '0');

    -- Insert new player record
    INSERT INTO Player (
        playerCode,
        name,
        lifeLineAskClass,
        lifeLineAskClassResult,
        lifeLine5050,
        lifeLinePhone,
        lifeLinePhoneResult,
        lifeLineNotes,
        lifeLineNotesResult
    )
    VALUES (
        p_playerCode,
        p_name,
        TRUE,   -- lifeLineAskClass available
        NULL,   -- no result yet
        TRUE,   -- lifeLine5050 available
        TRUE,   -- lifeLinePhone available
        NULL,   -- no result yet
        TRUE,   -- lifeLineNotes available
        NULL    -- no result yet
    )
    RETURNING PlayerId INTO p_PlayerId;

    RAISE NOTICE 'Player created: % with code %', p_name, p_playerCode;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'sp_CreatePlayer failed: %', SQLERRM;
END;
$$;