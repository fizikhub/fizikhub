"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Move, Plus, Trash2 } from "lucide-react";
import { SimWrapper, SimTask } from "./sim-wrapper";

interface OpticsSimProps {
    className?: string;
}

type Vector = { x: number; y: number };
type Material = { id: string; x: number; y: number; w: number; h: number; n: number; name: "Cam" | "Su" | "Hava", color: string };
type Ray = { start: Vector; dir: Vector; intensity: number };

export function OpticsSim({ className = "" }: OpticsSimProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initial Material Setup
    const [materials, setMaterials] = useState<Material[]>([
        { id: "m1", x: 300, y: 200, w: 200, h: 100, n: 1.5, name: "Cam", color: "rgba(200, 230, 255, 0.3)" },
        { id: "m2", x: 300, y: 350, w: 200, h: 100, n: 1.33, name: "Su", color: "rgba(100, 180, 255, 0.3)" }
    ]);
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

    // Light Source
    const [source, setSource] = useState({ x: 100, y: 300, angle: 0 });
    const [isDraggingSource, setIsDraggingSource] = useState(false);
    const [isDraggingMat, setIsDraggingMat] = useState<string | null>(null);

    // Tasks
    const [tasks, setTasks] = useState<SimTask[]>([
        { id: "o1", description: "Lazer ışığını hedefe ulaştır.", hint: "Blokların yerini veya lazerin açısını değiştir.", isCompleted: false },
        { id: "o2", description: "Tam yansıma olayını gözlemle.", hint: "Işığı çok yoğun ortamdan (Cam) az yoğun ortama (Hava) kritik açıdan büyük bir açıyla gönder.", isCompleted: false },
        { id: "o3", description: "İki bloğu kullanarak ışığı 'Z' şeklinde kır.", hint: "Blokları çapraz yerleştirip ışığın yolunu uzat.", isCompleted: false },
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // Target (Random position for Task 1)
    const [target, setTarget] = useState({ x: 600, y: 300, hit: false });

    // reset logic
    const resetSim = () => {
        setSource({ x: 100, y: 300, angle: 0 });
        setMaterials([
            { id: "m1", x: 300, y: 200, w: 200, h: 100, n: 1.5, name: "Cam", color: "rgba(200, 230, 255, 0.3)" },
            { id: "m2", x: 300, y: 350, w: 200, h: 100, n: 1.33, name: "Su", color: "rgba(100, 180, 255, 0.3)" }
        ]);
        setTarget({ x: 600, y: 300, hit: false });
    };

    // Helper: Normalize Vector
    const normalize = (v: Vector) => {
        const len = Math.sqrt(v.x * v.x + v.y * v.y);
        return { x: v.x / len, y: v.y / len };
    };

    // Helper: Dot Product
    const dot = (v1: Vector, v2: Vector) => v1.x * v2.x + v1.y * v2.y;

    // Ray Tracing Logic
    const traceRay = (ray: Ray, depth: number, ctx: CanvasRenderingContext2D) => {
        if (depth > 5 || ray.intensity < 0.1) return;

        let bestHit: { pt: Vector; norm: Vector; mat: Material } | null = null;
        let closestDist = Infinity;

        // Check intersections with all materials
        for (const mat of materials) {
            // Check 4 sides
            const lines = [
                { p1: { x: mat.x, y: mat.y }, p2: { x: mat.x + mat.w, y: mat.y }, n: { x: 0, y: -1 } }, // Top
                { p1: { x: mat.x, y: mat.y + mat.h }, p2: { x: mat.x + mat.w, y: mat.y + mat.h }, n: { x: 0, y: 1 } }, // Bottom
                { p1: { x: mat.x, y: mat.y }, p2: { x: mat.x, y: mat.y + mat.h }, n: { x: -1, y: 0 } }, // Left
                { p1: { x: mat.x + mat.w, y: mat.y }, p2: { x: mat.x + mat.w, y: mat.y + mat.h }, n: { x: 1, y: 0 } }, // Right
            ];

            for (const line of lines) {
                // Ray-Line Intersection
                const x1 = line.p1.x, y1 = line.p1.y;
                const x2 = line.p2.x, y2 = line.p2.y;
                const x3 = ray.start.x, y3 = ray.start.y;
                const x4 = ray.start.x + ray.dir.x, y4 = ray.start.y + ray.dir.y;

                const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
                if (den === 0) continue;

                const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
                const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

                if (t >= 0 && t <= 1 && u > 0) {
                    const intersectX = x1 + t * (x2 - x1);
                    const intersectY = y1 + t * (y2 - y1);
                    const dist = Math.sqrt((intersectX - x3) ** 2 + (intersectY - y3) ** 2);

                    if (dist < closestDist && dist > 1) { // Avoid self-intersection
                        closestDist = dist;
                        bestHit = { pt: { x: intersectX, y: intersectY }, norm: line.n, mat };
                    }
                }
            }
        }

        const endPos = bestHit ? bestHit.pt : {
            x: ray.start.x + ray.dir.x * 2000,
            y: ray.start.y + ray.dir.y * 2000
        };

        // Draw Ray Segment
        ctx.beginPath();
        ctx.moveTo(ray.start.x, ray.start.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.strokeStyle = `rgba(255, 50, 50, ${ray.intensity})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = "#FF0000";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Logic for Target Hit
        if (currentTaskIndex === 0 && !target.hit) {
            const d = pointLineDist(target, ray.start, endPos);
            if (d < 15) {
                setTarget(prev => ({ ...prev, hit: true }));
                completeTask(0);
            }
        }

        if (bestHit) {
            const { pt: intersection, norm: normal, mat: hitMaterial } = bestHit;

            // Calculate Refraction / Reflection
            const dp = dot(ray.dir, normal);
            const entering = dp < 0;

            const n1 = entering ? 1.0 : hitMaterial.n; // Assuming air outside
            const n2 = entering ? hitMaterial.n : 1.0;
            const eta = n1 / n2;

            const k = 1.0 - eta * eta * (1.0 - dp * dp);

            if (k < 0) {
                // Total Internal Reflection
                const reflectDir = {
                    x: ray.dir.x - 2 * dp * normal.x,
                    y: ray.dir.y - 2 * dp * normal.y
                };
                traceRay({ start: intersection, dir: reflectDir, intensity: ray.intensity * 0.9 }, depth + 1, ctx);

                if (currentTaskIndex === 1 && !tasks[1].isCompleted) {
                    completeTask(1); // Task 2: Observe TIR
                }

            } else {
                // Refraction
                const refractDir = {
                    x: eta * ray.dir.x - (eta * dp + Math.sqrt(k)) * normal.x,
                    y: eta * ray.dir.y - (eta * dp + Math.sqrt(k)) * normal.y
                };
                traceRay({ start: intersection, dir: refractDir, intensity: ray.intensity * 0.8 }, depth + 1, ctx);

                // Fresnel Reflection (Partial)
                const reflectDir = {
                    x: ray.dir.x - 2 * dp * normal.x,
                    y: ray.dir.y - 2 * dp * normal.y
                };
                traceRay({ start: intersection, dir: reflectDir, intensity: ray.intensity * 0.2 }, depth + 1, ctx);
            }
        }
    };

    const pointLineDist = (p: Vector, a: Vector, b: Vector) => {
        const atob = { x: b.x - a.x, y: b.y - a.y };
        const atop = { x: p.x - a.x, y: p.y - a.y };
        const len = atob.x * atob.x + atob.y * atob.y;
        let dot = atop.x * atob.x + atop.y * atob.y;
        const t = Math.min(1, Math.max(0, dot / len));
        dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
        return Math.sqrt((a.x + atob.x * t - p.x) ** 2 + (a.y + atob.y * t - p.y) ** 2);
    };

    const completeTask = (index: number) => {
        if (tasks[index].isCompleted) return;

        const newTasks = [...tasks];
        newTasks[index].isCompleted = true;
        setTasks(newTasks);
        setTimeout(() => {
            if (currentTaskIndex < tasks.length - 1) {
                setCurrentTaskIndex(prev => prev + 1);
            }
        }, 1500);
    }

    // Main Draw Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            if (containerRef.current) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }
        };
        resize(); // Initial call

        const loop = () => {
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
            for (let j = 0; j < canvas.height; j += 40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke(); }

            // Draw Target
            if (currentTaskIndex === 0) {
                ctx.beginPath();
                ctx.arc(target.x, target.y, 15, 0, Math.PI * 2);
                ctx.fillStyle = target.hit ? "#4ADE80" : "rgba(74, 222, 128, 0.2)";
                ctx.fill();
                ctx.strokeStyle = "#4ADE80";
                ctx.stroke();
                // Crosshair
                ctx.beginPath(); ctx.moveTo(target.x - 10, target.y); ctx.lineTo(target.x + 10, target.y); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(target.x, target.y - 10); ctx.lineTo(target.x, target.y + 10); ctx.stroke();
            }

            // Draw Materials
            materials.forEach(mat => {
                ctx.fillStyle = mat.color;
                ctx.fillRect(mat.x, mat.y, mat.w, mat.h);
                ctx.strokeStyle = selectedMaterial === mat.id ? "#FFC800" : "rgba(255,255,255,0.2)";
                ctx.lineWidth = 2;
                ctx.strokeRect(mat.x, mat.y, mat.w, mat.h);

                // Label
                ctx.fillStyle = "white";
                ctx.font = "bold 12px sans-serif";
                ctx.fillText(`${mat.name} (n=${mat.n})`, mat.x + 10, mat.y + 20);

                // Handles
                if (selectedMaterial === mat.id) {
                    ctx.fillStyle = "#FFC800";
                    ctx.fillRect(mat.x + mat.w - 8, mat.y + mat.h - 8, 8, 8); // Resize handle mockup
                }
            });

            // Draw Source
            ctx.save();
            ctx.translate(source.x, source.y);
            ctx.rotate(source.angle * Math.PI / 180);

            // Source Body
            ctx.fillStyle = "#333";
            ctx.fillRect(-10, -10, 40, 20);
            ctx.strokeStyle = "#999";
            ctx.strokeRect(-10, -10, 40, 20);

            // Laser Emitter
            ctx.fillStyle = "#FF0000";
            ctx.beginPath(); ctx.arc(30, 0, 4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // Trace Rays
            const rad = source.angle * Math.PI / 180;
            const dir = { x: Math.cos(rad), y: Math.sin(rad) };
            // Start ray slightly offset from source center to allow dragging source without self-hit issues if complex
            const start = {
                x: source.x + dir.x * 30,
                y: source.y + dir.y * 30
            };
            traceRay({ start, dir, intensity: 1.0 }, 0, ctx);

            requestAnimationFrame(loop);
        };
        const anim = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(anim);
    }, [materials, source, target, selectedMaterial, tasks, currentTaskIndex]);


    // Interaction Logic
    const handlePointerDown = (e: React.PointerEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        // Check Source Hit
        if (Math.hypot(px - source.x, py - source.y) < 20) {
            setIsDraggingSource(true);
            return;
        }

        // Check Materials Hit
        const mat = materials.find(m => px >= m.x && px <= m.x + m.w && py >= m.y && py <= m.y + m.h);
        if (mat) {
            setSelectedMaterial(mat.id);
            setIsDraggingMat(mat.id);
        } else {
            setSelectedMaterial(null);
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        if (isDraggingSource) {
            // If dragging near edge, rotate instead? 
            // Simple: Left button drag moves position. Right click rotates? 
            // Let's just update position for now, and have a slider for angle.
            setSource(prev => ({ ...prev, x: px, y: py }));
        }

        if (isDraggingMat) {
            setMaterials(prev => prev.map(m => {
                if (m.id === isDraggingMat) {
                    return { ...m, x: px - m.w / 2, y: py - m.h / 2 };
                }
                return m;
            }));
        }
    };

    const handlePointerUp = () => {
        setIsDraggingSource(false);
        setIsDraggingMat(null);
    };

    return (
        <SimWrapper
            title="Optik Laboratuvarı"
            description="Işığın kırılma ve yansıma yasalarını keşfet. Lazer kaynağını ve mercekleri hareket ettir."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={
                <div className="space-y-6">
                    {/* Source Controls */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                            <span className="text-zinc-500 font-black text-[10px] uppercase tracking-wider">Lazer Açısı</span>
                            <span className="text-white font-mono text-sm font-bold">{source.angle.toFixed(0)}°</span>
                        </div>
                        <input
                            type="range" min="0" max="360" value={source.angle}
                            onChange={(e) => setSource(prev => ({ ...prev, angle: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5757]"
                        />
                    </div>

                    {/* Material Controls */}
                    <div className="space-y-3">
                        <div className="text-zinc-500 font-black text-[10px] uppercase tracking-wider mb-2">Materyaller</div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setMaterials(prev => [...prev, {
                                    id: `m-${Date.now()}`, x: 100, y: 100, w: 150, h: 80,
                                    n: 1.5, name: "Cam", color: "rgba(200, 230, 255, 0.3)"
                                }])}
                                className="flex items-center justify-center gap-2 bg-zinc-800 p-3 rounded-xl hover:bg-zinc-700 transition-colors border border-white/5"
                            >
                                <Plus className="w-4 h-4 text-white" />
                                <span className="text-xs text-white font-bold">Cam Ekle</span>
                            </button>
                            <button
                                onClick={() => setMaterials(prev => [...prev, {
                                    id: `mw-${Date.now()}`, x: 150, y: 150, w: 150, h: 80,
                                    n: 1.33, name: "Su", color: "rgba(100, 180, 255, 0.3)"
                                }])}
                                className="flex items-center justify-center gap-2 bg-zinc-800 p-3 rounded-xl hover:bg-zinc-700 transition-colors border border-white/5"
                            >
                                <Plus className="w-4 h-4 text-white" />
                                <span className="text-xs text-white font-bold">Su Ekle</span>
                            </button>
                        </div>
                    </div>

                    {/* Selected Material Props */}
                    {selectedMaterial && (
                        <div className="animate-in slide-in-from-right fade-in bg-zinc-900 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-white font-bold text-sm">Seçili Blok</span>
                                <button
                                    onClick={() => {
                                        setMaterials(prev => prev.filter(m => m.id !== selectedMaterial));
                                        setSelectedMaterial(null);
                                    }}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {(() => {
                                const mat = materials.find(m => m.id === selectedMaterial);
                                if (!mat) return null;
                                return (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] text-zinc-500 font-black uppercase mb-2 block">Kırılma İndisi (n)</label>
                                            <input
                                                type="range" min="1" max="2.5" step="0.01" value={mat.n}
                                                onChange={(e) => setMaterials(prev => prev.map(m => m.id === selectedMaterial ? { ...m, n: parseFloat(e.target.value) } : m))}
                                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#4ADE80]"
                                            />
                                            <div className="text-right text-xs text-white font-mono mt-1">{mat.n.toFixed(2)}</div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-zinc-500 font-black uppercase mb-2 block">Döndürme (Basic)</label>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setMaterials(prev => prev.map(m => m.id === selectedMaterial ? { ...m, w: m.h, h: m.w } : m))}
                                                    className="flex-1 py-2 bg-zinc-800 rounded-lg text-xs font-bold text-white hover:bg-zinc-700"
                                                >
                                                    90° Çevir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-xl p-4">
                        <p className="text-[#FFD700] text-[10px] leading-relaxed font-bold italic uppercase tracking-wider">
                            ✨ İpucu: Lazer kaynağını (kırmızı nokta) ve cam/su bloklarını sürükleyerek hareket ettirebilirsin.
                        </p>
                    </div>
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

                {/* Drag Hint Overlay */}
                <div className="absolute top-4 right-4 pointer-events-none opacity-50">
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                        <Move className="w-3 h-3 text-white" />
                        <span className="text-[10px] text-white">Sürükle & Bırak</span>
                    </div>
                </div>
            </div>
        </SimWrapper>
    );
}
