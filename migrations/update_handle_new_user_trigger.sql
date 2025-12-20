-- Update handle_new_user to respect onboarding_completed in metadata
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
    -- Use metadata value if present (cast to boolean), otherwise default to FALSE
    COALESCE((NEW.raw_user_meta_data->>'onboarding_completed')::boolean, FALSE)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
