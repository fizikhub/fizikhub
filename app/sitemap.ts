import { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase-server';
import { simulations } from '@/components/simulations/data';
import { slugify } from '@/lib/slug';
import { getDictionaryTerms } from '@/lib/api';
import { SEO_PRIORITY_SLUG_SET } from '@/lib/seo-priority';
import { getSiteUrl, hasUsefulIndexableText, isLikelyIndexableArticle, isLikelyIndexableTitle, toAbsoluteUrl } from '@/lib/seo-utils';

export const revalidate = 3600; // Revalidate sitemap every hour

const STATIC_LAST_MODIFIED = new Date('2026-05-13T00:00:00.000+03:00');

function toLastModified(value?: string | null) {
    return value ? new Date(value) : STATIC_LAST_MODIFIED;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createStaticClient();
    const baseUrl = getSiteUrl();

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
            url: `${baseUrl}/konular`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'weekly',
            priority: 0.86,
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
            url: `${baseUrl}/rozetler`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.35,
        },
        {
            url: `${baseUrl}/kvkk`,
            lastModified: STATIC_LAST_MODIFIED,
            changeFrequency: 'yearly',
            priority: 0.2,
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
            .select('id, title, content, created_at, updated_at, votes, answers(count)')
            .order('created_at', { ascending: false })
            .limit(250),

        supabase
            .from('articles')
            .select('slug, title, excerpt, content, created_at, updated_at, category, cover_url, image_url')
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

    const questionPages: MetadataRoute.Sitemap = (questionsResult.data || [])
        .filter((question) => {
            const answerCount = Number(question.answers?.[0]?.count || 0);
            const visibleText = [question.title, question.content].filter(Boolean).join(' ');
            return isLikelyIndexableTitle(question.title) && (hasUsefulIndexableText(visibleText, 40) || answerCount > 0);
        })
        .map((question) => ({
            url: `${baseUrl}/forum/${question.id}`,
            lastModified: toLastModified(question.updated_at || question.created_at),
            changeFrequency: Number(question.answers?.[0]?.count || 0) > 0 ? 'weekly' as const : 'monthly' as const,
            priority: Number(question.answers?.[0]?.count || 0) > 0 || (question.votes || 0) > 2 ? 0.75 : 0.55,
        }));

    const articlePages: MetadataRoute.Sitemap = (articlesResult.data || []).flatMap((article) => {
        const slug = article.slug;
        if (!slug || !isLikelyIndexableArticle(article)) return [];

        let urlPrefix = 'makale';
        if (article.category === 'Deney') urlPrefix = 'deney';
        const imageUrl = toAbsoluteUrl(article.cover_url || article.image_url, baseUrl);
        const fallbackImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(article.title || slug)}`;
        const isPriorityArticle = SEO_PRIORITY_SLUG_SET.has(slug);

        return [{
            url: `${baseUrl}/${urlPrefix}/${slug}`,
            lastModified: toLastModified(article.updated_at || article.created_at),
            changeFrequency: 'weekly' as const,
            priority: isPriorityArticle ? 0.95 : 0.85,
            images: [imageUrl || fallbackImageUrl],
        }];
    });

    const termPages: MetadataRoute.Sitemap = terms
        .filter((term) => isLikelyIndexableTitle(term.term) && hasUsefulIndexableText(term.definition, 40))
        .map((term) => ({
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
