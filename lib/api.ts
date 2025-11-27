import { Database } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';

export type Article = Database['public']['Tables']['articles']['Row'] & {
    author?: Database['public']['Tables']['profiles']['Row'] | null;
};

export type Question = Database['public']['Tables']['questions']['Row'] & {
    author?: Database['public']['Tables']['profiles']['Row'] | null;
};

export type DictionaryTerm = Database['public']['Tables']['dictionary_terms']['Row'];

export async function getArticles(supabase: SupabaseClient<Database>) {
    const { data, error } = await supabase
        .from('articles')
        .select('*, author:profiles(*)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching articles:', error);
        return [];
    }

    return data as Article[];
}

export async function getArticleBySlug(supabase: SupabaseClient<Database>, slug: string) {
    const { data, error } = await supabase
        .from('articles')
        .select('*, author:profiles(*)')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching article:', error);
        return null;
    }

    return data as Article;
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
