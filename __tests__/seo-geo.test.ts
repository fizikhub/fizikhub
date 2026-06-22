import { describe, expect, it } from "vitest";
import { GET as robotsTxt } from "@/app/robots.txt/route";
import { GET as aiSitemap } from "@/app/ai-sitemap.xml/route";
import { GET as authorSitemap } from "@/app/author-sitemap.xml/route";
import { GET as openSearchDescriptor } from "@/app/opensearch.xml/route";
import { GET as sitemapIndex } from "@/app/sitemap-index.xml/route";
import { GET as topicSitemap } from "@/app/topic-sitemap.xml/route";
import { AI_CITATION_POLICY, AI_CONTENT_PROVENANCE, AI_CRAWLER_USER_AGENTS, AI_DISCOVERY_ROUTES, buildAiArticleSchemaTypes, buildAiCitationText } from "@/lib/ai-discovery";
import { buildSimulationCourseJsonLd, buildSimulationCourseListJsonLd, type SimulationCourseSource } from "@/lib/educational-schema";
import { isKnownAiCrawlerUserAgent } from "@/lib/ai-discovery";
import { buildForumDiscussionPostingItem, getForumAnswerUpvoteCount } from "@/lib/forum-structured-data";
import { getVectorUrl } from "@/lib/search-results";
import { serializeScriptJson } from "@/lib/script-json";
import { safeExternalUrl, socialProfileUrl } from "@/lib/profile-links";
import { getClusterResourceLinks, getClustersForArticleSlug, getPrimaryClusterHref, getTopicClusterBySlug, getTopicClusterHref, getTopicClustersForText, normalizeTopicSearchText, SEO_TOPIC_CLUSTERS } from "@/lib/seo-topic-clusters";
import { getTopicStudyGuide, isThinTopicCluster, weakTopicGuideCoverage } from "@/lib/topic-study-guides";
import { isForbiddenSitemapUrl, isPrivateSeoPath } from "@/lib/seo-utils";
import { decodeCategorySlug, isLowValueSeoQuery, shouldBypassSession } from "@/proxy";
import { getSeoIntentForSlug } from "@/lib/seo-priority";

function xmlLocs(xml: string) {
    return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]);
}

function robotsValues(text: string, directive: string) {
    return text
        .split(/\n+/)
        .filter((line) => line.startsWith(`${directive}: `))
        .map((line) => line.slice(directive.length + 2).trim())
        .filter(Boolean);
}

