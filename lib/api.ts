import { Database } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { createStaticClient } from './supabase-server';
import { CURATED_DICTIONARY_TERMS } from './dictionary-defaults';
import { slugify } from './slug';


export type Article = Database['public']['Tables']['articles']['Row'] & {
    author?: Database['public']['Tables']['profiles']['Row'] | null;
    summary?: string | null;
    is_featured?: boolean;
    views?: number;
    profiles?: Database['public']['Tables']['profiles']['Row'] | null; // Alias for author in some queries
    cover_url?: string | null;
    status?: string | null;
};

export type Question = Database['public']['Tables']['questions']['Row'] & {
    author?: Database['public']['Tables']['profiles']['Row'] | null;
};

export type DictionaryTerm = Database['public']['Tables']['dictionary_terms']['Row'];

function mergeDictionaryTerms(remoteTerms: DictionaryTerm[]) {
    const termsBySlug = new Map<string, DictionaryTerm>();

    for (const term of CURATED_DICTIONARY_TERMS) {
        termsBySlug.set(slugify(term.term), term);
    }

    for (const term of remoteTerms) {
        const slug = slugify(term.term);
        if (!termsBySlug.has(slug)) {
            termsBySlug.set(slug, term);
        }
    }

    return Array.from(termsBySlug.values()).sort((a, b) =>
        a.term.localeCompare(b.term, 'tr'),
    );
}

export const getArticles = cache(async function (
    _supabase: SupabaseClient<Database>, // Kept for backwards compatibility but ignored
    options: { status?: string | null; authorRole?: 'admin' | 'all'; fields?: string; limit?: number } = { status: 'published', authorRole: 'all' }
) {
    const fetchCached = unstable_cache(
        async () => {
            const staticClient = createStaticClient();
            const selectFields = options.fields || '*, author:profiles!articles_author_id_fkey(*)';

            let query = staticClient
                .from('articles')
                .select(selectFields)
                .order('created_at', { ascending: false });

            if (options.status) query = query.eq('status', options.status);
            if (options.authorRole === 'admin') query = query.eq('author.role', 'admin');
            if (options.limit) query = query.limit(options.limit);

            const { data, error } = await query;
            if (error) {
                console.error('Error fetching articles:', JSON.stringify(error, null, 2));
                return [];
            }
            return data as unknown as Article[];
        },
        [`articles-${JSON.stringify(options)}`],
        { revalidate: 600, tags: ['articles'] } // 10 minutes cache
    );

    return await fetchCached();
});


export const getArticleBySlug = cache(async function (_supabase: SupabaseClient<Database>, slug: string) {
    
    const fetchCached = unstable_cache(
        async (querySlug: string) => {
            const staticClient = createStaticClient();
            
            // First try to find by slug
            const { data, error } = await staticClient
                .from('articles')
                .select('*, author:profiles!articles_author_id_fkey(*)')
                .eq('slug', querySlug)
                .maybeSingle();

            if (data) return data as unknown as Article;

            // If not found and slug looks like a numeric ID, try to find by ID
            if (/^\d+$/.test(querySlug)) {
                const { data: byId } = await staticClient
                    .from('articles')
                    .select('*, author:profiles!articles_author_id_fkey(*)')
                    .eq('id', parseInt(querySlug))
                    .maybeSingle();

                if (byId) return byId as unknown as Article;
            }

            if (error) console.error('Error fetching article:', JSON.stringify(error, null, 2));
            return null;
        },
        [`article-${slug}`],
        { revalidate: 600, tags: ['articles', `article-${slug}`] } // 10 minutes cache
    );

    return await fetchCached(slug);
});


export const getQuestions = cache(async function (_supabase: SupabaseClient<Database>, options?: { limit?: number }) {
    const fetchCached = unstable_cache(
        async () => {
            const staticClient = createStaticClient();
            const { data, error } = await staticClient
                .from('questions')
                .select('*, author:profiles(*)')
                .order('created_at', { ascending: false })
                .limit(options?.limit || 50);

            if (error) {
                console.error('Error fetching questions:', error);
                return [];
            }
            return data as Question[];
        },
        [`questions-${options?.limit || 50}`],
        { revalidate: 60, tags: ['questions'] } // 1 minute cache for fresh forum data
    );

    return await fetchCached();
});


export const getDictionaryTerms = cache(async function (_supabase: SupabaseClient<Database>) {
    const fetchCached = unstable_cache(
        async () => {
            const staticClient = createStaticClient();
            const { data, error } = await staticClient
                .from('dictionary_terms')
                .select('*')
                .order('term', { ascending: true });

            if (error) {
                console.error('Error fetching dictionary terms:', JSON.stringify(error, null, 2));
                return CURATED_DICTIONARY_TERMS;
            }
            return mergeDictionaryTerms(data as DictionaryTerm[]);
        },
        ['dictionary_terms'],
        { revalidate: 3600, tags: ['dictionary'] } // 1 hour cache since terms rarely change
    );

    return await fetchCached();
});
