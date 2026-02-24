-- 1. Drop unused indexes across the database
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN 
        SELECT 
            s.indexrelname AS index_name,
            s.relname AS table_name,
            s.schemaname AS schema_name
        FROM 
            pg_stat_user_indexes s
        JOIN 
            pg_index i ON s.indexrelid = i.indexrelid
        WHERE 
            s.idx_scan = 0 
            AND i.indisunique = false 
            AND i.indisprimary = false
            AND s.schemaname = 'public'
            AND s.relname IN (
                'answer_likes', 'follows', 'stories', 'articles', 'answers', 
                'messages', 'article_bookmarks', 'notifications', 'documents', 
                'question_bookmarks', 'question_votes', 'quiz_questions', 
                'user_badges', 'user_quiz_attempts'
            )
    LOOP
        EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(r.schema_name) || '.' || quote_ident(r.index_name);
        RAISE NOTICE 'Dropped unused index % on table %', r.index_name, r.table_name;
    END LOOP;
END $$;


-- 2. Drop duplicate indexes on profiles table
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN 
        SELECT 
            indrelid::regclass AS table_name,
            array_agg(indexrelid::regclass) AS indexes,
            indkey AS columns
        FROM 
            pg_index
        WHERE 
            indrelid = 'public.profiles'::regclass
            AND indisunique = false
        GROUP BY 
            indrelid, indkey
        HAVING 
            count(*) > 1
    LOOP
        -- Keep the first index, drop the rest
        FOR i IN 2 .. array_length(r.indexes, 1)
        LOOP
            EXECUTE 'DROP INDEX IF EXISTS ' || r.indexes[i];
            RAISE NOTICE 'Dropped duplicate index % on table % for columns %', r.indexes[i], r.table_name, r.columns;
        END LOOP;
    END LOOP;
END $$;


-- 3. Fix Multiple Permissive Policies on stories and story_groups
-- Drop all existing policies to recreate them cleanly
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    -- For stories
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'stories' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.stories', pol.policyname);
    END LOOP;
    
    -- For story_groups
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'story_groups' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.story_groups', pol.policyname);
    END LOOP;
END $$;

-- Recreate single, consolidated policies for stories
CREATE POLICY "Stories are viewable by everyone" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Users can insert their own stories" ON public.stories FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own stories" ON public.stories FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own stories" ON public.stories FOR DELETE USING (auth.uid() = author_id);

-- Recreate single, consolidated policies for story_groups (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'story_groups') THEN
        CREATE POLICY "Story groups are viewable by everyone" ON public.story_groups FOR SELECT USING (true);
        CREATE POLICY "Users can insert their own story groups" ON public.story_groups FOR INSERT WITH CHECK (auth.uid() = owner_id);
        CREATE POLICY "Users can update their own story groups" ON public.story_groups FOR UPDATE USING (auth.uid() = owner_id);
        CREATE POLICY "Users can delete their own story groups" ON public.story_groups FOR DELETE USING (auth.uid() = owner_id);
    END IF;
END $$;


-- 4. Add targeted missing indexes for slow queries (articles and questions are slow)
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_author_id ON public.questions(author_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON public.user_quiz_attempts(user_id);

-- Explicitly drop specific duplicate index on profiles if known (id vs primary key)
DROP INDEX IF EXISTS public.profiles_id_idx;
