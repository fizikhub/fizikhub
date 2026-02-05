"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Target, Info } from "lucide-react";

interface SpringMassSimProps {
    className?: string;
}

export function SpringMassSim({ className = "" }: SpringMassSimProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [springK, setSpringK] = useState(50);
    const [mass, setMass] = useState(2);
    const [isRunning, setIsRunning] = useState(true);
    const [challenge, setChallenge] = useState(0);

    // Physics state
    const posRef = useRef(60);
    const velRef = useRef(0);

    // Formulas
    const omega = Math.sqrt(springK / mass);
    const period = (2 * Math.PI) / omega;
    const frequency = 1 / period;

    const challenges = [
        { question: "Yay sabitini artırınca frekans ne olur?", hint: "k değerini 50'den 100'e çıkar" },
        { question: "Kütleyi artırınca periyot ne olur?", hint: "m değerini 2'den 4'e çıkar" },
        { question: "1 Hz frekans elde et!", hint: "ω = √(k/m), f = ω/2π" },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const damping = 0.998;
        const restY = 80;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;

            // Clear with site background color
            ctx.fillStyle = "#121214"; // bg-background approx
            ctx.fillRect(0, 0, width, height);

            // Grid lines (very subtle)
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }
            for (let j = 0; j < height; j += 40) {
                ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(width, j); ctx.stroke();
            }

            // Physics (Hooke's Law)
            if (isRunning) {
                const force = -(springK / 100) * posRef.current;
                const acc = force / mass;
                velRef.current += acc;
                velRef.current *= damping;
                posRef.current += velRef.current;
            }

            const massY = restY + 80 + posRef.current;

            // Draw ceiling
            ctx.fillStyle = "#27272a";
            ctx.fillRect(centerX - 60, 20, 120, 12);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.strokeRect(centerX - 60, 20, 120, 12);

            // Draw spring (zigzag)
            ctx.strokeStyle = posRef.current > 0 ? "#518DFF" : "#FF5757"; // Vibrant Blue / Vibrant Red
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(centerX, 32);

            const coils = 12;
            const springLength = 80 + posRef.current;
            const coilH = springLength / coils;

            for (let i = 0; i < coils; i++) {
                const y = 32 + (i + 0.5) * coilH;
                const dir = i % 2 === 0 ? 1 : -1;
                ctx.lineTo(centerX + dir * 18, y);
            }
            ctx.lineTo(centerX, massY - 25);
            ctx.stroke();

            // Draw mass
            ctx.fillStyle = "#518DFF"; // Vibrant Blue
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 3;
            // Mass Shadow
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.fillRect(centerX - 35, massY - 25, 70, 50);
            ctx.shadowBlur = 0;
            ctx.strokeRect(centerX - 35, massY - 25, 70, 50);

            // Mass label
            ctx.fillStyle = "#000";
            ctx.font = "black 12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`${mass} kg`, centerX, massY + 5);

            // Equilibrium line
            ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.moveTo(centerX - 100, restY + 80);
            ctx.lineTo(centerX + 100, restY + 80);
            ctx.stroke();
            ctx.setLineDash([]);

            // Labels
            ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
            ctx.font = "bold 10px tracking-widest";
            ctx.textAlign = "right";
            ctx.fillText("DENGE KONUMU", centerX - 110, restY + 84);

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [springK, mass, isRunning]);

    const reset = () => {
        posRef.current = 60;
        velRef.current = 0;
    };

    return (
        <div className={cn("bg-background min-h-full flex flex-col font-[family-name:var(--font-outfit)]", className)}>
            {/* Top Mission Control */}
            <div className="bg-[#518DFF]/10 border-b border-white/5 p-4 sm:p-6">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#518DFF] flex items-center justify-center text-black border border-black shadow-[2px_2px_0px_#000]">
                                <Target className="w-4 h-4" />
                            </div>
                            <span className="text-[#518DFF] font-black text-xs uppercase tracking-[0.2em]">MISSION CONTROL</span>
                        </div>
                        <h2 className="text-white text-base sm:text-lg font-black tracking-tight uppercase italic">{challenges[challenge].question}</h2>
                        <div className="flex items-center gap-1.5 mt-2">
                            <Info className="w-3 h-3 text-zinc-500" />
                            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{challenges[challenge].hint}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
                {/* Simulation Canvas Area */}
                <div className="lg:col-span-8 relative bg-[#121214] border-b lg:border-b-0 lg:border-r border-white/5 order-1">
                    <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain cursor-pointer" onClick={reset} />

                    {/* Live Data Overlays */}
                    <div className="absolute top-6 left-6 flex flex-col gap-3">
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
                            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest block mb-1">Anlık Uzanım (x)</span>
                            <span className="text-[#FFA0A0] font-mono text-xl font-black">{(posRef.current / 100).toFixed(2)} m</span>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end gap-4 pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl pointer-events-auto">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                <div>
                                    <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest block">Periyot (T)</span>
                                    <span className="text-white font-mono text-base font-bold">{period.toFixed(2)} s</span>
                                </div>
                                <div>
                                    <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest block">Frekans (f)</span>
                                    <span className="text-[#B2F2BB] font-mono text-base font-bold">{frequency.toFixed(2)} Hz</span>
                                </div>
                                <div className="col-span-2 pt-2 border-t border-white/5 mt-1">
                                    <span className="text-zinc-400 text-[10px] sm:text-xs font-bold uppercase italic font-mono">ω = √(k/m) = {omega.toFixed(2)} rad/s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Sidebar */}
                <div className="lg:col-span-4 p-6 sm:p-8 space-y-8 bg-background order-2">
                    {/* Parameters */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                <span className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Yay Sabiti (k)</span>
                                <span className="text-[#A0C4FF] font-mono text-sm font-black">{springK} N/m</span>
                            </div>
                            <input
                                type="range" min="20" max="150" value={springK}
                                onChange={(e) => setSpringK(Number(e.target.value))}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#A0C4FF]"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                <span className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Kütle (m)</span>
                                <span className="text-[#FFA0A0] font-mono text-sm font-black">{mass} kg</span>
                            </div>
                            <input
                                type="range" min="0.5" max="10" step="0.5" value={mass}
                                onChange={(e) => setMass(Number(e.target.value))}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FFA0A0]"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            className={cn(
                                "flex-1 h-16 rounded-2xl border-2 border-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[4px_4px_0px_#000]",
                                isRunning ? "bg-[#FFA0A0] text-black" : "bg-[#B2F2BB] text-black"
                            )}
                        >
                            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            <span className="font-black text-sm uppercase italic">{isRunning ? "DURAKLAT" : "DEVAM ET"}</span>
                        </button>
                        <button
                            onClick={reset}
                            className="w-16 h-16 rounded-2xl border-2 border-black bg-zinc-100 text-black flex items-center justify-center hover:bg-white transition-all shadow-[4px_4px_0px_#000] active:scale-95"
                        >
                            <RotateCcw className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Challenge Selector */}
                    <div className="grid grid-cols-3 gap-2">
                        {challenges.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setChallenge(i)}
                                className={cn(
                                    "py-2.5 rounded-xl border border-black text-[10px] font-black uppercase tracking-widest transition-all shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none",
                                    challenge === i ? "bg-[#A0C4FF] text-black" : "bg-zinc-900 text-zinc-500 border-zinc-800 shadow-none hover:bg-zinc-800"
                                )}
                            >
                                GÖREV {i + 1}
                            </button>
                        ))}
                    </div>

                    {/* Discovery Note */}
                    <div className="bg-[#B2F2BB]/5 border border-[#B2F2BB]/20 rounded-2xl p-4 sm:p-5">
                        <p className="text-[#B2F2BB] text-[11px] sm:text-xs leading-relaxed font-bold italic uppercase tracking-wider">
                            ✨ Keşif: Yay sabiti (k) artınca salınım hızlanır. Kütle (m) artınca ise hantallaşır ve frekans düşer.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
