CREATE OR REPLACE PROCEDURE sp_CreatePlayer(
  IN p_name VARCHAR,
  IN p_username VARCHAR,
  IN p_email VARCHAR,
  IN p_passwordHash TEXT,
  OUT p_PlayerId INTEGER,
  OUT p_playerCode VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_sequence INTEGER;
BEGIN
  SELECT COALESCE(MAX("PlayerId"), 0) + 1 INTO v_sequence FROM "Player";
  p_playerCode := 'PLY' || LPAD(v_sequence::TEXT, 6, '0');

  INSERT INTO "Player" (
    "playerCode", "username", "email", "passwordHash", "name"
  ) VALUES (
    p_playerCode, p_username, p_email, p_passwordHash, p_name
  ) RETURNING "PlayerId" INTO p_PlayerId;

  INSERT INTO "Leaderboard" ("PlayerId") VALUES (p_PlayerId)
  ON CONFLICT ("PlayerId") DO NOTHING;

  INSERT INTO "PlayerSettings" ("PlayerId") VALUES (p_PlayerId)
  ON CONFLICT ("PlayerId") DO NOTHING;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_CreateGame(
  IN p_player1 INTEGER,
  IN p_player2 INTEGER DEFAULT NULL,
  IN p_player3 INTEGER DEFAULT NULL,
  IN p_player4 INTEGER DEFAULT NULL,
  IN p_category_ids INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
  IN p_maxPlayers INTEGER DEFAULT 4,
  IN p_gameMode VARCHAR DEFAULT 'Real-Time Speed',
  IN p_timeLimit INTEGER DEFAULT 45,
  OUT p_GameId INTEGER,
  OUT p_gameCode VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_sequence INTEGER;
  v_category INTEGER;
  v_player_id INTEGER;
BEGIN
  SELECT COALESCE(MAX("GameId"), 0) + 1 INTO v_sequence FROM "Game";
  p_gameCode := 'GAM' || LPAD(v_sequence::TEXT, 6, '0');

  INSERT INTO "Game" ("gameCode", "player1", "player2", "player3", "player4", "maxPlayers", "gameMode", "timeLimit", "status", "startTime")
  VALUES (p_gameCode, p_player1, p_player2, p_player3, p_player4, p_maxPlayers, p_gameMode, p_timeLimit, 'waiting', now())
  RETURNING "GameId" INTO p_GameId;

  FOREACH v_category IN ARRAY p_category_ids LOOP
    INSERT INTO "GameCategory" ("gameCategoryCode", "GameId", "CategoryId")
    VALUES ('GMC' || LPAD((SELECT COALESCE(MAX("GameCategoryId"), 0) + 1 FROM "GameCategory")::TEXT, 6, '0'), p_GameId, v_category)
    ON CONFLICT ("GameId", "CategoryId") DO NOTHING;
  END LOOP;

  -- Initialize lifelines for all players
  FOR v_player_id IN SELECT unnest(ARRAY[p_player1, p_player2, p_player3, p_player4]) WHERE unnest IS NOT NULL LOOP
    INSERT INTO "PlayerGameLifeline" ("PlayerId", "GameId") VALUES (v_player_id, p_GameId);
  END LOOP;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_GetQuestionsForGame(
  IN p_GameId INTEGER,
  OUT p_questions REFCURSOR
)
LANGUAGE plpgsql
AS $$
BEGIN
  OPEN p_questions FOR
    SELECT q."QuestionId", q."questionCode", q."question", c."name" AS category, pl."PrizeLevelId", pl."prizeLevelCode", pl."prizeValue", pl."isSafetyNet"
    FROM "Question" q
    JOIN "Category" c ON c."CategoryId" = q."CategoryId"
    JOIN "PrizeLevel" pl ON pl."PrizeLevelId" = q."PrizeLevelId"
    JOIN "GameCategory" gc ON gc."CategoryId" = q."CategoryId" AND gc."GameId" = p_GameId
    WHERE q."isActive" = true
    ORDER BY pl."PrizeLevelId" ASC, random()
    LIMIT 15;
END;
$$;

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
  v_answer_code VARCHAR;
  v_sequence INTEGER;
BEGIN
  SELECT a."isCorrect", a."justification" INTO p_isCorrect, p_justification
  FROM "Answer" a
  WHERE a."AnswerId" = p_AnswerId AND a."QuestionId" = p_QuestionId;

  IF p_isCorrect IS NULL THEN
    RAISE EXCEPTION 'Answer % does not belong to question %', p_AnswerId, p_QuestionId;
  END IF;

  SELECT pl."prizeValue", pl."isSafetyNet"
  INTO p_prizeValue, p_isSafetyNet
  FROM "Question" q
  JOIN "PrizeLevel" pl ON pl."PrizeLevelId" = q."PrizeLevelId"
  WHERE q."QuestionId" = p_QuestionId;

  SELECT COALESCE(MAX("PlayerGameAnswerId"), 0) + 1 INTO v_sequence FROM "PlayerGameAnswer";
  v_answer_code := 'PGA' || LPAD(v_sequence::TEXT, 6, '0');

  INSERT INTO "PlayerGameAnswer" (
    "playerGameAnswerCode", "GameId", "PlayerId", "QuestionId", "AnswerId", "isCorrect", "questionSequence"
  ) VALUES (
    v_answer_code, p_GameId, p_PlayerId, p_QuestionId, p_AnswerId, p_isCorrect, p_questionSequence
  );

  p_playerEliminated := NOT p_isCorrect;
END;
$$;

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
  v_hint_id INTEGER;
  v_hint_text TEXT;
  v_avatar_name VARCHAR;
  v_wrong_answer1 INTEGER;
  v_wrong_answer2 INTEGER;
BEGIN
  IF p_lifelineType = 'AskClass' THEN
    p_result := json_build_object('A', '20%', 'B', '20%', 'C', '40%', 'D', '20%')::TEXT;
    UPDATE "PlayerGameLifeline" SET "lifeLineAskClass" = false, "lifeLineAskClassResult" = p_result
    WHERE "PlayerId" = p_PlayerId AND "GameId" = p_GameId;
  ELSIF p_lifelineType = '5050' THEN
    SELECT "AnswerId" INTO v_wrong_answer1 FROM "Answer" WHERE "QuestionId" = p_QuestionId AND NOT "isCorrect" ORDER BY random() LIMIT 1;
    SELECT "AnswerId" INTO v_wrong_answer2 FROM "Answer" WHERE "QuestionId" = p_QuestionId AND NOT "isCorrect" AND "AnswerId" <> v_wrong_answer1 ORDER BY random() LIMIT 1;
    p_result := json_build_object('removeAnswer1', v_wrong_answer1, 'removeAnswer2', v_wrong_answer2)::TEXT;
    UPDATE "PlayerGameLifeline" SET "lifeLine5050" = false
    WHERE "PlayerId" = p_PlayerId AND "GameId" = p_GameId;
  ELSIF p_lifelineType = 'Phone' THEN
    SELECT "PhoneAPeerHintId", "avatarName", "hintText" INTO v_hint_id, v_avatar_name, v_hint_text
    FROM "PhoneAPeerHint" WHERE "QuestionId" = p_QuestionId AND "isActive" = true LIMIT 1;
    p_result := json_build_object('avatarName', v_avatar_name, 'hint', v_hint_text)::TEXT;
    UPDATE "PlayerGameLifeline" SET "lifeLinePhone" = false, "lifeLinePhoneResult" = v_hint_id
    WHERE "PlayerId" = p_PlayerId AND "GameId" = p_GameId;
  ELSE
    SELECT "CourseNoteHintId", "noteText" INTO v_hint_id, v_hint_text
    FROM "CourseNoteHint" WHERE "QuestionId" = p_QuestionId AND "isActive" = true LIMIT 1;
    p_result := json_build_object('note', v_hint_text)::TEXT;
    UPDATE "PlayerGameLifeline" SET "lifeLineNotes" = false, "lifeLineNotesResult" = v_hint_id
    WHERE "PlayerId" = p_PlayerId AND "GameId" = p_GameId;
  END IF;
END;
$$;

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
  v_player_id INTEGER;
  v_correct_count INTEGER;
  v_game_score INTEGER;
BEGIN
  IF p_status NOT IN ('completed', 'abandoned') THEN
    RAISE EXCEPTION 'Invalid game status %', p_status;
  END IF;

  IF p_status = 'completed' THEN
    -- Determine winner (player with highest score)
    SELECT pga."PlayerId", COALESCE(SUM(pl."prizeValue"), 0)
    INTO p_winnerId, p_finalScore
    FROM "PlayerGameAnswer" pga
    JOIN "Question" q ON q."QuestionId" = pga."QuestionId"
    JOIN "PrizeLevel" pl ON pl."PrizeLevelId" = q."PrizeLevelId"
    WHERE pga."GameId" = p_GameId AND pga."isCorrect" = true
    GROUP BY pga."PlayerId"
    ORDER BY SUM(pl."prizeValue") DESC, MAX(pga."answeredAt") ASC
    LIMIT 1;

    IF p_winnerId IS NOT NULL THEN
      SELECT "playerCode" INTO p_winnerCode FROM "Player" WHERE "PlayerId" = p_winnerId;
    END IF;

    -- Update stats for all players in the game
    FOR v_player_id IN
      SELECT player_id FROM (
        SELECT "player1" AS player_id FROM "Game" WHERE "GameId" = p_GameId
        UNION SELECT "player2" FROM "Game" WHERE "GameId" = p_GameId
        UNION SELECT "player3" FROM "Game" WHERE "GameId" = p_GameId
        UNION SELECT "player4" FROM "Game" WHERE "GameId" = p_GameId
      ) sub WHERE player_id IS NOT NULL
    LOOP
      SELECT COUNT(*), COALESCE(SUM(pl."prizeValue"), 0)
      INTO v_correct_count, v_game_score
      FROM "PlayerGameAnswer" pga
      JOIN "Question" q ON q."QuestionId" = pga."QuestionId"
      JOIN "PrizeLevel" pl ON pl."PrizeLevelId" = q."PrizeLevelId"
      WHERE pga."GameId" = p_GameId AND pga."PlayerId" = v_player_id AND pga."isCorrect" = true;

      UPDATE "Leaderboard"
      SET "totalGames" = "totalGames" + 1,
          "totalWins" = "totalWins" + (CASE WHEN v_player_id = p_winnerId THEN 1 ELSE 0 END),
          "totalCorrect" = "totalCorrect" + v_correct_count,
          "bestScore" = GREATEST("bestScore", v_game_score),
          "updatedAt" = now()
      WHERE "PlayerId" = v_player_id;
    END LOOP;

  ELSE
    p_winnerId := NULL;
    p_winnerCode := NULL;
    p_finalScore := 0;
  END IF;

  UPDATE "Game"
  SET "status" = p_status,
      "winner" = p_winnerId,
      "endTime" = now()
  WHERE "GameId" = p_GameId;

  CALL sp_RecalculateLeaderboard();
END;
$$;

CREATE OR REPLACE PROCEDURE sp_RecalculateLeaderboard()
LANGUAGE plpgsql
AS $$
DECLARE
  v_row RECORD;
  v_rank INTEGER := 1;
  leaderboard_cursor CURSOR FOR
    SELECT "LeaderboardId"
    FROM "Leaderboard"
    ORDER BY "bestScore" DESC, "totalWins" DESC, "totalCorrect" DESC, "updatedAt" ASC;
BEGIN
  OPEN leaderboard_cursor;
  LOOP
    FETCH leaderboard_cursor INTO v_row;
    EXIT WHEN NOT FOUND;

    UPDATE "Leaderboard"
    SET "rank" = v_rank,
        "updatedAt" = now()
    WHERE "LeaderboardId" = v_row."LeaderboardId";

    v_rank := v_rank + 1;
  END LOOP;
  CLOSE leaderboard_cursor;
END;
$$;
