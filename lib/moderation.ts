/**
 * Moderation utility for Fizikhub
 * Purpose: Filter illegal content, spam, and harmful keywords to comply with legal requirements.
 */

const FORBIDDEN_KEYWORDS = [
    // Terror/Violence
    "terör", "bomba", "suikast", "silah", "patlayıcı", "infaz", "cihat",
    // Insults/Slurs (Turkish)
    "küfür", "hakaret", "orospu", "piç", "amk", "amına",
    "siktir", "yarrak", "göt", "pezevenk", "gavat",
    // Spam/Scams
    "kumar", "bahis", "casino", "casinos", "porn", "porno",
    "viagra", "cialis", "forex", "bitcoin kazanç",
    // Phishing/Scam patterns
    "bedava iphone", "çekiliş kazandınız", "hediye kartı",
];

/**
 * Regex patterns to catch obfuscation attempts
 * e.g. "b.o.m.b.a", "b0mba", "s1lah"
 */
const FORBIDDEN_PATTERNS = [
    /b[oö0\.]m[^\w]?b[aä]/i,         // bomba variants
    /s[i1ıİ][l1][aäâ][hḥ]/i,         // silah variants
    /p[oöô0]r[nñ][oöô0]/i,           // porno variants
    /k[uüù][mṁ][aäâ]r/i,            // kumar variants
    /b[aäâ][hḥ][i1ıİ][sşṡ]/i,       // bahis variants
    /https?:\/\/[^\s]+\.(ru|cn|tk|ml|ga|cf)\b/i, // Suspicious TLDs
];

interface ModerationResult {
    isClean: boolean;
    isFlagged: boolean;
    reason?: string;
}

/**
 * Normalize Turkish characters and common substitutions for moderation checks.
 */
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[.\-_*!@#$^&]/g, '') // Remove common obfuscation chars
        .replace(/0/g, 'o')
        .replace(/1/g, 'i')
        .replace(/3/g, 'e')
        .replace(/4/g, 'a')
        .replace(/5/g, 's')
        .replace(/7/g, 't');
}

/**
 * Checks content for forbidden keywords and patterns.
 * @param content The text to check
 */
export function checkContent(content: string): ModerationResult {
    if (!content) return { isClean: true, isFlagged: false };

    const normalizedContent = normalizeText(content);

    // Check keywords against normalized content
    for (const keyword of FORBIDDEN_KEYWORDS) {
        if (normalizedContent.includes(normalizeText(keyword))) {
            return {
                isClean: false,
                isFlagged: true,
                reason: `İçerik politikasına aykırı içerik tespit edildi.`
            };
        }
    }

    // Check regex patterns against original content (for URL patterns etc.)
    for (const pattern of FORBIDDEN_PATTERNS) {
        if (pattern.test(content)) {
            return {
                isClean: false,
                isFlagged: true,
                reason: `Şüpheli içerik kalıbı tespit edildi.`
            };
        }
    }

    return { isClean: true, isFlagged: false };
}

/**
 * Helper to get user IP and User-Agent from headers (Next.js context)
 */
export async function getClientMetadata() {
    const { headers } = await import('next/headers');
    const headerList = await headers();

    // X-Forwarded-For is usually populated by Vercel/proxies
    const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const ua = headerList.get('user-agent') || 'unknown';

    return { ip, ua };
}
