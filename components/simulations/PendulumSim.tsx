"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Activity, RotateCcw, Play, Pause, Info, BarChart3, Scissors } from "lucide-react";

interface PendulumSimProps {
    className?: string;
}

export function PendulumSim({ className = "" }: PendulumSimProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // UI State
    const [length, setLength] = useState(150);
    const [isRunning, setIsRunning] = useState(true);
    const [challenge, setChallenge] = useState(0);
    const [showVectors, setShowVectors] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

    // Physics state
    const angleRef = useRef(Math.PI / 4);
    const velocityRef = useRef(0);
    const accelerationRef = useRef(0);

    // Physics constants
    const g_real = 9.81;
    const gravity = 0.5; // Visual gravity scale for canvas
    const damping = 0.998; // High quality low friction
    const bobRadius = 24;

    const challenges = [
        { question: "Sarkacın uzunluğunu artırınca periyot ne olur?", hint: "Uzunluğu max seviyeye çıkar ve hızı gözlemle." },
        { question: "Enerji korunumunu gözlemle!", hint: "Hızın en yüksek olduğu an potansiyel enerji en düşüktür." },
        { question: "Tam 2 saniyelik periyot yakalamaya çalış!", hint: "Uzunluğu ~200-240 civarına çekmeyi dene." },
    ];

    // Responsive Canvas
    useEffect(() => {
        const resize = () => {
            if (containerRef.current && canvasRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                canvasRef.current.width = rect.width;
                canvasRef.current.height = 350;
            }
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const originX = canvas.width / 2;
        const originY = 20;

        const dx = x - originX;
        const dy = y - originY;

        angleRef.current = Math.atan2(dx, dy);
        velocityRef.current = 0;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            const originX = width / 2;
            const originY = 20;

            // BACKGROUND
            ctx.fillStyle = "#121214";
            ctx.fillRect(0, 0, width, height);

            // GRID
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }

            // PHYSICS
            if (isRunning && !isDragging) {
                accelerationRef.current = (-gravity / length) * Math.sin(angleRef.current);
                velocityRef.current += accelerationRef.current;
                velocityRef.current *= damping;
                angleRef.current += velocityRef.current;
            }

            const bobX = originX + length * Math.sin(angleRef.current);
            const bobY = originY + length * Math.cos(angleRef.current);

            // DRAW STRING
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(bobX, bobY);
            ctx.stroke();

            // DRAW PIVOT
            ctx.fillStyle = "#27272a";
            ctx.beginPath();
            ctx.arc(originX, originY, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.lineWidth = 2;
            ctx.stroke();

            // DRAW BOB (Amber Matte)
            ctx.fillStyle = "#FFD700";
            ctx.shadowBlur = isDragging ? 20 : 0;
            ctx.shadowColor = "#FFD700";
            ctx.beginPath();
            ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 3;
            ctx.stroke();

            // VECTORS
            if (showVectors && isRunning) {
                // Velocity Vector (Green)
                const vLen = velocityRef.current * 1500;
                if (Math.abs(vLen) > 1) {
                    ctx.strokeStyle = "#4ade80";
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(bobX, bobY);
                    ctx.lineTo(bobX + vLen * Math.cos(angleRef.current), bobY - vLen * Math.sin(angleRef.current));
                    ctx.stroke();
                }

                // Gravity Vector (Red)
                ctx.strokeStyle = "#ef4444";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(bobX, bobY);
                ctx.lineTo(bobX, bobY + 40);
                ctx.stroke();
            }

            // ARC INDICATOR
            ctx.strokeStyle = "rgba(255, 215, 0, 0.1)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(originX, originY, length, 0, Math.PI * 2);
            ctx.stroke();

            // ENERGY BARS
            const currentH = length - length * Math.cos(angleRef.current);
            const potentialE = (currentH / (length * 2)) * 300;
            const kineticE = (Math.abs(velocityRef.current) * length * 4);

            const chartX = 30;
            const chartY = height - 80;

            // PE Bar
            ctx.fillStyle = "#3b82f6";
            ctx.fillRect(chartX, chartY, 15, -potentialE);
            // KE Bar
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(chartX + 25, chartY, 15, -kineticE * 50);

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [length, isRunning, isDragging, showVectors]);

    const period = 2 * Math.PI * Math.sqrt(length / 100 / g_real);

    return (
        <div ref={containerRef} className={cn("bg-background min-h-screen flex flex-col font-[family-name:var(--font-outfit)]", className)}>
            {/* Header / Mission Area */}
            <div className="bg-[#FFD700]/10 border-b border-white/5 p-4 sm:p-6">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#FFD700] flex items-center justify-center text-black border border-black shadow-[2px_2px_0px_#000]">
                                <Activity className="w-4 h-4" />
                            </div>
                            <span className="text-[#FFD700] font-black text-xs uppercase tracking-[0.2em]">HARMONIC LAB</span>
                        </div>
                        <h2 className="text-white text-base sm:text-lg font-black tracking-tight uppercase italic">{challenges[challenge].question}</h2>
                        <div className="flex items-center gap-1.5 mt-2">
                            <Info className="w-3 h-3 text-zinc-500" />
                            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{challenges[challenge].hint}</p>
                        </div>
                    </div>
                    <div className="bg-zinc-900 border border-white/10 p-3 rounded-2xl flex items-center gap-6">
                        <div>
                            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest block">PERİYOT (T)</span>
                            <span className="text-[#FFD700] font-mono text-xl font-black">{period.toFixed(2)}s</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest block">AÇI (θ)</span>
                            <span className="text-white font-mono text-xl font-black">{(angleRef.current * 180 / Math.PI).toFixed(0)}°</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Simulation Canvas Area */}
                <div
                    className="lg:col-span-8 relative bg-[#121214] border-b lg:border-b-0 lg:border-r border-white/5 touch-none overflow-hidden"
                    onMouseDown={(e) => { setIsDragging(true); handleInteraction(e); }}
                    onMouseMove={(e) => { if (isDragging) handleInteraction(e); }}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={(e) => { setIsDragging(true); handleInteraction(e); }}
                    onTouchMove={(e) => { if (isDragging) handleInteraction(e); }}
                    onTouchEnd={() => setIsDragging(false)}
                >
                    <canvas ref={canvasRef} className="w-full h-full object-contain cursor-grab active:cursor-grabbing" />

                    {/* Energy Indicators */}
                    <div className="absolute bottom-10 left-6 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-8 bg-blue-500 rounded-full" />
                            <span className="text-[9px] text-zinc-500 font-black uppercase">Potansiyel</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-8 bg-red-500 rounded-full" />
                            <span className="text-[9px] text-zinc-500 font-black uppercase">Kinetik</span>
                        </div>
                    </div>

                    <div className="absolute top-6 right-6">
                        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                            👆 Sarkaç Topunu Çek ve Bırak
                        </div>
                    </div>
                </div>

                {/* Controls Sidebar */}
                <div className="lg:col-span-4 p-6 sm:p-8 space-y-8 bg-background">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                <span className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">İp Uzunluğu (L)</span>
                                <span className="text-[#FFD700] font-mono text-sm font-black">{length} px</span>
                            </div>
                            <input
                                type="range" min="50" max="280" value={length}
                                onChange={(e) => setLength(Number(e.target.value))}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                            />
                        </div>

                        <button
                            onClick={() => setShowVectors(!showVectors)}
                            className={cn(
                                "w-full p-4 rounded-xl border-2 border-black flex items-center justify-between transition-all",
                                showVectors ? "bg-zinc-100 text-black shadow-[4px_4px_0px_#000]" : "bg-zinc-900 text-zinc-500 border-zinc-800"
                            )}
                        >
                            <span className="font-black text-xs uppercase tracking-widest">Kuvvet Vektörleri</span>
                            <div className={cn("w-4 h-4 rounded-full border-2 border-current", showVectors && "bg-black")} />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            className={cn(
                                "h-16 rounded-2xl border-2 border-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[4px_4px_0px_#000]",
                                isRunning ? "bg-[#FFD700] text-black" : "bg-green-500 text-white"
                            )}
                        >
                            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            <span className="font-black text-base uppercase tracking-widest">{isRunning ? "DURAKLAT" : "BAŞLAT"}</span>
                        </button>

                        <div className="grid grid-cols-4 gap-2">
                            <button
                                onClick={() => { setLength(150); setIsRunning(true); angleRef.current = Math.PI / 4; velocityRef.current = 0; }}
                                className="col-span-1 h-12 rounded-xl border border-black bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-all shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            {challenges.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setChallenge(i)}
                                    className={cn(
                                        "py-2.5 rounded-xl border border-black text-[10px] font-black uppercase tracking-widest transition-all shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none",
                                        challenge === i ? "bg-[#FFD700] text-black" : "bg-zinc-900 text-zinc-500 border-zinc-800 shadow-none hover:bg-zinc-800"
                                    )}
                                >
                                    #{i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-2xl p-5 flex gap-3">
                        <BarChart3 className="w-5 h-5 text-[#FFD700]" />
                        <p className="text-zinc-500 text-[11px] leading-relaxed font-bold uppercase tracking-tight">
                            Basit sarkaçta periyot kütleden bağımsızdır, sadece uzunluk (L) ve yerçekimine (g) bağlıdır.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
