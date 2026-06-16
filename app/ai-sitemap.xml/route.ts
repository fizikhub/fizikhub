import { simulations } from "@/components/simulations/data";
import { AI_CORE_ROUTES, AI_DISCOVERY_LAST_MODIFIED, AI_DISCOVERY_ROUTES } from "@/lib/ai-discovery";
import { getDictionaryTerms } from "@/lib/api";
import { escapeXml } from "@/lib/xml";
import { slugify } from "@/lib/slug";
import { createStaticClient, hasSupabasePublicConfig } from "@/lib/supabase-server";
import { getTopicClusterHref, SEO_TOPIC_CLUSTERS } from "@/lib/seo-topic-clusters";
import { getArticleCanonicalPath, getSiteUrl, hasUsefulIndexableText, isIndexableForumQuestion, isIndexableProfile, isLikelyIndexableArticle, isLikelyIndexableTitle } from "@/lib/seo-utils";

export const revalidate = 3600;

type SitemapEntry = {
    loc: string;
    lastmod: string;
    changefreq: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
    priority: string;
};

function toIsoDate(value?: string | null) {
    return new Date(value || AI_DISCOVERY_LAST_MODIFIED).toISOString();
}

function entry(baseUrl: string, path: string, options: Omit<SitemapEntry, "loc">): SitemapEntry {
    return {
        loc: `${baseUrl}${path}`,
        ...options,
    };
}

function uniqueEntries(entries: SitemapEntry[]) {
    const seen = new Set<string>();
    return entries.filter((item) => {
        if (seen.has(item.loc)) return false;
        seen.add(item.loc);
        return true;
    });
}

async function getDynamicEntries(baseUrl: string): Promise<SitemapEntry[]> {
    if (!hasSupabasePublicConfig()) return [];

    try {
        const supabase = createStaticClient();
        const [articlesResult, questionsResult, quizzesResult, profilesResult, terms] = await Promise.all([
            supabase
                .from("articles")
                .select("title, slug, category, excerpt, summary, content, created_at, updated_at")
                .eq("status", "published")
                .not("slug", "is", null)
                .order("created_at", { ascending: false })
                .limit(240),
            supabase
                .from("questions")
                .select("id, title, content, created_at, votes, status, answers(count)")
                .eq("status", "published")
                .order("created_at", { ascending: false })
                .limit(180),
            supabase
                .from("quizzes")
                .select("title, slug, description, created_at")
                .order("created_at", { ascending: false })
                .limit(120),
            supabase
                .from("profiles")
                .select("username, full_name, bio, is_writer, is_verified, created_at, updated_at")
                .not("username", "is", null)
                .order("updated_at", { ascending: false, nullsFirst: false })
                .limit(120),
            getDictionaryTerms(),
        ]);

        const articleEntries = (articlesResult.data || []).flatMap((article) => {
            if (!article.slug || !isLikelyIndexableArticle(article)) return [];
            const canonicalPath = getArticleCanonicalPath(article);
            if (!canonicalPath) return [];

            return entry(baseUrl, canonicalPath, {
                lastmod: toIsoDate(article.updated_at || article.created_at),
                changefreq: "weekly",
                priority: article.category === "Deney" ? "0.78" : "0.88",
            });
        });

        const questionEntries = (questionsResult.data || [])
            .filter(isIndexableForumQuestion)
            .map((question) => entry(baseUrl, `/forum/${question.id}`, {
                lastmod: toIsoDate(question.created_at),
                changefreq: Number(question.answers?.[0]?.count || 0) > 0 ? "weekly" : "monthly",
                priority: Number(question.answers?.[0]?.count || 0) > 0 || Number(question.votes || 0) > 2 ? "0.72" : "0.58",
            }));

        const dictionaryEntries = terms
            .filter((term) => isLikelyIndexableTitle(term.term) && hasUsefulIndexableText(term.definition, 40))
            .map((term) => entry(baseUrl, `/sozluk/${slugify(term.term)}`, {
                lastmod: toIsoDate(term.created_at),
                changefreq: "monthly",
                priority: "0.64",
            }));

        const quizEntries = (quizzesResult.data || [])
            .filter((quiz) => quiz.slug && isLikelyIndexableTitle(quiz.title) && hasUsefulIndexableText(quiz.description, 20))
            .map((quiz) => entry(baseUrl, `/testler/${quiz.slug}`, {
                lastmod: toIsoDate(quiz.created_at),
                changefreq: "monthly",
                priority: "0.58",
            }));

        const profileEntries = (profilesResult.data || [])
            .filter((profile) => isIndexableProfile(profile))
            .map((profile) => entry(baseUrl, `/kullanici/${profile.username}`, {
                lastmod: toIsoDate(profile.updated_at || profile.created_at),
                changefreq: "weekly",
                priority: profile.is_writer || profile.is_verified ? "0.62" : "0.45",
            }));

        return [...articleEntries, ...questionEntries, ...dictionaryEntries, ...quizEntries, ...profileEntries];
    } catch (error) {
        console.error("ai-sitemap dynamic entries error:", error);
        return [];
    }
}

export async function GET() {
    const baseUrl = getSiteUrl();

    const coreEntries = AI_CORE_ROUTES.map((route) => entry(baseUrl, route.path, {
        lastmod: AI_DISCOVERY_LAST_MODIFIED,
        changefreq: route.changeFrequency,
        priority: route.priority,
    }));

    const topicEntries = SEO_TOPIC_CLUSTERS.map((cluster) => entry(baseUrl, getTopicClusterHref(cluster), {
        lastmod: AI_DISCOVERY_LAST_MODIFIED,
        changefreq: "weekly",
        priority: "0.82",
    }));

    const learningGraphEntries = AI_DISCOVERY_ROUTES
        .filter((route) => route.path === "/simulation-learning.json")
        .map((route) => entry(baseUrl, route.path, {
            lastmod: AI_DISCOVERY_LAST_MODIFIED,
            changefreq: "weekly",
            priority: "0.76",
        }));

    const simulationEntries = simulations.map((simulation) => entry(baseUrl, `/simulasyonlar/${simulation.slug}`, {
        lastmod: AI_DISCOVERY_LAST_MODIFIED,
        changefreq: "monthly",
        priority: "0.70",
    }));

    const dynamicEntries = await getDynamicEntries(baseUrl);
    const urls = uniqueEntries([
        ...coreEntries,
        ...topicEntries,
        ...learningGraphEntries,
        ...simulationEntries,
        ...dynamicEntries,
    ])
        .map((item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${escapeXml(item.lastmod)}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`)
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
