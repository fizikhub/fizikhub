-- Recalculate votes for all questions
UPDATE questions q
SET votes = (
    SELECT COALESCE(SUM(vote_type), 0)
    FROM question_votes qv
    WHERE qv.question_id = q.id
);

-- Optional: Ensure no negative votes if that's a hard requirement (though logic allows it)
-- UPDATE questions SET votes = 0 WHERE votes < 0;
