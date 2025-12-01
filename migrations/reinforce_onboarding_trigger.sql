-- Drop the trigger first to ensure clean state
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the function to be absolutely sure about the logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed)
  VALUES (
    NEW.id,
    -- Use email prefix as temporary username if username metadata is missing
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    FALSE -- CRITICAL: Force FALSE for new users
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Double check: Update any profiles that might have slipped through with NULL onboarding_completed
UPDATE public.profiles 
SET onboarding_completed = FALSE 
WHERE onboarding_completed IS NULL;
