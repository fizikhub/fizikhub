-- Drop the trigger that causes double-counting of reputation points
-- The logic is already handled in the application layer (Server Actions) which correctly handles
-- both adding points for acceptance AND removing points for un-acceptance.
-- This trigger was only handling the 'add' case and was doing it redundantly.

DROP TRIGGER IF EXISTS trigger_accepted_answer_reputation ON answers;
DROP FUNCTION IF EXISTS award_reputation_for_accepted_answer();
