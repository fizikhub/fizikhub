-- Create indices for better query performance

-- Questions table indices
CREATE INDEX IF NOT EXISTS idx_questions_author_id ON questions(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_votes ON questions(votes DESC);

-- Answers table indices
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_author_id ON answers(author_id);

-- Profiles table indices
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Votes and Likes indices (for efficient lookups and joins)
CREATE INDEX IF NOT EXISTS idx_question_votes_composite ON question_votes(question_id, user_id);
CREATE INDEX IF NOT EXISTS idx_answer_likes_composite ON answer_likes(answer_id, user_id);

-- Follows indices
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- Badges indices
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