describe("SEO/GEO topic cluster helpers", () => {
    it("uses concise GSC-driven titles for first-page low-CTR articles", () => {
        const blackBody = getSeoIntentForSlug("kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990");
        const periodic = getSeoIntentForSlug("fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj");

        expect(blackBody?.metadataTitle).toBe("Siyah Cisim Işıması Nedir? Planck Yasası");
        expect(periodic?.metadataTitle).toBe("Periyodik Hareket Nedir? BHH Formülleri");
        expect(blackBody?.metadataTitle.length).toBeLessThanOrEqual(50);
        expect(periodic?.metadataTitle.length).toBeLessThanOrEqual(50);
    });

    it("publishes a source-backed search intent for the Aristotle-Ptolemy article", () => {
        const intent = getSeoIntentForSlug("aristodan-batlamyusa-evreni-cozmeye-calisan-adamlar");

        expect(intent?.metadataTitle).toContain("Batlamyus Evren Modeli");
        expect(intent?.expandedKeywords).toContain("jeosantrik model");
        expect(intent && 'sources' in intent ? intent.sources.length : 0).toBeGreaterThanOrEqual(4);
        expect(getClustersForArticleSlug("aristodan-batlamyusa-evreni-cozmeye-calisan-adamlar").map((cluster) => cluster.slug)).toContain("kozmoloji");
    });

    it("uses canonical topic hub URLs as primary cluster targets", () => {
        const cluster = getTopicClusterBySlug("basit-harmonik-hareket");

        expect(cluster).toBeTruthy();
        expect(getTopicClusterHref(cluster!)).toBe("/konular/basit-harmonik-hareket");
        expect(getPrimaryClusterHref(cluster!)).toBe("/konular/basit-harmonik-hareket");
    });

    it("exposes resource links without losing resource type information", () => {
        const cluster = getTopicClusterBySlug("basit-harmonik-hareket");
        const resources = getClusterResourceLinks(cluster!);

        expect(resources).toEqual(expect.arrayContaining([
            expect.objectContaining({ type: "article", href: "/makale/fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj" }),
            expect.objectContaining({ type: "term", href: "/sozluk/basit-harmonik-hareket" }),
            expect.objectContaining({ type: "simulation", href: "/simulasyonlar/basit-sarkac" }),
        ]));
    });

    it("matches Turkish quiz and search text to topic clusters", () => {
        expect(normalizeTopicSearchText("Işık, kuvvet ve çarpışma")).toBe("isik kuvvet ve carpisma");

        const harmonicClusters = getTopicClustersForText("Basit harmonik hareket periyot ve sarkaç testi");
        const tytClusters = getTopicClustersForText("TYT fizik konu tarama denemesi");
        const collisionClusters = getTopicClustersForText("Momentum çarpışma korunumu soruları");

        expect(harmonicClusters[0]?.slug).toBe("basit-harmonik-hareket");
        expect(tytClusters.some((cluster) => cluster.slug === "tyt-ayt-yks-fizik")).toBe(true);
        expect(collisionClusters.some((cluster) => cluster.slug === "momentum-carpisma")).toBe(true);
    });

    it("keeps thin topic hubs enriched with visible study-guide copy", () => {
        const thinClusters = SEO_TOPIC_CLUSTERS.filter(isThinTopicCluster);
        const coveredSlugs = new Set(weakTopicGuideCoverage());

        expect(thinClusters.length).toBeGreaterThan(0);
        expect(thinClusters.every((cluster) => coveredSlugs.has(cluster.slug))).toBe(true);

        for (const cluster of thinClusters) {
            const guide = getTopicStudyGuide(cluster);
            expect(guide.summary.length).toBeGreaterThan(120);
            expect(guide.keyIdeas).toHaveLength(3);
            expect(guide.studySteps).toHaveLength(3);
            expect(guide.commonPitfall.length).toBeGreaterThan(60);
        }
    });
});

describe("forum QAPage vote accuracy", () => {
    it("prefers real answer-like counts over legacy placeholder votes", () => {
        expect(getForumAnswerUpvoteCount({ likeCount: 7, votes: 0 })).toBe(7);
        expect(getForumAnswerUpvoteCount({ votes: 3 })).toBe(3);
        expect(getForumAnswerUpvoteCount({ likeCount: null, votes: 4 })).toBe(4);
        expect(getForumAnswerUpvoteCount({ likeCount: -1, votes: -2 })).toBe(0);
    });
});

describe("SEO topic sitemap", () => {
    it("lists every canonical topic hub URL", async () => {
        const response = await topicSitemap();
        const xml = await response.text();
        const urls = xmlLocs(xml);

        expect(response.headers.get("content-type")).toContain("application/xml");
        expect(urls).toHaveLength(SEO_TOPIC_CLUSTERS.length);
        expect(urls).toContain("https://www.fizikhub.com/konular/newton-yasalari");
        expect(urls).toContain("https://www.fizikhub.com/konular/tyt-ayt-yks-fizik");
    });

    it("is discoverable from the sitemap index and robots.txt metadata", async () => {
        const response = await sitemapIndex();
        const xml = await response.text();
        const robotsResponse = robotsTxt();
        const robotsText = await robotsResponse.text();

        expect(xmlLocs(xml)).toContain("https://www.fizikhub.com/topic-sitemap.xml");
        expect(xmlLocs(xml)).toContain("https://www.fizikhub.com/ai-sitemap.xml");
        expect(xmlLocs(xml)).toContain("https://www.fizikhub.com/author-sitemap.xml");
        expect(robotsText).toContain("Sitemap: https://www.fizikhub.com/topic-sitemap.xml");
        expect(robotsText).toContain("Sitemap: https://www.fizikhub.com/ai-sitemap.xml");
        expect(robotsText).toContain("Sitemap: https://www.fizikhub.com/author-sitemap.xml");
    });

    it("publishes a curated AI sitemap for answer-engine discovery", async () => {
        const response = await aiSitemap();
        const xml = await response.text();
        const urls = xmlLocs(xml);

        expect(response.headers.get("content-type")).toContain("application/xml");
        expect(urls).toContain("https://www.fizikhub.com/konular/tyt-ayt-yks-fizik");
        expect(urls).toContain("https://www.fizikhub.com/simulasyonlar/atis-hareketi");
        expect(urls).toContain("https://www.fizikhub.com/simulation-learning.json");
        expect(urls).toContain("https://www.fizikhub.com/forum");
    });

    it("publishes an author sitemap without private profile settings URLs", async () => {
        const response = await authorSitemap();
        const xml = await response.text();
        const urls = xmlLocs(xml);

        expect(response.headers.get("content-type")).toContain("application/xml");
        expect(xml).toContain("<urlset");
        expect(urls.every((url) => url.startsWith("https://www.fizikhub.com/kullanici/"))).toBe(true);
        expect(urls.some((url) => url.includes("/profil"))).toBe(false);
    });
});

