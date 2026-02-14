import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fizikhub.com';

    return {
        rules: [
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/profil/',
                    '/login/',
                    '/forgot-password/',
                    '/reset-password/',
                    '/onboarding/',
                    '/admin/',
                    '/mesajlar/',
                ],
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/profil/',
                    '/login/',
                    '/forgot-password/',
                    '/reset-password/',
                    '/onboarding/',
                    '/admin/',
                    '/mesajlar/',
                ],
            },
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/profil/',
                    '/login/',
                    '/forgot-password/',
                    '/reset-password/',
                    '/onboarding/',
                    '/admin/',
                    '/mesajlar/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
