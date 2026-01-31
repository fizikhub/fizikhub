-- Give extra 10 minutes to silginim
-- By reducing the used time by 600 seconds (10 minutes)
UPDATE profiles 
SET daily_time_used_seconds = GREATEST(0, daily_time_used_seconds - 600)
WHERE username = 'silginim';

-- Verify
SELECT username, daily_time_used_seconds, is_time_limited 
FROM profiles 
WHERE username = 'silginim';
