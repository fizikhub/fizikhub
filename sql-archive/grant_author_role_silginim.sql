-- Grant 'author' role to user @silginim
-- User ID: c7b4285b-e964-44c8-b10d-9867f0c9b0af

UPDATE profiles
SET 
    role = 'author',
    updated_at = NOW()
WHERE id = 'c7b4285b-e964-44c8-b10d-9867f0c9b0af';
