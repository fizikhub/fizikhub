import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase-server';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fizikhub.com';

    // Static pages with all important routes
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
        {
            url: `${baseUrl}/sozluk`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/testler`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/simulasyonlar`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/siralamalar`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/hakkimizda`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/iletisim`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/gizlilik-politikasi`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${baseUrl}/kullanim-sartlari`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.2,
        },
    ];

    // Fetch all data in parallel for speed
    const [questionsResult, articlesResult, profilesResult, termsResult, quizzesResult, simulationsResult] = await Promise.all([
        supabase
            .from('questions')
            .select('id, updated_at')
            .order('created_at', { ascending: false })
            .limit(1000),

        supabase
            .from('articles')
            .select('slug, updated_at, category')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(1000),

        supabase
            .from('profiles')
            .select('username, updated_at')
            .not('username', 'is', null)
            .order('created_at', { ascending: false })
            .limit(500),

        supabase
            .from('dictionary_terms')
            .select('slug, updated_at')
            .order('created_at', { ascending: false })
            .limit(500),

        supabase
            .from('quizzes')
            .select('slug, updated_at')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(200),
            .limit(200),

        supabase
            .from('simulations')
            .select('slug, updated_at')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(100),
    ]);

    const questionPages: MetadataRoute.Sitemap = (questionsResult.data || []).map((question) => ({
        url: `${baseUrl}/forum/${question.id}`,
        lastModified: new Date(question.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const articlePages: MetadataRoute.Sitemap = (articlesResult.data || []).map((article) => {
        // Differentiate between blog posts, experiments, and book reviews by category
        let urlPrefix = 'blog';
        if (article.category === 'Deney') urlPrefix = 'deney';
        else if (article.category === 'Kitap İncelemesi') urlPrefix = 'kitap-inceleme';

        return {
            url: `${baseUrl}/${urlPrefix}/${article.slug}`,
            lastModified: new Date(article.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        };
    });

    const profilePages: MetadataRoute.Sitemap = (profilesResult.data || []).map((profile) => ({
        url: `${baseUrl}/kullanici/${profile.username}`,
        lastModified: new Date(profile.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    const termPages: MetadataRoute.Sitemap = (termsResult.data || []).map((term) => ({
        url: `${baseUrl}/sozluk/${term.slug}`,
        lastModified: new Date(term.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    const quizPages: MetadataRoute.Sitemap = (quizzesResult.data || []).map((quiz) => ({
        url: `${baseUrl}/testler/${quiz.slug}`,
        lastModified: new Date(quiz.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    return [
        ...staticPages,
        ...questionPages,
        ...articlePages,
        ...profilePages,
        ...termPages,
        ...quizPages,
        ...simulationPages,
    ];
}
