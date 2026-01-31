-- Drop the broken follow trigger and function
-- The application code (actions.ts) now handles notification creation,
-- so this database trigger is redundant and causing errors because it uses the old schema.

DROP TRIGGER IF EXISTS on_follow_created ON follows;
DROP FUNCTION IF EXISTS handle_new_follow();
