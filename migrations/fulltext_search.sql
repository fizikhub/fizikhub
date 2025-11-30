-- Full-Text Search Migration
-- Add search capabilities for Turkish language

-- ==========================================
-- ARTICLES FULL-TEXT SEARCH
-- ==========================================

-- Add search vector column
ALTER TABLE articles ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create Turkish text search configuration (use simple for now, Turkish config must be installed separately)
-- Update search vector for articles
CREATE OR REPLACE FUNCTION articles_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.content, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS articles_search_update ON articles;
CREATE TRIGGER articles_search_update
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION articles_search_trigger();

-- Update existing articles
UPDATE articles SET search_vector =
  setweight(to_tsvector('simple', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(content, '')), 'B') ||
  setweight(to_tsvector('simple', COALESCE(category, '')), 'C');

-- Create GIN index for fast search
CREATE INDEX IF NOT EXISTS articles_search_idx ON articles USING GIN(search_vector);

-- ==========================================
-- QUESTIONS FULL-TEXT SEARCH
-- ==========================================

-- Add search vector column
ALTER TABLE questions ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create search trigger
CREATE OR REPLACE FUNCTION questions_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.content, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS questions_search_update ON questions;
CREATE TRIGGER questions_search_update
  BEFORE INSERT OR UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION questions_search_trigger();

-- Update existing questions
UPDATE questions SET search_vector =
  setweight(to_tsvector('simple', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(content, '')), 'B') ||
  setweight(to_tsvector('simple', COALESCE(category, '')), 'C');

-- Create GIN index for fast search
CREATE INDEX IF NOT EXISTS questions_search_idx ON questions USING GIN(search_vector);

-- ==========================================
-- SEARCH HELPER FUNCTION
-- ==========================================

-- Function to search articles
CREATE OR REPLACE FUNCTION search_articles(search_query text)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  content TEXT,
  slug TEXT,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.content,
    a.slug,
    ts_rank(a.search_vector, plainto_tsquery('simple', search_query)) AS relevance
  FROM articles a
  WHERE a.search_vector @@ plainto_tsquery('simple', search_query)
    AND a.status = 'published'
  ORDER BY relevance DESC, a.created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Function to search questions
CREATE OR REPLACE FUNCTION search_questions(search_query text)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  content TEXT,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    q.id,
    q.title,
    q.content,
    ts_rank(q.search_vector, plainto_tsquery('simple', search_query)) AS relevance
  FROM questions q
  WHERE q.search_vector @@ plainto_tsquery('simple', search_query)
  ORDER BY relevance DESC, q.created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION search_articles(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_questions(text) TO authenticated, anon;

-- Analyze tables
ANALYZE articles;
ANALYZE questions;
