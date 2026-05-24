import { Database } from '@/types/database';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { createStaticClient } from './supabase-server';
import { CURATED_DICTIONARY_TERMS } from './dictionary-defaults';
import { slugify } from './slug';
import { redisCache } from './upstash';

// ─── Base Types ─────────────────────────────────────────────────────────────

export type Article = Database['public']['Tables']['articles']['Row'] & {
    author?: Database['public']['Tables']['profiles']['Row'] | null;
    summary?: string | null;
    is_featured?: boolean;
    views?: number;
    profiles?: Database['public']['Tables']['profiles']['Row'] | null; // Alias for author in some queries
    cover_url?: string | null;
    status?: string | null;
    updated_at?: string | null;
};

export type Question = Database['public']['Tables']['questions']['Row'] & {
    author?: Database['public']['Tables']['profiles']['Row'] | null;
};

export type DictionaryTerm = Database['public']['Tables']['dictionary_terms']['Row'];

const PUBLIC_AUTHOR_SELECT = [
    'id',
    'username',
    'full_name',
    'avatar_url',
    'bio',
    'is_writer',
    'is_verified',
].join(', ');

const PUBLIC_ARTICLE_SELECT = [
    '*',
    `author:profiles!articles_author_id_fkey(${PUBLIC_AUTHOR_SELECT})`,
].join(', ');

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

// ─── Core Caching Logic (DRY Implementation) ───────────────────────────────

/**
 * Generic Double-Layer Cache Wrapper
 * Combines L1 (Upstash Redis) and L2 (Next.js unstable_cache) seamlessly.
 */
async function withHybridCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: {
        redisTtl: number;
        nextRevalidate: number;
        tags: string[];
    }
): Promise<T> {
    const redisCacheKey = `fh:${key}`;

    // L1: Check Redis first (edge-compatible, survives redeployments)
    const cached = await redisCache.get<T>(redisCacheKey);
    if (cached) return cached;

    // L2: Next.js unstable_cache (per-instance, request-deduped)
    const fetchCached = unstable_cache(
        async () => {
            try {
                return await fetcher();
            } catch (error) {
                console.error(`[Cache Error] Failed to fetch data for key ${key}:`, error);
                throw error;
            }
        },
        [key],
        { revalidate: options.nextRevalidate, tags: options.tags }
    );

    const result = await fetchCached();

    // Populate Redis L1 for subsequent requests
    if (result && (Array.isArray(result) ? result.length > 0 : true)) {
        redisCache.set(redisCacheKey, result, options.redisTtl).catch(() => {
            // Silently fail Redis sets to not block the request
        });
    }

    return result;
}

// ─── API Methods ────────────────────────────────────────────────────────────

export const getArticles = cache(async function (
    options: { status?: string | null; authorRole?: 'admin' | 'all'; fields?: string; limit?: number } = { status: 'published', authorRole: 'all' }
): Promise<Article[]> {
    const key = `articles:${JSON.stringify(options)}`;
    
    return withHybridCache<Article[]>(
        key,
        async () => {
            const staticClient = createStaticClient();
            const selectFields = options.fields || PUBLIC_ARTICLE_SELECT;

            let query = staticClient
                .from('articles')
                .select(selectFields)
                .order('created_at', { ascending: false });

            if (options.status) query = query.eq('status', options.status);
            if (options.authorRole === 'admin') query = query.eq('author.role', 'admin');
            if (options.limit) query = query.limit(options.limit);

            const { data, error } = await query;
            if (error) throw error;
            
            // Still using type assertion due to Supabase nested relational types complexity,
            // but wrapped safely in the try-catch of HybridCache.
            return (data || []) as unknown as Article[];
        },
        { redisTtl: 300, nextRevalidate: 600, tags: ['articles'] }
    ).catch(() => []);
});

export const getArticleBySlug = cache(async function (slug: string): Promise<Article | null> {
    const key = `article:${slug}`;
    
    return withHybridCache<Article | null>(
        key,
        async () => {
            const staticClient = createStaticClient();
            
            // First try to find by slug
            const { data, error } = await staticClient
                .from('articles')
                .select(PUBLIC_ARTICLE_SELECT)
                .eq('slug', slug)
                .eq('status', 'published')
                .maybeSingle();

            if (data) return data as unknown as Article;

            // If not found and slug looks like a numeric ID, try to find by ID
            if (/^\d+$/.test(slug)) {
                const { data: byId, error: byIdError } = await staticClient
                    .from('articles')
                    .select(PUBLIC_ARTICLE_SELECT)
                    .eq('id', parseInt(slug))
                    .eq('status', 'published')
                    .maybeSingle();

                if (byId) return byId as unknown as Article;
                if (byIdError) throw byIdError;
            }

            if (error) throw error;
            return null;
        },
        { redisTtl: 300, nextRevalidate: 600, tags: ['articles', `article-${slug}`] }
    ).catch(() => null);
});

export const getQuestions = cache(async function (options?: { limit?: number }): Promise<Question[]> {
    const key = `questions:${JSON.stringify(options)}`;
    
    return withHybridCache<Question[]>(
        key,
        async () => {
            const staticClient = createStaticClient();
            const { data, error } = await staticClient
                .from('questions')
                .select(`*, author:profiles(${PUBLIC_AUTHOR_SELECT})`)
                .eq('status', 'published')
                .order('created_at', { ascending: false })
                .limit(options?.limit || 50);

            if (error) throw error;
            return (data || []) as unknown as Question[];
        },
        { redisTtl: 30, nextRevalidate: 60, tags: ['questions'] } // Aggressive cache for fresh forum data
    ).catch(() => []);
});

export const getDictionaryTerms = cache(async function (): Promise<DictionaryTerm[]> {
    const key = 'dictionary:all';
    
    return withHybridCache<DictionaryTerm[]>(
        key,
        async () => {
            const staticClient = createStaticClient();
            const { data, error } = await staticClient
                .from('dictionary_terms')
                .select('*')
                .order('term', { ascending: true });

            if (error) throw error;
            return mergeDictionaryTerms(data as DictionaryTerm[]);
        },
        { redisTtl: 1800, nextRevalidate: 3600, tags: ['dictionary'] } // Less aggressive caching since terms rarely change
    ).catch((err) => {
        console.error('Failed to fetch dictionary terms, returning curated:', err);
        return CURATED_DICTIONARY_TERMS;
    });
});
