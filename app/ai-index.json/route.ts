import { simulations } from "@/components/simulations/data";
import { AI_CRAWLER_USER_AGENTS, AI_DISCOVERY_ROUTES, AI_PUBLIC_CONTENT_PREFIXES } from "@/lib/ai-discovery";
import { getDictionaryTerms } from "@/lib/api";
import { createStaticClient } from "@/lib/supabase-server";
import { slugify } from "@/lib/slug";
import { getRelatedUrlsForCluster, getTopicClusterHref, SEO_TOPIC_CLUSTERS } from "@/lib/seo-topic-clusters";
import { getArticleCanonicalPath, getSiteUrl, hasUsefulIndexableText, isIndexableForumQuestion, isLikelyIndexableArticle, isLikelyIndexableTitle, truncateForMeta } from "@/lib/seo-utils";

export const revalidate = 3600;

type AiIndexItem = {
    type: "article" | "forum" | "dictionary" | "quiz" | "simulation" | "topic";
    url: string;
    canonicalPath: string;
    title: string;
    description: string;
    topics: string[];
    intentQuestions: string[];
    entityType: string;
    contentFreshness: "fresh" | "recent" | "evergreen";
    updatedAt: string;
    language: "tr-TR";
    schemaTypes: string[];
    clusterSlugs: string[];
    relatedUrls: string[];
};

function unique(values: Array<string | null | undefined>) {
    return Array.from(new Set(values.filter(Boolean) as string[]));
}

function clusterTopicsForResource(kind: "article" | "term" | "quiz" | "simulation", slug: string) {
    return SEO_TOPIC_CLUSTERS.filter((cluster) => {
        if (kind === "article") return cluster.articleSlugs.includes(slug);
        if (kind === "term") return cluster.termSlugs.includes(slug);
        if (kind === "quiz") return cluster.quizSlugs.includes(slug);
        return cluster.simulationSlugs.includes(slug);
    });
}

function clusterSlugsForResource(kind: "article" | "term" | "quiz" | "simulation", slug: string) {
    return clusterTopicsForResource(kind, slug).map((cluster) => cluster.slug);
}

function intentQuestionsForResource(kind: "article" | "term" | "quiz" | "simulation", slug: string) {
    return unique(clusterTopicsForResource(kind, slug).flatMap((cluster) => cluster.intentQuestions)).slice(0, 8);
}

function contentFreshnessFor(updatedAt: string | null | undefined): AiIndexItem["contentFreshness"] {
    if (!updatedAt) return "evergreen";

    const ageDays = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays <= 14) return "fresh";
    if (ageDays <= 120) return "recent";
    return "evergreen";
}

function relatedUrlsFor(kind: "article" | "term" | "quiz" | "simulation", slug: string, baseUrl: string) {
    const clusters = clusterTopicsForResource(kind, slug);

    return unique([
        ...clusters.map((cluster) => `${baseUrl}${getTopicClusterHref(cluster)}`),
        ...clusters.flatMap(getRelatedUrlsForCluster).map((link) => `${baseUrl}${link.href}`),
    ])
        .filter((url) => {
            if (kind === "article") return url !== `${baseUrl}/makale/${slug}`;
            if (kind === "term") return url !== `${baseUrl}/sozluk/${slug}`;
            if (kind === "quiz") return url !== `${baseUrl}/testler/${slug}`;
            return url !== `${baseUrl}/simulasyonlar/${slug}`;
        })
        .slice(0, 12);
}

function topicsFor(kind: "article" | "term" | "quiz" | "simulation", slug: string, fallback: string[] = []) {
    return unique([
        ...clusterTopicsForResource(kind, slug).map((cluster) => cluster.title),
        ...fallback,
    ]).slice(0, 10);
}

function getAnswerCount(question: { answers?: Array<{ count?: number | null }> | null }) {
    return Number(question.answers?.[0]?.count || 0);
}

