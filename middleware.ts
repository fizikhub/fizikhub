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
let lastCleanup = Date.now();

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

function isRateLimited(ip: string, maxRequests: number): boolean {
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

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const ip = getClientIP(request);

    // 301 Redirect for /index to /
    if (pathname === '/index') {
        const url = request.nextUrl.clone();
        url.pathname = '/';
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

    // Normalize query params for /makale to fix Canonical tag warnings (kategori -> category)
    if (pathname === '/makale') {
        const url = request.nextUrl.clone();
        const kategori = url.searchParams.get('kategori');
        if (kategori) {
            url.searchParams.delete('kategori');
            url.searchParams.set('category', kategori);
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
        if (request.method === 'POST' && isRateLimited(`auth:${ip}`, MAX_REQUESTS_AUTH)) {
            return rateLimitResponse();
        }
    }

    // Rate limit password reset (stricter limit to prevent email enumeration)
    if (pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password')) {
        if (request.method === 'POST' && isRateLimited(`pwreset:${ip}`, MAX_REQUESTS_PASSWORD_RESET)) {
            return rateLimitResponse();
        }
    }

    // Rate limit API endpoints
    if (pathname.startsWith('/api')) {
        if (isRateLimited(`api:${ip}`, MAX_REQUESTS_API)) {
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
