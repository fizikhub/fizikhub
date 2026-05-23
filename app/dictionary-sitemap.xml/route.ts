import { getDictionaryTerms } from "@/lib/api";
import { slugify } from "@/lib/slug";
import { escapeXml } from "@/lib/xml";
import { getSiteUrl, hasUsefulIndexableText, isLikelyIndexableTitle } from "@/lib/seo-utils";

export const revalidate = 3600;

export async function GET() {
    const baseUrl = getSiteUrl();
    const terms = await getDictionaryTerms();

    const urls = terms
        .filter((term) => isLikelyIndexableTitle(term.term) && hasUsefulIndexableText(term.definition, 40))
        .map((term) => `  <url>
    <loc>${escapeXml(`${baseUrl}/sozluk/${slugify(term.term)}`)}</loc>
    <lastmod>${escapeXml(new Date(term.created_at || Date.now()).toISOString())}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
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
