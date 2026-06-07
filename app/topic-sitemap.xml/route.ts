import { getSiteUrl } from "@/lib/seo-utils";
import { getTopicClusterHref, SEO_TOPIC_CLUSTERS } from "@/lib/seo-topic-clusters";
import { escapeXml } from "@/lib/xml";

export const revalidate = 3600;

const TOPIC_LAST_MODIFIED = "2026-06-07T00:00:00.000+03:00";

export async function GET() {
    const baseUrl = getSiteUrl();

    const urls = SEO_TOPIC_CLUSTERS
        .map((cluster) => `  <url>
    <loc>${escapeXml(`${baseUrl}${getTopicClusterHref(cluster)}`)}</loc>
    <lastmod>${escapeXml(TOPIC_LAST_MODIFIED)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.78</priority>
  </url>`)
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
    });
}
