-- Create user_activity_logs table
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL, -- 'PAGE_VIEW', 'LOGIN', 'CLICK', etc.
    path TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add last_seen to profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_seen') THEN
        ALTER TABLE public.profiles ADD COLUMN last_seen TIMESTAMPTZ;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own logs
CREATE POLICY "Users can insert their own activity logs"
    ON public.user_activity_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all logs
CREATE POLICY "Admins can view all activity logs"
    ON public.user_activity_logs
    FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
        OR
        (auth.jwt() ->> 'email') = 'barannnbozkurttb.b@gmail.com'
    );

-- Index for faster querying by user and time
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created ON public.user_activity_logs(user_id, created_at DESC);
