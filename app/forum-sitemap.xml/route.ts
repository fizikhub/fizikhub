import { createStaticClient } from "@/lib/supabase-server";
import { escapeXml } from "@/lib/xml";
import { getSiteUrl, hasUsefulIndexableText, isLikelyIndexableTitle } from "@/lib/seo-utils";

export const revalidate = 1800;

function getAnswerCount(question: { answers?: Array<{ count?: number | null }> | null }) {
    return Number(question.answers?.[0]?.count || 0);
}

function isIndexableQuestion(question: {
    title?: string | null;
    content?: string | null;
    answers?: Array<{ count?: number | null }> | null;
}) {
    const visibleText = [question.title, question.content].filter(Boolean).join(" ");
    return isLikelyIndexableTitle(question.title) && (hasUsefulIndexableText(visibleText, 40) || getAnswerCount(question) > 0);
}

export async function GET() {
    const supabase = createStaticClient();
    const baseUrl = getSiteUrl();

    const { data: questions, error } = await supabase
        .from("questions")
        .select("id, title, content, created_at, votes, answers(count)")
        .order("created_at", { ascending: false })
        .limit(1000);

    if (error) {
        console.error("forum-sitemap error:", error);
    }

    const urls = (questions || [])
        .filter(isIndexableQuestion)
        .map((question) => {
            const answerCount = getAnswerCount(question);
            return `  <url>
    <loc>${escapeXml(`${baseUrl}/forum/${question.id}`)}</loc>
    <lastmod>${escapeXml(new Date(question.created_at || Date.now()).toISOString())}</lastmod>
    <changefreq>${answerCount > 0 ? "weekly" : "monthly"}</changefreq>
    <priority>${answerCount > 0 || (question.votes || 0) > 2 ? "0.75" : "0.55"}</priority>
  </url>`;
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=600",
        },
    });
}

