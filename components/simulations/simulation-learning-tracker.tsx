"use client";

import { CheckCircle2, Circle, ClipboardCheck, NotebookPen, Sparkles } from "lucide-react";
import type { Simulation } from "@/components/simulations/data";
import { useSimulationProgress } from "@/hooks/use-simulation-progress";
import { cn } from "@/lib/utils";
import { getSimulationProgressState, type SimulationConfidence } from "@/lib/simulation-progress";

type SimulationLearningTrackerProps = {
    slug: string;
    title: string;
    learning: Simulation["learning"];
};

const CONFIDENCE_OPTIONS: Array<{ value: SimulationConfidence; label: string }> = [
    { value: "low", label: "Tekrar bakacağım" },
    { value: "medium", label: "Anladım" },
    { value: "high", label: "Anlatabilirim" },
];

export function SimulationLearningTracker({ slug, title, learning }: SimulationLearningTrackerProps) {
    const { store, setCheckpoint, setCompleted, setConfidence, setNote } = useSimulationProgress();
    const record = store[slug];
    const progress = getSimulationProgressState(record, learning.checkpoints.length);
    const checkedSet = new Set(record?.checked || []);
    const note = record?.note || "";

    return (
        <section className="mt-6 rounded-[8px] border border-zinc-800 bg-black/40 p-4" aria-labelledby="learning-tracker-title">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="mb-2 inline-flex items-center gap-2 text-[#EAB308]">
                        <ClipboardCheck className="h-4 w-4" />
                        <h3 id="learning-tracker-title" className="text-sm font-black uppercase tracking-widest">Kendi ilerlemen</h3>
                    </div>
                    <p className="text-sm font-semibold leading-6 text-zinc-400">
                        {title}: {progress.checkedCount}/{progress.total} adım
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setCompleted(slug, !progress.completed, learning.checkpoints)}
                    className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-[7px] border px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors",
                        progress.completed
                            ? "border-emerald-400 bg-emerald-400 text-black"
                            : "border-[#EAB308] bg-[#EAB308] text-black"
                    )}
                >
                    {progress.completed ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                    {progress.completed ? "Tamamlandı" : "Deneyi tamamla"}
                </button>
            </div>

            <div className="h-3 overflow-hidden rounded-full border border-zinc-700 bg-zinc-900">
                <div
                    className="h-full rounded-full bg-[#EAB308] transition-all"
                    style={{ width: `${progress.percent}%` }}
                />
            </div>

            <div className="mt-4 grid gap-3">
                {learning.checkpoints.map((checkpoint) => {
                    const checked = checkedSet.has(checkpoint);

                    return (
                        <button
                            key={checkpoint}
                            type="button"
                            onClick={() => setCheckpoint(slug, checkpoint, !checked)}
                            className={cn(
                                "grid grid-cols-[1.5rem_1fr] gap-3 rounded-[7px] border p-3 text-left text-sm font-semibold leading-6 transition-colors",
                                checked
                                    ? "border-emerald-500/70 bg-emerald-500/10 text-emerald-100"
                                    : "border-zinc-800 bg-zinc-950/70 text-zinc-300 hover:border-[#EAB308]/70"
                            )}
                        >
                            {checked ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" /> : <Circle className="mt-0.5 h-5 w-5 text-zinc-600" />}
                            <span>{checkpoint}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_0.8fr]">
                <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <NotebookPen className="h-3.5 w-3.5" />
                        Deney notu
                    </span>
                    <textarea
                        value={note}
                        onChange={(event) => setNote(slug, event.target.value)}
                        maxLength={500}
                        rows={4}
                        placeholder="Gözlem, şaşırtan sonuç veya kısa formül notu..."
                        className="min-h-[112px] w-full resize-none rounded-[7px] border border-zinc-800 bg-zinc-950 p-3 text-sm font-semibold leading-6 text-zinc-100 outline-none transition-colors placeholder:text-zinc-700 focus:border-[#EAB308]"
                    />
                </label>

                <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">Güven seviyesi</p>
                    <div className="grid gap-2">
                        {CONFIDENCE_OPTIONS.map((option) => {
                            const selected = record?.confidence === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setConfidence(slug, option.value)}
                                    className={cn(
                                        "rounded-[7px] border px-3 py-3 text-left text-xs font-black uppercase tracking-wider transition-colors",
                                        selected
                                            ? "border-[#EAB308] bg-[#EAB308] text-black"
                                            : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-[#EAB308]/70"
                                    )}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
