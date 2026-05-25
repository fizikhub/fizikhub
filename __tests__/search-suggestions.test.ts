import { describe, expect, it } from "vitest";
import { GET as suggestionsRoute } from "@/app/api/search/suggestions/route";
import {
    buildOpenSearchSuggestions,
    MAX_SEARCH_SUGGESTIONS,
    normalizeSuggestionQuery,
    type SearchSuggestion,
} from "@/lib/search-suggestions";

describe("search suggestions helpers", () => {
    it("serves a noindex OpenSearch suggestion response from the route", async () => {
        const response = await suggestionsRoute(new Request("https://www.fizikhub.com/api/search/suggestions?q=x"));
        const payload = await response.json();

        expect(response.headers.get("content-type")).toContain("application/x-suggestions+json");
        expect(response.headers.get("x-robots-tag")).toBe("noindex, follow");
        expect(payload).toEqual(["x", [], [], []]);
    });

    it("normalizes noisy search text before querying or serializing", () => {
        expect(normalizeSuggestionQuery("  kuantum   fiziği  ")).toBe("kuantum fiziği");
        expect(normalizeSuggestionQuery("x".repeat(120))).toHaveLength(80);
    });

    it("serializes suggestions in the OpenSearch suggestion format", () => {
        const suggestions: SearchSuggestion[] = [
            {
                type: "topic",
                title: "Kuantum fiziği",
                description: "Kuantum fiziği konu rehberi",
                url: "/konular/kuantum-fizigi",
            },
        ];

        expect(buildOpenSearchSuggestions("kuantum", suggestions, "https://www.fizikhub.com")).toEqual([
            "kuantum",
            ["Kuantum fiziği"],
            ["Kuantum fiziği konu rehberi"],
            ["https://www.fizikhub.com/konular/kuantum-fizigi"],
        ]);
    });

    it("caps serialized suggestion count for browser autocomplete payloads", () => {
        const suggestions = Array.from({ length: MAX_SEARCH_SUGGESTIONS + 3 }, (_, index) => ({
            type: "topic" as const,
            title: `Konu ${index}`,
            url: `/konular/konu-${index}`,
        }));

        const payload = buildOpenSearchSuggestions("konu", suggestions, "https://www.fizikhub.com");

        expect(payload[1]).toHaveLength(MAX_SEARCH_SUGGESTIONS);
        expect(payload[3].at(-1)).toBe("https://www.fizikhub.com/konular/konu-7");
    });
});
