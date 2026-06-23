import { describe, expect, it } from "vitest";
import {
    buildTrackedShareUrl,
    extractGrowthAttribution,
    getLandingContentType,
    normalizeGrowthAttribution,
    parseGrowthTrackingCookie,
    serializeGrowthTrackingParams,
} from "@/lib/growth-attribution";

describe("growth attribution", () => {
    it("preserves explicit campaign parameters as first-touch data", () => {
        const result = extractGrowthAttribution(
            new URLSearchParams("utm_source=instagram&utm_medium=social&utm_campaign=launch&utm_content=article-card"),
            "https://instagram.com/p/example",
            "/makale/kuantum",
            new Date("2026-06-23T10:00:00.000Z"),
        );

        expect(result).toEqual(expect.objectContaining({
            source: "instagram",
            medium: "social",
            campaign: "launch",
            content: "article-card",
            landingPath: "/makale/kuantum",
        }));
    });

    it("recognizes AI referrals without requiring UTM parameters", () => {
        const result = extractGrowthAttribution(new URLSearchParams(), "https://chatgpt.com/c/example", "/sozluk/entropi");
        expect(result.source).toBe("ai");
        expect(result.medium).toBe("ai_referral");
        expect(result.referrerHost).toBe("chatgpt.com");
    });

    it("builds measurable share URLs while preserving the destination", () => {
        const result = new URL(buildTrackedShareUrl("https://www.fizikhub.com/forum/42?view=best", "whatsapp", "forum"));
        expect(result.pathname).toBe("/forum/42");
        expect(result.searchParams.get("view")).toBe("best");
        expect(result.searchParams.get("utm_source")).toBe("whatsapp");
        expect(result.searchParams.get("utm_campaign")).toBe("fizikhub_share");
        expect(result.searchParams.get("utm_content")).toBe("forum");
    });

    it("rejects malformed client attribution before server metadata storage", () => {
        expect(normalizeGrowthAttribution({ source: "x", medium: "social", landingPath: "https://evil.test" })).toBeNull();
        expect(getLandingContentType("/testler/modern-fizik")).toBe("quiz");
    });

    it("round-trips campaign data across the canonical cleanup redirect", () => {
        const serialized = serializeGrowthTrackingParams(new URLSearchParams("utm_source=whatsapp&utm_medium=social&utm_campaign=fizikhub_share&unsafe=no"));
        expect(serialized).not.toContain("unsafe");

        const restored = parseGrowthTrackingCookie(`other=1; fh_attribution=${encodeURIComponent(serialized!)}; theme=dark`);
        expect(restored.get("utm_source")).toBe("whatsapp");
        expect(restored.get("utm_campaign")).toBe("fizikhub_share");
        expect(restored.has("unsafe")).toBe(false);
    });
});
