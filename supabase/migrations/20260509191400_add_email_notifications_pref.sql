-- Add wants_email_notifications to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wants_email_notifications BOOLEAN DEFAULT TRUE;

-- Update existing rows to have this set to true (though DEFAULT TRUE handles new and existing if not null, but let's be explicit)
UPDATE profiles SET wants_email_notifications = TRUE WHERE wants_email_notifications IS NULL;
