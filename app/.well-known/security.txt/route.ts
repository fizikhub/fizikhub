import { getSiteUrl } from "@/lib/seo-utils";

export const revalidate = 86400;

export function GET() {
    const baseUrl = getSiteUrl();
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    const body = [
        "Contact: mailto:iletisim@fizikhub.com",
        `Expires: ${expires}`,
        `Canonical: ${baseUrl}/.well-known/security.txt`,
        `Policy: ${baseUrl}/gizlilik-politikasi`,
        "Preferred-Languages: tr, en",
        "",
    ].join("\n");

    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
            "X-Robots-Tag": "noindex, nofollow",
        },
    });
}
