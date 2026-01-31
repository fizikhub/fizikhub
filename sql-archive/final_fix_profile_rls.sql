-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Create comprehensive policies

-- 1. VIEW: Everyone can see profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- 2. INSERT: Users can insert their own profile (usually handled by trigger, but good for safety)
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 3. UPDATE: Users can update their own profile
-- This is the critical one for the "Edit Profile" feature
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. ADMIN: Admins can do everything (optional, but good for management)
-- Assuming admin check is done via email or a specific claim/role
-- For now, let's stick to the basic user permissions to be safe and simple.
-- If you have an admin system, add it here.

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON profiles TO anon;
