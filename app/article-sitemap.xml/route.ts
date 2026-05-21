import { createStaticClient } from "@/lib/supabase-server";
import { escapeXml } from "@/lib/xml";
import { getArticleCanonicalPath, getSiteUrl, isLikelyIndexableArticle, toAbsoluteUrl } from "@/lib/seo-utils";

export const revalidate = 3600;

export async function GET() {
    const supabase = createStaticClient();
    const baseUrl = getSiteUrl();

    const { data: articles, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .not("slug", "is", null)
        .order("created_at", { ascending: false })
        .limit(5000);

    if (error) {
        console.error("article-sitemap error:", error);
    }

    const urls = (articles || [])
        .flatMap((article) => {
            if (!article.slug || !isLikelyIndexableArticle(article)) return [];

            const canonicalPath = getArticleCanonicalPath(article);
            if (!canonicalPath) return [];
            const loc = `${baseUrl}${canonicalPath}`;
            const imageUrl = toAbsoluteUrl(article.cover_url || article.image_url, baseUrl);
            const imageXml = imageUrl
                ? `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(article.title || article.slug)}</image:title>
    </image:image>`
                : "";

            return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(new Date(article.updated_at || article.created_at || Date.now()).toISOString())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${article.category === "Deney" ? "0.75" : "0.85"}</priority>${imageXml}
  </url>`;
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
    });
}
