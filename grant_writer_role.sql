-- Grant 'writer' role (is_writer = true) to user @baranbozkurt
-- We first need to find the user ID for 'baranbozkurt'

UPDATE profiles
SET 
    is_writer = true,
    updated_at = NOW()
WHERE username = 'baranbozkurt';
