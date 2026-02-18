-- Add title, content, and category columns to the stories table if they don't exist
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS category TEXT;

-- Verify the columns are added
COMMENT ON COLUMN stories.title IS 'Title of the story';
COMMENT ON COLUMN stories.content IS 'Content description of the story';
COMMENT ON COLUMN stories.category IS 'Category/Group of the story (e.g., Kuantum, Astrofizik)';
