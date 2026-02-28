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
