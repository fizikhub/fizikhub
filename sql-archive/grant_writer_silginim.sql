-- Grant writer permission to user @silginim
UPDATE profiles 
SET is_writer = true 
WHERE username = 'silginim';

-- Verify the update
SELECT username, is_writer FROM profiles WHERE username = 'silginim';
