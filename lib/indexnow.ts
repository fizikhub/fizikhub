import { getSiteUrl, isForbiddenSitemapUrl, toCanonicalUrl } from "@/lib/seo-utils";

export type IndexNowSubmitResult = {
    submitted: boolean;
    skippedReason?: string;
    urls: string[];
    status?: number;
};

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export function getIndexNowKey() {
    const key = (process.env.INDEXNOW_KEY || process.env.NEXT_PUBLIC_INDEXNOW_KEY || "").trim();
    if (!key || key.length < 8 || key.length > 128) return null;
    return key;
}

export function getIndexNowKeyLocation(baseUrl = getSiteUrl()) {
    return `${baseUrl}/indexnow-key.txt`;
}

function normalizeIndexNowUrls(urls: string[], baseUrl: string) {
    const host = new URL(baseUrl).host;
    const seen = new Set<string>();

    return urls.flatMap((url) => {
        try {
            const canonical = toCanonicalUrl(url);
            const parsed = new URL(canonical);
            if (parsed.host !== host) return [];
            if (isForbiddenSitemapUrl(canonical)) return [];
            if (seen.has(canonical)) return [];
            seen.add(canonical);
            return [canonical];
        } catch {
            return [];
        }
    });
}

export async function submitIndexNowUrls(urls: string[], options: { baseUrl?: string } = {}): Promise<IndexNowSubmitResult> {
    const key = getIndexNowKey();
    if (!key) {
        return { submitted: false, skippedReason: "missing-indexnow-key", urls: [] };
    }

    const baseUrl = options.baseUrl || getSiteUrl();
    const normalizedUrls = normalizeIndexNowUrls(urls, baseUrl);
    if (normalizedUrls.length === 0) {
        return { submitted: false, skippedReason: "no-indexable-urls", urls: [] };
    }

    const response = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
            host: new URL(baseUrl).host,
            key,
            keyLocation: getIndexNowKeyLocation(baseUrl),
            urlList: normalizedUrls.slice(0, 10000),
        }),
        cache: "no-store",
    });

    return {
        submitted: response.ok,
        skippedReason: response.ok ? undefined : "indexnow-rejected",
        urls: normalizedUrls,
        status: response.status,
    };
}
