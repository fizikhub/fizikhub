import { describe, expect, it } from "vitest";
import { PWA_DISMISS_DAYS, shouldOfferPwaInstall } from "@/lib/pwa-install";

describe("PWA install eligibility", () => {
    const now = new Date("2026-06-23T12:00:00.000Z");

    it("waits for a returning session before offering installation", () => {
        expect(shouldOfferPwaInstall(1, null, now)).toBe(false);
        expect(shouldOfferPwaInstall(2, null, now)).toBe(true);
    });

    it("respects the dismissal cooldown", () => {
        expect(shouldOfferPwaInstall(4, "2026-06-20T12:00:00.000Z", now)).toBe(false);
        const oldDismissal = new Date(now.getTime() - PWA_DISMISS_DAYS * 86_400_000).toISOString();
        expect(shouldOfferPwaInstall(4, oldDismissal, now)).toBe(true);
    });
});
