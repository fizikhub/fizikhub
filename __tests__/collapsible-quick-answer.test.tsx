import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CollapsibleQuickAnswer } from "@/components/articles/collapsible-quick-answer";
import { getSeoIntentForSlug } from "@/lib/seo-priority";

describe("CollapsibleQuickAnswer", () => {
    it("starts closed while keeping the GEO answer in server-rendered HTML", () => {
        const intent = getSeoIntentForSlug("aristodan-batlamyusa-evreni-cozmeye-calisan-adamlar");
        expect(intent).toBeTruthy();

        const markup = renderToStaticMarkup(
            <CollapsibleQuickAnswer override={intent!} relatedArticles={[]} />,
        );

        expect(markup).toContain("<details");
        expect(markup).not.toMatch(/<details[^>]*\sopen(?:=|\s|>)/);
        expect(markup).toContain("<summary");
        expect(markup).toContain("Batlamyus&#x27;un jeosantrik modeli");
        expect(markup).toContain("Batlamyus evren modeli nedir?");
    });
});
