import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { GET as aiSitemap } from "@/app/ai-sitemap.xml/route";
import { GET as authorSitemap } from "@/app/author-sitemap.xml/route";
import { GET as sitemapIndex } from "@/app/sitemap-index.xml/route";
import { GET as topicSitemap } from "@/app/topic-sitemap.xml/route";
import { AI_CRAWLER_USER_AGENTS } from "@/lib/ai-discovery";
import { getVectorUrl } from "@/lib/search-results";
import { getClusterResourceLinks, getPrimaryClusterHref, getTopicClusterBySlug, getTopicClusterHref, getTopicClustersForText, normalizeTopicSearchText, SEO_TOPIC_CLUSTERS } from "@/lib/seo-topic-clusters";
import { isPrivateSeoPath } from "@/lib/seo-utils";

function xmlLocs(xml: string) {
    return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]);
}

describe("SEO/GEO topic cluster helpers", () => {
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
        const generated = robots();
        const sitemaps = Array.isArray(generated.sitemap) ? generated.sitemap : [generated.sitemap];

        expect(xmlLocs(xml)).toContain("https://www.fizikhub.com/topic-sitemap.xml");
        expect(xmlLocs(xml)).toContain("https://www.fizikhub.com/ai-sitemap.xml");
        expect(xmlLocs(xml)).toContain("https://www.fizikhub.com/author-sitemap.xml");
        expect(sitemaps).toContain("https://www.fizikhub.com/topic-sitemap.xml");
        expect(sitemaps).toContain("https://www.fizikhub.com/ai-sitemap.xml");
        expect(sitemaps).toContain("https://www.fizikhub.com/author-sitemap.xml");
    });

    it("publishes a curated AI sitemap for answer-engine discovery", async () => {
        const response = await aiSitemap();
        const xml = await response.text();
        const urls = xmlLocs(xml);

        expect(response.headers.get("content-type")).toContain("application/xml");
        expect(urls).toContain("https://www.fizikhub.com/konular/tyt-ayt-yks-fizik");
        expect(urls).toContain("https://www.fizikhub.com/simulasyonlar/atis-hareketi");
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
    it("keeps public author pages crawlable while private profile settings remain private", () => {
        expect(isPrivateSeoPath("/profil")).toBe(true);
        expect(isPrivateSeoPath("/profil/duzenle")).toBe(true);
        expect(isPrivateSeoPath("/kullanici/baran")).toBe(false);

        const generated = robots();
        const rules = Array.isArray(generated.rules) ? generated.rules : [generated.rules];
        const userAgents = rules
            .flatMap((rule) => Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent])
            .filter(Boolean);
        const disallowValues = rules
            .flatMap((rule) => Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow])
            .filter(Boolean);

        expect(userAgents).toEqual(expect.arrayContaining([
            "OAI-SearchBot",
            "Claude-SearchBot",
            "PerplexityBot",
        ]));
        expect(AI_CRAWLER_USER_AGENTS).toContain("ChatGPT-User");
        expect(disallowValues).not.toContain("/kullanici/");
        expect(disallowValues).not.toEqual(expect.arrayContaining([
            "/login",
            "/forgot-password",
            "/reset-password",
            "/basvuru/",
            "/paylas",
            "/*?q=*",
        ]));
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
