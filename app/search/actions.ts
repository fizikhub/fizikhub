"use server";

import { createClient } from "@/lib/supabase-server";

export type SearchResult = {
    type: 'question' | 'article' | 'user';
    id: string | number;
    title: string;
    description?: string;
    url: string;
    image?: string;
};

export async function searchGlobal(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];

    const supabase = await createClient();
    const searchTerm = `%${query}%`;

    const results: SearchResult[] = [];

    // 1. Search Questions
    const { data: questions } = await supabase
        .from('questions')
        .select('id, title, content, category')
        .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(5);

    if (questions) {
        questions.forEach(q => {
            results.push({
                type: 'question',
                id: q.id,
                title: q.title,
                description: q.content.substring(0, 60) + '...',
                url: `/forum/soru/${q.id}`,
                image: undefined // Could use category icon
            });
        });
    }

    // 2. Search Articles
    const { data: articles } = await supabase
        .from('articles')
        .select('id, title, content, slug, cover_image')
        .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(5);

    if (articles) {
        articles.forEach(a => {
            results.push({
                type: 'article',
                id: a.id,
                title: a.title,
                description: a.content.substring(0, 60) + '...',
                url: `/blog/${a.id}`, // Or slug if implemented
                image: a.cover_image
            });
        });
    }

    // 3. Search Users
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .or(`username.ilike.${searchTerm},full_name.ilike.${searchTerm}`)
        .limit(5);

    if (profiles) {
        profiles.forEach(p => {
            results.push({
                type: 'user',
                id: p.id,
                title: p.full_name || p.username,
                description: `@${p.username}`,
                url: `/kullanici/${p.username}`,
                image: p.avatar_url || undefined
            });
        });
    }

    return results;
}
