import { describe, expect, it } from "vitest";
import { simulations } from "@/components/simulations/data";
import {
    getRecommendedSimulationPath,
    getSimulationLearningSearchText,
    getSimulationLearningSummary,
    simulationMatchesQuery,
} from "@/lib/simulation-learning";

describe("simulation learning helpers", () => {
    it("summarizes guided simulation learning metadata", () => {
        const summary = getSimulationLearningSummary(simulations);

        expect(summary.totalSimulations).toBe(simulations.length);
        expect(summary.totalMinutes).toBeGreaterThan(simulations.length);
        expect(summary.difficultyCounts.Kolay).toBeGreaterThan(0);
        expect(summary.popularTags).toContain("Mekanik");
    });

    it("orders the recommended path from easier simulations to harder ones", () => {
        const path = getRecommendedSimulationPath(simulations);

        expect(path[0].simulation.difficulty).toBe("Kolay");
        expect(path.at(-1)?.simulation.difficulty).toBe("Zor");
        expect(path.map((item) => item.step)).toEqual(simulations.map((_, index) => index + 1));
    });

    it("indexes learning goals and checkpoints for simulation search", () => {
        const projectile = simulations.find((simulation) => simulation.slug === "atis-hareketi");

        expect(projectile).toBeDefined();
        expect(getSimulationLearningSearchText(projectile!)).toContain("menzil");
        expect(simulationMatchesQuery(projectile!, "45 derece")).toBe(true);
        expect(simulationMatchesQuery(projectile!, "snell yasası")).toBe(false);
    });
});
