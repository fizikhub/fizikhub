import { Database } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';

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

export async function getArticles(
    supabase: SupabaseClient<Database>,
    options: { status?: string | null; authorRole?: 'admin' | 'all'; fields?: string; limit?: number } = { status: 'published', authorRole: 'all' }
) {
    // Default to all fields if not specified, but for homepage we will want to restrict this
    const selectFields = options.fields || '*, author:profiles!articles_author_id_fkey(*)';

    let query = supabase
        .from('articles')
        .select(selectFields)
        .order('created_at', { ascending: false });

    if (options.status) {
        query = query.eq('status', options.status);
    }

    if (options.authorRole === 'admin') {
        query = query.eq('author.role', 'admin');
    }

    if (options.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching articles:', JSON.stringify(error, null, 2));
        return [];
    }

    return data as Article[];
}

export async function getArticleBySlug(supabase: SupabaseClient<Database>, slug: string) {
    // First try to find by slug
    const { data, error } = await supabase
        .from('articles')
        .select('*, author:profiles!articles_author_id_fkey(*)')
        .eq('slug', slug)
        .maybeSingle();

    if (data) {
        return data as Article;
    }

    // If not found and slug looks like a numeric ID, try to find by ID
    // This handles cases where we link to /blog/[id] instead of /blog/[slug]
    if (/^\d+$/.test(slug)) {
        const { data: byId } = await supabase
            .from('articles')
            .select('*, author:profiles!articles_author_id_fkey(*)')
            .eq('id', parseInt(slug))
            .maybeSingle();

        if (byId) {
            return byId as Article;
        }
    }

    if (error) {
        console.error('Error fetching article:', JSON.stringify(error, null, 2));
    }

    return null;
}

export async function getQuestions(supabase: SupabaseClient<Database>) {
    const { data, error } = await supabase
        .from('questions')
        .select('*, author:profiles(*)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching questions:', error);
        return [];
    }

    return data as Question[];
}

export async function getDictionaryTerms(supabase: SupabaseClient<Database>) {
    const { data, error } = await supabase
        .from('dictionary_terms')
        .select('*')
        .order('term', { ascending: true });

    if (error) {
        console.error('Error fetching dictionary terms:', JSON.stringify(error, null, 2));
        return [];
    }

    return data as DictionaryTerm[];
}
