-- Add status column to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived'));

-- Index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);

-- Update existing rows explicitly (optional, since default is published)
UPDATE questions SET status = 'published' WHERE status IS NULL;
