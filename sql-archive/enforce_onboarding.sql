-- 1. Add onboarding_completed column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- 2. Update existing users to have onboarding_completed = TRUE (so they aren't locked out)
UPDATE public.profiles 
SET onboarding_completed = TRUE 
WHERE onboarding_completed IS FALSE;

-- 3. Update the handle_new_user function to set onboarding_completed = FALSE for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    FALSE -- Explicitly set to FALSE for new users
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
