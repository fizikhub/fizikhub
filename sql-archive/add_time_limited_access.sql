-- Add time-limited access columns to profiles table
-- Run this in Supabase SQL Editor

-- Add columns for time-limited user tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_time_limited BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_time_used_seconds INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS time_limit_reset_date DATE DEFAULT CURRENT_DATE;

-- Create index for quick lookup of time-limited users
CREATE INDEX IF NOT EXISTS idx_profiles_time_limited ON profiles(is_time_limited) WHERE is_time_limited = true;

-- Set the initial time-limited users
UPDATE profiles 
SET is_time_limited = true, daily_time_used_seconds = 0, time_limit_reset_date = CURRENT_DATE
WHERE username IN ('silginim', 'sulfiriikasit', 'testcik');

-- Verification
SELECT username, is_time_limited, daily_time_used_seconds, time_limit_reset_date
FROM profiles 
WHERE is_time_limited = true;
