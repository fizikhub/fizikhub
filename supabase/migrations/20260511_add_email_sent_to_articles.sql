-- Add email_sent boolean to articles table
ALTER TABLE articles
ADD COLUMN email_sent boolean NOT NULL DEFAULT false;

-- Add a comment
COMMENT ON COLUMN articles.email_sent IS 'Indicates whether an email notification has been manually sent for this article.';
