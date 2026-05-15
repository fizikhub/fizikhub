export function getSiteUrl() {
    const configuredUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

    return (configuredUrl || "https://www.fizikhub.com").replace(/\/+$/, "");
}
