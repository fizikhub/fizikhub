-- Enable pgvector extension
create extension if not exists vector;

-- Create a unified documents table for search
-- This table will store embeddings for questions, articles, etc.
-- You should create a trigger or background job to sync this table with your main tables.
create table if not exists documents (
  id bigserial primary key,
  content text, -- Combined text (title + body)
  metadata jsonb, -- { "title": "...", "source_id": "...", "source_type": "article" }
  embedding vector(768) -- text-embedding-004 dimension
);

-- Function to match documents
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

-- EXAMPLE: How to insert data (you need to generate embeddings first via API and insert here)
-- insert into documents (content, metadata, embedding) values ('Hello World', '{"type": "test"}', '[0.1, 0.2, ...]');
