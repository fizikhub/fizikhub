import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/middleware'
import { isKnownAiCrawlerUserAgent } from '@/lib/ai-discovery'

// Sliding window rate limiting with automatic cleanup
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_AUTH = 5; // Max 5 auth requests per minute
const MAX_REQUESTS_API = 30; // Max 30 API requests per minute
const MAX_REQUESTS_PASSWORD_RESET = 3; // Max 3 password reset requests per minute
const MAX_MAP_SIZE = 10000; // Prevent unbounded memory growth
const CLEANUP_INTERVAL = 30 * 1000; // Cleanup every 30 seconds
const RATE_LIMIT_TTL_SECONDS = RATE_LIMIT_WINDOW / 1000;
let lastCleanup = Date.now();
const CANONICAL_HOST = 'www.fizikhub.com';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
const SEO_METADATA_PATHS = new Set([
    '/robots.txt',
    '/sitemap.xml',
    '/sitemap-index.xml',
    '/topic-sitemap.xml',
    '/article-sitemap.xml',
    '/forum-sitemap.xml',
    '/dictionary-sitemap.xml',
    '/news-sitemap.xml',
    '/ai-sitemap.xml',
    '/author-sitemap.xml',
    '/feed.xml',
    '/llms.txt',
    '/ai-index.json',
    '/simulation-learning.json',
    '/opensearch.xml',
    '/opengraph-image',
]);
const PUBLIC_SEO_PATHS = new Set([
    '/',
    '/hakkimizda',
    '/gizlilik-politikasi',
    '/kullanim-sartlari',
    '/iletisim',
    '/puanlar-nedir',
    '/rozetler',
    '/siralamalar',
    '/konular',
    '/makale',
    '/forum',
    '/sozluk',
    '/testler',
    '/simulasyonlar',
]);
const PUBLIC_SEO_PREFIXES = [
    '/makale/',
    '/deney/',
    '/forum/',
    '/sozluk/',
    '/testler/',
    '/simulasyonlar/',
    '/konular/',
    '/kullanici/',
];
const LOW_VALUE_QUERY_PATHS = new Set([
    '/ara',
    '/forum',
    '/makale',
    '/sozluk',
    '/testler',
    '/simulasyonlar',
]);
const SEARCH_CRAWLER_PATTERN = /Googlebot|Googlebot-Image|Googlebot-News|Bingbot|DuckDuckBot|YandexBot|Applebot|LinkedInBot|Twitterbot|facebookexternalhit|Facebot|WhatsApp|Slackbot|TelegramBot|Instagram|Pinterest|Discordbot/i;

type UpstashPipelineResult = Array<{ result?: unknown; error?: string }>;

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

function cleanupExpiredEntries() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL && rateLimitMap.size < MAX_MAP_SIZE) return;

    lastCleanup = now;
    const keysToDelete: string[] = [];
    rateLimitMap.forEach((val, key) => {
        if (now - val.timestamp > RATE_LIMIT_WINDOW) {
            keysToDelete.push(key);
        }
    });
    keysToDelete.forEach(key => rateLimitMap.delete(key));
}

async function incrementExternalRateLimit(key: string): Promise<number | null> {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) return null;

    try {
        const response = await fetch(`${redisUrl.replace(/\/+$/, '')}/pipeline`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${redisToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                ['INCR', key],
                ['EXPIRE', key, String(RATE_LIMIT_TTL_SECONDS)],
            ]),
        });

        if (!response.ok) return null;

        const data = await response.json() as UpstashPipelineResult;
        const count = Number(data[0]?.result);
        return Number.isFinite(count) ? count : null;
    } catch {
        return null;
    }
}

async function isRateLimited(ip: string, maxRequests: number): Promise<boolean> {
    const externalCount = await incrementExternalRateLimit(ip);
    if (externalCount !== null) {
        return externalCount > maxRequests;
    }

    const now = Date.now();

    // Periodic cleanup
    cleanupExpiredEntries();

    const record = rateLimitMap.get(ip);

    if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
        return false;
    }

    if (record.count >= maxRequests) {
        return true;
    }

    record.count++;
    return false;
}

