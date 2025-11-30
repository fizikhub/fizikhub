-- Update user profile for gencaktas869@gmail.com
-- Set username to 58aka and add verification badge

UPDATE profiles
SET 
    username = '58aka',
    is_verified = true
WHERE id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'gencaktas869@gmail.com'
);
