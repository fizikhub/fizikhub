import { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase-static';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createStaticClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.fizikhub.com';

    // Base date for static pages to avoid continuous invalidation
    const staticDate = new Date('2024-05-01').toISOString();

    // Static pages with all important routes
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: staticDate,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/forum`,
            lastModified: staticDate,
            changeFrequency: 'hourly',
            priority: 0.9,
        },

        {
            url: `${baseUrl}/makale`,
            lastModified: staticDate,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/sozluk`,
            lastModified: staticDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/testler`,
            lastModified: staticDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/simulasyonlar`,
            lastModified: staticDate,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/siralamalar`,
            lastModified: staticDate,
            changeFrequency: 'daily',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/hakkimizda`,
            lastModified: staticDate,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/iletisim`,
            lastModified: staticDate,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/gizlilik-politikasi`,
            lastModified: staticDate,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${baseUrl}/kullanim-sartlari`,
            lastModified: staticDate,
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
            .select('slug, updated_at, category, cover_url')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(1000),

        supabase
            .from('profiles')
            .select('username, updated_at, avatar_url')
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
        // Differentiate between articles (makale), experiments, and book reviews by category
        let urlPrefix = 'makale';
        if (article.category === 'Deney') urlPrefix = 'deney';
        else if (article.category === 'Kitap İncelemesi') urlPrefix = 'kitap-inceleme';

        return {
            url: `${baseUrl}/${urlPrefix}/${article.slug}`,
            lastModified: new Date(article.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
            ...(article.cover_url ? { images: [article.cover_url] } : { images: [`${baseUrl}/api/og?title=${encodeURIComponent(article.slug)}`] }),
        };
    });

    const profilePages: MetadataRoute.Sitemap = (profilesResult.data || []).map((profile) => ({
        url: `${baseUrl}/kullanici/${profile.username}`,
        lastModified: new Date(profile.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        ...(profile.avatar_url ? { images: [profile.avatar_url] } : {}),
    }));

    // Removed termPages because /sozluk/[slug] does not exist; terms are listed on /sozluk

    const quizPages: MetadataRoute.Sitemap = (quizzesResult.data || []).map((quiz) => ({
        url: `${baseUrl}/testler/${quiz.slug}`,
        lastModified: new Date(quiz.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    const simulationPages: MetadataRoute.Sitemap = (simulationsResult?.data || []).map((sim: any) => ({
        url: `${baseUrl}/simulasyonlar/${sim.slug}`,
        lastModified: new Date(sim.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [
        ...staticPages,
        ...questionPages,
        ...articlePages,
        ...profilePages,
        ...quizPages,
        ...simulationPages,
    ];
}