function rateLimitResponse(): NextResponse {
    return new NextResponse(
        JSON.stringify({ error: 'Çok fazla istek. Lütfen biraz bekleyin.' }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': '60'
            }
        }
    );
}

function goneNoindexResponse(): NextResponse {
    return new NextResponse(null, {
        status: 410,
        headers: {
            'X-Robots-Tag': 'noindex, nofollow',
        },
    });
}

function canonicalRedirectUrl(request: NextRequest, pathname?: string) {
    const url = new URL(request.nextUrl.toString());
    url.protocol = 'https';
    url.hostname = CANONICAL_HOST;
    url.port = '';
    if (pathname) url.pathname = pathname;
    return url;
}

function normalizeSeoUrl(request: NextRequest) {
    const url = canonicalRedirectUrl(request);
    const original = request.nextUrl;
    const host = request.headers.get('host') || '';
    const forwardedProto = request.headers.get('x-forwarded-proto') || original.protocol.replace(':', '');
    const isProductionDomain = host === 'fizikhub.com' || host === CANONICAL_HOST;
    let changed = isProductionDomain && (host !== CANONICAL_HOST || forwardedProto !== 'https');

    if (url.pathname === '/index') {
        url.pathname = '/';
        changed = true;
    }

    if (url.pathname === '/blog' || url.pathname.startsWith('/blog/')) {
        url.pathname = url.pathname.replace(/^\/blog/, '/makale');
        changed = true;
    }

    const kategori = url.searchParams.get('kategori');
    if ((url.pathname === '/makale' || url.pathname.startsWith('/makale/')) && kategori) {
        url.searchParams.delete('kategori');
        url.searchParams.set('category', kategori);
        changed = true;
    }

    if ((url.pathname === '/makale' || url.pathname.startsWith('/makale/')) && url.searchParams.get('sort') === 'latest') {
        url.searchParams.delete('sort');
        changed = true;
    }

    if (url.pathname === '/kesfet') {
        url.pathname = '/makale';
        changed = true;
    }

    if (!isProductionDomain) {
        url.protocol = original.protocol;
        url.host = original.host;
    }

    return changed ? url : null;
}

