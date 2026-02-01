"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

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
    const frameCountRef = useRef(0);

    // Physics constants
    const g_real = 9.81;
    const gravity = 0.5; // Visual gravity scale
    const damping = 0.995;
    const bobRadius = 22;

    const challenges = [
        { question: "Sarkacın uzunluğunu artırınca periyot ne olur?", hint: "Uzunluğu 200m'ye çıkar ve hızı gözlemle." },
        { question: "Enerji korunumunu gözlemle!", hint: "Hızın en yüksek olduğu ana bak (En alt nokta)." },
        { question: "Tam 1 saniyelik periyot yakala!", hint: "Uzunluğu ~100 civarına çekmeyi dene." },
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

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const originX = canvas.width / 2;
        const originY = 50;
        const bobX = originX + length * Math.sin(angleRef.current);
        const bobY = originY + length * Math.cos(angleRef.current);

        const dist = Math.sqrt((x - bobX) ** 2 + (y - bobY) ** 2);
        if (dist < bobRadius * 2) {
            setIsDragging(true);
            setIsRunning(false);
        }
    };

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const originX = canvasRef.current.width / 2;
        const originY = 50;

        const dx = x - originX;
        const dy = y - originY;

        angleRef.current = Math.atan2(dx, dy);
        velocityRef.current = 0;
    }, [isDragging]);

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            setIsRunning(true);
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchmove", handleMouseMove);
            window.addEventListener("touchend", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleMouseMove);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [isDragging, handleMouseMove]);

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
            const originY = 50;

            // BACKGROUND GRADIENT
            const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
            bgGradient.addColorStop(0, "#0f172a");
            bgGradient.addColorStop(1, "#1e293b");
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // GRID
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }
            for (let i = 0; i < height; i += 40) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
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

            // DRAW SHADOW
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowOffsetY = 10;

            // DRAW STRING
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 3;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(bobX, bobY);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // DRAW PIVOT
            const pivotGrad = ctx.createRadialGradient(originX, originY, 2, originX, originY, 8);
            pivotGrad.addColorStop(0, "#f8fafc");
            pivotGrad.addColorStop(1, "#475569");
            ctx.fillStyle = pivotGrad;
            ctx.beginPath();
            ctx.arc(originX, originY, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.stroke();

            // DRAW BOB
            const bobGrad = ctx.createRadialGradient(bobX - 5, bobY - 5, 2, bobX, bobY, bobRadius);
            bobGrad.addColorStop(0, "#fbbf24"); // Yellow light
            bobGrad.addColorStop(1, "#b45309"); // Dark amber

            ctx.fillStyle = bobGrad;
            ctx.beginPath();
            ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 3;
            ctx.stroke();

            // VECTORS
            if (showVectors && isRunning) {
                // Velocity Vector (Green)
                const vLen = velocityRef.current * 1000;
                ctx.strokeStyle = "#4ade80";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(bobX, bobY);
                ctx.lineTo(bobX + vLen * Math.cos(angleRef.current), bobY - vLen * Math.sin(angleRef.current));
                ctx.stroke();

                // Gravity Vector (Red)
                ctx.strokeStyle = "#ef4444";
                ctx.beginPath();
                ctx.moveTo(bobX, bobY);
                ctx.lineTo(bobX, bobY + 40);
                ctx.stroke();
            }

            // ENERGY CHART (Top Right)
            const chartX = width - 120;
            const chartY = 30;
            const maxH = length;
            const currentH = length - length * Math.cos(angleRef.current);
            const potentialE = (currentH / (length * 2)) * 100;
            const kineticE = (Math.abs(velocityRef.current) * length * 2); // Simplified

            ctx.fillStyle = "rgba(0,0,0,0.4)";
            ctx.roundRect?.(chartX - 10, chartY - 10, 110, 80, 8);
            ctx.fill();

            // PE Bar
            ctx.fillStyle = "#3b82f6";
            ctx.fillRect(chartX, chartY + 20, 10, -Math.min(potentialE * 0.5, 60));
            ctx.fillStyle = "#fff";
            ctx.font = "10px Inter";
            ctx.fillText("Potansiyel", chartX - 5, chartY + 35);

            // KE Bar
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(chartX + 50, chartY + 20, 10, -Math.min(kineticE * 50, 60));
            ctx.fillText("Kinetik", chartX + 45, chartY + 35);

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [length, isRunning, isDragging, showVectors]);

    const period = 2 * Math.PI * Math.sqrt(length / 100 / g_real);

    return (
        <div ref={containerRef} className={cn("bg-[#0f172a] overflow-hidden rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]", className)}>
            {/* Premium Header */}
            <div className="bg-amber-400 p-4 border-b-4 border-black flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⚡</span>
                        <h3 className="font-black uppercase italic text-lg">PRO PENDULUM v2.0</h3>
                    </div>
                    <p className="text-xs font-bold text-black/60 uppercase tracking-widest">{challenges[challenge].question}</p>
                </div>
                <div className="bg-black text-amber-400 px-3 py-1 rounded-sm font-mono text-sm font-bold">
                    T = {period.toFixed(2)}s
                </div>
            </div>

            {/* Canvas Area */}
            <div className="relative cursor-crosshair touch-none">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className="w-full h-[350px] block"
                />

                {/* Drag Hint */}
                {!isDragging && frameCountRef.current < 100 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse">
                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-sm font-bold">
                            👆 Çek ve Bırak!
                        </div>
                    </div>
                )}

                {/* Live Stats Overlay */}
                <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                    <div className="bg-black/80 backdrop-blur-sm p-3 rounded-lg border-2 border-white/10 space-y-1">
                        <div className="flex justify-between gap-8">
                            <span className="text-neutral-400 text-xs font-bold uppercase">Açı (θ)</span>
                            <span className="text-white font-mono font-bold">{(angleRef.current * 180 / Math.PI).toFixed(1)}°</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="text-neutral-400 text-xs font-bold uppercase">Hız (v)</span>
                            <span className="text-green-400 font-mono font-bold">{(velocityRef.current * 100).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Controls */}
            <div className="p-6 bg-slate-900 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-xl border-2 border-white/5">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-white font-black uppercase text-xs tracking-tighter">İp Uzunluğu (L)</label>
                            <span className="bg-amber-400 text-black px-2 py-0.5 rounded font-bold text-xs">{(length / 100).toFixed(2)}m</span>
                        </div>
                        <input
                            type="range" min="80" max="250" value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            className={cn(
                                "flex-1 py-4 font-black uppercase text-sm border-2 border-black transition-all active:translate-y-1 active:shadow-none",
                                isRunning ? "bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-green-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            )}
                        >
                            {isRunning ? "Durdur" : "Başlat"}
                        </button>
                        <button
                            onClick={() => setShowVectors(!showVectors)}
                            className={cn(
                                "px-4 py-4 font-black uppercase text-sm border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none",
                                showVectors ? "bg-cyan-500 text-white" : "bg-slate-700 text-neutral-400"
                            )}
                        >
                            {showVectors ? "Vektörler Açık" : "Vektörler Kapalı"}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        {challenges.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setChallenge(i)}
                                className={cn(
                                    "py-2 text-[10px] font-black uppercase border-2 border-black transition-all",
                                    challenge === i
                                        ? "bg-amber-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        : "bg-slate-800 text-neutral-500 hover:bg-slate-700"
                                )}
                            >
                                Görev {i + 1}
                            </button>
                        ))}
                    </div>

                    <div className="bg-amber-400/10 border-2 border-dashed border-amber-400/30 p-4 rounded-xl flex gap-3">
                        <span className="text-xl">💡</span>
                        <p className="text-amber-200 text-xs font-medium leading-relaxed">
                            {challenges[challenge].hint}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
