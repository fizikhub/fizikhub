CREATE TABLE article_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, user_id)
);

-- RLS Policies for the new table
ALTER TABLE article_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see all approvals"
ON article_approvals FOR SELECT USING (true);

CREATE POLICY "Only valid users can insert approvals"
ON article_approvals FOR INSERT WITH CHECK (auth.uid() = user_id);