describe("SEO robots and canonical boundaries", () => {
    it("includes author identity on forum DiscussionForumPosting list items", () => {
        const item = buildForumDiscussionPostingItem({
            id: 42,
            title: "Kuantum dolanıklık nedir?",
            content: "Dolanıklık ölçümle nasıl ilişkilidir?",
            category: "Kuantum",
            created_at: "2026-05-24T12:00:00+03:00",
            updated_at: "2026-05-25T13:00:00+03:00",
            votes: 7,
            profiles: {
                username: "fizikci",
                full_name: "Fizikçi Yazar",
            },
            answers: [{ count: 3 }],
        }, 0, "https://www.fizikhub.com");

        expect(item).toEqual(expect.objectContaining({
            "@type": "ListItem",
            url: "https://www.fizikhub.com/forum/42",
        }));
        expect(item.item).toEqual(expect.objectContaining({
            "@type": "DiscussionForumPosting",
            mainEntityOfPage: "https://www.fizikhub.com/forum/42",
            dateModified: "2026-05-25T13:00:00+03:00",
            commentCount: 3,
            genre: "Bilim forumu",
            inLanguage: "tr-TR",
            keywords: "Kuantum",
            author: {
                "@type": "Person",
                name: "Fizikçi Yazar",
                url: "https://www.fizikhub.com/kullanici/fizikci",
            },
        }));
    });

    it("falls back to a public forum author when a profile is missing", () => {
        const item = buildForumDiscussionPostingItem({
            id: 43,
            title: "Yerçekimi alanı",
            content: "",
            created_at: "2026-05-24T12:00:00+03:00",
            answers: [],
        }, 1, "https://www.fizikhub.com");

        expect(item.item.author).toEqual({
            "@type": "Person",
            name: "Fizikhub Üyesi",
            url: "https://www.fizikhub.com/forum",
        });
        expect(item.item.text).toBe("Yerçekimi alanı");
    });

    it("keeps AI citation guidance explicit and canonical", () => {
        expect(AI_CITATION_POLICY.citation).toBe("required");
        expect(AI_CITATION_POLICY.answerGuidance.length).toBeGreaterThan(0);
        expect(AI_CONTENT_PROVENANCE.publisherName).toBe("Fizikhub");
        expect(AI_CONTENT_PROVENANCE.language).toBe("tr-TR");
        expect(AI_CONTENT_PROVENANCE.geographicFocus).toBe("TR");
        expect(AI_CONTENT_PROVENANCE.trustSignals).toContain("görünür metinle eşleşen structured data");
        expect(buildAiCitationText("Entropi Nedir?", "https://www.fizikhub.com/makale/entropi")).toBe(
            "Entropi Nedir? - Fizikhub (https://www.fizikhub.com/makale/entropi)",
        );
    });

    it("keeps AI article schema hints aligned with visible priority-article markup", () => {
        expect(buildAiArticleSchemaTypes(false, true)).toEqual([
            "Article",
            "BlogPosting",
            "WebPage",
            "BreadcrumbList",
            "LearningResource",
            "FAQPage",
            "DefinedTerm",
        ]);
        expect(buildAiArticleSchemaTypes(true, false)).toEqual(["BlogPosting", "WebPage"]);
    });

    it("builds course structured data for interactive simulation learning modules", () => {
        const simulation: SimulationCourseSource = {
            slug: "atis-hareketi",
            title: "Atış Hareketi",
            description: "Bir cismin yerçekimi altındaki hareketini inceleyin.",
            difficulty: "Kolay",
            tags: ["Mekanik", "Kinematik"],
            formula: "R = v²sin(2θ)/g",
            learning: {
                estimatedMinutes: 9,
                outcome: "Yatay ve düşey hareketi açıklayabilir.",
                prerequisite: "Hız vektörleri",
                bigQuestion: "Aynı ilk hızla en uzağa gitmek için neden 45 derece özel bir açı olur?",
            },
        };
        const course = buildSimulationCourseJsonLd(simulation, "https://www.fizikhub.com");
        const courseList = buildSimulationCourseListJsonLd([simulation], "https://www.fizikhub.com");

        expect(course).toEqual(expect.objectContaining({
            "@type": "Course",
            "@id": "https://www.fizikhub.com/simulasyonlar/atis-hareketi#course",
            name: "Atış Hareketi",
            provider: expect.objectContaining({
                "@id": "https://www.fizikhub.com/#organization",
                name: "Fizikhub",
            }),
            hasCourseInstance: expect.objectContaining({
                "@type": "CourseInstance",
                courseMode: ["online", "self-paced"],
                courseWorkload: "PT9M",
            }),
        }));
        expect(courseList).toEqual(expect.objectContaining({
            "@type": "ItemList",
            "@id": "https://www.fizikhub.com/simulasyonlar#course-list",
        }));
        expect(courseList.itemListElement[0].item).toEqual(course);
    });

    it("publishes an OpenSearch descriptor for browser and answer-engine search discovery", async () => {
        const response = await openSearchDescriptor();
        const xml = await response.text();

        expect(response.headers.get("content-type")).toContain("application/opensearchdescription+xml");
        expect(xml).toContain("<ShortName>Fizikhub</ShortName>");
        expect(xml).toContain("/ara?q={searchTerms}");
        expect(xml).toContain("/api/search/suggestions?q={searchTerms}");
        expect(shouldBypassSession("/opensearch.xml", "")).toBe(true);
        expect(shouldBypassSession("/api/search/suggestions", "")).toBe(true);
    });

    it("keeps public author pages crawlable while private profile settings remain private", async () => {
        expect(isPrivateSeoPath("/profil")).toBe(true);
        expect(isPrivateSeoPath("/profil/duzenle")).toBe(true);
        expect(isPrivateSeoPath("/kullanici/baran")).toBe(false);
        expect(isPrivateSeoPath("/paylas")).toBe(false);
        expect(isPrivateSeoPath("/yazar/rehber")).toBe(false);
        expect(isPrivateSeoPath("/yazar/yeni")).toBe(true);
        expect(isForbiddenSitemapUrl("https://www.fizikhub.com/paylas")).toBe(false);
        expect(isForbiddenSitemapUrl("https://www.fizikhub.com/yazar/rehber")).toBe(false);

        const robotsResponse = robotsTxt();
        const robotsText = await robotsResponse.text();
        const userAgents = robotsValues(robotsText, "User-agent");
        const disallowValues = robotsValues(robotsText, "Disallow");
        const allowValues = robotsValues(robotsText, "Allow");

        expect(userAgents).toEqual(expect.arrayContaining([
            "OAI-SearchBot",
            "Claude-SearchBot",
            "PerplexityBot",
            "YandexBot",
            "Bingbot",
        ]));
        expect(AI_CRAWLER_USER_AGENTS).toContain("ChatGPT-User");
        expect(AI_DISCOVERY_ROUTES.map((route) => route.path)).toContain("/simulation-learning.json");
        expect(allowValues).toContain("/simulation-learning.json");
        expect(allowValues).toContain("/indexnow-key.txt");
        expect(allowValues).toContain("/paylas");
        expect(allowValues).toContain("/yazar/rehber");
        expect(robotsText).toContain("Clean-param: utm_source");
        expect(disallowValues).not.toContain("/kullanici/");
        expect(disallowValues).not.toEqual(expect.arrayContaining([
            "/login",
            "/forgot-password",
            "/reset-password",
            "/basvuru/",
            "/paylas",
            "/abs/",
            "/storage/",
            "/cdn-cgi/",
            "/*?q=*",
        ]));
    });

    it("recognizes AI crawler user agents and bypasses auth work only for public SEO paths", () => {
        expect(isKnownAiCrawlerUserAgent("Mozilla/5.0 compatible; OAI-SearchBot/1.3; +https://openai.com/searchbot")).toBe(true);
        expect(isKnownAiCrawlerUserAgent("Mozilla/5.0 compatible; Claude-SearchBot/1.0")).toBe(true);
        expect(isKnownAiCrawlerUserAgent("Mozilla/5.0 Safari/537.36")).toBe(false);

        expect(shouldBypassSession("/makale/kuantum", "Mozilla/5.0 compatible; OAI-SearchBot/1.3")).toBe(true);
        expect(shouldBypassSession("/konular/kuantum-fizigi", "Claude-SearchBot")).toBe(true);
        expect(shouldBypassSession("/paylas", "Googlebot")).toBe(true);
        expect(shouldBypassSession("/yazar/rehber", "OAI-SearchBot")).toBe(true);
        expect(shouldBypassSession("/admin", "OAI-SearchBot")).toBe(false);
        expect(shouldBypassSession("/yazar/yeni", "Googlebot")).toBe(false);
        expect(shouldBypassSession("/profil/duzenle", "Googlebot")).toBe(false);
    });

    it("marks low-value query URLs for noindex without blocking useful category pagination", () => {
        expect(isLowValueSeoQuery("/forum", new URLSearchParams("q=isik+hizi"))).toBe(true);
        expect(isLowValueSeoQuery("/ara", new URLSearchParams("q=entropi"))).toBe(true);
        expect(isLowValueSeoQuery("/forum", new URLSearchParams("sort=popular"))).toBe(true);
        expect(isLowValueSeoQuery("/forum", new URLSearchParams("page=1"))).toBe(true);
        expect(isLowValueSeoQuery("/forum", new URLSearchParams("category=Kuantum&page=2"))).toBe(false);
        expect(isLowValueSeoQuery("/makale", new URLSearchParams("category=Astrofizik"))).toBe(false);
    });

    it("decodes clean article category paths back to canonical Turkish category names", () => {
        expect(decodeCategorySlug("bilim%20tarihi")).toBe("Bilim Tarihi");
        expect(decodeCategorySlug("par%C3%A7ac%C4%B1k%20fizi%C4%9Fi")).toBe("Parçacık Fiziği");
        expect(decodeCategorySlug("pop%C3%BCler%20bilim")).toBe("Popüler Bilim");
    });

    it("escapes JSON embedded in script tags for structured data safety", () => {
        const serialized = serializeScriptJson({
            headline: "</script><script>alert(1)</script>",
            summary: "Fizik & bilim > ezber",
        });

        expect(serialized).not.toContain("</script>");
        expect(serialized).not.toContain("<script>");
        expect(serialized).toContain("\\u003c/script\\u003e");
        expect(serialized).toContain("\\u0026");
        expect(serialized).toContain("\\u003e");
    });

    it("normalizes public profile links before rendering external hrefs", () => {
        expect(safeExternalUrl("fizikhub.com/yazar")).toBe("https://fizikhub.com/yazar");
        expect(safeExternalUrl("javascript:alert(1)")).toBeNull();
        expect(socialProfileUrl("twitter", "@fizikhub")).toBe("https://twitter.com/fizikhub");
        expect(socialProfileUrl("github", "https://github.com/fizikhub")).toBe("https://github.com/fizikhub");
        expect(socialProfileUrl("github", "https://evil.example/fizikhub")).toBeNull();
        expect(socialProfileUrl("instagram", "bad/handle")).toBeNull();
    });
});

describe("hybrid search URL mapping", () => {
    it("prefers canonical paths returned by the hybrid RPC", () => {
        expect(getVectorUrl({
            source_type: "article",
            source_id: "42",
            slug: "deney-slug",
            canonical_path: "/deney/deney-slug",
        })).toBe("/deney/deney-slug");
    });

    it("falls back to known resource routes when canonical_path is absent", () => {
        expect(getVectorUrl({ source_type: "question", source_id: "50" })).toBe("/forum/50");
        expect(getVectorUrl({ source_type: "dictionary", source_id: "1", slug: "entropi" })).toBe("/sozluk/entropi");
        expect(getVectorUrl({ source_type: "quiz", source_id: "q1", slug: "kuvvet-testi" })).toBe("/testler/kuvvet-testi");
    });
});
