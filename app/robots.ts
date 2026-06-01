import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo-utils';
import { AI_CRAWLER_USER_AGENTS, AI_DISCOVERY_ROUTES } from '@/lib/ai-discovery';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getSiteUrl();

    // Allowed areas
    const publicAllow = [
        '/',
        '/makale/',
        '/blog/',
        '/konular/',
        '/sozluk/',
        '/forum/',
        '/simulasyonlar/',
        '/testler/',
        '/hakkimizda',
        '/iletisim',
        '/paylas',
        '/rozetler',
        '/siralamalar',
        '/puanlar-nedir',
        '/yazar/rehber',
        '/kullanici/', // Ensure public profile route is allowed
        ...AI_DISCOVERY_ROUTES.map((route) => route.path), // Add AI discovery routes like /simulation-learning.json
    ];

    // Keep legacy cleanup paths crawlable so Google can see their 301/410
    // responses and retire old Search Console rows instead of reporting a
    // robots.txt block.
    const commonDisallow = [
        '/api/',
    ];

    const aiRules = AI_CRAWLER_USER_AGENTS.map(bot => ({
        userAgent: bot,
        allow: publicAllow,
        disallow: commonDisallow,
        crawlDelay: 2,
    }));

    return {
        rules: [
            ...aiRules,
            {
                userAgent: 'Googlebot',
                allow: publicAllow,
                disallow: commonDisallow,
            },
            {
                userAgent: 'Googlebot-Image',
                allow: publicAllow,
                disallow: commonDisallow,
            },
            {
                userAgent: 'Googlebot-News',
                allow: publicAllow,
                disallow: commonDisallow,
            },
            {
                userAgent: 'Bingbot',
                allow: publicAllow,
                disallow: commonDisallow,
                crawlDelay: 2,
            },
            {
                userAgent: '*',
                allow: publicAllow,
                disallow: commonDisallow,
                crawlDelay: 1,
            },
        ],
        sitemap: [
            `${baseUrl}/sitemap-index.xml`,
            `${baseUrl}/sitemap.xml`,
            `${baseUrl}/news-sitemap.xml`,
            `${baseUrl}/topic-sitemap.xml`,
            `${baseUrl}/ai-sitemap.xml`,
            `${baseUrl}/author-sitemap.xml`,
        ],
    };
}
