import { MetadataRoute } from 'next';
import { AI_CRAWLER_USER_AGENTS, AI_DISCOVERY_ROUTES, AI_PUBLIC_CONTENT_PREFIXES } from '@/lib/ai-discovery';
import { getSiteUrl } from '@/lib/seo-utils';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getSiteUrl();

    const cleanupDisallow = [
        '/api/',
        '/abs/',
        '/storage/',
        '/cdn-cgi/',
    ];

    const commonDisallow = cleanupDisallow;
    const publicAllow = [
        '/',
        '/konular',
        '/konular/',
        '/api/og',
        '/opengraph-image',
        '/og-image.jpg',
        '/icon-512.png',
        '/new-logo.svg',
        '/email/fh-avatar.png',
        '/email/fh-avatar.svg',
        '/_next/image',
        ...AI_DISCOVERY_ROUTES.map((route) => route.path),
    ];

    const aiRules = AI_CRAWLER_USER_AGENTS.map(bot => ({
        userAgent: bot,
        allow: [...publicAllow, ...AI_PUBLIC_CONTENT_PREFIXES],
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
            `${baseUrl}/topic-sitemap.xml`,
            `${baseUrl}/ai-sitemap.xml`,
            `${baseUrl}/author-sitemap.xml`,
        ],
    };
}
