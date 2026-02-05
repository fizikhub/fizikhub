"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Target, RotateCcw, Play, Info, MapPin } from "lucide-react";

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
    const [lastResult, setLastResult] = useState<{ range: number; maxHeight: number; time: number; x: number } | null>(null);

    // Simulation state
    const projRef = useRef<{ x: number; y: number; vx: number; vy: number; active: boolean } | null>(null);
    const trailRef = useRef<{ x: number; y: number }[]>([]);

    // Physics constants
    const g = 9.81;
    const timeStep = 0.016 * 1.5;
    const scale = 3.5; // Pixels per meter

    const challenges = [
        { question: "Maksimum menzil için en iyi açıyı bul!", hint: "Açıyı 45° yap ve 'Ateşle' butonuna bas." },
        { question: "50 metre menzile ulaş!", hint: "Hız ve açıyı ayarlayarak tam 50m'yi hedefle." },
        { question: "En yüksek irtifa rekoru kır!", hint: "Açıyı 90°'ye yaklaştırıp hızı fulle." },
    ];

    // Responsive Canvas
    useEffect(() => {
        const resize = () => {
            if (containerRef.current && canvasRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                canvasRef.current.width = rect.width;
                canvasRef.current.height = 400; // Fixed simulation height
            }
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    const launch = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const groundY = canvas.height - 60;
        const startX = 60;
        const angleRad = (angle * Math.PI) / 180;

        projRef.current = {
            x: startX,
            y: groundY,
            vx: velocity * Math.cos(angleRad) * scale,
            vy: -velocity * Math.sin(angleRad) * scale,
            active: true
        };
        trailRef.current = [];
        // Keep lastResult for ghost marker, only clear when new launch starts? 
        // No, let's keep the marker until it hits again.
    };

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const startX = 60;
        const groundY = canvasRef.current.height - 60;

        const dx = x - startX;
        const dy = groundY - y;

        if (dx > 0 && dy > -20) {
            const newAngle = Math.atan2(dy, dx) * 180 / Math.PI;
            const newVelocity = Math.sqrt(dx * dx + dy * dy) / scale;

            setAngle(Math.min(90, Math.max(0, Math.round(newAngle))));
            setVelocity(Math.min(100, Math.max(5, Math.round(newVelocity))));
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const startX = 60;
        const groundY = canvas.height - 60;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            // BACKGROUND
            ctx.fillStyle = "#121214";
            ctx.fillRect(0, 0, width, height);

            // GRIDLINES
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, groundY); ctx.stroke();
            }
            for (let j = 0; j < groundY; j += 40) {
                ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(width, j); ctx.stroke();
            }

            // GROUND
            ctx.fillStyle = "#1c1c1f";
            ctx.fillRect(0, groundY, width, height - groundY);
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(width, groundY);
            ctx.stroke();

            // DISTANCE MARKERS (Meters)
            for (let i = 0; i < width; i += 50) {
                const meters = Math.round((i - startX) / scale);
                if (meters >= 0 && meters % 10 === 0) {
                    ctx.fillStyle = "rgba(255,255,255,0.4)";
                    ctx.font = "black 10px monospace";
                    ctx.textAlign = "center";
                    ctx.fillText(`${meters}m`, i, groundY + 25);

                    ctx.strokeStyle = "rgba(255,255,255,0.2)";
                    ctx.beginPath();
                    ctx.moveTo(i, groundY);
                    ctx.lineTo(i, groundY + 10);
                    ctx.stroke();
                }
            }

            // GHOST LANDING MARKER
            if (lastResult) {
                ctx.save();
                ctx.translate(lastResult.x, groundY);
                ctx.fillStyle = "#FF5757";
                ctx.globalAlpha = 0.4;
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.textAlign = "center";
                ctx.font = "bold 12px sans-serif";
                ctx.fillText(`${lastResult.range.toFixed(1)}m`, 0, -15);
                ctx.restore();
            }

            // INTERACTION FEEDBACK (Dashed line)
            const angleRad = (angle * Math.PI) / 180;
            const previewVX = velocity * Math.cos(angleRad) * scale;
            const previewVY = -velocity * Math.sin(angleRad) * scale;

            ctx.setLineDash([6, 4]);
            ctx.strokeStyle = "rgba(255, 215, 0, 0.2)";
            ctx.lineWidth = 2;
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

            // Base
            ctx.fillStyle = "#27272a";
            ctx.beginPath();
            ctx.arc(0, 0, 18, Math.PI, 0);
            ctx.fill();
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Barrel
            const barrelGrad = ctx.createLinearGradient(0, -12, 0, 12);
            barrelGrad.addColorStop(0, "#FF5757");
            barrelGrad.addColorStop(1, "#992222");
            ctx.fillStyle = barrelGrad;
            ctx.fillRect(0, -12, 50, 24);
            ctx.strokeStyle = "#000";
            ctx.strokeRect(0, -12, 50, 24);
            ctx.restore();

            // TRAIL
            if (trailRef.current.length > 1) {
                ctx.strokeStyle = "rgba(255, 87, 87, 0.4)";
                ctx.lineWidth = 3;
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                trailRef.current.forEach((p, i) => {
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // PROJECTILE
            const proj = projRef.current;
            if (proj && proj.active) {
                proj.vy += g * scale * timeStep;
                proj.x += proj.vx * timeStep;
                proj.y += proj.vy * timeStep;

                trailRef.current.push({ x: proj.x, y: proj.y });

                // Projectile visual
                ctx.fillStyle = "#FFD700";
                ctx.shadowBlur = 15;
                ctx.shadowColor = "#FFD700";
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 3;
                ctx.stroke();

                if (proj.y >= groundY) {
                    proj.active = false;
                    const range = (proj.x - startX) / scale;
                    const maxH = Math.max(...trailRef.current.map(p => groundY - p.y)) / scale;
                    setLastResult({ range, maxHeight: maxH, time: trailRef.current.length * timeStep, x: proj.x });
                }
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [angle, velocity, lastResult]);

    return (
        <div ref={containerRef} className={cn("bg-background min-h-screen flex flex-col font-[family-name:var(--font-outfit)]", className)}>
            {/* Header / Mission Area */}
            <div className="bg-[#FF5757]/10 border-b border-white/5 p-4 sm:p-6">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#FF5757] flex items-center justify-center text-black border border-black shadow-[2px_2px_0px_#000]">
                                <Target className="w-4 h-4" />
                            </div>
                            <span className="text-[#FF5757] font-black text-xs uppercase tracking-[0.2em]">MISSION CONTROL</span>
                        </div>
                        <h2 className="text-white text-base sm:text-lg font-black tracking-tight uppercase italic">{challenges[challenge].question}</h2>
                        <div className="flex items-center gap-1.5 mt-2">
                            <Info className="w-3 h-3 text-zinc-500" />
                            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{challenges[challenge].hint}</p>
                        </div>
                    </div>
                    {lastResult && (
                        <div className="bg-zinc-900 border border-white/10 p-3 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                            <div className="text-right">
                                <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest block">SON MENZİL</span>
                                <span className="text-[#FFD700] font-mono text-xl font-black">{lastResult.range.toFixed(1)}m</span>
                            </div>
                            <MapPin className="text-[#FF5757] w-6 h-6" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Simulation Canvas Area */}
                <div className="lg:col-span-8 relative bg-[#121214] border-b lg:border-b-0 lg:border-r border-white/5 touch-none">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={(e) => { setIsDragging(true); handleInteraction(e); }}
                        onMouseMove={(e) => { if (isDragging) handleInteraction(e); }}
                        onMouseUp={() => setIsDragging(false)}
                        onTouchStart={(e) => { setIsDragging(true); handleInteraction(e); }}
                        onTouchMove={(e) => { if (isDragging) handleInteraction(e); }}
                        onTouchEnd={() => setIsDragging(false)}
                        className="w-full h-full object-contain cursor-crosshair"
                    />

                    {/* Live Data Overlays */}
                    <div className="absolute top-6 left-6 flex flex-col gap-3">
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest block mb-1">Menzil (R)</span>
                                    <span className="text-[#FFD700] font-mono text-xl font-black">{(velocity * velocity * Math.sin(2 * angle * Math.PI / 180) / g).toFixed(1)}m</span>
                                </div>
                                <div>
                                    <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest block mb-1">Dikey (H)</span>
                                    <span className="text-white font-mono text-xl font-black">{(Math.pow(velocity * Math.sin(angle * Math.PI / 180), 2) / (2 * g)).toFixed(1)}m</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Sidebar */}
                <div className="lg:col-span-4 p-6 sm:p-8 space-y-8 bg-background">
                    {/* Parameters */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                <span className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Fırlatma Açısı</span>
                                <span className="text-[#FF5757] font-mono text-sm font-black">{angle}°</span>
                            </div>
                            <input
                                type="range" min="0" max="90" value={angle}
                                onChange={(e) => setAngle(Number(e.target.value))}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5757]"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                <span className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">İlk Hız (v₀)</span>
                                <span className="text-[#FFD700] font-mono text-sm font-black">{velocity} m/s</span>
                            </div>
                            <input
                                type="range" min="5" max="100" value={velocity}
                                onChange={(e) => setVelocity(Number(e.target.value))}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={launch}
                            disabled={projRef.current?.active}
                            className={cn(
                                "h-20 rounded-2xl border-2 border-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[6px_6px_0px_#000]",
                                "bg-[#FFD700] text-black hover:bg-white disabled:opacity-50 disabled:shadow-none"
                            )}
                        >
                            <Play className="w-6 h-6 fill-current" />
                            <span className="font-black text-xl uppercase italic tracking-tighter">ATEŞLE!</span>
                        </button>

                        <div className="grid grid-cols-4 gap-2">
                            <button
                                onClick={() => { setAngle(45); setVelocity(50); setLastResult(null); }}
                                className="col-span-1 h-12 rounded-xl border border-black bg-zinc-100 text-black flex items-center justify-center hover:bg-white transition-all shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            {challenges.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setChallenge(i)}
                                    className={cn(
                                        "py-2.5 rounded-xl border border-black text-[10px] font-black uppercase tracking-widest transition-all shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none",
                                        challenge === i ? "bg-[#FF5757] text-black" : "bg-zinc-900 text-zinc-500 border-zinc-800 shadow-none hover:bg-zinc-800"
                                    )}
                                >
                                    #{i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Educational Note */}
                    <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-2xl p-4 sm:p-5">
                        <p className="text-[#FFD700] text-[11px] sm:text-xs leading-relaxed font-bold italic uppercase tracking-wider">
                            ✨ İpucu: Maksimum menzil için açıyı 45° yapmayı dene. Hız arttıkça topun izlediği parabol genişleyecektir.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
