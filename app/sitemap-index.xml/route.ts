import { getSiteUrl } from "@/lib/seo-utils";
import { AI_DISCOVERY_LAST_MODIFIED } from "@/lib/ai-discovery";
import { escapeXml } from "@/lib/xml";

export const revalidate = 3600;

const SITEMAPS = [
    "/sitemap.xml",
    "/topic-sitemap.xml",
    "/article-sitemap.xml",
    "/forum-sitemap.xml",
    "/dictionary-sitemap.xml",
    "/news-sitemap.xml",
    "/ai-sitemap.xml",
    "/author-sitemap.xml",
];

export async function GET() {
    const baseUrl = getSiteUrl();
    const lastmod = AI_DISCOVERY_LAST_MODIFIED;

    const entries = SITEMAPS.map((path) => `  <sitemap>
    <loc>${escapeXml(`${baseUrl}${path}`)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
  </sitemap>`).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
    });
}
