"use server";

import { createClient } from "@/lib/supabase-server";
import { generateEmbedding } from "@/lib/gemini";
import { sanitizeSearchQuery } from "@/lib/security";

export type SearchResult = {
    type: 'question' | 'article' | 'user';
    id: string | number;
    title: string;
    description?: string;
    url: string;
    image?: string;
    similarity?: number;
};

export async function searchGlobal(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];

    const supabase = await createClient();
    const results: SearchResult[] = [];

    // --- STRATEGY 1: SEMANTIC SEARCH (Vector) ---
    // Try to generate embedding
    const embedding = await generateEmbedding(query);

    if (embedding) {
        // Call RPC function 'match_documents'
        // Assumes user has setup:
        // function match_documents (query_embedding vector(768), match_threshold float, match_count int)
        const { data: vectorData, error } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.5, // Customizable threshold
            match_count: 5
        });

        if (!error && vectorData && vectorData.length > 0) {
            // Map vector results
            vectorData.forEach((item: any) => {
                const type = item.source_type || 'article'; // Default if unknown
                let url = '/';
                if (type === 'question') url = `/forum/soru/${item.id}`;
                else if (type === 'article') url = `/blog/${item.id}`; // using ID, or slug if available in item logic
                else if (type === 'user') url = `/kullanici/${item.username}`;

                // Avoid duplicates if we combine lists, but for now let's prioritize vector results
                results.push({
                    type: type as any,
                    id: item.id,
                    title: item.title,
                    description: item.content?.substring(0, 100) + '...',
                    url: url,
                    image: item.cover_image,
                    similarity: item.similarity
                });
            });

            // If we got good semantic results, we might return here or blend.
            // For this implementation, let's Append text search results to ensure specific keywords aren't missed.
        }
    }

    // --- STRATEGY 2: KEYWORD SEARCH (Fallback/Augment) ---
    const sanitized = sanitizeSearchQuery(query);
    const searchTerm = `%${sanitized}%`;

    // 1. Search Questions
    const { data: questions } = await supabase
        .from('questions')
        .select('id, title, content, category')
        .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(3);

    if (questions) {
        questions.forEach(q => {
            if (!results.find(r => r.type === 'question' && r.id === q.id)) { // Dedup
                results.push({
                    type: 'question',
                    id: q.id,
                    title: q.title,
                    description: q.content.substring(0, 60) + '...',
                    url: `/forum/soru/${q.id}`,
                    image: undefined
                });
            }
        });
    }

    // 2. Search Articles
    const { data: articles } = await supabase
        .from('articles')
        .select('id, title, content, slug, cover_image')
        .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(3);

    if (articles) {
        articles.forEach(a => {
            if (!results.find(r => r.type === 'article' && r.id === a.id)) { // Dedup
                results.push({
                    type: 'article',
                    id: a.id,
                    title: a.title,
                    description: a.content.substring(0, 60) + '...',
                    url: `/blog/${a.id}`,
                    image: a.cover_image
                });
            }
        });
    }

    // 3. Search Users
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .or(`username.ilike.${searchTerm},full_name.ilike.${searchTerm}`)
        .limit(3);

    if (profiles) {
        profiles.forEach(p => {
            if (!results.find(r => r.type === 'user' && r.id === p.id)) { // Dedup
                results.push({
                    type: 'user',
                    id: p.id,
                    title: p.full_name || p.username,
                    description: `@${p.username}`,
                    url: `/kullanici/${p.username}`,
                    image: p.avatar_url || undefined
                });
            }
        });
    }

    return results;
}
