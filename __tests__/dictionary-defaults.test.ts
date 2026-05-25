import { describe, expect, it } from "vitest";
import { CURATED_DICTIONARY_TERMS } from "@/lib/dictionary-defaults";
import { slugify } from "@/lib/slug";

describe("curated dictionary defaults", () => {
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
});
