import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fizikhub.com';

    const commonDisallow = [
        '/api/',
        '/profil/',
        '/login/',
        '/forgot-password/',
        '/reset-password/',
        '/onboarding/',
        '/admin/',
        '/mesajlar/',
        '/notifications/',
        '/notlar/',
        '/kurulum/',
        '/search/',
        '/time-limit/',
        '/yonetim/',
        '/basvuru/',
        '/paylas/',
        '/ara/',
        '/abs/',
        '/*?sort=*',
        '/*?filter=*',
        '/*?category=*',
        '/*?q=*',
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
        allow: ['/', '/blog/', '/forum/', '/sozluk/', '/llms.txt', '/testler/', '/simulasyonlar/'],
        disallow: commonDisallow,
        crawlDelay: 2, // Be kind to our servers, LLMs!
    }));

    return {
        rules: [
            ...aiRules,
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: commonDisallow,
                crawlDelay: 1,
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
                disallow: commonDisallow,
                crawlDelay: 2,
            },
            {
                userAgent: '*',
                allow: ['/', '/llms.txt'],
                disallow: commonDisallow,
                crawlDelay: 1,
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
