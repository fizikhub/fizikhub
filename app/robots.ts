import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo-utils';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getSiteUrl();

    const cleanupDisallow = [
        '/api/',
        '/abs/',
        '/storage/',
        '/cdn-cgi/',
        '/kullanici/',
        '/admin/',
        '/yonetim/',
        '/yazar-paneli/',
        '/*?q=*',
    ];

    const commonDisallow = cleanupDisallow;
    const publicAllow = [
        '/',
        '/konular',
        '/api/og',
        '/opengraph-image',
        '/og-image.jpg',
        '/icon-512.png',
        '/new-logo.svg',
        '/email/fh-avatar.png',
        '/email/fh-avatar.svg',
        '/_next/image',
        '/ai-index.json',
    ];

    // Modern AI and LLM Search Crawlers (ChatGPT, Perplexity, Claude, etc.)
    const aiBots = [
        'GPTBot',
        'ChatGPT-User',
        'Google-Extended',
        'PerplexityBot',
        'ClaudeBot',
        'Claude-Web',
        'anthropic-ai',
        'OAI-SearchBot',
        'CCBot',
        'Amazonbot',
        'Applebot',
        'Meta-ExternalAgent',
        'Meta-ExternalFetcher',
    ];

    const aiRules = aiBots.map(bot => ({
        userAgent: bot,
        allow: [...publicAllow, '/makale/', '/forum/', '/sozluk/', '/llms.txt', '/ai-index.json', '/feed.xml', '/testler/', '/simulasyonlar/'],
        disallow: commonDisallow,
        crawlDelay: 2, // Be kind to our servers, LLMs!
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
                allow: [...publicAllow, '/llms.txt', '/ai-index.json', '/feed.xml'],
                disallow: commonDisallow,
                crawlDelay: 1,
            },
        ],
        sitemap: [
            `${baseUrl}/sitemap-index.xml`,
            `${baseUrl}/sitemap.xml`,
            `${baseUrl}/article-sitemap.xml`,
            `${baseUrl}/forum-sitemap.xml`,
            `${baseUrl}/dictionary-sitemap.xml`,
            `${baseUrl}/news-sitemap.xml`,
        ],
    };
}
