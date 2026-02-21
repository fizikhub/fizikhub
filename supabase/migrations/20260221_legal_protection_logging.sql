-- Add legal logging and moderation columns to content tables
-- Tables: questions, answers, answer_comments, messages, article_likes

-- 1. QUESTIONS
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS author_ip inet;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS user_agent text;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS is_flagged boolean DEFAULT false;

-- 2. ANSWERS
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS author_ip inet;
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS user_agent text;
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS is_flagged boolean DEFAULT false;

-- 3. ANSWER COMMENTS
ALTER TABLE public.answer_comments ADD COLUMN IF NOT EXISTS author_ip inet;
ALTER TABLE public.answer_comments ADD COLUMN IF NOT EXISTS user_agent text;
ALTER TABLE public.answer_comments ADD COLUMN IF NOT EXISTS is_flagged boolean DEFAULT false;

-- 4. MESSAGES
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS author_ip inet;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS user_agent text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_flagged boolean DEFAULT false;

-- 5. ARTICLE LIKES
ALTER TABLE public.article_likes ADD COLUMN IF NOT EXISTS author_ip inet;
ALTER TABLE public.article_likes ADD COLUMN IF NOT EXISTS user_agent text;

-- Create an index for faster lookups by IP (useful for investigating spam/abuse)
CREATE INDEX IF NOT EXISTS idx_questions_ip ON public.questions(author_ip);
CREATE INDEX IF NOT EXISTS idx_answers_ip ON public.answers(author_ip);
CREATE INDEX IF NOT EXISTS idx_messages_ip ON public.messages(author_ip);
