import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/middleware'

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

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const ip = getClientIP(request);

    // 301 Redirect for /index to /
    if (pathname === '/index') {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url, 301);
    }

    // Legacy blog URLs were replaced by /makale. Normalize them in one hop so
    // Search Console sees a single canonical destination.
    if (pathname === '/blog' || pathname.startsWith('/blog/')) {
        const url = request.nextUrl.clone();
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
        const url = request.nextUrl.clone();
        url.pathname = pathname.replace(/^\/kitap-inceleme/, '/makale');
        return NextResponse.redirect(url, 301);
    }

    const legacyArticleRedirects: Record<string, string> = {
        '/makale/killi-bir-kopekten-kitalararasi-akustik-muhendisane-binalarin-evrimi-ve-fizigi':
            '/makale/killi-bir-kopekten-kitalararasi-akustik-muhendisine-balinalarin-evrimi-ve-fizigi',
    };

    if (legacyArticleRedirects[pathname]) {
        const url = request.nextUrl.clone();
        url.pathname = legacyArticleRedirects[pathname];
        return NextResponse.redirect(url, 301);
    }

    // Clean up URLs broken by markdown parsing bugs (trailing characters after closed parenthesis)
    // E.g. /abs/123) or /storage/...blob)olay
    if (pathname.includes(')')) {
        const cleanPathname = pathname.split(')')[0];
        if (cleanPathname.length > 0) {
            const url = request.nextUrl.clone();
            url.pathname = cleanPathname;
            return NextResponse.redirect(url, 301);
        }
    }

    // Clean up trailing .*
    if (pathname.endsWith('.*')) {
        const cleanPathname = pathname.replace(/\.\*$/, '');
        if (cleanPathname.length > 0) {
            const url = request.nextUrl.clone();
            url.pathname = cleanPathname;
            return NextResponse.redirect(url, 301);
        }
    }

    // Normalize query params for /makale to fix canonical tag warnings.
    if (pathname === '/makale') {
        const url = request.nextUrl.clone();
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

    // Redirect /abs/* to 404 (arXiv automation removed)
    if (pathname.startsWith('/abs/')) {
        const url = request.nextUrl.clone();
        url.pathname = '/404';
        return NextResponse.rewrite(url);
    }

    // Soft-redirect /storage/ links to the actual Supabase bucket
    if (pathname.startsWith('/storage/v1/object/public/')) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cd8341b2-228f-4981-ac3a-5a84c9adca5e.supabase.co';
        const url = new URL(`${supabaseUrl}${pathname}`);
        return NextResponse.redirect(url, 301);
    }

    // Redirect junk single-character paths that bots hit
    if (['/n', '/2', '/slot', '/ozel', '/interstellar'].includes(pathname) || pathname === '/&' || pathname === '/$') {
        const url = request.nextUrl.clone();
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

    // Bypass session management for social media bots/crawlers
    // These bots don't have cookies and only need the HTML for OG meta tags
    const userAgent = request.headers.get('user-agent') || '';
    const isSocialBot = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Instagram|Pinterest|Discordbot/i.test(userAgent);

    if (isSocialBot) {
        return NextResponse.next();
    }

    const response = await updateSession(request);

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
