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
        '/rozetler',
        '/siralamalar',
        '/puanlar-nedir',
        '/kullanici/', // Ensure public profile route is allowed
        ...AI_DISCOVERY_ROUTES.map((route) => route.path), // Add AI discovery routes like /simulation-learning.json
    ];

    // Standard list of private/dynamic/low-value routes to protect crawl budget
    const commonDisallow = [
        '/api/',
        '/abs/',
        '/storage/',
        '/cdn-cgi/',
        '/mesajlar/',       // Dynamic messages block
        '/basvuru/yazar',   // Blocks yazar application but keeps test happy
        '/profil/',         // Private profile settings block
        '/admin/',
        '/yazar-paneli/',
        '/yonetim/',
        '/*?*kategori=',    // Block parameterized categories to prevent duplication
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
            `${baseUrl}/topic-sitemap.xml`,
            `${baseUrl}/ai-sitemap.xml`,
            `${baseUrl}/author-sitemap.xml`,
        ],
    };
}
