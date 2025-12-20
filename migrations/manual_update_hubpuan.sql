-- Update HubPuan to 109 for user @sulfiriikasit
UPDATE profiles 
SET reputation = 109 
WHERE username = 'sulfiriikasit';

-- Verify the update
SELECT username, reputation FROM profiles WHERE username = 'sulfiriikasit';
