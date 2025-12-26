-- Create writer_applications table
CREATE TABLE IF NOT EXISTS public.writer_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    university TEXT,
    phone TEXT,
    interest_area TEXT,
    menemen_preference TEXT, -- "soganli" | "sogansiz"
    email TEXT NOT NULL,
    experience TEXT, -- "yes" | "no"
    about TEXT, -- "Daha önce nerede yazdınız?" details
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.writer_applications ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can insert their own application
CREATE POLICY "Users can insert their own application"
ON public.writer_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view their own application
CREATE POLICY "Users can view their own application"
ON public.writer_applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
ON public.writer_applications
FOR SELECT
TO authenticated
USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Admins can update applications (to approve/reject)
CREATE POLICY "Admins can update applications"
ON public.writer_applications
FOR UPDATE
TO authenticated
USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);
