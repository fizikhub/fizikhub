"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
    parseSimulationProgressStore,
    serializeSimulationProgressStore,
    setSimulationCheckpoint,
    setSimulationCompleted,
    setSimulationConfidence,
    setSimulationNote,
    SIMULATION_PROGRESS_STORAGE_KEY,
    type SimulationConfidence,
    type SimulationProgressStore,
} from "@/lib/simulation-progress";

const SIMULATION_PROGRESS_EVENT = "fizikhub:simulation-progress";
const EMPTY_SNAPSHOT = "{}";

function readSnapshot() {
    if (typeof window === "undefined") return EMPTY_SNAPSHOT;
    return window.localStorage.getItem(SIMULATION_PROGRESS_STORAGE_KEY) || EMPTY_SNAPSHOT;
}

function subscribeToProgress(callback: () => void) {
    if (typeof window === "undefined") return () => {};

    const handleStorage = (event: StorageEvent) => {
        if (event.key === SIMULATION_PROGRESS_STORAGE_KEY) callback();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(SIMULATION_PROGRESS_EVENT, callback);

    return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(SIMULATION_PROGRESS_EVENT, callback);
    };
}

function writeStore(nextStore: SimulationProgressStore) {
    window.localStorage.setItem(SIMULATION_PROGRESS_STORAGE_KEY, serializeSimulationProgressStore(nextStore));
    window.dispatchEvent(new Event(SIMULATION_PROGRESS_EVENT));
}

export function useSimulationProgress() {
    const snapshot = useSyncExternalStore(subscribeToProgress, readSnapshot, () => EMPTY_SNAPSHOT);
    const store = useMemo(() => parseSimulationProgressStore(snapshot), [snapshot]);

    const updateStore = useCallback((updater: (store: SimulationProgressStore) => SimulationProgressStore) => {
        if (typeof window === "undefined") return;

        const currentStore = parseSimulationProgressStore(window.localStorage.getItem(SIMULATION_PROGRESS_STORAGE_KEY));
        writeStore(updater(currentStore));
    }, []);

    return {
        store,
        setCheckpoint: useCallback((slug: string, checkpoint: string, checked: boolean) => {
            updateStore((currentStore) => setSimulationCheckpoint(currentStore, slug, checkpoint, checked));
        }, [updateStore]),
        setCompleted: useCallback((slug: string, completed: boolean, allCheckpoints: string[]) => {
            updateStore((currentStore) => setSimulationCompleted(currentStore, slug, completed, allCheckpoints));
        }, [updateStore]),
        setConfidence: useCallback((slug: string, confidence: SimulationConfidence) => {
            updateStore((currentStore) => setSimulationConfidence(currentStore, slug, confidence));
        }, [updateStore]),
        setNote: useCallback((slug: string, note: string) => {
            updateStore((currentStore) => setSimulationNote(currentStore, slug, note));
        }, [updateStore]),
    };
}
