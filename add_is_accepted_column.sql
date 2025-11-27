-- Add is_accepted column to answers table
ALTER TABLE answers 
ADD COLUMN IF NOT EXISTS is_accepted BOOLEAN DEFAULT FALSE;

-- Create a partial unique index to ensure only one accepted answer per question
CREATE UNIQUE INDEX IF NOT EXISTS unique_accepted_answer_per_question 
ON answers (question_id) 
WHERE is_accepted = TRUE;
