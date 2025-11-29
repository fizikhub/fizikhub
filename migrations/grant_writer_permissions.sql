-- Grant writer permission to specific users
UPDATE profiles
SET is_writer = true
WHERE username IN ('Klausy', 'testcik');

-- Verify the update
SELECT username, is_writer FROM profiles WHERE username IN ('Klausy', 'testcik');
