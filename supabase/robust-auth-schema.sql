-- ==========================================
-- FizikHub Auth & Profile Robustness Script
-- ==========================================
-- This script ensures the profiles table is correctly structured
-- and that new users are automatically added to the profiles table.
--
-- RUN THIS IN THE SUPABASE SQL EDITOR
-- ==========================================

-- 1. Ensure profiles table has the right columns
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[],
  has_seen_onboarding BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Setup RLS Policies
-- Profiles are viewable by everyone
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone.' AND tablename = 'profiles') THEN
        CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
          FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile.' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can insert their own profile." ON public.profiles
          FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile.' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can update own profile." ON public.profiles
          FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- 4. Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'username'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- 5. Trigger to call handle_new_user on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. (Optional) Sync existing users to profiles if missing
INSERT INTO public.profiles (id, full_name, username)
SELECT 
    id, 
    raw_user_meta_data->>'full_name', 
    raw_user_meta_data->>'username'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
