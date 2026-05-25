import type { Simulation } from "@/components/simulations/data";

const DIFFICULTY_WEIGHT: Record<Simulation["difficulty"], number> = {
    Kolay: 1,
    Orta: 2,
    Zor: 3,
};

export type SimulationLearningPathItem = {
    step: number;
    simulation: Simulation;
    reason: string;
};

export function normalizeSimulationSearchText(value: string) {
    return value
        .toLocaleLowerCase("tr-TR")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9ğüşıöç\s]/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function getSimulationLearningSearchText(simulation: Simulation) {
    return normalizeSimulationSearchText([
        simulation.title,
        simulation.description,
        simulation.formula,
        simulation.difficulty,
        ...simulation.tags,
        ...(simulation.seo?.keywords || []),
        simulation.learning.bigQuestion,
        simulation.learning.outcome,
        simulation.learning.prerequisite,
        simulation.learning.quickCheck,
        ...simulation.learning.checkpoints,
        ...simulation.learning.relatedResources.flatMap((resource) => [resource.label, resource.type]),
    ].filter(Boolean).join(" "));
}

export function simulationMatchesQuery(simulation: Simulation, query: string) {
    const normalizedQuery = normalizeSimulationSearchText(query);
    if (!normalizedQuery) return true;

    return getSimulationLearningSearchText(simulation).includes(normalizedQuery);
}

export function getRecommendedSimulationPath(simulations: Simulation[]): SimulationLearningPathItem[] {
    return [...simulations]
        .sort((a, b) => {
            const difficultyDiff = DIFFICULTY_WEIGHT[a.difficulty] - DIFFICULTY_WEIGHT[b.difficulty];
            if (difficultyDiff !== 0) return difficultyDiff;

            return a.learning.estimatedMinutes - b.learning.estimatedMinutes;
        })
        .map((simulation, index) => ({
            step: index + 1,
            simulation,
            reason: getPathReason(simulation),
        }));
}

export function getSimulationLearningSummary(simulations: Simulation[]) {
    const tagCounts = new Map<string, number>();
    const difficultyCounts: Record<Simulation["difficulty"], number> = {
        Kolay: 0,
        Orta: 0,
        Zor: 0,
    };
    let totalMinutes = 0;

    for (const simulation of simulations) {
        difficultyCounts[simulation.difficulty] += 1;
        totalMinutes += simulation.learning.estimatedMinutes;

        for (const tag of simulation.tags) {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
    }

    const popularTags = [...tagCounts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "tr-TR"))
        .map(([tag]) => tag);

    return {
        totalSimulations: simulations.length,
        totalMinutes,
        averageMinutes: simulations.length > 0 ? Math.round(totalMinutes / simulations.length) : 0,
        difficultyCounts,
        popularTags,
    };
}

function getPathReason(simulation: Simulation) {
    if (simulation.difficulty === "Kolay") {
        return "Temel sezgiyi kurmak için iyi bir başlangıç.";
    }

    if (simulation.difficulty === "Orta") {
        return "Formül ile gözlem arasındaki bağı güçlendirir.";
    }

    return "Soyut kavramları deneysel düşünmeyle birleştirir.";
}
