-- Add is_verified column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Update the specific user to be verified
UPDATE profiles
SET is_verified = TRUE
WHERE username = 'Testtesttest';
