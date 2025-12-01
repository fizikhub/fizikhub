-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    points INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings ["Option A", "Option B", ...]
    correct_answer INTEGER NOT NULL, -- Index of the correct option (0, 1, 2, 3)
    "order" INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_quiz_attempts table
CREATE TABLE IF NOT EXISTS public.user_quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL, -- Number of correct answers
    total_questions INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS Policies
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quizzes are readable by everyone
CREATE POLICY "Quizzes are viewable by everyone" ON public.quizzes
    FOR SELECT USING (true);

-- Questions are readable by everyone
CREATE POLICY "Questions are viewable by everyone" ON public.quiz_questions
    FOR SELECT USING (true);

-- Users can insert their own attempts
CREATE POLICY "Users can insert their own attempts" ON public.user_quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own attempts
CREATE POLICY "Users can view their own attempts" ON public.user_quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

-- Insert Sample Data (Newton's Laws)
DO $$
DECLARE
    quiz_id UUID;
BEGIN
    -- Insert Quiz
    INSERT INTO public.quizzes (title, slug, description, points)
    VALUES (
        'Newton''ın Hareket Yasaları',
        'newtonin-hareket-yasalari',
        'Newton''ın üç hareket yasası hakkındaki bilginizi test edin. Kuvvet, kütle ve ivme arasındaki ilişkiyi ne kadar iyi biliyorsunuz?',
        50
    ) RETURNING id INTO quiz_id;

    -- Insert Questions
    INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer, "order")
    VALUES
    (
        quiz_id,
        'Newton''ın ikinci yasasına göre, bir cisme etki eden net kuvvet neye eşittir?',
        '["Kütle x Hız", "Kütle x İvme", "Hız / Zaman", "Kütle / Hacim"]'::jsonb,
        1,
        1
    ),
    (
        quiz_id,
        'Etki-tepki yasası hangisidir?',
        '["Birinci Yasa", "İkinci Yasa", "Üçüncü Yasa", "Yerçekimi Yasası"]'::jsonb,
        2,
        2
    ),
    (
        quiz_id,
        'Eylemsizlik yasası olarak da bilinen yasa hangisidir?',
        '["Birinci Yasa", "İkinci Yasa", "Üçüncü Yasa", "Termodinamiğin Sıfırıncı Yasası"]'::jsonb,
        0,
        3
    ),
    (
        quiz_id,
        '10 kg kütleli bir cisme 50 N kuvvet uygulanırsa ivmesi kaç m/s² olur? (Sürtünme yok)',
        '["0.2", "5", "50", "500"]'::jsonb,
        1,
        4
    ),
    (
        quiz_id,
        'Aşağıdakilerden hangisi vektörel bir büyüklüktür?',
        '["Kütle", "Zaman", "Sıcaklık", "Kuvvet"]'::jsonb,
        3,
        5
    );
END $$;

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
