import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/middleware'

// Simple in-memory rate limiting with automatic cleanup
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_AUTH = 5; // Max 5 auth requests per minute
const MAX_REQUESTS_API = 30; // Max 30 API requests per minute
const MAX_MAP_SIZE = 10000; // Prevent unbounded memory growth

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

function isRateLimited(ip: string, maxRequests: number): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    // Cleanup old entries to prevent memory leak
    if (rateLimitMap.size > MAX_MAP_SIZE) {
        const keysToDelete: string[] = [];
        rateLimitMap.forEach((val, key) => {
            if (now - val.timestamp > RATE_LIMIT_WINDOW) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => rateLimitMap.delete(key));
    }

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

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const ip = getClientIP(request);

    // Rate limit auth endpoints (login, register, password reset)
    if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/auth')) {
        if (request.method === 'POST' && isRateLimited(`auth:${ip}`, MAX_REQUESTS_AUTH)) {
            return new NextResponse(
                JSON.stringify({ error: 'Çok fazla deneme. Lütfen 1 dakika bekleyin.' }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': '60'
                    }
                }
            );
        }
    }

    // Rate limit API endpoints
    if (pathname.startsWith('/api')) {
        if (isRateLimited(`api:${ip}`, MAX_REQUESTS_API)) {
            return new NextResponse(
                JSON.stringify({ error: 'Rate limit aşıldı. Lütfen biraz bekleyin.' }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': '60'
                    }
                }
            );
        }
    }

    const response = await updateSession(request);

    // Context Security Policy (CSP)
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com https://ssl.google-analytics.com https://www.googletagmanager.com https://cdn.jsdelivr.net;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
        img-src 'self' blob: data: https://*.supabase.co https://*.google-analytics.com https://*.googletagmanager.com;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;
        frame-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        block-all-mixed-content;
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');

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
