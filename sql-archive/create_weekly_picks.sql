-- Create weekly_picks table
CREATE TABLE IF NOT EXISTS public.weekly_picks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id BIGINT REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    week_start_date DATE DEFAULT CURRENT_DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.weekly_picks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Weekly picks are viewable by everyone" ON public.weekly_picks
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert weekly picks" ON public.weekly_picks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update weekly picks" ON public.weekly_picks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
