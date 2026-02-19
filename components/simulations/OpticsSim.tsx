"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SimWrapper, SimTask } from "./sim-wrapper";
import { MousePointer2, Move, RotateCw, Plus, Trash2 } from "lucide-react";

// --- Types & Physics Interfaces ---

type Vector = { x: number; y: number };
const vec = (x: number, y: number) => ({ x, y });
const add = (v1: Vector, v2: Vector) => ({ x: v1.x + v2.x, y: v1.y + v2.y });
const sub = (v1: Vector, v2: Vector) => ({ x: v1.x - v2.x, y: v1.y - v2.y });
const scale = (v: Vector, s: number) => ({ x: v.x * s, y: v.y * s });
const dot = (v1: Vector, v2: Vector) => v1.x * v2.x + v1.y * v2.y;
const len = (v: Vector) => Math.sqrt(v.x * v.x + v.y * v.y);
const norm = (v: Vector) => { const l = len(v); return l === 0 ? vec(0, 0) : scale(v, 1 / l); };
const rot = (v: Vector, angle: number) => ({
    x: v.x * Math.cos(angle) - v.y * Math.sin(angle),
    y: v.x * Math.sin(angle) + v.y * Math.cos(angle)
});

type OpticalElement = {
    id: string;
    type: "block" | "mirror" | "target";
    x: number;
    y: number;
    w: number;
    h: number;
    rotation: number; // radians
    n: number; // Refractive index (1.5 glass, 1.33 water, Infinity mirror)
    dragging?: boolean;
    color: string;
};

type RaySegment = {
    start: Vector;
    end: Vector;
    intensity: number;
};

// --- Physics Constants ---
const MAX_BOUNCES = 10;
const MIN_INTENSITY = 0.01;

