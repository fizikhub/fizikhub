const DEFAULT_SITE_URL = "https://www.fizikhub.com";
const TEST_LIKE_PATTERN = /(^|[-_\s])(test|deneme|tesr|taslak|lorem|dummy|sample|djrjr)([-_\s]|$)/i;
const PRIVATE_SEO_PATH_PREFIXES = [
    "/admin",
    "/auth",
    "/basvuru/yazar",
    "/forgot-password",
    "/kitap-inceleme/yeni",
    "/kurulum",
    "/login",
    "/makale/duzenle",
    "/makale/yeni",
    "/mesajlar",
    "/notifications",
    "/profil",
    "/reset-password",
    "/time-limit",
    "/yazar",
    "/yazar-paneli",
    "/yonetim",
];
const PUBLIC_NOINDEX_PATHS = new Set<string>([]);

function normalizeProductionSiteUrl(url: string) {
    const cleanUrl = url.replace(/\/+$/, "");

    try {
        const parsed = new URL(cleanUrl);
        if (parsed.hostname === "fizikhub.com" || parsed.hostname === "www.fizikhub.com") {
            return DEFAULT_SITE_URL;
        }
    } catch {
        return cleanUrl;
    }

    return cleanUrl;
}

export function getSiteUrl() {
    return normalizeProductionSiteUrl(process.env.NEXT_PUBLIC_APP_URL || DEFAULT_SITE_URL);
}

export function getCanonicalOrigin() {
    return DEFAULT_SITE_URL;
}

export function toCanonicalUrl(pathOrUrl: string) {
    try {
        const parsed = new URL(pathOrUrl);
        parsed.protocol = "https";
        parsed.hostname = "www.fizikhub.com";
        parsed.port = "";
        return parsed.toString().replace(/\/+$/, parsed.pathname === "/" ? "/" : "");
    } catch {
        return new URL(pathOrUrl, DEFAULT_SITE_URL).toString();
    }
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
    const lower = clean.toLocaleLowerCase("tr-TR");

    if (clean.length < 4) return false;
    if (/^(.)\1+$/i.test(clean)) return false;
    if (/^[\d\W_]+$/.test(clean)) return false;
    if (/^(test|deneme|taslak|lorem ipsum)$/i.test(lower)) return false;
    if (lower.startsWith("lorem ipsum")) return false;
    if (TEST_LIKE_PATTERN.test(lower)) return false;

    return true;
}

export function hasUsefulIndexableText(value: string | null | undefined, minLength = 80) {
    const clean = stripMarkdownForMeta(value);
    const lower = clean.toLocaleLowerCase("tr-TR");

    if (clean.length < minLength) return false;
    if (lower.includes("lorem ipsum dolor sit amet")) return false;

    return true;
}

export function isLikelyIndexableArticle(article: {
    title?: string | null;
    slug?: string | null;
    category?: string | null;
    excerpt?: string | null;
    summary?: string | null;
    content?: string | null;
}) {
    if (!article.slug || !isLikelyIndexableTitle(article.title)) return false;
    if (isTestLikeSlugOrTitle(article.slug, article.title)) return false;
    if (article.category === "Terim") return false;

    const visibleText = [article.excerpt, article.summary, article.content].filter(Boolean).join(" ");
    if (visibleText && !hasUsefulIndexableText(visibleText, 40)) return false;

    return true;
}

export function isTestLikeSlugOrTitle(slug?: string | null, title?: string | null) {
    const values = [slug, title].filter(Boolean).map((value) => stripMarkdownForMeta(value).toLocaleLowerCase("tr-TR"));

    return values.some((value) =>
        TEST_LIKE_PATTERN.test(value) ||
        /^test[-_\d]/i.test(value) ||
        value === "test" ||
        value === "deneme"
    );
}

export function getArticleCanonicalPath(article: { slug?: string | null; category?: string | null }) {
    if (!article.slug) return null;
    return `/${article.category === "Deney" ? "deney" : "makale"}/${article.slug}`;
}

export function isIndexableForumQuestion(question: {
    title?: string | null;
    content?: string | null;
    status?: string | null;
    answers?: Array<{ count?: number | null }> | null;
}) {
    if (question.status && question.status !== "published") return false;
    if (!isLikelyIndexableTitle(question.title) || isTestLikeSlugOrTitle(null, question.title)) return false;

    const answerCount = Number(question.answers?.[0]?.count || 0);
    const visibleText = [question.title, question.content].filter(Boolean).join(" ");
    return hasUsefulIndexableText(visibleText, 40) || answerCount > 0;
}

export function isIndexableProfile(profile: {
    username?: string | null;
    full_name?: string | null;
    bio?: string | null;
    is_writer?: boolean | null;
    is_verified?: boolean | null;
    articleCount?: number | null;
    questionCount?: number | null;
    answerCount?: number | null;
}) {
    if (!profile.username || isTestLikeSlugOrTitle(profile.username, profile.full_name)) return false;
    if (profile.is_writer || profile.is_verified) return true;
    if (hasUsefulIndexableText(profile.bio, 80)) return true;

    const contributionCount = Number(profile.articleCount || 0) + Number(profile.questionCount || 0) + Number(profile.answerCount || 0);
    return contributionCount >= 3 && Boolean(profile.full_name);
}

export function isPrivateSeoPath(pathname: string) {
    if (pathname === "/yazar/rehber" || pathname.startsWith("/yazar/rehber/")) {
        return false; // Author guide is a public resources page
    }
    return PRIVATE_SEO_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isTechnicalAssetPath(pathname: string) {
    return pathname.startsWith("/_next/") ||
        pathname === "/favicon.ico" ||
        pathname === "/manifest.json" ||
        pathname === "/sw.js" ||
        pathname.startsWith("/workbox-") ||
        /\.(?:woff2?|ttf|otf|eot|map)$/i.test(pathname);
}

export function isForbiddenSitemapUrl(url: string) {
    try {
        const parsed = new URL(url);
        return parsed.origin !== DEFAULT_SITE_URL ||
            parsed.pathname === "/search" ||
            parsed.pathname.startsWith("/blog") ||
            parsed.pathname === "/index" ||
            parsed.pathname.includes("*") ||
            PUBLIC_NOINDEX_PATHS.has(parsed.pathname) ||
            parsed.searchParams.has("kategori") ||
            parsed.searchParams.get("sort") === "latest" ||
            (parsed.pathname.startsWith("/makale/kategori/") && parsed.searchParams.toString().length > 0) ||
            isPrivateSeoPath(parsed.pathname) ||
            isTechnicalAssetPath(parsed.pathname) ||
            isTestLikeSlugOrTitle(parsed.pathname, null);
    } catch {
        return true;
    }
}
