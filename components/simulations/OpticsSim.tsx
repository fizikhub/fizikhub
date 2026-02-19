"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Move, Plus, Trash2, RotateCcw, MousePointer2 } from "lucide-react";
import { SimWrapper, SimTask } from "./sim-wrapper";

interface OpticsSimProps {
    className?: string;
}

// -- Physics Engine Types --
type Vector = { x: number; y: number };
type MaterialType = "Glass" | "Water" | "Air" | "Diamond" | "Custom";
type OpticalMaterial = {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    n: number; // Refractive Index
    name: string;
    color: string;
    rotation: number; // For rotating blocks
};

type RaySegment = {
    start: Vector;
    end: Vector;
    intensity: number;
};

type GameState = {
    source: { x: number; y: number; angle: number; active: boolean };
    materials: OpticalMaterial[];
    target: { x: number; y: number; r: number; hit: boolean };
    dragging: { type: "source" | "material" | null; id?: string; offset?: Vector };
    rays: RaySegment[]; // Store computed rays for debugging/rendering
};

export function OpticsSim({ className }: OpticsSimProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // -- UI State --
    const [tasks, setTasks] = useState<SimTask[]>([
        { id: "o1", description: "Hedefi Vurmak", hint: "Lazer kaynağını veya cam bloğu hareket ettirerek ışığı hedefe ulaştır.", isCompleted: false },
        { id: "o2", description: "Tam Yansıma", hint: "Işığı camdan havaya gönderirken açıyı genişlet (yaklaşık 42° üzeri).", isCompleted: false },
        { id: "o3", description: "Prizma Etkisi", hint: "İki farklı ortamı kullanarak ışığı saptır.", isCompleted: false },
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // Controls State
    const [selectedMatId, setSelectedMatId] = useState<string | null>(null);
    const [uiSourceAngle, setUiSourceAngle] = useState(0);

    // -- Physics State (Ref) --
    const state = useRef<GameState>({
        source: { x: 100, y: 300, angle: 0, active: true },
        materials: [
            { id: "glass-1", x: 300, y: 200, w: 150, h: 200, n: 1.5, name: "Cam (n=1.5)", color: "rgba(100, 200, 255, 0.2)", rotation: 0 }
        ],
        target: { x: 600, y: 300, r: 20, hit: false },
        dragging: { type: null },
        rays: []
    });

    // -- Reset --
    const resetSim = useCallback(() => {
        const s = state.current;
        s.source = { x: 100, y: s.source.y, angle: 0, active: true }; // Keep Y mostly
        s.target.hit = false;
        s.materials = [
            { id: "glass-default", x: 300, y: 200, w: 150, h: 200, n: 1.5, name: "Cam", color: "rgba(100, 200, 255, 0.2)", rotation: 0 }
        ];
        setSelectedMatId(null);
        setUiSourceAngle(0);
        setCurrentTaskIndex(0); // Optional: reset tasks? Maybe not.
    }, []);

    // -- Physics Helper Functions --
    const dot = (v1: Vector, v2: Vector) => v1.x * v2.x + v1.y * v2.y;
    const normalize = (v: Vector) => {
        const len = Math.sqrt(v.x * v.x + v.y * v.y);
        return len === 0 ? { x: 0, y: 0 } : { x: v.x / len, y: v.y / len };
    };

    // -- Ray Tracing Core --
    const computePhysics = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const s = state.current;
        const rays: RaySegment[] = [];
        const maxDepth = 6;

        const castRay = (start: Vector, dir: Vector, intensity: number, depth: number) => {
            if (depth > maxDepth || intensity < 0.05) return;

            let closestT = Infinity;
            let bestHit: { pt: Vector, norm: Vector, mat: OpticalMaterial | null } | null = null;

            // 1. Intersect with Canvas Boundaries (Screen edges)
            const bounds = [
                { p1: { x: 0, y: 0 }, p2: { x: width, y: 0 }, n: { x: 0, y: 1 } },
                { p1: { x: width, y: 0 }, p2: { x: width, y: height }, n: { x: -1, y: 0 } },
                { p1: { x: width, y: height }, p2: { x: 0, y: height }, n: { x: 0, y: -1 } },
                { p1: { x: 0, y: height }, p2: { x: 0, y: 0 }, n: { x: 1, y: 0 } }
            ];

            // 2. Intersect with Materials
            // For now, assume Axis-Aligned Bounding Boxes (AABB) for simplicity, 
            // but we might want rotation later. Treating as AABB.
            for (const mat of s.materials) {
                const rectLines = [
                    { p1: { x: mat.x, y: mat.y }, p2: { x: mat.x + mat.w, y: mat.y }, n: { x: 0, y: -1 } }, // Top
                    { p1: { x: mat.x, y: mat.y + mat.h }, p2: { x: mat.x + mat.w, y: mat.y + mat.h }, n: { x: 0, y: 1 } }, // Bottom
                    { p1: { x: mat.x, y: mat.y }, p2: { x: mat.x, y: mat.y + mat.h }, n: { x: -1, y: 0 } }, // Left
                    { p1: { x: mat.x + mat.w, y: mat.y }, p2: { x: mat.x + mat.w, y: mat.y + mat.h }, n: { x: 1, y: 0 } }  // Right
                ];

                for (const line of rectLines) {
                    const x1 = line.p1.x, y1 = line.p1.y;
                    const x2 = line.p2.x, y2 = line.p2.y;
                    const x3 = start.x, y3 = start.y;
                    const x4 = start.x + dir.x, y4 = start.y + dir.y;

                    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
                    if (den === 0) continue;

                    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
                    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

                    // Avoid self-intersection: t must be slightly > 0
                    if (t > 0.001 && t < closestT && u >= 0 && u <= 1) {
                        const ix = x1 + t * (x2 - x1);
                        const iy = y1 + t * (y2 - y1);
                        // Check strictly greater than epsilon to avoid self-hits
                        closestT = t;
                        bestHit = { pt: { x: ix, y: iy }, norm: line.n, mat: mat };
                    }
                }
            }

            // Check canvas bounds as fallback if no material hit closer
            for (const line of bounds) {
                const x1 = line.p1.x, y1 = line.p1.y;
                const x2 = line.p2.x, y2 = line.p2.y;
                const x3 = start.x, y3 = start.y;
                const x4 = start.x + dir.x, y4 = start.y + dir.y;

                const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
                if (den === 0) continue;

                const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
                const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

                if (t > 0.001 && t < closestT && u >= 0 && u <= 1) {
                    const ix = x1 + t * (x2 - x1);
                    const iy = y1 + t * (y2 - y1);
                    closestT = t;
                    bestHit = { pt: { x: ix, y: iy }, norm: line.n, mat: null }; // Wall hit
                }
            }

            if (!bestHit) {
                // Should practically never happen with bounds, but strictly:
                rays.push({ start, end: { x: start.x + dir.x * 1000, y: start.y + dir.y * 1000 }, intensity });
                return;
            }

            // Record Ray
            const hitPt = bestHit.pt;
            rays.push({ start, end: hitPt, intensity });

            // Check Target Hit (for task)
            if (currentTaskIndex === 0 && !s.target.hit) {
                // Point-line distance check for the target circle
                // Simple approx: check if ray segment intersects circle
                const dx = s.target.x - start.x;
                const dy = s.target.y - start.y;
                // If start is close or ray passes through... 
                // Let's use simple distance from hit point for now.
                if (Math.hypot(hitPt.x - s.target.x, hitPt.y - s.target.y) < s.target.r + 5) {
                    s.target.hit = true;
                    completeTask(0);
                }
            }

            // Stop if hit wall (mat === null)
            if (!bestHit.mat) return;

            // Refraction / Reflection Logic
            const mat = bestHit.mat;
            const norm = bestHit.norm;

            // Determine incident n1 and transmitted n2
            const dotProd = dot(dir, norm);
            const entering = dotProd < 0;

            const n1 = entering ? 1.0 : mat.n; // Assuming air (1.0) outside
            const n2 = entering ? mat.n : 1.0;
            const eta = n1 / n2;

            // Fresnel calculation setup
            const cosTi = -dotProd; // Incident angle cosine (if entering, dotProd is neg, so neg dotProd is pos)
            // Wait, standard geometric approach:
            // I = -N if entering, else N
            const normal = entering ? norm : { x: -norm.x, y: -norm.y };
            const cosI = -dot(dir, normal);
            const sinT2 = eta * eta * (1.0 - cosI * cosI);

            if (sinT2 > 1.0) {
                // Total Internal Reflection (TIR)
                const reflDir = {
                    x: dir.x + 2 * cosI * normal.x,
                    y: dir.y + 2 * cosI * normal.y
                };
                // Task 2 check
                if (currentTaskIndex === 1 && !tasks[1].isCompleted) completeTask(1);

                castRay(hitPt, reflDir, intensity, depth + 1);
            } else {
                const cosT = Math.sqrt(1.0 - sinT2);
                const refrDir = {
                    x: eta * dir.x + (eta * cosI - cosT) * normal.x,
                    y: eta * dir.y + (eta * cosI - cosT) * normal.y
                };

                // Fresnel Reflection (Partial)
                // Simple approximation or Schlick's
                const R0 = ((n1 - n2) / (n1 + n2)) ** 2;
                const R = R0 + (1 - R0) * ((1 - cosI) ** 5);

                castRay(hitPt, refrDir, intensity * (1 - R), depth + 1);
                if (R > 0.05) {
                    const reflDir = {
                        x: dir.x + 2 * cosI * normal.x,
                        y: dir.y + 2 * cosI * normal.y
                    };
                    castRay(hitPt, reflDir, intensity * R, depth + 1);
                }
            }
        };

        // Start Ray
        const rad = s.source.angle * Math.PI / 180;
        const dir = { x: Math.cos(rad), y: Math.sin(rad) };
        castRay({ x: s.source.x, y: s.source.y }, dir, 1.0, 0);

        s.rays = rays;
    };

    const completeTask = (index: number) => {
        setTasks(prev => {
            if (prev[index].isCompleted) return prev;
            const n = [...prev];
            n[index].isCompleted = true;
            return n;
        });
        setTimeout(() => setCurrentTaskIndex(i => Math.min(i + 1, tasks.length - 1)), 1500);
    };

    // -- Render Loop --
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !containerRef.current) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const loop = () => {
            const container = containerRef.current;
            if (!container) return;

            // Resize
            if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
            }

            // Physics
            computePhysics(ctx, canvas.width, canvas.height);

            // Draw
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            const gridSize = 50;
            for (let x = 0; x < canvas.width; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
            for (let y = 0; y < canvas.height; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

            const s = state.current;

            // Target
            if (currentTaskIndex === 0) {
                ctx.beginPath();
                ctx.arc(s.target.x, s.target.y, s.target.r, 0, Math.PI * 2);
                ctx.fillStyle = s.target.hit ? "#4ADE80" : "rgba(74, 222, 128, 0.2)";
                ctx.fill();
                ctx.strokeStyle = "#4ADE80";
                ctx.lineWidth = 2;
                ctx.stroke();
                // Glow
                if (s.target.hit) {
                    ctx.shadowColor = "#4ADE80";
                    ctx.shadowBlur = 20;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // Materials
            s.materials.forEach(mat => {
                const isSelected = selectedMatId === mat.id;
                ctx.fillStyle = mat.color;
                ctx.fillRect(mat.x, mat.y, mat.w, mat.h);

                // Border
                ctx.lineWidth = isSelected ? 3 : 1;
                ctx.strokeStyle = isSelected ? "#FACC15" : "rgba(255,255,255,0.3)";
                ctx.strokeRect(mat.x, mat.y, mat.w, mat.h);

                // Label
                ctx.fillStyle = "white";
                ctx.font = "12px sans-serif";
                ctx.fillText(`${mat.name} (n=${mat.n})`, mat.x + 5, mat.y - 5);

                // Handles (if selected)
                if (isSelected) {
                    ctx.fillStyle = "#FACC15";
                    ctx.fillRect(mat.x - 4, mat.y - 4, 8, 8); // TL
                    ctx.fillRect(mat.x + mat.w - 4, mat.y + mat.h - 4, 8, 8); // BR
                }
            });

            // Rays
            s.rays.forEach(ray => {
                ctx.beginPath();
                ctx.moveTo(ray.start.x, ray.start.y);
                ctx.lineTo(ray.end.x, ray.end.y);
                ctx.strokeStyle = `rgba(255, 50, 50, ${ray.intensity})`;
                ctx.lineWidth = 2 * ray.intensity * (window.devicePixelRatio || 1);
                ctx.stroke();

                // Arrow head for direction? Maybe.
            });

            // Source (Laser Pointer)
            ctx.save();
            ctx.translate(s.source.x, s.source.y);
            ctx.rotate(s.source.angle * Math.PI / 180);

            // Body
            ctx.fillStyle = "#27272a";
            ctx.fillRect(-15, -10, 50, 20);
            ctx.strokeStyle = "#52525b";
            ctx.lineWidth = 2;
            ctx.strokeRect(-15, -10, 50, 20);

            // Output point
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(35, 0, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            animationId = requestAnimationFrame(loop);
        };
        animationId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationId);
    }, [currentTaskIndex, selectedMatId]);

    // -- Interactions --
    const handlePointerDown = (e: React.PointerEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();
        // Handle touch vs mouse coordinates correctly if needed, but clientX is usually fine
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const s = state.current;

        // 1. Check Source
        if (Math.hypot(x - s.source.x, y - s.source.y) < 30) {
            s.dragging = { type: "source", offset: { x: x - s.source.x, y: y - s.source.y } };
            return;
        }

        // 2. Check Materials (Topmost first)
        for (let i = s.materials.length - 1; i >= 0; i--) {
            const mat = s.materials[i];
            if (x >= mat.x && x <= mat.x + mat.w && y >= mat.y && y <= mat.y + mat.h) {
                s.dragging = { type: "material", id: mat.id, offset: { x: x - mat.x, y: y - mat.y } };
                setSelectedMatId(mat.id);
                return;
            }
        }

        // Deselect
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
            layoutMode="split"
            title="Optik Laboratuvarı"
            description="Işığın kırılma ve yansıma yasalarını keşfet."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={
                <div className="space-y-6">
                    {/* Source Control */}
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">LAZER KAYNAĞI</span>
                            <span className="text-white font-mono font-bold bg-white/5 px-2 py-1 rounded">{uiSourceAngle}°</span>
                        </div>
                        <input
                            type="range" min="0" max="360" value={uiSourceAngle}
                            onChange={(e) => {
                                const v = parseInt(e.target.value);
                                setUiSourceAngle(v);
                                state.current.source.angle = v;
                            }}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => {
                                state.current.materials.push({
                                    id: `glass-${Date.now()}`,
                                    x: 100, y: 100, w: 120, h: 80,
                                    n: 1.5, name: "Cam", color: "rgba(100, 200, 255, 0.2)", rotation: 0
                                });
                            }}
                            className="flex items-center justify-center gap-2 bg-zinc-800 p-4 rounded-xl border border-white/5 hover:bg-zinc-700 active:scale-95 transition-all"
                        >
                            <Plus className="w-5 h-5 text-blue-400" />
                            <span className="font-bold text-sm text-white">Cam Ekle</span>
                        </button>

                        <button
                            onClick={() => {
                                state.current.materials.push({
                                    id: `water-${Date.now()}`,
                                    x: 100, y: 200, w: 120, h: 80,
                                    n: 1.33, name: "Su", color: "rgba(100, 255, 200, 0.2)", rotation: 0
                                });
                            }}
                            className="flex items-center justify-center gap-2 bg-zinc-800 p-4 rounded-xl border border-white/5 hover:bg-zinc-700 active:scale-95 transition-all"
                        >
                            <Plus className="w-5 h-5 text-teal-400" />
                            <span className="font-bold text-sm text-white">Su Ekle</span>
                        </button>
                    </div>

                    {/* Selection Context */}
                    {selectedMatId && (
                        <div className="animate-in slide-in-from-bottom-5 fade-in duration-300">
                            <div className="p-4 bg-zinc-900 rounded-xl border border-amber-500/20 shadow-lg shadow-amber-900/10">
                                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                                    <span className="font-bold text-amber-400 text-sm flex items-center gap-2">
                                        <MousePointer2 className="w-4 h-4" />
                                        Seçili Obje
                                    </span>
                                    <button
                                        onClick={() => {
                                            state.current.materials = state.current.materials.filter(m => m.id !== selectedMatId);
                                            setSelectedMatId(null);
                                        }}
                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        const m = state.current.materials.find(mat => mat.id === selectedMatId);
                                        if (m) {
                                            // Simple swap w/h for 90 deg rotation roughly
                                            const temp = m.w; m.w = m.h; m.h = temp;
                                        }
                                    }}
                                    className="w-full py-3 bg-zinc-800 rounded-lg font-bold text-sm text-zinc-300 hover:text-white flex items-center justify-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
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
                className="w-full h-full relative cursor-crosshair touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <canvas ref={canvasRef} className="w-full h-full block" />

                {/* Visual Hint */}
                {state.current.materials.length === 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 font-bold text-2xl pointer-events-none">
                        Blok Ekle
                    </div>
                )}
            </div>
        </SimWrapper>
    );
}
