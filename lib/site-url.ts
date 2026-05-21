export function getSiteUrl() {
    const configuredUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

    const cleanUrl = (configuredUrl || "https://www.fizikhub.com").replace(/\/+$/, "");

    try {
        const parsed = new URL(cleanUrl);
        if (parsed.hostname === "fizikhub.com" || parsed.hostname === "www.fizikhub.com") {
            return "https://www.fizikhub.com";
        }
    } catch {
        return cleanUrl;
    }

    return cleanUrl;
}
