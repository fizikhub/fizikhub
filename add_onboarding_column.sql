-- Add has_seen_onboarding column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_seen_onboarding BOOLEAN DEFAULT FALSE;

-- Update existing users to have seen it (optional, but good for not annoying existing users)
-- UPDATE profiles SET has_seen_onboarding = TRUE WHERE created_at < NOW();
