"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Move, RotateCcw, Play, Pause } from "lucide-react";
import { SimWrapper, SimTask } from "./sim-wrapper";

interface ProjectileSimProps {
    className?: string;
}

// Physics State (Mutable Ref)
type GameState = {
    // Projectile
    x: number; y: number; vx: number; vy: number;
    active: boolean;
    path: { x: number; y: number }[];
    // Cannon
    angle: number;
    power: number;
    // Environment
    g: number;
    scale: number; // pixels per simulation meter
    // Target
    target: { x: number; y: number; w: number; h: number; hit: boolean };
};

export function ProjectileSim({ className }: ProjectileSimProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // UI Sync State
    const [isRunning, setIsRunning] = useState(false);
    const [uiAngle, setUiAngle] = useState(45);
    const [uiPower, setUiPower] = useState(50);
    const [simData, setSimData] = useState({ range: 0, height: 0, time: 0 });

    // Tasks
    const [tasks, setTasks] = useState<SimTask[]>([
        { id: "p1", description: "Hedefi vur!", hint: "Açıyı ve gücü ayarla.", isCompleted: false },
        { id: "p2", description: "Maksimum menzile ulaş (45°).", hint: "Açıyı 45 derece yap ve tam güçle ateşle.", isCompleted: false },
        { id: "p3", description: "Yüksek bir atış yap (>150m).", hint: "Açıyı dikleştir (75°+).", isCompleted: false },
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // Physics Engine
    const state = useRef<GameState>({
        x: 0, y: 0, vx: 0, vy: 0,
        active: false,
        path: [],
        angle: 45,
        power: 50,
        g: 9.81,
        scale: 4, // 1m = 4px
        target: { x: 600, y: 0, w: 50, h: 10, hit: false }
    });

    // Reset Logic
    const resetSim = useCallback(() => {
        const s = state.current;
        s.active = false;
        s.x = 50; s.y = containerRef.current ? containerRef.current.clientHeight - 50 : 500;
        s.vx = 0; s.vy = 0;
        s.path = [];
        s.target.hit = false;
        // Randomize target for fun if task 0
        if (currentTaskIndex === 0 && containerRef.current) {
            s.target.x = 300 + Math.random() * (containerRef.current.clientWidth - 400);
        }
        setIsRunning(false);
        setSimData({ range: 0, height: 0, time: 0 });
    }, [currentTaskIndex]);

    const fire = () => {
        const s = state.current;
        if (s.active) return; // Already flying

        const rad = s.angle * Math.PI / 180;
        const v = s.power * 2; // Arbitrary power multiplier

        s.active = true;
        s.path = [];
        s.target.hit = false;

        // Reset Pos
        if (containerRef.current) {
            s.y = containerRef.current.clientHeight - 50;
        }
        s.x = 50;

        s.vx = v * Math.cos(rad);
        s.vy = -v * Math.sin(rad); // Up is negative Y in canvas
        setIsRunning(true);
    };

    // Task Completion
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
    }, []);


    // Game Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let lastTime = performance.now();

        // Initial Layout
        if (containerRef.current) {
            canvas.width = containerRef.current.clientWidth;
            canvas.height = containerRef.current.clientHeight;
            resetSim();
        }

        const loop = (time: number) => {
            const output = canvasRef.current; // access fresh ref
            if (!output || !containerRef.current) return;

            // Auto Resize
            if (output.width !== containerRef.current.clientWidth || output.height !== containerRef.current.clientHeight) {
                output.width = containerRef.current.clientWidth;
                output.height = containerRef.current.clientHeight;
                // Keep ground relative
                if (!state.current.active) state.current.y = output.height - 50;
            }

            const dt = Math.min((time - lastTime) / 1000, 0.1); // Cap dt
            lastTime = time;
            const s = state.current;

            // Update Physics
            if (s.active) {
                s.vy += s.g * s.scale * dt * 2; // *2 for visual speedup
                s.x += s.vx * s.scale * dt * 2;
                s.y += s.vy * s.scale * dt * 2;

                s.path.push({ x: s.x, y: s.y });

                // Ground Collision
                const groundY = output.height - 50;
                if (s.y >= groundY) {
                    s.y = groundY;
                    s.active = false;
                    setIsRunning(false);

                    // Results
                    const range = (s.x - 50) / s.scale;
                    const maxH = Math.abs(Math.min(...s.path.map(p => p.y)) - groundY) / s.scale;
                    setSimData({
                        range,
                        height: maxH,
                        time: s.path.length * 0.016 // rough approx
                    });

                    // Check Tasks
                    if (currentTaskIndex === 0 && s.target.hit) completeTask(0);
                    if (currentTaskIndex === 1 && Math.abs(s.angle - 45) < 2 && s.power > 90) completeTask(1);
                    if (currentTaskIndex === 2 && maxH > 150) completeTask(2);
                }

                // Target Collision
                const groundLevel = output.height - 50;
                // Target is on ground
                if (s.x > s.target.x && s.x < s.target.x + s.target.w && s.y >= groundLevel - s.target.h) {
                    s.target.hit = true;
                }
            }

            // Draw
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, output.width, output.height);

            // Grid
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            for (let i = 0; i < output.width; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, output.height); ctx.stroke(); }

            // Ground
            ctx.fillStyle = "#222";
            ctx.fillRect(0, output.height - 50, output.width, 50);
            ctx.fillStyle = "#4ADE80"; // Grass line
            ctx.fillRect(0, output.height - 50, output.width, 2);

            // Target
            if (currentTaskIndex === 0) {
                const ty = output.height - 50;
                ctx.fillStyle = s.target.hit ? "#EF4444" : "#FBBF24";
                ctx.fillRect(s.target.x, ty - 10, s.target.w, 10);
            }

            // Path
            if (s.path.length > 1) {
                ctx.beginPath();
                ctx.moveTo(s.path[0].x, s.path[0].y);
                for (let p of s.path) ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
                ctx.setLineDash([5, 5]);
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Cannon
            const cx = 50;
            const cy = output.height - 50;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(-s.angle * Math.PI / 180);
            ctx.fillStyle = "#666";
            ctx.fillRect(0, -10, 60, 20); // Barrel
            ctx.restore();

            ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2); ctx.fillStyle = "#333"; ctx.fill(); // Wheel

            // Projectile
            ctx.beginPath();
            ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#FFF";
            ctx.fill();

            animationId = requestAnimationFrame(loop);
        };
        animationId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationId);
    }, [currentTaskIndex, completeTask, resetSim]);

    return (
        <SimWrapper
            title="Eğik Atış Laboratuvarı"
            description="Yerçekimi altında cisimlerin hareketini incele."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={
                <div className="space-y-6">
                    <div className="flex gap-2">
                        <button
                            onClick={fire}
                            disabled={isRunning}
                            className={cn(
                                "flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all",
                                isRunning ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-white text-black hover:bg-zinc-200"
                            )}
                        >
                            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            {isRunning ? "Simülasyon Aktif" : "ATEŞLE"}
                        </button>
                    </div>

                    <div className="space-y-4 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold text-zinc-400">AÇI</span>
                                <span className="text-sm font-mono font-bold text-white">{uiAngle}°</span>
                            </div>
                            <input
                                type="range" min="0" max="90" value={uiAngle}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value);
                                    setUiAngle(v);
                                    state.current.angle = v;
                                }}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold text-zinc-400">GÜÇ</span>
                                <span className="text-sm font-mono font-bold text-white">{uiPower}m/s</span>
                            </div>
                            <input
                                type="range" min="10" max="100" value={uiPower}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value);
                                    setUiPower(v);
                                    state.current.power = v;
                                }}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#4ADE80]"
                            />
                        </div>
                    </div>

                    {/* Results */}
                    {simData.range > 0 && (
                        <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-zinc-900 p-3 rounded-xl border border-white/10">
                                <div className="text-[10px] text-zinc-500 uppercase font-black">Menzil</div>
                                <div className="text-lg font-mono font-bold text-white">{simData.range.toFixed(1)}m</div>
                            </div>
                            <div className="bg-zinc-900 p-3 rounded-xl border border-white/10">
                                <div className="text-[10px] text-zinc-500 uppercase font-black">Yükseklik</div>
                                <div className="text-lg font-mono font-bold text-white">{simData.height.toFixed(1)}m</div>
                            </div>
                        </div>
                    )}
                </div>
            }
        >
            <div
                ref={containerRef}
                className="w-full h-full relative"
            >
                <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
        </SimWrapper>
    );
}
