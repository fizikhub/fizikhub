import { describe, expect, it } from "vitest";
import { CURATED_DICTIONARY_TERMS } from "@/lib/dictionary-defaults";
import { slugify } from "@/lib/slug";

describe("curated dictionary defaults", () => {
    it("keeps curated term slugs unique", () => {
        const slugs = CURATED_DICTIONARY_TERMS.map((term) => slugify(term.term));

        expect(new Set(slugs).size).toBe(slugs.length);
        expect(slugs.length).toBeGreaterThanOrEqual(447);
    });

    it("ships new circuit and photoelectric terms as indexable defined terms", () => {
        const expectedSlugs = [
            "seri-devre",
            "paralel-devre",
            "esdeger-direnc",
            "kirchhoff-akim-yasasi",
            "kirchhoff-gerilim-yasasi",
            "elektriksel-guc",
            "ic-direnc",
            "fotoelektrik-olay",
            "esik-frekansi",
            "is-fonksiyonu",
            "durdurma-potansiyeli",
            "fotoelektron",
            "foton-enerjisi",
            "kuantum-verimi",
        ];

        for (const slug of expectedSlugs) {
            const matches = CURATED_DICTIONARY_TERMS.filter((term) => slugify(term.term) === slug);

            expect(matches, slug).toHaveLength(1);
            expect(matches[0].definition.length).toBeGreaterThan(80);
            expect(matches[0].category).toMatch(/Elektrik Devreleri|Modern Fizik/);
        }
    });

    it("ships the expanded mobile-search glossary clusters", () => {
        const expectedSlugs = [
            "hooke-yasasi",
            "basit-sarkac",
            "rc-devresi",
            "snell-yasasi",
            "kuantum-sayisi",
            "ph",
            "galvanik-hucre",
            "kutlecekim-mercegi",
            "kozmik-ag",
            "schwarzschild-yaricapi",
        ];

        for (const slug of expectedSlugs) {
            const matches = CURATED_DICTIONARY_TERMS.filter((term) => slugify(term.term) === slug);

            expect(matches, slug).toHaveLength(1);
            expect(matches[0].definition.length).toBeGreaterThan(80);
        }
    });
});
