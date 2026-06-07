const ALLOWED_MARKDOWN_EMBED_HOSTS = new Set([
    "www.youtube.com",
    "youtube.com",
    "www.youtube-nocookie.com",
    "youtube-nocookie.com",
    "phet.colorado.edu",
]);

export function isAllowedMarkdownEmbedUrl(value: string | null | undefined): boolean {
    if (!value) return false;

    try {
        const url = new URL(value, "https://www.fizikhub.com");
        return url.protocol === "https:" && ALLOWED_MARKDOWN_EMBED_HOSTS.has(url.hostname);
    } catch {
        return false;
    }
}