export async function GET() {
    const supabase = createStaticClient();
    const baseUrl = getSiteUrl();

    const [articlesResult, questionsResult, quizzesResult, terms] = await Promise.all([
        supabase
            .from("articles")
            .select("*")
            .eq("status", "published")
            .not("slug", "is", null)
            .order("created_at", { ascending: false })
            .limit(500),
        supabase
            .from("questions")
            .select("id, title, content, category, tags, created_at, updated_at, votes, status, answers(count)")
            .eq("status", "published")
            .order("created_at", { ascending: false })
            .limit(300),
        supabase
            .from("quizzes")
            .select("id, title, slug, description, created_at")
            .order("created_at", { ascending: false })
            .limit(200),
        getDictionaryTerms(),
    ]);

    const quizIds = (quizzesResult.data || []).map((quiz) => quiz.id).filter(Boolean);
    const questionCounts = new Map<string, number>();

    if (quizIds.length > 0) {
        const { data: quizQuestions } = await supabase
            .from("quiz_questions")
            .select("quiz_id")
            .in("quiz_id", quizIds);

        for (const question of quizQuestions || []) {
            if (!question.quiz_id) continue;
            questionCounts.set(question.quiz_id, (questionCounts.get(question.quiz_id) || 0) + 1);
        }
    }

    const articleItems: AiIndexItem[] = (articlesResult.data || [])
        .flatMap((article) => {
            if (!article.slug || !isLikelyIndexableArticle(article)) return [];
            const isExperiment = article.category === "Deney";
            const canonicalPath = getArticleCanonicalPath(article);
            if (!canonicalPath) return [];

            return [{
                type: "article",
                url: `${baseUrl}${canonicalPath}`,
                canonicalPath,
                title: article.title || article.slug,
                description: truncateForMeta(article.excerpt || article.content || `${article.title} hakkında Fizikhub makalesi.`, 220),
                topics: topicsFor("article", article.slug, [article.category || "Fizik"]),
                intentQuestions: intentQuestionsForResource("article", article.slug),
                entityType: isExperiment ? "experiment-article" : "article",
                contentFreshness: contentFreshnessFor(article.updated_at || article.created_at),
                updatedAt: new Date(article.updated_at || article.created_at || Date.now()).toISOString(),
                language: "tr-TR",
                schemaTypes: isExperiment ? ["BlogPosting", "WebPage"] : ["BlogPosting", "WebPage", "BreadcrumbList"],
                clusterSlugs: clusterSlugsForResource("article", article.slug),
                relatedUrls: relatedUrlsFor("article", article.slug, baseUrl),
            }];
        });

    const forumItems: AiIndexItem[] = (questionsResult.data || [])
        .flatMap((question) => {
            const answerCount = getAnswerCount(question);
            if (!isIndexableForumQuestion(question)) return [];

            return [{
                type: "forum",
                url: `${baseUrl}/forum/${question.id}`,
                canonicalPath: `/forum/${question.id}`,
                title: question.title || `Fizikhub forum sorusu ${question.id}`,
                description: truncateForMeta(question.content || `${question.title} hakkında Fizikhub forum tartışması.`, 220),
                topics: unique([question.category, ...(Array.isArray(question.tags) ? question.tags : [])]).slice(0, 10),
                intentQuestions: [],
                entityType: answerCount > 0 ? "answered-question" : "forum-question",
                contentFreshness: contentFreshnessFor(question.updated_at || question.created_at),
                updatedAt: new Date(question.updated_at || question.created_at || Date.now()).toISOString(),
                language: "tr-TR",
                schemaTypes: answerCount > 0 ? ["QAPage", "Question", "Answer"] : ["WebPage"],
                clusterSlugs: [],
                relatedUrls: [`${baseUrl}/forum`, `${baseUrl}/makale`, `${baseUrl}/sozluk`],
            }];
        });

    const dictionaryItems: AiIndexItem[] = terms
        .filter((term) => isLikelyIndexableTitle(term.term) && hasUsefulIndexableText(term.definition, 40))
        .map((term) => {
            const termSlug = slugify(term.term);
            return {
                type: "dictionary",
                url: `${baseUrl}/sozluk/${termSlug}`,
                canonicalPath: `/sozluk/${termSlug}`,
                title: term.term,
                description: truncateForMeta(term.definition, 220),
                topics: topicsFor("term", termSlug, [term.category || "Bilim sözlüğü"]),
                intentQuestions: intentQuestionsForResource("term", termSlug),
                entityType: "defined-term",
                contentFreshness: "evergreen" as const,
                updatedAt: new Date(term.created_at || Date.now()).toISOString(),
                language: "tr-TR",
                schemaTypes: ["DefinedTerm", "DefinedTermSet", "WebPage"],
                clusterSlugs: clusterSlugsForResource("term", termSlug),
                relatedUrls: relatedUrlsFor("term", termSlug, baseUrl),
            };
        });

    const quizItems: AiIndexItem[] = (quizzesResult.data || [])
        .flatMap((quiz) => {
            const count = quiz.id ? questionCounts.get(quiz.id) || 0 : 0;
            if (!quiz.slug || !isLikelyIndexableTitle(quiz.title) || (count < 3 && !hasUsefulIndexableText(quiz.description, 40))) return [];

            return [{
                type: "quiz",
                url: `${baseUrl}/testler/${quiz.slug}`,
                canonicalPath: `/testler/${quiz.slug}`,
                title: quiz.title,
                description: truncateForMeta(quiz.description || `${quiz.title} testiyle fizik bilgini ölç.`, 220),
                topics: topicsFor("quiz", quiz.slug, ["Fizik testi", "TYT AYT YKS fizik"]),
                intentQuestions: intentQuestionsForResource("quiz", quiz.slug),
                entityType: "quiz",
                contentFreshness: contentFreshnessFor(quiz.created_at),
                updatedAt: new Date(quiz.created_at || Date.now()).toISOString(),
                language: "tr-TR",
                schemaTypes: ["Quiz", "LearningResource", "BreadcrumbList"],
                clusterSlugs: clusterSlugsForResource("quiz", quiz.slug),
                relatedUrls: relatedUrlsFor("quiz", quiz.slug, baseUrl),
            }];
        });

    const simulationItems: AiIndexItem[] = simulations.map((sim) => ({
        type: "simulation",
        url: `${baseUrl}/simulasyonlar/${sim.slug}`,
        canonicalPath: `/simulasyonlar/${sim.slug}`,
        title: sim.title,
        description: truncateForMeta(`${sim.description} Temel formül: ${sim.formula}.`, 220),
        topics: topicsFor("simulation", sim.slug, sim.tags),
        intentQuestions: intentQuestionsForResource("simulation", sim.slug),
        entityType: "interactive-simulation",
        contentFreshness: "evergreen" as const,
        updatedAt: "2026-05-13T00:00:00.000+03:00",
        language: "tr-TR",
        schemaTypes: ["LearningResource", "SoftwareApplication", "BreadcrumbList"],
        clusterSlugs: clusterSlugsForResource("simulation", sim.slug),
        relatedUrls: relatedUrlsFor("simulation", sim.slug, baseUrl),
    }));

    const topicItems: AiIndexItem[] = SEO_TOPIC_CLUSTERS.map((cluster) => ({
        type: "topic",
        url: `${baseUrl}${getTopicClusterHref(cluster)}`,
        canonicalPath: getTopicClusterHref(cluster),
        title: cluster.title,
        description: truncateForMeta(`${cluster.title}: ${cluster.intentQuestions.join(" ")} ${cluster.aliases.join(", ")} kaynakları.`, 220),
        topics: unique([cluster.title, ...cluster.aliases]).slice(0, 10),
        intentQuestions: cluster.intentQuestions,
        entityType: "topic-cluster",
        contentFreshness: "evergreen",
        updatedAt: "2026-05-13T00:00:00.000+03:00",
        language: "tr-TR",
        schemaTypes: ["CollectionPage", "ItemList", "LearningResource", "FAQPage", "BreadcrumbList"],
        clusterSlugs: [cluster.slug],
        relatedUrls: unique(getRelatedUrlsForCluster(cluster).map((link) => `${baseUrl}${link.href}`)).slice(0, 12),
    }));

    return Response.json({
        name: "Fizikhub AI Index",
        generatedAt: new Date().toISOString(),
        language: "tr-TR",
        policy: {
            summarization: "allowed",
            citation: "required",
            note: "Google AI Mode ve AI Overviews normal Google Search indeksleme, snippet izni ve Googlebot erişiminden beslenir. Bu manifest sitemap yerine geçmeyen yardımcı bir AI keşif yüzeyidir.",
        },
        discovery: {
            canonicalHost: baseUrl,
            entryPoints: AI_DISCOVERY_ROUTES.map((route) => ({
                url: `${baseUrl}${route.path}`,
                label: route.label,
                mediaType: route.mediaType,
                description: route.description,
            })),
            aiSitemap: `${baseUrl}/ai-sitemap.xml`,
            publicContentPrefixes: AI_PUBLIC_CONTENT_PREFIXES,
            crawlerUserAgents: AI_CRAWLER_USER_AGENTS,
            preferredCitation: "Kanonik Fizikhub URL'sini kaynak olarak gösterin ve varsa konu hub URL'sini ek kaynak olarak kullanın.",
        },
        sources: {
            sitemapIndex: `${baseUrl}/sitemap-index.xml`,
            topicSitemap: `${baseUrl}/topic-sitemap.xml`,
            aiSitemap: `${baseUrl}/ai-sitemap.xml`,
            llmsTxt: `${baseUrl}/llms.txt`,
            rss: `${baseUrl}/feed.xml`,
        },
        items: [
            ...topicItems,
            ...articleItems,
            ...forumItems,
            ...dictionaryItems,
            ...quizItems,
            ...simulationItems,
        ],
    }, {
        headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
