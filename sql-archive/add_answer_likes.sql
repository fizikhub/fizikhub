-- Add answer_likes table for tracking user likes on answers
CREATE TABLE IF NOT EXISTS answer_likes (
    id BIGSERIAL PRIMARY KEY,
    answer_id BIGINT NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(answer_id, user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_answer_likes_answer_id ON answer_likes(answer_id);
CREATE INDEX IF NOT EXISTS idx_answer_likes_user_id ON answer_likes(user_id);

-- Enable RLS
ALTER TABLE answer_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view likes
CREATE POLICY "Anyone can view answer likes"
    ON answer_likes
    FOR SELECT
    USING (true);

-- Policy: Authenticated users can insert their own likes
CREATE POLICY "Users can like answers"
    ON answer_likes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own likes
CREATE POLICY "Users can unlike answers"
    ON answer_likes
    FOR DELETE
    USING (auth.uid() = user_id);
