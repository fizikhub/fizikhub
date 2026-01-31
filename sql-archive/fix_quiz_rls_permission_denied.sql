-- Drop potentially existing broken policies first to avoid conflicts
DROP POLICY IF EXISTS "Admins can insert quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Admins can update quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Admins can delete quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Admins can insert questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Admins can delete questions" ON public.quiz_questions;

-- Allow admins to insert quizzes
CREATE POLICY "Admins can insert quizzes"
    ON public.quizzes
    FOR INSERT
    WITH CHECK (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
        OR
        (auth.jwt() ->> 'email') = 'barannnbozkurttb.b@gmail.com'
    );

-- Allow admins to update quizzes
CREATE POLICY "Admins can update quizzes"
    ON public.quizzes
    FOR UPDATE
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
        OR
        (auth.jwt() ->> 'email') = 'barannnbozkurttb.b@gmail.com'
    );

-- Allow admins to delete quizzes
CREATE POLICY "Admins can delete quizzes"
    ON public.quizzes
    FOR DELETE
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
        OR
        (auth.jwt() ->> 'email') = 'barannnbozkurttb.b@gmail.com'
    );

-- Allow admins to insert questions
CREATE POLICY "Admins can insert questions"
    ON public.quiz_questions
    FOR INSERT
    WITH CHECK (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
        OR
        (auth.jwt() ->> 'email') = 'barannnbozkurttb.b@gmail.com'
    );

-- Allow admins to update questions
CREATE POLICY "Admins can update questions"
    ON public.quiz_questions
    FOR UPDATE
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
        OR
        (auth.jwt() ->> 'email') = 'barannnbozkurttb.b@gmail.com'
    );

-- Allow admins to delete questions
CREATE POLICY "Admins can delete questions"
    ON public.quiz_questions
    FOR DELETE
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
        OR
        (auth.jwt() ->> 'email') = 'barannnbozkurttb.b@gmail.com'
    );
