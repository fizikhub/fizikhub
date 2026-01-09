-- Ultra Performance Optimization Script for Fizikhub
-- Run this in the Supabase SQL Editor

-- 1. Enable Extensions for Advanced Search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. optimize "Feed" Queries (The most frequent query)
-- Articles Feed: usually filters by status='published' and sorts by created_at desc
CREATE INDEX IF NOT EXISTS idx_articles_feed_composite 
ON articles(status, created_at DESC);

-- Questions Feed: sorts by created_at desc
CREATE INDEX IF NOT EXISTS idx_questions_feed_sort 
ON questions(created_at DESC);

-- 3. Advanced Text Search (Fuzzy Search / "Did you mean?")
-- GIN Trigram indexes allow "ILIKE '%term%'" to be instant.

-- Articles Title & Content
CREATE INDEX IF NOT EXISTS idx_articles_title_trgm 
ON articles USING gin (title gin_trgm_ops);

-- Questions Title
CREATE INDEX IF NOT EXISTS idx_questions_title_trgm 
ON questions USING gin (title gin_trgm_ops);

-- Profile Search (Username & Fullname)
CREATE INDEX IF NOT EXISTS idx_profiles_username_trgm 
ON profiles USING gin (username gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_profiles_fullname_trgm 
ON profiles USING gin (full_name gin_trgm_ops);

-- 4. Foreign Key optimizations (Speed up joins)
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_author_id ON questions(author_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_author_id ON answers(author_id);

-- 5. COUNTER CACHE TRIGGERS (Massive Read Performance Boost)
-- Instead of counting `select count(*) from likes` every time a card is shown,
-- we maintain a `likes_count` column on the article/question row.

-- A) Articles Likes
-- First, ensure column exists
ALTER TABLE articles ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Function to handle like changes
CREATE OR REPLACE FUNCTION update_article_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE articles SET likes_count = likes_count + 1 WHERE id = NEW.article_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE articles SET likes_count = likes_count - 1 WHERE id = OLD.article_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS trg_update_article_likes_count ON article_likes;
CREATE TRIGGER trg_update_article_likes_count
AFTER INSERT OR DELETE ON article_likes
FOR EACH ROW EXECUTE FUNCTION update_article_likes_count();

-- B) Article Comments
ALTER TABLE articles ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION update_article_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE articles SET comments_count = comments_count + 1 WHERE id = NEW.article_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE articles SET comments_count = comments_count - 1 WHERE id = OLD.article_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_article_comments_count ON article_comments;
CREATE TRIGGER trg_update_article_comments_count
AFTER INSERT OR DELETE ON article_comments
FOR EACH ROW EXECUTE FUNCTION update_article_comments_count();

-- C) Question Answers
ALTER TABLE questions ADD COLUMN IF NOT EXISTS answers_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION update_question_answers_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE questions SET answers_count = answers_count + 1 WHERE id = NEW.question_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE questions SET answers_count = answers_count - 1 WHERE id = OLD.question_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_question_answers_count ON answers;
CREATE TRIGGER trg_update_question_answers_count
AFTER INSERT OR DELETE ON answers
FOR EACH ROW EXECUTE FUNCTION update_question_answers_count();

-- 6. Recalculate existing counts once (Fixes any sync issues)
UPDATE articles a SET likes_count = (SELECT count(*) FROM article_likes WHERE article_id = a.id);
UPDATE articles a SET comments_count = (SELECT count(*) FROM article_comments WHERE article_id = a.id);
UPDATE questions q SET answers_count = (SELECT count(*) FROM answers WHERE question_id = q.id);

SELECT 'Optimization Complete: Indexes + Search + Counter Triggers Applied!' as status;
