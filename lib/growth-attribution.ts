export const GROWTH_ATTRIBUTION_STORAGE_KEY = "fizikhub:first-touch:v1";
export const GROWTH_LAST_TOUCH_STORAGE_KEY = "fizikhub:last-touch:v1";
export const GROWTH_ATTRIBUTION_COOKIE = "fh_attribution";

const AI_REFERRER_HOSTS = [
    "chatgpt.com",
    "openai.com",
    "perplexity.ai",
    "claude.ai",
    "anthropic.com",
    "gemini.google.com",
    "copilot.microsoft.com",
];

const SEARCH_REFERRER_HOSTS = ["google.", "bing.com", "yandex.", "duckduckgo.com", "search.brave.com"];
const SOCIAL_REFERRER_HOSTS = ["x.com", "twitter.com", "instagram.com", "facebook.com", "linkedin.com", "t.co", "youtube.com"];
const MAX_VALUE_LENGTH = 120;
const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "source", "ref"] as const;

export type GrowthAttribution = {
    source: string;
    medium: string;
    campaign?: string;
    content?: string;
    term?: string;
    referrerHost?: string;
    landingPath: string;
    capturedAt: string;
};

function cleanValue(value: string | null | undefined, maxLength = MAX_VALUE_LENGTH): string | undefined {
    const clean = value?.replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
    return clean || undefined;
}

export function serializeGrowthTrackingParams(searchParams: URLSearchParams): string | null {
    const values = Object.fromEntries(
        TRACKING_KEYS.flatMap((key) => {
            const value = cleanValue(searchParams.get(key));
            return value ? [[key, value]] : [];
        }),
    );
    return Object.keys(values).length > 0 ? JSON.stringify(values) : null;
}

export function parseGrowthTrackingCookie(cookieHeader: string): URLSearchParams {
    const cookie = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${GROWTH_ATTRIBUTION_COOKIE}=`));
    if (!cookie) return new URLSearchParams();

    try {
        const parsed = JSON.parse(decodeURIComponent(cookie.slice(GROWTH_ATTRIBUTION_COOKIE.length + 1))) as Record<string, unknown>;
        const params = new URLSearchParams();
        for (const key of TRACKING_KEYS) {
            const value = cleanValue(typeof parsed[key] === "string" ? parsed[key] : undefined);
            if (value) params.set(key, value);
        }
        return params;
    } catch {
        return new URLSearchParams();
    }
}

function getReferrerHost(referrer: string): string | undefined {
    if (!referrer) return undefined;

    try {
        return new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    } catch {
        return undefined;
    }
}

function hostMatches(host: string | undefined, patterns: string[]) {
    return Boolean(host && patterns.some((pattern) => host === pattern || host.endsWith(`.${pattern}`) || host.includes(pattern)));
}

export function normalizeGrowthAttribution(value: unknown): GrowthAttribution | null {
    if (!value || typeof value !== "object") return null;
    const candidate = value as Partial<Record<keyof GrowthAttribution, unknown>>;
    const source = cleanValue(typeof candidate.source === "string" ? candidate.source : undefined);
    const medium = cleanValue(typeof candidate.medium === "string" ? candidate.medium : undefined);
    const landingPath = cleanValue(typeof candidate.landingPath === "string" ? candidate.landingPath : undefined, 200);
    const capturedAt = typeof candidate.capturedAt === "string" && !Number.isNaN(Date.parse(candidate.capturedAt))
        ? new Date(candidate.capturedAt).toISOString()
        : new Date().toISOString();

    if (!source || !medium || !landingPath || !landingPath.startsWith("/")) return null;

    return {
        source,
        medium,
        campaign: cleanValue(typeof candidate.campaign === "string" ? candidate.campaign : undefined),
        content: cleanValue(typeof candidate.content === "string" ? candidate.content : undefined),
        term: cleanValue(typeof candidate.term === "string" ? candidate.term : undefined),
        referrerHost: cleanValue(typeof candidate.referrerHost === "string" ? candidate.referrerHost : undefined),
        landingPath,
        capturedAt,
    };
}

export function extractGrowthAttribution(
    searchParams: URLSearchParams,
    referrer: string,
    landingPath: string,
    now = new Date(),
): GrowthAttribution {
    const referrerHost = getReferrerHost(referrer);
    const explicitSource = cleanValue(searchParams.get("utm_source") || searchParams.get("source") || searchParams.get("ref"));
    const isAi = hostMatches(referrerHost, AI_REFERRER_HOSTS);
    const isSearch = hostMatches(referrerHost, SEARCH_REFERRER_HOSTS);
    const isSocial = hostMatches(referrerHost, SOCIAL_REFERRER_HOSTS);
    const inferredSource = isAi ? "ai" : isSearch ? "organic_search" : isSocial ? "social" : referrerHost ? referrerHost : "direct";
    const inferredMedium = isAi ? "ai_referral" : isSearch ? "organic" : isSocial ? "social" : referrerHost ? "referral" : "none";

    return {
        source: explicitSource || inferredSource,
        medium: cleanValue(searchParams.get("utm_medium")) || inferredMedium,
        campaign: cleanValue(searchParams.get("utm_campaign")),
        content: cleanValue(searchParams.get("utm_content")),
        term: cleanValue(searchParams.get("utm_term")),
        referrerHost,
        landingPath: cleanValue(landingPath, 200) || "/",
        capturedAt: now.toISOString(),
    };
}

export function getLandingContentType(pathname: string) {
    if (pathname.startsWith("/makale/")) return "article";
    if (pathname.startsWith("/forum/")) return "forum";
    if (pathname.startsWith("/sozluk/")) return "dictionary";
    if (pathname.startsWith("/testler/")) return "quiz";
    if (pathname.startsWith("/simulasyonlar/")) return "simulation";
    if (pathname.startsWith("/konular/")) return "topic";
    return pathname === "/" ? "home" : "page";
}

export function buildTrackedShareUrl(rawUrl: string, channel: string, contentType: string) {
    const url = new URL(rawUrl, "https://www.fizikhub.com");
    url.searchParams.set("utm_source", cleanValue(channel) || "share");
    url.searchParams.set("utm_medium", "social");
    url.searchParams.set("utm_campaign", "fizikhub_share");
    url.searchParams.set("utm_content", cleanValue(contentType) || "content");
    return url.toString();
}
