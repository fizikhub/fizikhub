import { describe, expect, it } from "vitest";
import { simulations } from "@/components/simulations/data";
import { getTopicClusterBySlug } from "@/lib/seo-topic-clusters";
import { getSimulationLearningSearchText, simulationMatchesQuery } from "@/lib/simulation-learning";

describe("simulation registry", () => {
    it("keeps simulation ids and slugs unique", () => {
        const ids = simulations.map((simulation) => simulation.id);
        const slugs = simulations.map((simulation) => simulation.slug);

        expect(new Set(ids).size).toBe(ids.length);
        expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("requires every simulation to ship guided learning metadata", () => {
        for (const simulation of simulations) {
            expect(simulation.learning.bigQuestion.length).toBeGreaterThan(20);
            expect(simulation.learning.outcome.length).toBeGreaterThan(30);
            expect(simulation.learning.estimatedMinutes).toBeGreaterThanOrEqual(5);
            expect(simulation.learning.checkpoints.length).toBeGreaterThanOrEqual(3);
            expect(simulation.learning.quickCheck.length).toBeGreaterThan(20);
            expect(simulation.learning.relatedResources.length).toBeGreaterThanOrEqual(2);
            expect(simulation.learning.relatedResources.every((resource) => resource.href.startsWith("/"))).toBe(true);
        }
    });

    it("registers new circuit and photoelectric simulations with topic clusters", () => {
        const circuit = simulations.find((simulation) => simulation.slug === "ohm-devresi");
        const photoelectric = simulations.find((simulation) => simulation.slug === "fotoelektrik-olay");

        expect(circuit?.id).toBe("circuit");
        expect(photoelectric?.id).toBe("photoelectric");
        expect(getTopicClusterBySlug("devreler")?.simulationSlugs).toContain("ohm-devresi");
        expect(getTopicClusterBySlug("fotoelektrik-olay")?.simulationSlugs).toContain("fotoelektrik-olay");
    });

    it("indexes new learning concepts for semantic simulation search", () => {
        const circuit = simulations.find((simulation) => simulation.slug === "ohm-devresi");
        const photoelectric = simulations.find((simulation) => simulation.slug === "fotoelektrik-olay");

        expect(circuit).toBeDefined();
        expect(photoelectric).toBeDefined();
        expect(getSimulationLearningSearchText(circuit!)).toContain("esdeger direnc");
        expect(getSimulationLearningSearchText(photoelectric!)).toContain("durdurma potansiyeli");
        expect(simulationMatchesQuery(circuit!, "paralel devre")).toBe(true);
        expect(simulationMatchesQuery(photoelectric!, "eşik frekansı")).toBe(true);
        expect(simulationMatchesQuery(photoelectric!, "foton enerjisi")).toBe(true);
    });
});
