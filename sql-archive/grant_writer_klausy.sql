-- Grant 'writer' role (is_writer = true) to user @Klausy
-- Updates the profile for username 'Klausy'

UPDATE profiles
SET 
    is_writer = true,
    updated_at = NOW()
WHERE username = 'Klausy';

-- Verify the update
SELECT username, is_writer, updated_at 
FROM profiles 
WHERE username = 'Klausy';
