-- Update RLS policies for questions table to allow admin deletion

-- Drop existing delete policy if it exists (to be safe)
DROP POLICY IF EXISTS "Users can delete own questions" ON questions;
DROP POLICY IF EXISTS "Admins can delete any question" ON questions;
DROP POLICY IF EXISTS "Users can delete own questions or admin can delete all" ON questions;

-- Create a comprehensive delete policy
CREATE POLICY "Users can delete own questions or admin can delete all"
    ON questions FOR DELETE
    USING (
        auth.uid() = author_id
        OR
        (select auth.jwt() ->> 'email') = 'barannnbozkurttb.b@gmail.com'
    );

SELECT 'Question delete policy updated successfully!' as message;
