-- DEFINITIVE FIX FOR PROFILE UPDATES
-- This script resets all policies on the profiles table to ensure users can update their own data.

-- 1. Enable RLS (idempotent)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to remove conflicts/recursion
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- 3. Create Simple, Non-Recursive Policies

-- VIEW: Everyone can see all profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- INSERT: Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- UPDATE: Users can update their own profile
-- This is the most critical policy for the "Edit Profile" feature.
-- We explicitly check if the user ID matches the auth ID.
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. Grant Permissions
-- Ensure the authenticated role has permission to modify the table
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- 5. Verify/Fix updated_at trigger (Optional but good practice)
-- Ensure the function exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists to avoid duplication error
DROP TRIGGER IF EXISTS set_updated_at ON profiles;

-- Create trigger
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
