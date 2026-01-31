-- RLS Policy verification and updates for admin delete operations
-- Run this in Supabase SQL Editor to ensure admins can delete content

-- Articles: Allow admin delete
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'articles' AND policyname = 'Adminler makale silebilir'
    ) THEN
        CREATE POLICY "Adminler makale silebilir"
            ON public.articles
            FOR DELETE
            USING (
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
    END IF;
END $$;

-- Questions: Allow admin delete
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'questions' AND policyname = 'Adminler soru silebilir'
    ) THEN
        CREATE POLICY "Adminler soru silebilir"
            ON public.questions
            FOR DELETE
            USING (
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
    END IF;
END $$;

-- Answers: Allow admin delete
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'answers' AND policyname = 'Adminler cevap silebilir'
    ) THEN
        CREATE POLICY "Adminler cevap silebilir"
            ON public.answers
            FOR DELETE
            USING (
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
    END IF;
END $$;

-- Note: dictionary_terms delete policy was already created in supabase_dictionary_migration.sql
