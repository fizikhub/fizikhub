import { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase-server';
import { simulations } from '@/components/simulations/data';
import { slugify } from '@/lib/slug';
import { getDictionaryTerms } from '@/lib/api';

export const revalidate = 3600; // Revalidate sitemap every hour

const STATIC_LAST_MODIFIED = new Date('2026-04-17T00:00:00.000Z');

function toLastModified(value?: string | null) {
    return value ? new Date(value) : STATIC_LAST_MODIFIED;
}

function getBaseUrl() {
    return (process.env.NEXT_PUBLIC_APP_URL || 'https://www.fizikhub.com').replace(/\/+$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createStaticClient();
    const baseUrl = getBaseUrl();

    // Static pages with all important routes
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/forum`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'hourly',
            priority: 0.9,
        },

        {
            url: `${baseUrl}/makale`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/sozluk`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/testler`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/simulasyonlar`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/puanlar-nedir`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/siralamalar`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'daily',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/hakkimizda`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/iletisim`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/gizlilik-politikasi`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${baseUrl}/kullanim-sartlari`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
    ];

    // Fetch all data in parallel for speed
    const [questionsResult, articlesResult, quizzesResult, terms] = await Promise.all([
        supabase
            .from('questions')
            .select('id, created_at')
            .order('created_at', { ascending: false })
            .limit(250),

        supabase
            .from('articles')
            .select('slug, created_at, category, cover_url')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(1000),

        supabase
            .from('quizzes')
            .select('slug, created_at')
            .order('created_at', { ascending: false })
            .limit(200),

        getDictionaryTerms(supabase),
    ]);

    const questionPages: MetadataRoute.Sitemap = (questionsResult.data || []).map((question) => ({
        url: `${baseUrl}/forum/${question.id}`,
        lastModified: toLastModified(question.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const articlePages: MetadataRoute.Sitemap = (articlesResult.data || []).flatMap((article) => {
        if (!article.slug || article.category === 'Terim') return [];

        let urlPrefix = 'makale';
        if (article.category === 'Deney') urlPrefix = 'deney';

        return [{
            url: `${baseUrl}/${urlPrefix}/${article.slug}`,
            lastModified: toLastModified(article.created_at),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
            ...(article.cover_url ? { images: [article.cover_url] } : { images: [`${baseUrl}/api/og?title=${encodeURIComponent(article.slug)}`] }),
        }];
    });

    const termPages: MetadataRoute.Sitemap = terms.map((term) => ({
        url: `${baseUrl}/sozluk/${slugify(term.term)}`,
        lastModified: toLastModified(term.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.65,
    }));

    const quizPages: MetadataRoute.Sitemap = (quizzesResult.data || []).map((quiz) => ({
        url: `${baseUrl}/testler/${quiz.slug}`,
        lastModified: toLastModified(quiz.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    const simulationPages: MetadataRoute.Sitemap = simulations.map((sim) => ({
        url: `${baseUrl}/simulasyonlar/${sim.slug}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [
        ...staticPages,
        ...questionPages,
        ...articlePages,
        ...termPages,
        ...quizPages,
        ...simulationPages,
    ];
}
