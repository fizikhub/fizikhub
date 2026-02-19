"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Move, RotateCcw, Play, Pause, TrendingUp, Info } from "lucide-react";
import { SimWrapper, SimTask } from "./sim-wrapper";

interface PendulumSimProps {
    className?: string;
}

export function PendulumSim({ className }: PendulumSimProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // -- UI State --
    const [tasks, setTasks] = useState<SimTask[]>([
        {
            id: "p1",
            description: "Sarkaç Uzunluğunu Değiştir",
            hint: "İp uzunluğunu (L) en sona getir ve periyodun (T) nasıl değiştiğini izle.",
            isCompleted: false,
            explanation: "Formül: T = 2π√(L/g). İp uzunluğu (L) arttıkça periyot (T) artar. Sarkaç daha yavaş salınır."
        },
        {
            id: "p2",
            description: "Genlik ve Enerji",
            hint: "Sarkacı çok yüksek bir açıdan (60° üzeri) serbest bırak.",
            isCompleted: false,
            explanation: "Enerji Korunumu: En tepede Potansiyel Enerji (PE) maksimumdur. En altta ise Kinetik Enerji (KE) ve Hız maksimumdur."
        },
        {
            id: "p3",
            description: "Kütlenin Etkisi",
            hint: "Sarkaç kütlesini değiştir ve periyodu gözlemle.",
            isCompleted: false,
            explanation: "Şaşırtıcı ama gerçek: Sarkaç periyodu kütleye (m) bağlı DEĞİLDİR! Sadece ip uzunluğu ve yerçekimi önemlidir."
        },
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // Controls
    const [length, setLength] = useState(150); // pixels
    const [mass, setMass] = useState(1.0); // kg (visual/logic only)
    const [isRunning, setIsRunning] = useState(true);
    const [showForces, setShowForces] = useState(false);

    // -- Physics State (Refs for performance) --
    // We use a simple harmonic motion approximation or RK4 if needed. 
    // For educational "Simple Pendulum", standard Equation of Motion: theta'' = -(g/L) * sin(theta) is best.
    const state = useRef({
        angle: Math.PI / 4, // radians
        angularVel: 0,
        angularAcc: 0,
        time: 0,
        dragging: false
    });

    const physicsParams = useRef({
        g: 0.4, // Visual gravity constant
        damping: 0.995 // Air resistance
    });

    // -- Reset --
    const resetSim = useCallback(() => {
        state.current = {
            angle: Math.PI / 4,
            angularVel: 0,
            angularAcc: 0,
            time: 0,
            dragging: false
        };
        setLength(150);
        setMass(1.0);
        setIsRunning(true);
        // Don't reset tasks to keep progress
    }, []);

    // -- Task Completion Logic --
    const completeTask = useCallback((index: number) => {
        setTasks(prev => {
            if (prev[index].isCompleted) return prev;
            const newTasks = [...prev];
            newTasks[index].isCompleted = true;
            return newTasks;
        });
        // Auto advance after a delay
        setTimeout(() => {
            setCurrentTaskIndex(prev => Math.min(prev + 1, tasks.length - 1));
        }, 1000);
    }, [tasks.length]);

    // -- Loop --
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !containerRef.current) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const s = state.current;
        const p = physicsParams.current;

        const loop = () => {
            // Resize
            if (containerRef.current && (canvas.width !== containerRef.current.clientWidth || canvas.height !== containerRef.current.clientHeight)) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }

            const width = canvas.width;
            const height = canvas.height;
            const originX = width / 2;
            const originY = 50;

            // Physics Update
            if (isRunning && !s.dragging) {
                // theta'' = -(g/L) * sin(theta)
                // L needs to be scaled properly. Let's treat 'length' as pixels directly for visual simplicity, 
                // but physically L implies period. 
                // acceleration = - (g / length) * sin(theta)
                // We boost g for visual speed.
                const force = -1 * p.g * Math.sin(s.angle);
                s.angularAcc = force / (length / 100);
                s.angularVel += s.angularAcc;
                s.angularVel *= p.damping; // Friction
                s.angle += s.angularVel;
                s.time += 1;
            } else if (s.dragging) {
                s.angularVel = 0;
                s.angularAcc = 0;
            }

            // --- Checks for Tasks ---
            if (currentTaskIndex === 0 && !tasks[0].isCompleted) {
                if (length > 250) completeTask(0);
            }
            if (currentTaskIndex === 1 && !tasks[1].isCompleted) {
                if (Math.abs(s.angle) > (60 * Math.PI / 180) && !s.dragging) completeTask(1);
            }
            if (currentTaskIndex === 2 && !tasks[2].isCompleted) {
                if (mass !== 1.0) completeTask(2); // Any change triggers it essentially
            }

            // --- Drawing ---
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, width, height);

            // Grid
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
            for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

            // Pivot
            ctx.fillStyle = "#52525b";
            ctx.beginPath(); ctx.arc(originX, originY, 4, 0, Math.PI * 2); ctx.fill();

            // Bob Position
            const bobX = originX + length * Math.sin(s.angle);
            const bobY = originY + length * Math.cos(s.angle);

            // String
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(bobX, bobY);
            ctx.stroke();

            // Mass (Bob) - Visual size depends on mass prop
            const radius = 20 + (mass * 5);
            ctx.fillStyle = "#FFD700"; // Gold
            ctx.shadowColor = "#FFD700";
            ctx.shadowBlur = s.dragging ? 20 : 0;
            ctx.beginPath();
            ctx.arc(bobX, bobY, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Force Vectors
            if (showForces) {
                // Gravity (mg)
                ctx.strokeStyle = "#ef4444";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(bobX, bobY);
                ctx.lineTo(bobX, bobY + 50 * mass); // Scale with mass
                ctx.stroke();

                // Velocity (Green)
                ctx.strokeStyle = "#4ade80";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(bobX, bobY);
                // v = L * omega
                const vMag = s.angularVel * length * 5;
                ctx.lineTo(bobX + vMag * Math.cos(s.angle), bobY - vMag * Math.sin(s.angle));
                ctx.stroke();
            }

            // Info Overlay (Period)
            // T = 2*PI * sqrt(L / g)
            // Visual G is tricky, let's calc real period based on our constants
            // const T = 2 * Math.PI * Math.sqrt((length/100) / p.g);
            // This is just for display

            animationId = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(animationId);

    }, [length, mass, isRunning, showForces, currentTaskIndex, tasks]);

    // -- Interaction --
    const handlePointerDown = (e: React.PointerEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Simple hit test anywhere near center for mobile ease
        state.current.dragging = true;
        handlePointerMove(e); // Snap immediately
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!state.current.dragging) return;
        const rect = containerRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const originX = rect.width / 2;
        const originY = 50;

        const dx = x - originX;
        const dy = y - originY;
        state.current.angle = Math.atan2(dx, dy);
        state.current.angularVel = 0;
    };

    const handlePointerUp = () => {
        state.current.dragging = false;
    };

    // Calculate display period
    const period = (2 * Math.PI * Math.sqrt((length / 100) / 9.8)).toFixed(2);

    return (
        <SimWrapper
            layoutMode="split"
            title="Basit Sarkaç"
            description="Harmonik hareket, periyot ve enerji korunumu deneyi."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={
                <div className="space-y-6">
                    {/* Period Display */}
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">Hesaplanan Periyot</span>
                            <span className="text-2xl font-mono font-black text-[#FFD700]">{period}s</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">Açı (θ)</span>
                            <span className="text-white font-mono font-bold">{(state.current.angle * 180 / Math.PI).toFixed(0)}°</span>
                        </div>
                    </div>

                    {/* Length Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-zinc-400">İp Uzunluğu (L)</span>
                            <span className="text-xs font-mono text-white bg-white/10 px-2 py-0.5 rounded">{length}cm</span>
                        </div>
                        <input
                            type="range" min="50" max="300" value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                        />
                    </div>

                    {/* Mass Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-zinc-400">Kütle (m)</span>
                            <span className="text-xs font-mono text-white bg-white/10 px-2 py-0.5 rounded">{mass}kg</span>
                        </div>
                        <input
                            type="range" min="0.5" max="3.0" step="0.1" value={mass}
                            onChange={(e) => setMass(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Play/Pause */}
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={cn(
                            "w-full h-14 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95",
                            isRunning ? "bg-[#FFD700] text-black shadow-[0_4px_20px_rgba(255,215,0,0.2)]" : "bg-zinc-800 text-white border border-white/10"
                        )}
                    >
                        {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        {isRunning ? "Duraklat" : "Başlat"}
                    </button>

                    {/* Forces Toggle */}
                    <button
                        onClick={() => setShowForces(!showForces)}
                        className={cn(
                            "w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2",
                            showForces ? "bg-white text-black border-white" : "text-zinc-500 border-white/10 hover:bg-zinc-900"
                        )}
                    >
                        <TrendingUp className="w-4 h-4" />
                        Vektörleri Göster
                    </button>

                    {/* Info Box */}
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                        <Info className="w-5 h-5 text-blue-400 shrink-0" />
                        <p className="text-[11px] text-blue-200 leading-relaxed font-medium">
                            Basit harmonik harekette periyot (T), cismin kütlesinden bağımsızdır. Sadece ip uzunluğuna ve yerçekimi ivmesine bağlıdır.
                        </p>
                    </div>
                </div>
            }
        >
            <div
                ref={containerRef}
                className="w-full h-full relative cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <canvas ref={canvasRef} className="w-full h-full block" />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/20 text-[10px] uppercase font-bold tracking-widest pointer-events-none">
                    Sürtünmesiz Ortam
                </div>
            </div>
        </SimWrapper>
    );
}
