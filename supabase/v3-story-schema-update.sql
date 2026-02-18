-- Add title and content columns to the stories table if they don't exist
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS content TEXT;

-- Verify the columns are added
COMMENT ON COLUMN stories.title IS 'Title of the story';
COMMENT ON COLUMN stories.content IS 'Content description of the story';
