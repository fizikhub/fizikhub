const DEFAULT_SITE_URL = "https://www.fizikhub.com";

export function getSiteUrl() {
    return (process.env.NEXT_PUBLIC_APP_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

export function toAbsoluteUrl(url: string | null | undefined, baseUrl = getSiteUrl()) {
    if (!url) return null;

    try {
        return new URL(url).toString();
    } catch {
        return new URL(url, baseUrl).toString();
    }
}

export function stripMarkdownForMeta(content: string | null | undefined) {
    return (content || "")
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
        .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
        .replace(/[#*_>`~|[\]]/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
}

export function truncateForMeta(value: string, maxLength = 158) {
    const clean = stripMarkdownForMeta(value);

    if (clean.length <= maxLength) return clean;

    const slice = clean.slice(0, maxLength + 1);
    const lastSpace = slice.lastIndexOf(" ");
    const end = lastSpace > maxLength - 35 ? lastSpace : maxLength;

    return `${clean.slice(0, end).trim()}...`;
}

export function buildMetaDescription(
    sources: Array<string | null | undefined>,
    fallback: string,
    maxLength = 158,
) {
    const source = sources.map(stripMarkdownForMeta).find((value) => value.length > 0) || fallback;
    return truncateForMeta(source, maxLength);
}

export function isLikelyIndexableTitle(title: string | null | undefined) {
    const clean = stripMarkdownForMeta(title).trim();

    if (clean.length < 4) return false;
    if (/^(.)\1+$/i.test(clean)) return false;
    if (/^[\d\W_]+$/.test(clean)) return false;

    return true;
}
