/**
 * Moderation utility for Fizikhub
 * Purpose: Filter illegal content, spam, and harmful keywords to comply with legal requirements.
 */

const FORBIDDEN_KEYWORDS = [
    // Terror/Violence (Placeholder/General terms for protection)
    "terör", "bomba", "suikast", "silah", "patlayıcı",
    // Insults/Slurs (Common Turkish slurs as examples)
    "küfür", "hakaret", // actual list would be much longer
    // Spam/Scams
    "kumar", "bahis", "casinos", "porn"
];

interface ModerationResult {
    isClean: boolean;
    isFlagged: boolean;
    reason?: string;
}

/**
 * Checks content for forbidden keywords and patterns.
 * @param content The text to check
 */
export function checkContent(content: string): ModerationResult {
    if (!content) return { isClean: true, isFlagged: false };

    const normalizedContent = content.toLowerCase();

    for (const keyword of FORBIDDEN_KEYWORDS) {
        if (normalizedContent.includes(keyword)) {
            return {
                isClean: false,
                isFlagged: true,
                reason: `Yasaklı kelime tespit edildi: ${keyword}`
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
