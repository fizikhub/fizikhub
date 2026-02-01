"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ProjectileSimProps {
    className?: string;
}

export function ProjectileSim({ className = "" }: ProjectileSimProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // UI State
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(50);
    const [challenge, setChallenge] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [lastResult, setLastResult] = useState<{ range: number; maxHeight: number; time: number } | null>(null);

    // Simulation state
    const projRef = useRef<{ x: number; y: number; vx: number; vy: number; active: boolean } | null>(null);
    const trailRef = useRef<{ x: number; y: number }[]>([]);

    // Physics constants
    const g = 9.81;
    const timeStep = 0.016 * 1.5; // Slightly accelerated for "fun"
    const scale = 3.5; // Pixels per meter

    const challenges = [
        { question: "Maksimum menzil için en iyi açıyı bul!", hint: "Açıyı 45° yap ve 'Ateşle' butonuna bas." },
        { question: "50 metre menzile ulaş!", hint: "Açı ve hızı koordine ederek tam 50m'yi hedefle." },
        { question: "En yüksek irtifa rekoru kır!", hint: "Açıyı 90°'ye yaklaştırıp hızı fulle." },
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

    const launch = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const groundY = canvas.height - 40;
        const startX = 50;
        const angleRad = (angle * Math.PI) / 180;

        projRef.current = {
            x: startX,
            y: groundY,
            vx: velocity * Math.cos(angleRad) * scale,
            vy: -velocity * Math.sin(angleRad) * scale,
            active: true
        };
        trailRef.current = [];
        setLastResult(null);
    };

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const startX = 50;
        const groundY = canvasRef.current.height - 40;

        const dx = x - startX;
        const dy = groundY - y;

        if (dx > 0 && dy > 0) {
            const newAngle = Math.atan2(dy, dx) * 180 / Math.PI;
            const newVelocity = Math.sqrt(dx * dx + dy * dy) / scale;

            setAngle(Math.min(90, Math.round(newAngle)));
            setVelocity(Math.min(100, Math.round(newVelocity)));
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const startX = 50;
        const groundY = canvas.height - 40;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            // BACKGROUND
            const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
            bgGradient.addColorStop(0, "#082f49"); // Deep sky blue
            bgGradient.addColorStop(1, "#0c4a6e");
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // GRID & DISTANCE MARKERS
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            for (let i = 0; i < width; i += 50) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, groundY); ctx.stroke();
                if (i > 50 && (i - 50) % 100 === 0) {
                    ctx.fillStyle = "rgba(255,255,255,0.3)";
                    ctx.font = "10px Inter";
                    ctx.fillText(`${Math.round((i - 50) / scale)}m`, i - 10, groundY + 25);
                }
            }

            // GROUND
            ctx.fillStyle = "#14532d"; // Dark green
            ctx.fillRect(0, groundY, width, height - groundY);
            ctx.fillStyle = "#166534";
            ctx.fillRect(0, groundY, width, 4);

            // PREVIEW ARC (Interaction Feedback)
            const angleRad = (angle * Math.PI) / 180;
            const previewVX = velocity * Math.cos(angleRad) * scale;
            const previewVY = -velocity * Math.sin(angleRad) * scale;

            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
            ctx.beginPath();
            ctx.moveTo(startX, groundY);
            for (let t = 0; t < 2; t += 0.1) {
                const px = startX + previewVX * t;
                const py = groundY + previewVY * t + 0.5 * g * scale * t * t;
                if (py > groundY) break;
                ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // CANNON
            ctx.save();
            ctx.translate(startX, groundY);
            ctx.rotate(-angleRad);

            // Cannon Base
            ctx.fillStyle = "#334155";
            ctx.beginPath();
            ctx.arc(0, 0, 15, Math.PI, 0);
            ctx.fill();

            // Cannon Barrel
            const barrelGrad = ctx.createLinearGradient(0, -10, 0, 10);
            barrelGrad.addColorStop(0, "#475569");
            barrelGrad.addColorStop(1, "#1e293b");
            ctx.fillStyle = barrelGrad;
            ctx.fillRect(0, -10, 45, 20);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.strokeRect(0, -10, 45, 20);
            ctx.restore();

            // TRAIL
            if (trailRef.current.length > 1) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = "#fca5a5";
                ctx.strokeStyle = "#f87171";
                ctx.lineWidth = 4;
                ctx.lineCap = "round";
                ctx.beginPath();
                trailRef.current.forEach((p, i) => {
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // PROJECTILE
            const proj = projRef.current;
            if (proj && proj.active) {
                proj.vy += g * scale * timeStep;
                proj.x += proj.vx * timeStep;
                proj.y += proj.vy * timeStep;

                trailRef.current.push({ x: proj.x, y: proj.y });

                // Projectile visual
                ctx.fillStyle = "#fbbf24";
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#000";
                ctx.stroke();

                if (proj.y >= groundY) {
                    proj.active = false;
                    const range = (proj.x - startX) / scale;
                    const maxH = Math.max(...trailRef.current.map(p => groundY - p.y)) / scale;
                    setLastResult({ range, maxHeight: maxH, time: trailRef.current.length * timeStep });
                }
            }

            // VECTORS UI (Components)
            if (!proj?.active) {
                const arrowLen = 60;
                // Vx component
                ctx.strokeStyle = "#3b82f6";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(startX, groundY);
                ctx.lineTo(startX + arrowLen * Math.cos(angleRad), groundY);
                ctx.stroke();
                // Vy component
                ctx.strokeStyle = "#ef4444";
                ctx.beginPath();
                ctx.moveTo(startX, groundY);
                ctx.lineTo(startX, groundY - arrowLen * Math.sin(angleRad));
                ctx.stroke();
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [angle, velocity]);

    return (
        <div ref={containerRef} className={cn("bg-[#082f49] overflow-hidden rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]", className)}>
            {/* Premium Header */}
            <div className="bg-rose-500 p-4 border-b-4 border-black flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">☄️</span>
                        <h3 className="font-black uppercase italic text-lg text-white">PROJECTILE ELITE</h3>
                    </div>
                </div>
                <div className="flex gap-2">
                    {lastResult && (
                        <div className="bg-black/40 px-3 py-1 rounded text-[10px] font-bold text-rose-200">
                            SON ATK: {lastResult.range.toFixed(1)}m
                        </div>
                    )}
                </div>
            </div>

            {/* Canvas Area */}
            <div className="relative touch-none overflow-hidden">
                <canvas
                    ref={canvasRef}
                    onMouseDown={(e) => { setIsDragging(true); handleInteraction(e); }}
                    onMouseMove={(e) => { if (isDragging) handleInteraction(e); }}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={(e) => { setIsDragging(true); handleInteraction(e); }}
                    onTouchMove={(e) => { if (isDragging) handleInteraction(e); }}
                    onTouchEnd={() => setIsDragging(false)}
                    className="w-full h-[350px] block cursor-crosshair"
                />

                {/* Challenge Card (Overlay) */}
                <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80">
                    <div className="bg-white p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-rose-500 text-white px-1.5 py-0.5 rounded font-black">GÖREV {challenge + 1}</span>
                            <p className="text-xs font-black uppercase tracking-tighter truncate">{challenges[challenge].question}</p>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-bold leading-tight">💡 {challenges[challenge].hint}</p>
                    </div>
                </div>

                {/* Live Physics Panel */}
                <div className="absolute bottom-12 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border-2 border-white/10 space-y-3 min-w-[140px]">
                    <div className="space-y-1">
                        <p className="text-[10px] text-neutral-400 font-black uppercase">Menzil (R)</p>
                        <p className="text-xl font-black text-rose-400 font-mono">{(velocity * velocity * Math.sin(2 * angle * Math.PI / 180) / g).toFixed(1)}m</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-neutral-400 font-black uppercase">Max Yükseklik (H)</p>
                        <p className="text-lg font-black text-white font-mono">{(Math.pow(velocity * Math.sin(angle * Math.PI / 180), 2) / (2 * g)).toFixed(1)}m</p>
                    </div>
                </div>
            </div>

            {/* Premium Controls */}
            <div className="p-6 bg-slate-900 border-t-4 border-black space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="bg-slate-800/50 p-4 rounded-xl border-2 border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-white font-black uppercase text-xs">Fırlatma Açısı</label>
                                <span className="bg-rose-500 text-white px-2 py-0.5 rounded font-bold text-xs">{angle}°</span>
                            </div>
                            <input
                                type="range" min="0" max="90" value={angle}
                                onChange={(e) => setAngle(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border-2 border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-white font-black uppercase text-xs">İlk Hız (v₀)</label>
                                <span className="bg-rose-500 text-white px-2 py-0.5 rounded font-bold text-xs">{velocity} m/s</span>
                            </div>
                            <input
                                type="range" min="10" max="100" value={velocity}
                                onChange={(e) => setVelocity(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 justify-center">
                        <button
                            onClick={launch}
                            className="w-full py-6 bg-green-500 text-white font-black text-2xl uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all active:scale-95"
                        >
                            🚀 Ateşle!
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                            {challenges.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setChallenge(i)}
                                    className={cn(
                                        "py-2 text-[10px] font-black uppercase border-2 border-black transition-all",
                                        challenge === i
                                            ? "bg-rose-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                            : "bg-slate-800 text-neutral-500 hover:bg-slate-700"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
