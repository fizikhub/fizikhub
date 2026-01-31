-- CRITICAL FIX: Stop auto-creating profiles on signup
-- Profiles should ONLY be created when user completes onboarding

-- 1. Drop the trigger that auto-creates profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop the function as well to ensure it's not called elsewhere
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Clean up any "unnamed" profiles that were auto-created
-- These are profiles where onboarding_completed is FALSE and username looks like an email prefix
DELETE FROM public.profiles 
WHERE onboarding_completed = FALSE 
  AND (username IS NULL OR username = '' OR username NOT LIKE '%@%');

-- Note: From now on, profiles will ONLY be created via the completeOnboarding action
-- when the user clicks "Tamamla ve Başla"
