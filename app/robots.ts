import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.fizikhub.com').replace(/\/+$/, '');

    const privateDisallow = [
        '/api/',
        '/profil/',
        '/onboarding/',
        '/admin/',
        '/yazar/',
        '/yazar-paneli/',
        '/makale/yeni',
        '/mesajlar/',
        '/notifications/',
        '/kurulum/',
        '/time-limit/',
        '/yonetim/',
    ];

    const cleanupDisallow = [
        '/abs/',
        '/storage/',
        '/cdn-cgi/'
    ];

    const commonDisallow = [...privateDisallow, ...cleanupDisallow];
    const publicAllow = ['/', '/api/og', '/opengraph-image', '/og-image.jpg', '/icon-512.png', '/new-logo.svg', '/_next/image'];

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
        allow: [...publicAllow, '/makale/', '/forum/', '/sozluk/', '/llms.txt', '/feed.xml', '/testler/', '/simulasyonlar/'],
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
                allow: [...publicAllow, '/llms.txt', '/feed.xml'],
                disallow: commonDisallow,
                crawlDelay: 1,
            },
        ],
        sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/news-sitemap.xml`],
    };
}
