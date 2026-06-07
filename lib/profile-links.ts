type SocialPlatform = "twitter" | "github" | "linkedin" | "instagram";

const SOCIAL_HOSTS: Record<SocialPlatform, string> = {
    twitter: "twitter.com",
    github: "github.com",
    linkedin: "linkedin.com/in",
    instagram: "instagram.com",
};

const SOCIAL_HANDLE_PATTERNS: Record<SocialPlatform, RegExp> = {
    twitter: /^[A-Za-z0-9_]{1,15}$/,
    github: /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/,
    linkedin: /^[A-Za-z0-9_-]{3,100}$/,
    instagram: /^[A-Za-z0-9._]{1,30}$/,
};

export function safeExternalUrl(value: string | null | undefined) {
    const trimmed = value?.trim();
    if (!trimmed) return null;

    try {
        const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`);
        if (url.protocol !== "https:" && url.protocol !== "http:") return null;
        if (!url.hostname || url.username || url.password) return null;
        return url.toString();
    } catch {
        return null;
    }
}

export function externalUrlLabel(value: string | null | undefined) {
    const safeUrl = safeExternalUrl(value);
    if (!safeUrl) return "";

    const url = new URL(safeUrl);
    return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`.replace(/^www\./, "");
}

export function socialProfileUrl(platform: SocialPlatform, value: string | null | undefined) {
    const trimmed = value?.trim();
    if (!trimmed) return null;

    const host = SOCIAL_HOSTS[platform];
    const hostRoot = host.split("/")[0];
    let handle = trimmed.replace(/^@+/, "");

    try {
        const parsed = new URL(/^[a-z][a-z\d+.-]*:/i.test(handle) ? handle : `https://${handle}`);
        const hostname = parsed.hostname.replace(/^www\./, "").toLocaleLowerCase("en-US");
        if (hostname === hostRoot) {
            handle = parsed.pathname.replace(/^\/+/, "");
            if (platform === "linkedin" && handle.startsWith("in/")) {
                handle = handle.slice(3);
            }
            handle = handle.split("/")[0] || "";
        }
    } catch {
        // Plain handles are handled by the validation below.
    }

    handle = handle.replace(/^\/+|\/+$/g, "");
    if (!SOCIAL_HANDLE_PATTERNS[platform].test(handle)) return null;

    return `https://${host}/${handle}`;
}