export default function OpticsSim() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // -- State --
    const [laser, setLaser] = useState({ x: 50, y: 300, angle: -0.2, dragging: false });
    const [elements, setElements] = useState<OpticalElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [rays, setRays] = useState<RaySegment[]>([]);

    const [tasks, setTasks] = useState<SimTask[]>([
        {
            id: "o1", description: "Hedefi Vur!", hint: "Aynayı sürükle ve açısını değiştirerek lazeri hedefe yansıt.", isCompleted: false,
            explanation: "Yansıma Yasası: Işık aynaya hangi açıyla gelirse, aynı açıyla yansır."
        },
        {
            id: "o2", description: "Işığı Kır!", hint: "Cam bloğu ışığın yoluna koy. Işığın nasıl büküldüğünü gör.", isCompleted: false,
            explanation: "Snell Yasası: Işık cam gibi yoğun bir ortama girerken yavaşlar ve yön değiştirir."
        },
        {
            id: "o3", description: "Işığı Hapset!", hint: "Işığı camın içinden çok yatay gönder (veya lazeri camın içine sok). Işık dışarı çıkamasın!", isCompleted: false,
            explanation: "Tebrikler! Kritik açıyı aştın ve ışık dışarı çıkamadı. Fiber internet kablosu da böyle çalışır."
        }
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // -- Init --
    useEffect(() => {
        resetSim();
    }, []);

    const resetSim = () => {
        setLaser({ x: 50, y: 300, angle: -0.2, dragging: false });
        const target: OpticalElement = {
            id: "target", type: "target", x: 700, y: 300, w: 20, h: 20, rotation: 0, n: 1,
            color: "#EF4444"
        };
        const mirror: OpticalElement = {
            id: "mirror1", type: "mirror", x: 400, y: 500, w: 100, h: 10, rotation: 0, n: Infinity,
            color: "#94A3B8"
        };
        setElements([target, mirror]);
    };

    // -- Physics Engine (Ray Tracing) --
    const traceRay = useCallback((start: Vector, dir: Vector, intensity: number, depth: number, excludeId?: string): RaySegment[] => {
        if (depth > MAX_BOUNCES || intensity < MIN_INTENSITY) return [];

        let nearestT = Infinity;
        let hitPoint = add(start, scale(dir, 1000)); // Default end
        let hitNormal = vec(0, 0);
        let hitElement: OpticalElement | null = null;
        let entering = true;

        // Check intersections with all elements
        // Simplified: Treat all as AABBs first for speed, or OBBs properly
        // Let's do proper OBB (Oriented Bounding Box) intersection
        for (const el of elements) {
            if (el.id === "target") continue; // Targets don't reflect/refract physics-wise (detected separately)
            if (el.id === excludeId) continue;

            // Transform ray to local space of the element
            // 1. Translate ray start to relative
            const relStart = sub(start, vec(el.x, el.y));
            // 2. Rotate ray by -el.rotation
            const localStart = rot(relStart, -el.rotation);
            const localDir = rot(dir, -el.rotation);

            // AABB Intersection in local space (-w/2, -h/2 to w/2, h/2)
            const halfW = el.w / 2;
            const halfH = el.h / 2;

            // Cohen-Sutherland-like clipping or slab method
            // Slab method for ray-AABB constants:
            const tx1 = (-halfW - localStart.x) / localDir.x;
            const tx2 = (halfW - localStart.x) / localDir.x;
            const ty1 = (-halfH - localStart.y) / localDir.y;
            const ty2 = (halfH - localStart.y) / localDir.y;

            const tmin = Math.max(Math.min(tx1, tx2), Math.min(ty1, ty2));
            const tmax = Math.min(Math.max(tx1, tx2), Math.max(ty1, ty2));

            if (tmax < 0 || tmin > tmax) continue; // No hit

            const t = tmin > 0.001 ? tmin : tmax; // if inside, tmin < 0, take tmax
            if (t > 0.001 && t < nearestT) {
                nearestT = t;
                hitElement = el;

                // Calculate local normal
                const localHit = add(localStart, scale(localDir, t));
                let localN = vec(0, 0);
                const eps = 0.01;
                if (Math.abs(localHit.x - (-halfW)) < eps) localN = vec(-1, 0);
                else if (Math.abs(localHit.x - halfW) < eps) localN = vec(1, 0);
                else if (Math.abs(localHit.y - (-halfH)) < eps) localN = vec(0, -1);
                else localN = vec(0, 1);

                hitNormal = rot(localN, el.rotation); // Transform normal back to world
                hitPoint = add(start, scale(dir, t));
                entering = tmin > 0.001; // If tmin positive, we hit outside. If negative, we are inside exiting.
            }
        }

        // Current Segment
        const segment: RaySegment = { start, end: hitPoint, intensity };
        const nextSegments: RaySegment[] = [];

        // Explicit null check for safety
        if (!hitElement) return [segment];

        if (hitElement.type === "mirror") {
            // Reflection: R = D - 2(D.N)N
            const dDotN = dot(dir, hitNormal);
            const reflectDir = sub(dir, scale(hitNormal, 2 * dDotN));
            nextSegments.push(...traceRay(hitPoint, reflectDir, intensity * 0.9, depth + 1, hitElement.id));
        } else if (hitElement.type === "block") {
            // Refraction (Snell's Law)
            const n1 = entering ? 1.0 : hitElement.n;
            const n2 = entering ? hitElement.n : 1.0;
            const eta = n1 / n2;
            const dDotN = dot(dir, hitNormal);

            // Fresnel (simplified) checks for TIR
            // cos(theta1) = -dot(D, N) (if N is pointing against D)
            // Ensure Normal points against Ray
            let N = hitNormal;
            let c1 = -dot(dir, N);
            if (c1 < 0) { c1 = -c1; N = scale(N, -1); } // Flip normal if inside

            const k = 1.0 - eta * eta * (1.0 - c1 * c1);

            if (k < 0) {
                // Total Internal Reflection (TIR)
                const reflectDir = sub(dir, scale(N, 2 * dot(dir, N)));
                nextSegments.push(...traceRay(hitPoint, reflectDir, intensity, depth + 1, hitElement.id));
            } else {
                // Refraction
                const refractDir = add(scale(dir, eta), scale(N, eta * c1 - Math.sqrt(k)));
                nextSegments.push(...traceRay(hitPoint, norm(refractDir), intensity * 0.8, depth + 1, hitElement.id));

                // Partial Reflection (Fresnel effect roughly)
                const reflectDir = sub(dir, scale(N, 2 * dot(dir, N)));
                nextSegments.push(...traceRay(hitPoint, reflectDir, intensity * 0.2, depth + 1, hitElement.id));
            }
        }

        return [segment, ...nextSegments];
    }, [elements]);

    // -- Game Loop --
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !containerRef.current) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const render = () => {
            if (canvas.width !== containerRef.current!.clientWidth) {
                canvas.width = containerRef.current!.clientWidth;
                canvas.height = containerRef.current!.clientHeight;
            }
            const width = canvas.width;
            const height = canvas.height;

            // Physics Calculation
            const startDir = vec(Math.cos(laser.angle), Math.sin(laser.angle));
            const calculatedRays = traceRay(vec(laser.x, laser.y), startDir, 1.0, 0);
            setRays(calculatedRays);

            // Draw
            ctx.fillStyle = "#020617"; // Slate 950
            ctx.fillRect(0, 0, width, height);

            // Grid
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
            for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

            // Laser Body
            ctx.save();
            ctx.translate(laser.x, laser.y);
            ctx.rotate(laser.angle);
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(-15, -8, 30, 16);
            ctx.fillStyle = "#991b1b";
            ctx.fillRect(10, -4, 5, 8); // Nozzle
            ctx.restore();

            // Elements
            elements.forEach(el => {
                ctx.save();
                ctx.translate(el.x, el.y);
                ctx.rotate(el.rotation);

                if (el.type === "target") {
                    ctx.fillStyle = el.color; // Red
                    ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = "white";
                    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = el.color;
                    ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();

                    // Hit Check
                    const lastRay = calculatedRays[calculatedRays.length - 1];
                    const dist = Math.sqrt((lastRay.end.x - el.x) ** 2 + (lastRay.end.y - el.y) ** 2);
                    if (dist < 20) {
                        // Hit logic in loop or effect? Doing visuals here.
                        ctx.shadowColor = "#ef4444";
                        ctx.shadowBlur = 20;
                    }

                } else {
                    ctx.fillStyle = el.color;
                    // Glass/Water transparency
                    if (el.type === "block") ctx.globalAlpha = 0.3;

                    ctx.fillRect(-el.w / 2, -el.h / 2, el.w, el.h);

                    ctx.globalAlpha = 1.0;
                    ctx.strokeStyle = el.id === selectedId ? "#FDB813" : "rgba(255,255,255,0.2)";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(-el.w / 2, -el.h / 2, el.w, el.h);

                    // Rotation Handle
                    if (el.id === selectedId) {
                        ctx.fillStyle = "#FDB813";
                        ctx.beginPath(); ctx.arc(0, -el.h / 2 - 15, 5, 0, Math.PI * 2); ctx.fill();
                        ctx.beginPath(); ctx.moveTo(0, -el.h / 2); ctx.lineTo(0, -el.h / 2 - 15); ctx.stroke();
                    }
                }
                ctx.restore();
            });

            // Rays
            ctx.lineCap = "round";
            calculatedRays.forEach(ray => {
                ctx.beginPath();
                ctx.moveTo(ray.start.x, ray.start.y);
                ctx.lineTo(ray.end.x, ray.end.y);
                ctx.strokeStyle = `rgba(239, 68, 68, ${ray.intensity})`;
                ctx.lineWidth = 3 * ray.intensity;
                ctx.shadowColor = "#ef4444";
                ctx.shadowBlur = 10 * ray.intensity;
                ctx.stroke();
                ctx.shadowBlur = 0;
            });

            // Target Hit Check Logic for Tasks
            const lastRay = calculatedRays[calculatedRays.length - 1];
            if (lastRay) {
                const target = elements.find(e => e.type === "target");
                if (target) {
                    const dist = Math.sqrt((lastRay.end.x - target.x) ** 2 + (lastRay.end.y - target.y) ** 2);
                    if (dist < 20 && currentTaskIndex === 0 && !tasks[0].isCompleted) {
                        completeTask(0);
                    }
                }
                // Task 2 check (Refraction)
                if (currentTaskIndex === 1 && !tasks[1].isCompleted) {
                    // Check if ray passed through a block? 
                    const hasRefraction = calculatedRays.length > 2; // Simple heuristic
                    if (hasRefraction) completeTask(1);
                }
                // Task 3 check (TIR)
                if (currentTaskIndex === 2 && !tasks[2].isCompleted) {
                    // Check if rays are bouncing inside a block
                    const bounces = calculatedRays.filter(r => r.intensity > 0.8).length;
                    if (bounces > 4) completeTask(2);
                }
            }

            animationId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationId);
    }, [laser, elements, selectedId, traceRay, currentTaskIndex, tasks]);

    const completeTask = (index: number) => {
        setTasks(prev => {
            if (prev[index].isCompleted) return prev;
            const newTasks = [...prev];
            newTasks[index].isCompleted = true;
            return newTasks;
        });
        setTimeout(() => setCurrentTaskIndex(prev => Math.min(prev + 1, tasks.length - 1)), 1500);
    };

    // -- Interactions --
    // Simplified for brevity in this prompt, handling drag of Laser and Elements
    const handlePointerDown = (e: React.PointerEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check Laser
        if (Math.hypot(x - laser.x, y - laser.y) < 30) {
            setLaser({ ...laser, dragging: true });
            setSelectedId(null);
            return;
        }

        // Check Elements
        // Simple radius or box check
        const clicked = elements.find(el => Math.hypot(x - el.x, y - el.y) < Math.max(el.w, el.h) / 2);
        if (clicked) {
            setSelectedId(clicked.id);
            // Check rotation handle
            // ...
        } else {
            setSelectedId(null);
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (laser.dragging) {
            // If dragging near edge, rotate? Or separate rotate mode?
            // Let's just move laser position for now
            // Angle change logic:
            const dx = x - laser.x;
            const dy = y - laser.y;
            if (Math.hypot(dx, dy) > 20) {
                setLaser(prev => ({ ...prev, angle: Math.atan2(dy, dx) }));
            }
            // setLaser(prev => ({ ...prev, x, y })); // Move vs Rotate? 
            // Let's make it look at mouse
            setLaser(prev => ({ ...prev, angle: Math.atan2(y - prev.y, x - prev.x) }));
            return;
        }

        // Element dragging
        if (selectedId && e.buttons === 1) {
            setElements(prev => prev.map(el => {
                if (el.id === selectedId) {
                    return { ...el, x, y };
                }
                return el;
            }));
        }
    };

    const handlePointerUp = () => {
        setLaser(prev => ({ ...prev, dragging: false }));
    };

    // Add Elements
    const addElement = (type: "block" | "mirror") => {
        const newEl: OpticalElement = {
            id: Math.random().toString(36),
            type,
            x: 400 + Math.random() * 50,
            y: 300 + Math.random() * 50,
            w: type === "block" ? 100 : 120,
            h: type === "block" ? 60 : 10,
            rotation: 0,
            n: type === "block" ? 1.5 : Infinity,
            color: type === "block" ? "#93C5FD" : "#94A3B8"
        };
        setElements(prev => [...prev, newEl]);
    };

    return (
        <SimWrapper
            layoutMode="split"
            title="Optik Laboratuvarı"
            description="Işığın yansıması, kırılması ve tam iç yansıma deneyleri."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={
                <div className="space-y-4">
                    <p className="text-xs text-zinc-400 font-bold uppercase mb-2">Araç Kutusu</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => addElement("block")} className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 p-3 rounded-xl transition-all">
                            <div className="w-8 h-6 bg-blue-400/50 rounded-sm" />
                            <span className="text-xs font-bold">Cam Blok</span>
                        </button>
                        <button onClick={() => addElement("mirror")} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-600 p-3 rounded-xl transition-all">
                            <div className="w-8 h-1 bg-zinc-400 rounded-full" />
                            <span className="text-xs font-bold">Ayna</span>
                        </button>
                    </div>

                    {selectedId && (
                        <div className="bg-zinc-900 border border-white/10 p-4 rounded-xl space-y-3 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-white">Seçili Obje</span>
                                <button onClick={() => {
                                    setElements(prev => prev.filter(e => e.id !== selectedId));
                                    setSelectedId(null);
                                }} className="text-red-500 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => setElements(prev => prev.map(e => e.id === selectedId ? { ...e, rotation: e.rotation - 0.1 } : e))} className="flex-1 bg-black p-2 rounded text-zinc-400 hover:text-white">
                                    <RotateCw className="w-4 h-4 mx-auto -scale-x-100" />
                                </button>
                                <button onClick={() => setElements(prev => prev.map(e => e.id === selectedId ? { ...e, rotation: e.rotation + 0.1 } : e))} className="flex-1 bg-black p-2 rounded text-zinc-400 hover:text-white">
                                    <RotateCw className="w-4 h-4 mx-auto" />
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
            >
                <canvas ref={canvasRef} className="block w-full h-full" />
                <div className="absolute top-4 right-4 text-xs text-zinc-500 font-mono pointer-events-none">
                    Lazere tıklayıp çekerek nişan al
                </div>
            </div>
        </SimWrapper>
    );
}
