-- Migration: AI Review System
-- Creates tables for article references, AI reviews, and reviewer notes

-- 1. Article References Table
CREATE TABLE IF NOT EXISTS article_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
    url TEXT,
    title TEXT NOT NULL,
    authors TEXT,
    publisher TEXT,
    year TEXT,
    doi TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_references_article ON article_references(article_id);

-- 2. Article AI Reviews Table
CREATE TABLE IF NOT EXISTS article_ai_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    overall_score INTEGER DEFAULT 0,
    content_accuracy JSONB DEFAULT '{}',
    grammar_check JSONB DEFAULT '{}',
    source_reliability JSONB DEFAULT '{}',
    source_content_match JSONB DEFAULT '{}',
    suggestions JSONB DEFAULT '[]',
    raw_response TEXT,
    model_used TEXT DEFAULT 'gemini-2.0-flash-lite',
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_ai_reviews_article ON article_ai_reviews(article_id);

-- 3. Article Notes Table
CREATE TABLE IF NOT EXISTS article_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'suggestion' CHECK (type IN ('correction', 'suggestion', 'question')),
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_notes_article ON article_notes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_notes_user ON article_notes(user_id);

-- RLS Policies
ALTER TABLE article_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_ai_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_notes ENABLE ROW LEVEL SECURITY;

-- References: anyone can read, authors can insert/update/delete their own
CREATE POLICY "Anyone can read references"
ON article_references FOR SELECT USING (true);

CREATE POLICY "Authors can manage references"
ON article_references FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM articles WHERE articles.id = article_id AND articles.author_id = auth.uid())
);

CREATE POLICY "Authors can update references"
ON article_references FOR UPDATE USING (
    EXISTS (SELECT 1 FROM articles WHERE articles.id = article_id AND articles.author_id = auth.uid())
);

CREATE POLICY "Authors can delete references"
ON article_references FOR DELETE USING (
    EXISTS (SELECT 1 FROM articles WHERE articles.id = article_id AND articles.author_id = auth.uid())
);

-- AI Reviews: anyone can read
CREATE POLICY "Anyone can read AI reviews"
ON article_ai_reviews FOR SELECT USING (true);

CREATE POLICY "Service can manage AI reviews"
ON article_ai_reviews FOR ALL USING (true);

-- Notes: anyone can read, authenticated users can insert
CREATE POLICY "Anyone can read notes"
ON article_notes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add notes"
ON article_notes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Note authors can update their notes"
ON article_notes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Note authors can delete their notes"
ON article_notes FOR DELETE USING (auth.uid() = user_id);
