import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase-server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fizikhub.com';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/forum`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ];

    // Fetch all questions
    const { data: questions } = await supabase
        .from('questions')
        .select('id, updated_at')
        .order('created_at', { ascending: false });

    const questionPages: MetadataRoute.Sitemap = (questions || []).map((question) => ({
        url: `${baseUrl}/forum/${question.id}`,
        lastModified: new Date(question.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Fetch all articles
    const { data: articles } = await supabase
        .from('articles')
        .select('slug, updated_at')
        .order('created_at', { ascending: false });

    const articlePages: MetadataRoute.Sitemap = (articles || []).map((article) => ({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // Fetch all profiles (only verified or active users)
    const { data: profiles } = await supabase
        .from('profiles')
        .select('username, updated_at')
        .not('username', 'is', null)
        .order('created_at', { ascending: false });

    const profilePages: MetadataRoute.Sitemap = (profiles || []).map((profile) => ({
        url: `${baseUrl}/kullanici/${profile.username}`,
        lastModified: new Date(profile.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...questionPages, ...articlePages, ...profilePages];
}
