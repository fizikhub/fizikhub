-- Add social_links and website columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Example structure for social_links:
-- {
--   "twitter": "username",
--   "github": "username",
--   "instagram": "username",
--   "linkedin": "username"
-- }
