-- Update handle_new_user to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  has_username boolean;
  meta_onboarding boolean;
BEGIN
  -- Check if username is explicitly provided in metadata (strong signal of custom signup)
  has_username := (NEW.raw_user_meta_data->>'username') IS NOT NULL AND length(NEW.raw_user_meta_data->>'username') > 0;
  
  -- Check explicit onboarding flag
  BEGIN
    meta_onboarding := (NEW.raw_user_meta_data->>'onboarding_completed')::boolean;
  EXCEPTION WHEN OTHERS THEN
    meta_onboarding := FALSE;
  END;

  INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    -- Logic: If flag is explicitly true OR if username was provided (implies distinct signup flow), set true.
    COALESCE(meta_onboarding, has_username, FALSE)
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    onboarding_completed = EXCLUDED.onboarding_completed;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
