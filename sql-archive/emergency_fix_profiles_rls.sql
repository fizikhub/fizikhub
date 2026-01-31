-- EMERGENCY FIX: Fix infinite recursion in profiles RLS

-- 1. Create a secure function to check if user is admin
-- This bypasses RLS to avoid recursion when querying the profiles table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- 3. Re-create policies using the secure function
CREATE POLICY "Admins can view all profiles"
    ON profiles
    FOR SELECT
    USING (
        is_admin() 
        OR 
        (SELECT email FROM auth.users WHERE id = auth.uid()) = 'barannnbozkurttb.b@gmail.com'
    );

CREATE POLICY "Admins can update all profiles"
    ON profiles
    FOR UPDATE
    USING (
        is_admin()
        OR 
        (SELECT email FROM auth.users WHERE id = auth.uid()) = 'barannnbozkurttb.b@gmail.com'
    );

-- 4. Ensure basic policies exist (just in case)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);
