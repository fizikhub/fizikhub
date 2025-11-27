/**
 * Calculate estimated reading time for article content
 * @param content HTML or plain text content
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');

    // Count words (split by whitespace)
    const words = plainText.trim().split(/\s+/).length;

    // Average reading speed: 200 words per minute
    const readingTime = Math.ceil(words / 200);

    return readingTime;
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
    if (minutes < 1) return '1 dk';
    return `${minutes} dk`;
}
