import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { getVectorUrl } from "@/lib/search-results";
import { getClusterResourceLinks, getPrimaryClusterHref, getTopicClusterBySlug, getTopicClusterHref } from "@/lib/seo-topic-clusters";
import { isPrivateSeoPath } from "@/lib/seo-utils";

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
});

describe("SEO robots and canonical boundaries", () => {
    it("keeps public author pages crawlable while private profile settings remain private", () => {
        expect(isPrivateSeoPath("/profil")).toBe(true);
        expect(isPrivateSeoPath("/profil/duzenle")).toBe(true);
        expect(isPrivateSeoPath("/kullanici/baran")).toBe(false);

        const generated = robots();
        const rules = Array.isArray(generated.rules) ? generated.rules : [generated.rules];
        const disallowValues = rules
            .flatMap((rule) => Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow])
            .filter(Boolean);

        expect(disallowValues).not.toContain("/kullanici/");
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
