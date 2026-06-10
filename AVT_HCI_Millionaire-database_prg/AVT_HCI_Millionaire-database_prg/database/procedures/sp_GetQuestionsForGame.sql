-- Description : Retrieves 15 active questions for a game based on selected categories, ordered by prize level ascending

CREATE OR REPLACE PROCEDURE sp_GetQuestionsForGame(
    IN p_GameId INTEGER,
    OUT p_questions REFCURSOR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validate that the game exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM Game 
        WHERE GameId = p_GameId 
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Game with ID % does not exist or is not active', p_GameId;
    END IF;

    -- Validate that the game has categories assigned
    IF NOT EXISTS (
        SELECT 1 FROM GameCategory 
        WHERE GameId = p_GameId
    ) THEN
        RAISE EXCEPTION 'Game with ID % has no categories assigned', p_GameId;
    END IF;

    -- Open cursor returning 15 questions ordered by prize level
    OPEN p_questions FOR
        SELECT
            q.QuestionId,
            q.questionCode,
            q.question,
            c.name AS category,
            pl.PrizeLevelId,
            pl.prizeLevelCode,
            pl.prizeValue,
            pl.isSafetyNet
        FROM Question q
        INNER JOIN Category c
            ON q.CategoryId = c.CategoryId
        INNER JOIN PrizeLevel pl
            ON q.PrizeLevelId = pl.PrizeLevelId
        INNER JOIN GameCategory gc
            ON q.CategoryId = gc.CategoryId
            AND gc.GameId = p_GameId
        WHERE q.isActive = TRUE
        ORDER BY pl.PrizeLevelId ASC, RANDOM()
        LIMIT 15;

    RAISE NOTICE 'Questions retrieved for game: %', p_GameId;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'sp_GetQuestionsForGame failed: %', SQLERRM;
END;
$$;