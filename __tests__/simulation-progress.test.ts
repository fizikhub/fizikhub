import { describe, expect, it } from "vitest";
import {
    getSimulationProgressState,
    normalizeSimulationProgressStore,
    parseSimulationProgressStore,
    serializeSimulationProgressStore,
    setSimulationCheckpoint,
    setSimulationCompleted,
    setSimulationConfidence,
    setSimulationNote,
    type SimulationProgressStore,
} from "@/lib/simulation-progress";

describe("simulation progress helpers", () => {
    it("normalizes malformed local progress payloads", () => {
        expect(normalizeSimulationProgressStore({
            "atis-hareketi": {
                checked: ["a", "a", "", 42],
                confidence: "high",
                note: "gözlem",
                updatedAt: "2026-05-25T00:00:00.000Z",
            },
            ignored: null,
        })).toEqual({
            "atis-hareketi": {
                checked: ["a"],
                confidence: "high",
                note: "gözlem",
                updatedAt: "2026-05-25T00:00:00.000Z",
            },
        });

        expect(parseSimulationProgressStore("{bozuk json")).toEqual({});
    });

    it("tracks checkpoint progress and completion percent", () => {
        let store: SimulationProgressStore = {};
        store = setSimulationCheckpoint(store, "atis-hareketi", "Açı değiştir", true, "2026-05-25T00:00:00.000Z");

        expect(store["atis-hareketi"].checked).toEqual(["Açı değiştir"]);
        expect(getSimulationProgressState(store["atis-hareketi"], 3)).toMatchObject({
            checkedCount: 1,
            completed: false,
            percent: 33,
        });

        store = setSimulationCompleted(store, "atis-hareketi", true, ["Açı değiştir", "Yerçekimi değiştir"], "2026-05-25T00:01:00.000Z");

        expect(getSimulationProgressState(store["atis-hareketi"], 2)).toMatchObject({
            checkedCount: 2,
            completed: true,
            percent: 100,
        });
    });

    it("stores confidence and trims notes for local learning journals", () => {
        let store: SimulationProgressStore = {};
        store = setSimulationConfidence(store, "yay-kutle", "medium", "2026-05-25T00:00:00.000Z");
        store = setSimulationNote(store, "yay-kutle", ` ${"x".repeat(600)} `, "2026-05-25T00:01:00.000Z");

        expect(store["yay-kutle"].confidence).toBe("medium");
        expect(store["yay-kutle"].note).toHaveLength(500);
        expect(serializeSimulationProgressStore(store)).toContain("yay-kutle");
    });
});
