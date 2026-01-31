-- Grant writer permission to user @World
UPDATE profiles 
SET is_writer = true 
WHERE username = 'World';