function isPublicSeoPath(pathname: string) {
    return PUBLIC_SEO_PATHS.has(pathname) || PUBLIC_SEO_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isLowValueSeoQuery(pathname: string, searchParams: URLSearchParams) {
    if (!LOW_VALUE_QUERY_PATHS.has(pathname)) return false;
    if (searchParams.has('q')) return true;
    if (searchParams.has('filter')) return true;
    if (searchParams.get('sort') && searchParams.get('sort') !== 'newest') return true;
    return false;
}

function decodeCategorySlug(slug: string): string {
    const decoded = decodeURIComponent(slug);
    if (!decoded) return '';
    return decoded.charAt(0).toLocaleUpperCase('tr-TR') + decoded.slice(1);
}

export function shouldBypassSession(pathname: string, userAgent: string) {
    if (SEO_METADATA_PATHS.has(pathname)) return true;
    if (pathname.startsWith('/api/og')) return true;
    if (pathname.startsWith('/api/search/suggestions')) return true;

    const isKnownCrawler = SEARCH_CRAWLER_PATTERN.test(userAgent) || isKnownAiCrawlerUserAgent(userAgent);
    return isKnownCrawler && isPublicSeoPath(pathname);
}

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const ip = getClientIP(request);
    const normalizedUrl = normalizeSeoUrl(request);
    if (normalizedUrl) return NextResponse.redirect(normalizedUrl, 301);

    // 301 Redirect for /index to /
    if (pathname === '/index') {
        return NextResponse.redirect(`${CANONICAL_ORIGIN}/`, 301);
    }

    // Clean Category URLs redirects and internal rewrites for GEO/SEO
    if (pathname.startsWith('/blog/kategori/')) {
        const categorySlug = pathname.replace(/^\/blog\/kategori\//, '');
        const url = canonicalRedirectUrl(request);
        url.pathname = `/makale/kategori/${categorySlug}`;
        return NextResponse.redirect(url, 301);
    }

    if (pathname.startsWith('/makale/kategori/')) {
        const categorySlug = pathname.replace(/^\/makale\/kategori\//, '');
        const categoryName = decodeCategorySlug(categorySlug);
        
        const url = request.nextUrl.clone();
        url.pathname = '/makale';
        url.searchParams.set('category', categoryName);
        
        return NextResponse.rewrite(url);
    }

    // Redirect legacy parameterized URLs to clean category URLs
    if (pathname === '/blog' || pathname === '/makale') {
        const kategori = request.nextUrl.searchParams.get('kategori') || request.nextUrl.searchParams.get('category');
        if (kategori) {
            const url = canonicalRedirectUrl(request);
            url.pathname = `/makale/kategori/${kategori.toLowerCase()}`;
            url.searchParams.delete('kategori');
            url.searchParams.delete('category');
            
            // Preserve other query parameters if they exist
            request.nextUrl.searchParams.forEach((value, key) => {
                if (key !== 'kategori' && key !== 'category') {
                    url.searchParams.set(key, value);
                }
            });
            
            return NextResponse.redirect(url, 301);
        }
    }

    // Legacy blog URLs were replaced by /makale. Normalize them in one hop so
    // Search Console sees a single canonical destination.
    if (pathname === '/blog' || pathname.startsWith('/blog/')) {
        const url = canonicalRedirectUrl(request);
        url.pathname = pathname.replace(/^\/blog/, '/makale');

        const kategori = url.searchParams.get('kategori');
        if (kategori) {
            url.searchParams.delete('kategori');
            url.searchParams.set('category', kategori);
        }

        if (url.searchParams.get('sort') === 'latest') {
            url.searchParams.delete('sort');
        }

        return NextResponse.redirect(url, 301);
    }

    if (pathname.startsWith('/kitap-inceleme/') && pathname !== '/kitap-inceleme/yeni') {
        const url = canonicalRedirectUrl(request);
        url.pathname = pathname.replace(/^\/kitap-inceleme/, '/makale');
        return NextResponse.redirect(url, 301);
    }

    const legacyArticleRedirects: Record<string, string> = {
        '/makale/killi-bir-kopekten-kitalararasi-akustik-muhendisane-binalarin-evrimi-ve-fizigi':
            '/makale/killi-bir-kopekten-kitalararasi-akustik-muhendisine-balinalarin-evrimi-ve-fizigi',
    };

    if (legacyArticleRedirects[pathname]) {
        const url = canonicalRedirectUrl(request);
        url.pathname = legacyArticleRedirects[pathname];
        return NextResponse.redirect(url, 301);
    }

    const rootArticleRedirects: Record<string, string> = {
        '/test-mkn0gnnsixw': '/makale/test-mkn0gnnsixw',
        '/serway-1-kitap-i-ncelemesi-mkkynylwexp': '/makale/serway-1-kitap-i-ncelemesi-mkkynylwexp',
        '/azteklerden-gunumuze-tutun-tarihcesi-kimyasi-ve-etkileri-1769018062247':
            '/makale/azteklerden-gunumuze-tutun-tarihcesi-kimyasi-ve-etkileri-1769018062247',
        '/matematik-ile-her-seyi-kusursuzca-kanitlayabilir-miyiz-1768299779741':
            '/makale/matematik-ile-her-seyi-kusursuzca-kanitlayabilir-miyiz-1768299779741',
    };

    if (rootArticleRedirects[pathname]) {
        const url = canonicalRedirectUrl(request);
        url.pathname = rootArticleRedirects[pathname];
        return NextResponse.redirect(url, 301);
    }

    if (pathname === '/kesfet') {
        const url = canonicalRedirectUrl(request);
        url.pathname = '/makale';
        return NextResponse.redirect(url, 301);
    }

    const arxivMatch = pathname.match(/^\/abs\/([^).]+v\d+)/);
    if (arxivMatch) {
        return NextResponse.redirect(`https://arxiv.org/abs/${arxivMatch[1]}`, 301);
    }

    if (pathname.startsWith('/storage/v1/object/public/')) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
        if (!supabaseUrl) return goneNoindexResponse();

        const cleanPathname = pathname.split(')')[0];
        try {
            const url = new URL(`${supabaseUrl.replace(/\/+$/, '')}${cleanPathname}`);
            return NextResponse.redirect(url, 301);
        } catch {
            return goneNoindexResponse();
        }
    }

    if (pathname === '/solar-system/our-solar-system/in-depth') {
        const url = request.nextUrl.clone();
        url.pathname = '/simulasyonlar/gunes-sistemi';
        return NextResponse.redirect(url, 301);
    }

    if (pathname === '/cdn-cgi/l/email-protection') {
        return new NextResponse(null, { status: 410 });
    }

    if (/^\/(?:makale|deney)\/(?:test|tesr|deneme)(?:[-_]|$)/i.test(pathname)) {
        return goneNoindexResponse();
    }

    // Clean up URLs broken by markdown parsing bugs (trailing characters after closed parenthesis)
    // E.g. /abs/123) or /storage/...blob)olay
    if (pathname.includes(')')) {
        const cleanPathname = pathname.split(')')[0];
        if (cleanPathname.length > 0) {
            const url = canonicalRedirectUrl(request);
            url.pathname = cleanPathname;
            return NextResponse.redirect(url, 301);
        }
    }

    // Clean up trailing .*
    if (pathname.endsWith('.*')) {
        const cleanPathname = pathname.replace(/\.\*$/, '');
        if (cleanPathname.length > 0) {
            const url = canonicalRedirectUrl(request);
            url.pathname = cleanPathname;
            return NextResponse.redirect(url, 301);
        }
    }

    // Normalize query params for /makale to fix canonical tag warnings.
    if (pathname === '/makale') {
        const url = canonicalRedirectUrl(request);
        let changed = false;
        const kategori = url.searchParams.get('kategori');
        if (kategori) {
            url.searchParams.delete('kategori');
            url.searchParams.set('category', kategori);
            changed = true;
        }

        if (url.searchParams.get('sort') === 'latest') {
            url.searchParams.delete('sort');
            changed = true;
        }

        if (changed) {
            return NextResponse.redirect(url, 301);
        }
    }

    // Deprecated arXiv automation paths without a parseable arXiv id are gone.
    if (pathname.startsWith('/abs/')) {
        return goneNoindexResponse();
    }

    // Redirect junk single-character paths that bots hit
    if (['/n', '/2', '/slot', '/ozel', '/interstellar'].includes(pathname) || pathname === '/&' || pathname === '/$') {
        const url = canonicalRedirectUrl(request);
        url.pathname = '/';
        return NextResponse.redirect(url, 301);
    }

    // Rate limit auth endpoints (login, register, password reset)
    if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/auth')) {
        if (request.method === 'POST' && await isRateLimited(`auth:${ip}`, MAX_REQUESTS_AUTH)) {
            return rateLimitResponse();
        }
    }

    // Rate limit password reset (stricter limit to prevent email enumeration)
    if (pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password')) {
        if (request.method === 'POST' && await isRateLimited(`pwreset:${ip}`, MAX_REQUESTS_PASSWORD_RESET)) {
            return rateLimitResponse();
        }
    }

    // Rate limit API endpoints
    if (pathname.startsWith('/api')) {
        if (await isRateLimited(`api:${ip}`, MAX_REQUESTS_API)) {
            return rateLimitResponse();
        }
    }

    // Bypass session management for crawler-facing metadata and social bots.
    // These requests do not need Supabase cookie refresh work.
    const userAgent = request.headers.get('user-agent') || '';

    let response;
    if (shouldBypassSession(pathname, userAgent)) {
        response = NextResponse.next();
    } else {
        response = await updateSession(request);
    }

    if (isLowValueSeoQuery(pathname, request.nextUrl.searchParams)) {
        response.headers.set('X-Robots-Tag', 'noindex, follow');
        response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    }

    // Security headers are centralized in next.config.ts. Keep proxy focused on
    // canonical redirects, rate limits, and Supabase session cookie updates so
    // CSP frame-ancestor policy stays consistent for social previews.

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Static assets (images, fonts, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|sw.js|workbox-.*\\.js|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff|woff2|ico)$).*)',
    ],
}
