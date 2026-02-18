-- Create Story Groups Table
CREATE TABLE IF NOT EXISTS story_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    cover_url TEXT,
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add group_id to stories
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES story_groups(id) ON DELETE SET NULL;

-- Enable RLS for story_groups
ALTER TABLE story_groups ENABLE ROW LEVEL SECURITY;

-- Policies for story_groups
CREATE POLICY "Public groups are viewable by everyone" 
ON story_groups FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own groups" 
ON story_groups FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own groups" 
ON story_groups FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own groups" 
ON story_groups FOR DELETE 
USING (auth.uid() = author_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_stories_group_id ON stories(group_id);
CREATE INDEX IF NOT EXISTS idx_story_groups_author_id ON story_groups(author_id);
