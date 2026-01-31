-- Mark all existing users as having seen the onboarding tour
-- Run this ONCE to grandfather in current users.
UPDATE profiles 
SET has_seen_onboarding = TRUE 
WHERE has_seen_onboarding IS FALSE OR has_seen_onboarding IS NULL;
