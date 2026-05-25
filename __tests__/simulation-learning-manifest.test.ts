import { describe, expect, it } from "vitest";
import { GET as simulationLearningManifest } from "@/app/simulation-learning.json/route";
import { simulations } from "@/components/simulations/data";
import { AI_DISCOVERY_ROUTES } from "@/lib/ai-discovery";

describe("simulation learning manifest", () => {
    it("is discoverable as an AI/GEO entry point", async () => {
        const response = await simulationLearningManifest();
        const payload = await response.json();
        const items = payload.itemListElement.map((entry: { item: { name: string; url: string; teaches: string[]; relatedUrls: string[] } }) => entry.item);

        expect(response.headers.get("content-type")).toContain("application/json");
        expect(AI_DISCOVERY_ROUTES.map((route) => route.path)).toContain("/simulation-learning.json");
        expect(payload.numberOfItems).toBe(simulations.length);
        expect(items.map((item: { name: string }) => item.name)).toEqual(expect.arrayContaining([
            "Ohm Devresi",
            "Fotoelektrik Olay",
        ]));
        expect(items.find((item: { name: string }) => item.name === "Ohm Devresi")?.relatedUrls).toContain("https://www.fizikhub.com/konular/devreler");
        expect(items.find((item: { name: string }) => item.name === "Fotoelektrik Olay")?.teaches.join(" ")).toContain("eşik frekansı");
    });
});
