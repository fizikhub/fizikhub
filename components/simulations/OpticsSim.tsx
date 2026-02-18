"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Move, Plus, Trash2, RefreshCcw, Maximize2 } from "lucide-react";
import { SimWrapper, SimTask } from "./sim-wrapper";

interface OpticsSimProps {
    className?: string;
}

// Types for Physics Engine (Ref-based, no React state overhead)
type Vector = { x: number; y: number };
type Material = { id: string; x: number; y: number; w: number; h: number; n: number; name: "Cam" | "Su" | "Hava"; color: string };
type Ray = { start: Vector; dir: Vector; intensity: number };
type GameState = {
    source: { x: number; y: number; angle: number };
    materials: Material[];
    target: { x: number; y: number; hit: boolean };
    dragging: { type: "source" | "material" | null; id?: string; offset?: Vector };
};

export function OpticsSim({ className = "" }: OpticsSimProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // UI State (Only for React Overlay)
    const [tasks, setTasks] = useState<SimTask[]>([
        { id: "o1", description: "Lazer ışığını hedefe ulaştır.", hint: "Kaynağı veya blokları hareket ettir.", isCompleted: false },
        { id: "o2", description: "Tam yansıma (TIR) olayını gözlemle.", hint: "Yoğun ortamdan (Cam) az yoğun ortama (Hava) geniş açıyla gönder.", isCompleted: false },
        { id: "o3", description: "Işığı 'Z' şeklinde kır.", hint: "İki bloğu çapraz yerleştir.", isCompleted: false },
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [selectedMatId, setSelectedMatId] = useState<string | null>(null);
    const [uiSourceAngle, setUiSourceAngle] = useState(0); // Sync for slider

    // Physics State (Mutable Ref)
    const state = useRef<GameState>({
        source: { x: 100, y: 300, angle: 0 },
        materials: [
            { id: "m1", x: 300, y: 200, w: 200, h: 100, n: 1.5, name: "Cam", color: "rgba(200, 230, 255, 0.3)" },
            { id: "m2", x: 300, y: 350, w: 200, h: 100, n: 1.33, name: "Su", color: "rgba(100, 180, 255, 0.3)" }
        ],
        target: { x: 600, y: 300, hit: false },
        dragging: { type: null }
    });

    // Helper Math
    const dot = (v1: Vector, v2: Vector) => v1.x * v2.x + v1.y * v2.y;
    const pointLineDist = (p: Vector, a: Vector, b: Vector) => {
        const atob = { x: b.x - a.x, y: b.y - a.y };
        const atop = { x: p.x - a.x, y: p.y - a.y };
        const len = atob.x * atob.x + atob.y * atob.y;
        let dotVal = atop.x * atob.x + atop.y * atob.y;
        const t = Math.min(1, Math.max(0, dotVal / len));
        return Math.sqrt((a.x + atob.x * t - p.x) ** 2 + (a.y + atob.y * t - p.y) ** 2);
    };

    // Task Completion Logic
    const completeTask = useCallback((index: number) => {
        setTasks(prev => {
            if (prev[index].isCompleted) return prev;
            const newTasks = [...prev];
            newTasks[index].isCompleted = true;
            return newTasks;
        });
        setTimeout(() => {
            setCurrentTaskIndex(prev => Math.min(prev + 1, tasks.length - 1));
        }, 1500);
    }, [tasks.length]);

    // Ray Tracing Engine
    const traceRay = (ray: Ray, depth: number, ctx: CanvasRenderingContext2D) => {
        if (depth > 5 || ray.intensity < 0.1) return;

        let bestHit: { pt: Vector; norm: Vector; mat: Material } | null = null;
        let closestDist = Infinity;

        // Intersection Check
        for (const mat of state.current.materials) {
            const lines = [
                { p1: { x: mat.x, y: mat.y }, p2: { x: mat.x + mat.w, y: mat.y }, n: { x: 0, y: -1 } },
                { p1: { x: mat.x, y: mat.y + mat.h }, p2: { x: mat.x + mat.w, y: mat.y + mat.h }, n: { x: 0, y: 1 } },
                { p1: { x: mat.x, y: mat.y }, p2: { x: mat.x, y: mat.y + mat.h }, n: { x: -1, y: 0 } },
                { p1: { x: mat.x + mat.w, y: mat.y }, p2: { x: mat.x + mat.w, y: mat.y + mat.h }, n: { x: 1, y: 0 } },
            ];

            for (const line of lines) {
                const x1 = line.p1.x, y1 = line.p1.y;
                const x2 = line.p2.x, y2 = line.p2.y;
                const x3 = ray.start.x, y3 = ray.start.y;
                const x4 = ray.start.x + ray.dir.x, y4 = ray.start.y + ray.dir.y;

                const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
                if (den === 0) continue;

                const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
                const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

                if (t >= 0 && t <= 1 && u > 0) {
                    const ix = x1 + t * (x2 - x1);
                    const iy = y1 + t * (y2 - y1);
                    const dist = Math.sqrt((ix - x3) ** 2 + (iy - y3) ** 2);

                    if (dist < closestDist && dist > 1) {
                        closestDist = dist;
                        bestHit = { pt: { x: ix, y: iy }, norm: line.n, mat };
                    }
                }
            }
        }

        const endPos = bestHit ? bestHit.pt : {
            x: ray.start.x + ray.dir.x * 2000,
            y: ray.start.y + ray.dir.y * 2000
        };

        // Draw Ray
        ctx.beginPath();
        ctx.moveTo(ray.start.x, ray.start.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.strokeStyle = `rgba(255, 50, 50, ${ray.intensity})`;
        ctx.lineWidth = Math.max(1, 3 * ray.intensity);
        ctx.stroke();

        // Check Target Hit (Only task 0)
        if (currentTaskIndex === 0 && !state.current.target.hit) {
            if (pointLineDist(state.current.target, ray.start, endPos) < 15) {
                state.current.target.hit = true;
                completeTask(0);
            }
        }

        if (bestHit) {
            const { norm, mat } = bestHit;
            const dp = dot(ray.dir, norm);
            const entering = dp < 0;

            const n1 = entering ? 1.0 : mat.n;
            const n2 = entering ? mat.n : 1.0;
            const eta = n1 / n2;
            const k = 1.0 - eta * eta * (1.0 - dp * dp);

            if (k < 0) { // TIR
                const rDir = { x: ray.dir.x - 2 * dp * norm.x, y: ray.dir.y - 2 * dp * norm.y };
                traceRay({ start: bestHit.pt, dir: rDir, intensity: ray.intensity * 0.95 }, depth + 1, ctx);
                if (currentTaskIndex === 1 && !tasks[1].isCompleted) completeTask(1);
            } else { // Refract + Reflect
                const refrDir = {
                    x: eta * ray.dir.x - (eta * dp + Math.sqrt(k)) * norm.x,
                    y: eta * ray.dir.y - (eta * dp + Math.sqrt(k)) * norm.y
                };
                traceRay({ start: bestHit.pt, dir: refrDir, intensity: ray.intensity * 0.8 }, depth + 1, ctx);

                // Fresnel Reflection
                const reflDir = { x: ray.dir.x - 2 * dp * norm.x, y: ray.dir.y - 2 * dp * norm.y };
                traceRay({ start: bestHit.pt, dir: reflDir, intensity: ray.intensity * 0.15 }, depth + 1, ctx);
            }
        }
    };

    // Main Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const render = () => {
            // Resize if needed
            if (containerRef.current && (canvas.width !== containerRef.current.clientWidth || canvas.height !== containerRef.current.clientHeight)) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }

            // Clear
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
            for (let j = 0; j < canvas.height; j += 40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke(); }

            const s = state.current;

            // Draw Target
            if (currentTaskIndex === 0) {
                ctx.beginPath(); ctx.arc(s.target.x, s.target.y, 15, 0, Math.PI * 2);
                ctx.fillStyle = s.target.hit ? "#4ADE80" : "rgba(74, 222, 128, 0.2)";
                ctx.fill(); ctx.strokeStyle = "#4ADE80"; ctx.stroke();
            }

            // Draw Materials
            s.materials.forEach(mat => {
                ctx.fillStyle = mat.color;
                ctx.fillRect(mat.x, mat.y, mat.w, mat.h);
                ctx.strokeStyle = selectedMatId === mat.id ? "#FFC800" : "rgba(255,255,255,0.2)";
                ctx.lineWidth = selectedMatId === mat.id ? 2 : 1;
                ctx.strokeRect(mat.x, mat.y, mat.w, mat.h);

                ctx.fillStyle = "rgba(255,255,255,0.8)";
                ctx.font = "bold 12px sans-serif";
                ctx.fillText(`${mat.name} (n=${mat.n})`, mat.x + 5, mat.y + 15);
            });

            // Draw Source
            ctx.save();
            ctx.translate(s.source.x, s.source.y);
            ctx.rotate(s.source.angle * Math.PI / 180);
            ctx.fillStyle = "#333"; ctx.fillRect(-10, -10, 40, 20);
            ctx.strokeStyle = "#999"; ctx.strokeRect(-10, -10, 40, 20);
            ctx.fillStyle = "#FF0000"; ctx.beginPath(); ctx.arc(30, 0, 4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // Trace
            const rad = s.source.angle * Math.PI / 180;
            const start = {
                x: s.source.x + Math.cos(rad) * 35,
                y: s.source.y + Math.sin(rad) * 35
            };
            traceRay({ start, dir: { x: Math.cos(rad), y: Math.sin(rad) }, intensity: 1.0 }, 0, ctx);

            animationId = requestAnimationFrame(render);
            setUiSourceAngle(s.source.angle); // Sync UI occasionally if needed, or better, bind UI to state updates
        };
        render();
        return () => cancelAnimationFrame(animationId);
    }, [currentTaskIndex, selectedMatId, completeTask]); // Dependencies minimal to avoid re-renders

    // Input Handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const s = state.current;

        // Check Source
        if (Math.hypot(x - s.source.x, y - s.source.y) < 25) {
            s.dragging = { type: "source", offset: { x: x - s.source.x, y: y - s.source.y } };
            return;
        }

        // Check Materials
        // Reverse iterate to pick top-most
        for (let i = s.materials.length - 1; i >= 0; i--) {
            const m = s.materials[i];
            if (x >= m.x && x <= m.x + m.w && y >= m.y && y <= m.y + m.h) {
                s.dragging = { type: "material", id: m.id, offset: { x: x - m.x, y: y - m.y } };
                setSelectedMatId(m.id);
                return;
            }
        }

        setSelectedMatId(null);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!state.current.dragging.type) return;

        const rect = containerRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const s = state.current;
        const off = s.dragging.offset || { x: 0, y: 0 };

        if (s.dragging.type === "source") {
            s.source.x = x - off.x;
            s.source.y = y - off.y;
        } else if (s.dragging.type === "material" && s.dragging.id) {
            const mat = s.materials.find(m => m.id === s.dragging.id);
            if (mat) {
                mat.x = x - off.x;
                mat.y = y - off.y;
            }
        }
    };

    const handlePointerUp = () => {
        state.current.dragging = { type: null };
    };

    return (
        <SimWrapper
            title="Optik Laboratuvarı"
            description="Lazerler ve lensler ile ışığın davranışını araştır."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={() => {
                state.current.source = { x: 100, y: 300, angle: 0 };
                state.current.target.hit = false;
                // Re-init visuals
            }}
            controls={
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                            <span className="text-zinc-500 font-bold text-[10px] uppercase">Lazer Açısı</span>
                            <span className="text-white font-mono text-sm">{uiSourceAngle.toFixed(0)}°</span>
                        </div>
                        <input
                            type="range" min="0" max="360" value={uiSourceAngle}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setUiSourceAngle(val);
                                state.current.source.angle = val;
                            }}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5757]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => {
                                state.current.materials.push({
                                    id: `m-${Date.now()}`, x: 150, y: 150, w: 150, h: 80, n: 1.5, name: "Cam", color: "rgba(200, 230, 255, 0.3)"
                                });
                            }}
                            className="flex items-center justify-center gap-2 bg-zinc-800 p-3 rounded-xl border border-white/5 hover:bg-zinc-700"
                        >
                            <Plus className="w-4 h-4 text-white" />
                            <span className="text-xs text-white font-bold">Cam</span>
                        </button>
                        <button
                            onClick={() => {
                                state.current.materials.push({
                                    id: `m-${Date.now()}`, x: 150, y: 250, w: 150, h: 80, n: 1.33, name: "Su", color: "rgba(100, 180, 255, 0.3)"
                                });
                            }}
                            className="flex items-center justify-center gap-2 bg-zinc-800 p-3 rounded-xl border border-white/5 hover:bg-zinc-700"
                        >
                            <Plus className="w-4 h-4 text-white" />
                            <span className="text-xs text-white font-bold">Su</span>
                        </button>
                    </div>

                    {selectedMatId && (
                        <div className="bg-zinc-900 p-4 rounded-xl border border-white/10 animate-in fade-in slide-in-from-right">
                            <div className="flex justify-between mb-4">
                                <span className="text-xs font-bold text-white">Seçili Obje</span>
                                <button
                                    onClick={() => {
                                        state.current.materials = state.current.materials.filter(m => m.id !== selectedMatId);
                                        setSelectedMatId(null);
                                    }}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        const m = state.current.materials.find(mat => mat.id === selectedMatId);
                                        if (m) {
                                            const temp = m.w; m.w = m.h; m.h = temp;
                                        }
                                    }}
                                    className="w-full py-2 bg-zinc-800 rounded text-xs font-bold text-zinc-300 hover:text-white"
                                >
                                    90° Döndür
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            }
        >
            <div
                ref={containerRef}
                className="w-full h-full relative"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <canvas ref={canvasRef} className="w-full h-full block touch-none" />
                <div className="absolute top-4 right-4 pointer-events-none opacity-40 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                    <Move className="w-3 h-3 text-white" />
                    <span className="text-[10px] text-white">Sürükle</span>
                </div>
            </div>
        </SimWrapper>
    );
}
