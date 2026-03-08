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
    ];

    return {
        rules: [
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
                allow: '/',
                disallow: commonDisallow,
                crawlDelay: 1,
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
