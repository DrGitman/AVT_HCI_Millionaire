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
BEGIN
  RETURN QUERY
  WITH player_answers AS (
    SELECT pga."QuestionId", pga."isCorrect", q."PrizeLevelId", pl."prizeValue", pl."isSafetyNet"
    FROM "PlayerGameAnswer" pga
    JOIN "Question" q ON q."QuestionId" = pga."QuestionId"
    JOIN "PrizeLevel" pl ON pl."PrizeLevelId" = q."PrizeLevelId"
    WHERE pga."GameId" = p_GameId
      AND pga."PlayerId" = p_PlayerId
  ),
  aggregates AS (
    SELECT
      COALESCE(SUM(CASE WHEN "isCorrect" THEN "prizeValue" ELSE 0 END), 0) AS earned,
      COALESCE(MAX(CASE WHEN "isCorrect" AND "isSafetyNet" THEN "prizeValue" ELSE 0 END), 0) AS safety_net,
      COALESCE(SUM(CASE WHEN "isCorrect" THEN 1 ELSE 0 END), 0) AS correct_count,
      COALESCE(COUNT(*), 0) AS total_count
    FROM player_answers
  )
  SELECT
    earned,
    safety_net,
    correct_count,
    total_count,
    GREATEST(earned, safety_net)
  FROM aggregates;
END;
$$;

CREATE OR REPLACE FUNCTION fn_GetPlayerProfile(
  p_PlayerId INTEGER
)
RETURNS TABLE (
  username VARCHAR,
  name VARCHAR,
  level INTEGER,
  prestigePoints INTEGER,
  accuracy NUMERIC,
  totalGames INTEGER,
  rank INTEGER,
  lastActive TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.username,
    p.name,
    (l."bestScore" / 100000) + 1 AS level, -- Example level logic
    l."bestScore" AS prestigePoints,
    CASE WHEN l."totalCorrect" > 0 THEN (l."totalCorrect"::NUMERIC / (l."totalGames" * 15)::NUMERIC) * 100 ELSE 0 END AS accuracy,
    l."totalGames",
    l."rank",
    l."updatedAt" AS lastActive
  FROM "Player" p
  JOIN "Leaderboard" l ON l."PlayerId" = p."PlayerId"
  WHERE p."PlayerId" = p_PlayerId;
END;
$$;
