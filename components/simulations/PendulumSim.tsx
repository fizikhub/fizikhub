"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Activity, RotateCcw, Play, Pause, BarChart3 } from "lucide-react";
import { SimWrapper, SimTask } from "./sim-wrapper";

interface PendulumSimProps {
    className?: string;
}

export function PendulumSim({ className = "" }: PendulumSimProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // UI & Physics State
    const [length, setLength] = useState(150);
    const [isRunning, setIsRunning] = useState(true);
    const [showVectors, setShowVectors] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

    // Mission State
    const [tasks, setTasks] = useState<SimTask[]>([
        {
            id: "ped1",
            description: "Hareketi Başlat",
            hint: "Sarkacı tutup yana çek ve bırak. Salınımı gözlemle.",
            isCompleted: false,
            explanation: "Süper! Sarkaç, potansiyel ve kinetik enerji arasında sürekli dönüşüm yaparak salınır."
        },
        {
            id: "ped2",
            description: "Kısa İp, Hızlı Tur",
            hint: "İp uzunluğunu 100px altına düşür ve periyodun nasıl kısaldığını gör.",
            isCompleted: false,
            explanation: "Doğru! İp kısaldıkça sarkaç daha hızlı salınır (Periyot azalır)."
        },
        {
            id: "ped3",
            description: "Yavaş Çekim (2 Saniye)",
            hint: "Periyodu yaklaşık 2 saniye yapmak için ipi uzatmayı dene (200px civarı).",
            isCompleted: false,
            explanation: "Harika! Uzun sarkaçlar daha yavaş salınır. T = 2π√(L/g) formülünü hatırladın mı?"
        }
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // Physics References
    const angleRef = useRef(Math.PI / 4);
    const velocityRef = useRef(0);
    const accelerationRef = useRef(0);
    const timeRef = useRef(0);

    // Physics constants
    const g_real = 9.81;
    const gravity = 0.5; // Visual gravity scale
    const damping = 0.998;
    const bobRadius = 24;

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
    }, []);

    const resetSim = () => {
        setLength(150);
        setIsRunning(true);
        angleRef.current = Math.PI / 4;
        velocityRef.current = 0;
        timeRef.current = 0;
    };

    // Interaction Handlers
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

        angleRef.current = Math.atan2(x - originX, y - originY);
        velocityRef.current = 0;
    };

    // Game Loop
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

            // Update Dimensions if resized
            if (containerRef.current && (canvas.width !== containerRef.current.clientWidth || canvas.height !== containerRef.current.clientHeight)) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }

            // Paint Background
            ctx.fillStyle = "#09090b"; // Match theme
            ctx.fillRect(0, 0, width, height);

            // Grid
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }

            // Physics Update
            if (isRunning && !isDragging) {
                accelerationRef.current = (-gravity / length) * Math.sin(angleRef.current);
                velocityRef.current += accelerationRef.current;
                velocityRef.current *= damping;
                angleRef.current += velocityRef.current;
                timeRef.current += 1 / 60; // Approx dt

                // Task Checks
                // Task 1: Just let it swing a bit properly
                if (currentTaskIndex === 0 && Math.abs(velocityRef.current) > 0.05) {
                    completeTask(0);
                }
                // Task 2: Short length (<100)
                if (currentTaskIndex === 1 && length < 100) {
                    completeTask(1);
                }
                // Task 3: Period approx 2s -> Length around 200-240 visual scale mapping is loose here, checking raw length
                // In visual scale g=0.5. T = 2pi * sqrt(L/g). For T=2s -> 4 = 4pi^2 * L/0.5 -> L = 0.5/pi^2 ~ 0.05 (too small relative).
                // Let's just rely on the user finding the "sweet spot" value defined in hint (200px)
                if (currentTaskIndex === 2 && length > 190 && length < 230) {
                    completeTask(2);
                }
            }

            const bobX = originX + length * Math.sin(angleRef.current);
            const bobY = originY + length * Math.cos(angleRef.current);

            // Draw String
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(bobX, bobY);
            ctx.stroke();

            // Draw Pivot
            ctx.fillStyle = "#27272a";
            ctx.beginPath(); ctx.arc(originX, originY, 6, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 2; ctx.stroke();

            // Draw Bob
            ctx.fillStyle = isDragging ? "#F59E0B" : "#FFD700"; // Amber-500 drag, Gold default
            ctx.shadowBlur = isDragging ? 25 : 0;
            ctx.shadowColor = "#F59E0B";
            ctx.beginPath();
            ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#000"; ctx.lineWidth = 3; ctx.stroke();

            // Vectors
            if (showVectors && isRunning) {
                // Velocity (Green)
                const vLen = velocityRef.current * 1500;
                if (Math.abs(vLen) > 1) {
                    ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(bobX, bobY);
                    ctx.lineTo(bobX + vLen * Math.cos(angleRef.current), bobY - vLen * Math.sin(angleRef.current));
                    ctx.stroke();
                }
                // Gravity (Red)
                ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(bobX, bobY); ctx.lineTo(bobX, bobY + 40); ctx.stroke();
            }

            animationId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animationId);
    }, [length, isRunning, isDragging, showVectors, currentTaskIndex, completeTask]);

    const period = 2 * Math.PI * Math.sqrt(length / 100 / g_real); // Visual approx

    // Controls component
    const Controls = (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/10 text-white">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">UZUNLUK (L)</span>
                    <span className="text-lg font-mono font-bold text-[#FFD700]">{length}px</span>
                </div>
                <input
                    type="range" min="50" max="300" value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                />
            </div>

            <button
                onClick={() => setIsRunning(!isRunning)}
                className={cn(
                    "w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-lg active:scale-95",
                    isRunning
                        ? "bg-zinc-800 text-zinc-400 border border-white/5"
                        : "bg-[#FFD700] text-black border border-transparent"
                )}
            >
                {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                {isRunning ? "DURAKLAT" : "DEVAM ET"}
            </button>

            <button
                onClick={() => setShowVectors(!showVectors)}
                className={cn(
                    "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                    showVectors ? "bg-white/5 border-white/20 text-white" : "bg-transparent border-zinc-800 text-zinc-500"
                )}
            >
                <span className="font-bold text-xs uppercase tracking-widest">Kuvvet Vektörleri</span>
                <div className={cn("w-4 h-4 rounded-full border-2 border-current transition-colors", showVectors && "bg-[#4ade80] border-[#4ade80]")} />
            </button>

            <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 text-center">
                <div className="text-[9px] text-zinc-500 uppercase font-black mb-1">Hesaplanan Periyot</div>
                <div className="text-2xl font-mono font-bold text-white">{period.toFixed(2)}s</div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                <BarChart3 className="w-5 h-5 text-blue-400 shrink-0" />
                <p className="text-blue-200/70 text-xs leading-relaxed font-medium">
                    Basit sarkaçta periyot kütleden bağımsızdır, sadece ipin uzunluğuna ve yerçekimine bağlıdır.
                </p>
            </div>
        </div>
    );

    return (
        <SimWrapper
            title="Basit Sarkaç"
            description="Periyodik hareketin temellerini keşfet."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={Controls}
        >
            <div
                ref={containerRef}
                className="w-full h-full relative"
                onMouseDown={(e) => { setIsDragging(true); handleInteraction(e); }}
                onMouseMove={(e) => { if (isDragging) handleInteraction(e); }}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={(e) => { setIsDragging(true); handleInteraction(e); }}
                onTouchMove={(e) => { if (isDragging) handleInteraction(e); }}
                onTouchEnd={() => setIsDragging(false)}
            >
                <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing touch-none" />

                {!isRunning && !isDragging && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 text-sm font-bold pointer-events-none select-none animate-pulse">
                        DURAKLATILDI
                    </div>
                )}
            </div>
        </SimWrapper>
    );
}
