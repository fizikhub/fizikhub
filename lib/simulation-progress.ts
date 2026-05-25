export const SIMULATION_PROGRESS_STORAGE_KEY = "fizikhub.simulationProgress.v1";

export type SimulationConfidence = "low" | "medium" | "high";

export type SimulationProgressRecord = {
    checked: string[];
    completedAt?: string;
    confidence?: SimulationConfidence;
    note?: string;
    updatedAt: string;
};

export type SimulationProgressStore = Record<string, SimulationProgressRecord>;

export function normalizeSimulationProgressStore(value: unknown): SimulationProgressStore {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};

    const store: SimulationProgressStore = {};

    for (const [slug, record] of Object.entries(value)) {
        if (!slug || !record || typeof record !== "object" || Array.isArray(record)) continue;

        const rawRecord = record as Partial<SimulationProgressRecord>;
        const checked = Array.isArray(rawRecord.checked)
            ? Array.from(new Set(rawRecord.checked.filter((item): item is string => typeof item === "string" && item.trim().length > 0)))
            : [];
        const updatedAt = typeof rawRecord.updatedAt === "string" ? rawRecord.updatedAt : new Date(0).toISOString();
        const normalizedRecord: SimulationProgressRecord = {
            checked,
            updatedAt,
        };

        if (typeof rawRecord.completedAt === "string") normalizedRecord.completedAt = rawRecord.completedAt;
        if (rawRecord.confidence === "low" || rawRecord.confidence === "medium" || rawRecord.confidence === "high") {
            normalizedRecord.confidence = rawRecord.confidence;
        }
        if (typeof rawRecord.note === "string" && rawRecord.note.trim().length > 0) {
            normalizedRecord.note = rawRecord.note.slice(0, 500);
        }

        store[slug] = normalizedRecord;
    }

    return store;
}

export function parseSimulationProgressStore(serialized: string | null | undefined): SimulationProgressStore {
    if (!serialized) return {};

    try {
        return normalizeSimulationProgressStore(JSON.parse(serialized));
    } catch {
        return {};
    }
}

export function serializeSimulationProgressStore(store: SimulationProgressStore) {
    return JSON.stringify(normalizeSimulationProgressStore(store));
}

export function getSimulationProgressState(record: SimulationProgressRecord | undefined, totalCheckpoints: number) {
    const total = Math.max(0, totalCheckpoints);
    const checkedCount = Math.min(record?.checked.length || 0, total);
    const completed = Boolean(record?.completedAt);
    const percent = completed
        ? 100
        : total > 0
            ? Math.round((checkedCount / total) * 100)
            : 0;

    return {
        checkedCount,
        completed,
        percent,
        total,
    };
}

export function setSimulationCheckpoint(
    store: SimulationProgressStore,
    slug: string,
    checkpoint: string,
    checked: boolean,
    now = new Date().toISOString(),
): SimulationProgressStore {
    const current = store[slug] || { checked: [], updatedAt: now };
    const checkedSet = new Set(current.checked);

    if (checked) {
        checkedSet.add(checkpoint);
    } else {
        checkedSet.delete(checkpoint);
    }

    return {
        ...store,
        [slug]: {
            ...current,
            checked: Array.from(checkedSet),
            updatedAt: now,
        },
    };
}

export function setSimulationCompleted(
    store: SimulationProgressStore,
    slug: string,
    completed: boolean,
    allCheckpoints: string[],
    now = new Date().toISOString(),
): SimulationProgressStore {
    const current = store[slug] || { checked: [], updatedAt: now };

    return {
        ...store,
        [slug]: {
            ...current,
            checked: completed ? Array.from(new Set(allCheckpoints)) : current.checked,
            completedAt: completed ? now : undefined,
            updatedAt: now,
        },
    };
}

export function setSimulationConfidence(
    store: SimulationProgressStore,
    slug: string,
    confidence: SimulationConfidence,
    now = new Date().toISOString(),
): SimulationProgressStore {
    const current = store[slug] || { checked: [], updatedAt: now };

    return {
        ...store,
        [slug]: {
            ...current,
            confidence,
            updatedAt: now,
        },
    };
}

export function setSimulationNote(
    store: SimulationProgressStore,
    slug: string,
    note: string,
    now = new Date().toISOString(),
): SimulationProgressStore {
    const current = store[slug] || { checked: [], updatedAt: now };
    const trimmedNote = note.trim().slice(0, 500);

    return {
        ...store,
        [slug]: {
            ...current,
            note: trimmedNote.length > 0 ? trimmedNote : undefined,
            updatedAt: now,
        },
    };
}
