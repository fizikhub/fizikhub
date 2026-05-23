import { describe, expect, it } from "vitest";
import { DEFAULT_BADGES, getBadgeCategoryTitle, getBadgeRequirementLabel } from "@/lib/badges";

describe("badge catalog helpers", () => {
    it("provides a fallback catalog for empty live badge data", () => {
        expect(DEFAULT_BADGES.length).toBeGreaterThanOrEqual(20);
        expect(DEFAULT_BADGES.some((badge) => badge.name === "Merhaba Dünya")).toBe(true);
    });

    it("formats known category titles with their display icon", () => {
        expect(getBadgeCategoryTitle("reputation")).toBe("⭐ İtibar & Seviye");
        expect(getBadgeCategoryTitle("unknown")).toBe("🏷️ unknown");
    });

    it("formats badge requirement labels", () => {
        expect(getBadgeRequirementLabel("reputation", 500)).toBe("500 HubPuan");
        expect(getBadgeRequirementLabel("accepted_answer_count", 3)).toBe("3 Kabul Edilen Cevap");
        expect(getBadgeRequirementLabel("manual", 1)).toBeNull();
    });
});
