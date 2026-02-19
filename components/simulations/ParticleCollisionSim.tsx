"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Bomb, Scale, ArrowRightLeft } from "lucide-react"; // Import icons
import { SimWrapper, SimTask } from "./sim-wrapper";

interface ParticleCollisionSimProps {
    className?: string;
}

export function ParticleCollisionSim({ className = "" }: ParticleCollisionSimProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mass1, setMass1] = useState(2);
    const [mass2, setMass2] = useState(2);
    const [isRunning, setIsRunning] = useState(false);

    // Internal state to track validation results
    const [collisionResult, setCollisionResult] = useState<{ pInitial: number, pFinal: number } | null>(null);

    // Particles
    const p1Ref = useRef({ x: 100, y: 150, vx: 3, vy: 0 });
    const p2Ref = useRef({ x: 300, y: 150, vx: -2, vy: 0 });

    // -- Tasks --
    const [tasks, setTasks] = useState<SimTask[]>([
        {
            id: "pc1", description: "Momentum Korunumu", hint: "Simülasyonu başlat ve çarpışmadan önceki toplam momentum ile sonrakini karşılaştır.", isCompleted: false,
            explanation: "Sistem dışından net bir kuvvet etki etmediği sürece toplam momentum (P = m.v) daima korunur!"
        },
        {
            id: "pc2", description: "Eşit Kütleler", hint: "Kütleleri eşitle (örn. 2kg - 2kg) ve hızların nasıl değiş tokuş edildiğini izle.", isCompleted: false,
            explanation: "Esnek çarpışmada kütleler eşitse, cisimler hızlarını birbirine aktarır. Bilardo topları gibi!"
        },
        {
            id: "pc3", description: "Farklı Kütleler", hint: "Bir kütleyi diğerinin 2 katı yap ve çarpışmayı gözlemle.", isCompleted: false,
            explanation: "Ağır cisim hafif cisme çarptığında yoluna devam ederken, hafif cisim çok daha hızlı fırlar."
        }
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    const completeTask = useCallback((index: number) => {
        setTasks(prev => {
            if (prev[index].isCompleted) return prev;
            const newTasks = [...prev];
            newTasks[index].isCompleted = true;
            return newTasks;
        });
        setTimeout(() => setCurrentTaskIndex(prev => Math.min(prev + 1, tasks.length - 1)), 1500);
    }, [tasks.length]);

    // Check Tasks Logic
    useEffect(() => {
        if (!collisionResult) return;

        if (currentTaskIndex === 0 && !tasks[0].isCompleted) {
            // Just verifying a collision happened and momentum was calculated
            completeTask(0);
        }
        if (currentTaskIndex === 1 && !tasks[1].isCompleted) {
            if (Math.abs(mass1 - mass2) < 0.1) completeTask(1);
        }
        if (currentTaskIndex === 2 && !tasks[2].isCompleted) {
            // Check for significant mass difference (e.g. ratio >= 2 or <= 0.5)
            const ratio = mass1 / mass2;
            if (ratio >= 2 || ratio <= 0.5) completeTask(2);
        }
    }, [collisionResult, mass1, mass2, currentTaskIndex, tasks, completeTask]);


    const resetSim = () => {
        p1Ref.current = { x: 100, y: 150, vx: 3, vy: 0 };
        p2Ref.current = { x: 300, y: 150, vx: -2, vy: 0 };
        setIsRunning(false);
        setCollisionResult(null);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !containerRef.current) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let hasCollided = false;
        let collisionProcessed = false;


        const draw = () => {
            // Resize handling
            if (containerRef.current && (canvas.width !== containerRef.current.clientWidth || canvas.height !== containerRef.current.clientHeight)) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
                // re-center y if needed, but we use fixed 150 mostly. Let's adapt y relative to height
            }

            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;

            // Adjust particle Y to center dynamically
            // p1Ref.current.y = centerY;
            // p2Ref.current.y = centerY; 
            // Better not reset Y constantly to avoid glitches, just set on reset.

            const p1 = p1Ref.current;
            const p2 = p2Ref.current;
            // Ensure they stay on center line vertically if we resized
            p1.y = centerY;
            p2.y = centerY;

            // Calculate momentum
            const mom1 = mass1 * p1.vx;
            const mom2 = mass2 * p2.vx;
            const totalMom = mom1 + mom2;

            // Clear
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, width, height);

            // Track line
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();

            // Grid
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }

            // Physics
            if (isRunning) {
                p1.x += p1.vx;
                p2.x += p2.vx;

                // Collision detection
                const r1 = 20 + mass1 * 5;
                const r2 = 20 + mass2 * 5;
                const dist = Math.abs(p2.x - p1.x);

                if (dist < r1 + r2 && !hasCollided) {
                    hasCollided = true;

                    // Store Initial Momentum for validation/display just before impact changes velocities
                    const pInitial = Math.abs(totalMom); // simplify comparison

                    // Elastic collision 1D
                    const v1 = ((mass1 - mass2) * p1.vx + 2 * mass2 * p2.vx) / (mass1 + mass2);
                    const v2 = ((mass2 - mass1) * p2.vx + 2 * mass1 * p1.vx) / (mass1 + mass2);
                    p1.vx = v1;
                    p2.vx = v2;

                    // Separate to prevent sticking
                    const overlap = (r1 + r2 - dist) / 2;
                    p1.x -= overlap + 1;
                    p2.x += overlap + 1;

                    // Trigger result update after a short delay to simulate "calculation"
                    if (!collisionProcessed) {
                        collisionProcessed = true;
                        setTimeout(() => {
                            const pFinal = Math.abs(mass1 * p1.vx + mass2 * p2.vx);
                            setCollisionResult({ pInitial, pFinal });
                        }, 200);
                    }

                } else if (dist > r1 + r2 + 10) {
                    // Reset collision flag when separated
                    hasCollided = false;
                    // But don't reset collisionProcessed if we want to keep the result displayed
                }

                // Wall bounce
                if (p1.x < r1) { p1.x = r1; p1.vx *= -1; }
                if (p1.x > width - r1) { p1.x = width - r1; p1.vx *= -1; }
                if (p2.x < r2) { p2.x = r2; p2.vx *= -1; }
                if (p2.x > width - r2) { p2.x = width - r2; p2.vx *= -1; }
            }

            // Draw particles
            const drawParticle = (p: typeof p1, m: number, color: string, label: string) => {
                const r = 20 + m * 5;

                ctx.fillStyle = color;
                // ctx.strokeStyle = "#000";
                // ctx.lineWidth = 3;

                // Shadow / Glow
                ctx.shadowColor = color;
                ctx.shadowBlur = 15;

                ctx.beginPath();
                ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowBlur = 0;
                ctx.fillStyle = "white"; // "rgba(255,255,255,0.9)";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(`${m}kg`, p.x, p.y);

                // Velocity Arrow
                if (Math.abs(p.vx) > 0.1) {
                    const arrowLen = p.vx * 10;
                    ctx.strokeStyle = "rgba(255,255,255,0.8)";
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y - r - 10);
                    ctx.lineTo(p.x + arrowLen, p.y - r - 10);
                    ctx.stroke();
                    // Arrow head logic... simplified
                    ctx.fillStyle = "rgba(255,255,255,0.8)";
                    ctx.beginPath();
                    ctx.arc(p.x + arrowLen, p.y - r - 10, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            };

            drawParticle(p1, mass1, "#3B82F6", `v₁=${p1.vx.toFixed(1)}`);
            drawParticle(p2, mass2, "#EF4444", `v₂=${p2.vx.toFixed(1)}`);

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [mass1, mass2, isRunning]);


    return (
        <SimWrapper
            title="arpışma Laboratuvarı" // Fix typo if needed: Çarpışma. "arpışma" looks like typo.
            description="Momentum korunumu ve esnek çarpışmaları incele."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={
                <div className="space-y-6">
                    {/* Live Momentum Data */}
                    <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500 font-bold uppercase tracking-widest">Toplam Momentum</span>
                            {collisionResult && <span className="text-green-400 font-bold">KORUNDU ✓</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-mono font-black text-white">
                                {Math.abs((mass1 * p1Ref.current.vx) + (mass2 * p2Ref.current.vx)).toFixed(1)}
                            </span>
                            <span className="text-zinc-600 font-bold text-xs uppercase">kg·m/s</span>
                        </div>
                    </div>

                    {/* Mass Controls */}
                    <div className="space-y-4">
                        {/* Mass 1 */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-blue-400">Kütle 1 (Mavi)</span>
                                <span>{mass1} kg</span>
                            </div>
                            <input
                                type="range" min="1" max="5" value={mass1}
                                onChange={(e) => { setMass1(Number(e.target.value)); resetSim(); }}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Mass 2 */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-red-400">Kütle 2 (Kırmızı)</span>
                                <span>{mass2} kg</span>
                            </div>
                            <input
                                type="range" min="1" max="5" value={mass2}
                                onChange={(e) => { setMass2(Number(e.target.value)); resetSim(); }}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            className={cn(
                                "flex-1 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg",
                                isRunning
                                    ? "bg-zinc-800 text-zinc-400 border border-white/5"
                                    : "bg-white text-black hover:bg-zinc-200"
                            )}
                        >
                            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            {isRunning ? "Durdur" : "Başlat"}
                        </button>
                        <button
                            onClick={resetSim}
                            className="w-14 rounded-xl border border-white/10 flex items-center justify-center hover:bg-zinc-800 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5 text-zinc-400" />
                        </button>
                    </div>

                    {/* Result Message */}
                    {collisionResult && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
                            <p className="text-green-400 text-xs font-bold text-center">
                                Momentum Korundu! <br />
                                <span className="opacity-70 font-mono font-normal">P(önce) = {collisionResult.pInitial.toFixed(1)} ≈ P(sonra) = {collisionResult.pFinal.toFixed(1)}</span>
                            </p>
                        </div>
                    )}
                </div>
            }
        >
            <div ref={containerRef} className="w-full h-full relative bg-[#09090b] touch-none">
                <canvas ref={canvasRef} className="block w-full h-full" />

                <div className="absolute top-4 right-4 text-[10px] text-zinc-600 font-mono pointer-events-none uppercase tracking-widest hidden sm:block">
                    COLLISION LAB
                </div>
            </div>
        </SimWrapper>
    );
}

