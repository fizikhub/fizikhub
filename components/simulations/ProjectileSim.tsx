"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { SimWrapper, SimTask } from "./sim-wrapper";

interface ProjectileSimProps {
    className?: string;
}

export function ProjectileSim({ className = "" }: ProjectileSimProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Tasks
    const [tasks, setTasks] = useState<SimTask[]>([
        { id: "t1", description: "50 metre menzile (+/- 2m) atış yap", hint: "45° açı en uzun menzili verir.", isCompleted: false },
        { id: "t2", description: "Maksimum yüksekliği 40m üzerine çıkar", hint: "Açıyı dikleştirip (75°+) hızı arttır.", isCompleted: false },
        { id: "t3", description: "Topun havada kalma süresini 8 saniyeye çıkar", hint: "Yüksek açı ve yüksek hız gerekli.", isCompleted: false },
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // Simulation State
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [lastResult, setLastResult] = useState<{ range: number; maxHeight: number; time: number; x: number } | null>(null);

    // Physics Engine Refs
    const projRef = useRef<{ x: number; y: number; vx: number; vy: number; active: boolean } | null>(null);
    const trailRef = useRef<{ x: number; y: number }[]>([]);
    const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string }[]>([]);

    const g = 9.81;
    const timeStep = 0.016 * 1.5;
    const scale = 3.5; // Pixels per meter

    // Resize Handler
    useEffect(() => {
        const resize = () => {
            if (containerRef.current && canvasRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                canvasRef.current.width = rect.width;
                canvasRef.current.height = rect.height;
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
        setLastResult(null);
    };

    const resetSim = () => {
        setAngle(45);
        setVelocity(50);
        setLastResult(null);
        projRef.current = null;
        trailRef.current = [];
        particlesRef.current = [];
    };

    const checkTaskCompletion = (result: { range: number; maxHeight: number; time: number }) => {
        if (currentTaskIndex >= tasks.length) return;

        let completed = false;
        if (currentTaskIndex === 0) {
            // Task 1: 50m range (+/- 2m)
            if (result.range >= 48 && result.range <= 52) completed = true;
        } else if (currentTaskIndex === 1) {
            // Task 2: Max height > 40m
            if (result.maxHeight > 40) completed = true;
        } else if (currentTaskIndex === 2) {
            // Task 3: Flight time > 8s
            if (result.time > 8) completed = true;
        }

        if (completed) {
            const newTasks = [...tasks];
            newTasks[currentTaskIndex].isCompleted = true;
            setTasks(newTasks);
            setTimeout(() => {
                if (currentTaskIndex < tasks.length - 1) {
                    setCurrentTaskIndex(prev => prev + 1);
                }
            }, 1000);
        }
    };

    // Main Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            const groundY = height - 60;
            const startX = 60;

            // Clear
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, width, height);

            // Grid
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 50) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }
            for (let j = 0; j < height; j += 50) {
                ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(width, j); ctx.stroke();
            }

            // Target Visualization
            if (currentTaskIndex === 0 && !tasks[0].isCompleted) {
                const targetStart = startX + 48 * scale;
                const targetWidth = 4 * scale;
                ctx.fillStyle = "rgba(74, 222, 128, 0.1)";
                ctx.fillRect(targetStart, 0, targetWidth, groundY);

                ctx.strokeStyle = "#4ADE80";
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(targetStart, 0, targetWidth, groundY);
                ctx.setLineDash([]);

                ctx.fillStyle = "#4ADE80";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("HEDEF", targetStart + targetWidth / 2, groundY - 20);
            }

            // Ground
            ctx.fillStyle = "#18181b";
            ctx.fillRect(0, groundY, width, height - groundY);
            ctx.strokeStyle = "#27272a";
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(width, groundY); ctx.stroke();

            // Distance Markers
            for (let i = 0; i < width; i += 50) {
                const meters = Math.round((i - startX) / scale);
                if (meters >= 0 && meters % 10 === 0) {
                    ctx.fillStyle = "#52525b";
                    ctx.font = "10px monospace";
                    ctx.textAlign = "center";
                    ctx.fillText(`${meters}m`, i, groundY + 20);
                    ctx.fillRect(i, groundY, 1, 6);
                }
            }

            // Cannon
            const angleRad = (angle * Math.PI) / 180;
            ctx.save();
            ctx.translate(startX, groundY);
            ctx.rotate(-angleRad);

            // Barrel
            const barrelGrad = ctx.createLinearGradient(0, -10, 0, 10);
            barrelGrad.addColorStop(0, "#52525b");
            barrelGrad.addColorStop(1, "#3f3f46");
            ctx.fillStyle = barrelGrad;
            ctx.fillRect(0, -10, 60, 20);
            ctx.strokeStyle = "#18181b";
            ctx.strokeRect(0, -10, 60, 20);
            ctx.restore();

            // Base
            ctx.fillStyle = "#27272a";
            ctx.beginPath(); ctx.arc(startX, groundY, 20, Math.PI, 0); ctx.fill();
            ctx.strokeStyle = "#000"; ctx.stroke();

            // Preview Lines
            if (!projRef.current?.active) {
                const previewVX = velocity * Math.cos(angleRad) * scale;
                const previewVY = -velocity * Math.sin(angleRad) * scale;
                ctx.beginPath();
                ctx.moveTo(startX, groundY);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
                ctx.setLineDash([4, 4]);
                for (let t = 0; t < 2.0; t += 0.1) {
                    const px = startX + previewVX * t;
                    const py = groundY + previewVY * t + 0.5 * g * scale * t * t;
                    if (py > groundY) break;
                    ctx.lineTo(px, py);
                }
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Projectile
            const proj = projRef.current;
            if (proj && proj.active) {
                proj.vy += g * scale * timeStep;
                proj.x += proj.vx * timeStep;
                proj.y += proj.vy * timeStep;
                trailRef.current.push({ x: proj.x, y: proj.y });

                // Ball
                ctx.fillStyle = "#FFC800";
                ctx.shadowColor = "#FFC800";
                ctx.shadowBlur = 10;
                ctx.beginPath(); ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
                ctx.strokeStyle = "black"; ctx.lineWidth = 1; ctx.stroke();

                // Trail
                ctx.beginPath();
                ctx.strokeStyle = "rgba(255, 200, 0, 0.3)";
                ctx.lineWidth = 3;
                trailRef.current.forEach((p, i) => {
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();

                // Collision
                if (proj.y >= groundY) {
                    proj.active = false;
                    const range = (proj.x - startX) / scale;
                    const maxH = Math.max(...trailRef.current.map(p => groundY - p.y)) / scale;
                    const flightTime = trailRef.current.length * timeStep;

                    const result = { range, maxHeight: maxH, time: flightTime, x: proj.x };
                    setLastResult(result);
                    checkTaskCompletion(result);

                    // Debris
                    for (let k = 0; k < 10; k++) {
                        particlesRef.current.push({
                            x: proj.x, y: groundY,
                            vx: (Math.random() - 0.5) * 8,
                            vy: -(Math.random() * 4 + 1),
                            life: 1.0,
                            color: Math.random() > 0.5 ? "#FFC800" : "#FFFFFF"
                        });
                    }
                }
            }

            // Render Particles
            if (particlesRef.current.length > 0) {
                particlesRef.current = particlesRef.current.filter(p => p.life > 0);
                particlesRef.current.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.2;
                    p.life -= 0.05;
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
                    ctx.globalAlpha = 1;
                });
            }

            // Flag / Result Marker
            if (lastResult) {
                ctx.fillStyle = "#FF5757";
                ctx.beginPath();
                ctx.moveTo(lastResult.x, groundY);
                ctx.lineTo(lastResult.x - 5, groundY - 15);
                ctx.lineTo(lastResult.x + 5, groundY - 15);
                ctx.fill();

                ctx.textAlign = "center";
                ctx.fillStyle = "white";
                ctx.font = "12px sans-serif";
                ctx.fillText(`${lastResult.range.toFixed(1)}m`, lastResult.x, groundY - 20);
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [angle, velocity, currentTaskIndex, tasks]); // Re-bind on task summary change

    // Touch/Mouse Interaction
    const handleInteraction = (clientX: number, clientY: number) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const groundY = canvasRef.current.height - 60;
        const startX = 60;

        const dx = x - startX;
        const dy = groundY - y;

        if (dx > 0 && dy > -20) {
            const newAngle = Math.atan2(dy, dx) * 180 / Math.PI;
            const newVel = Math.min(100, Math.max(10, Math.sqrt(dx * dx + dy * dy) / scale));

            setAngle(Math.min(90, Math.max(0, newAngle)));
            setVelocity(newVel);
        }
    };

    return (
        <SimWrapper
            title="Atış Hareketi"
            description="Yerçekimi altında hareket eden bir cismin yörüngesini incele. Açı ve hızı değiştirerek hedefleri vurmaya çalış."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={
                <div className="space-y-6">
                    {/* Angle Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                            <span className="text-zinc-500 font-black text-[10px] uppercase tracking-wider">Atış Açısı</span>
                            <span className="text-white font-mono text-sm font-bold">{angle.toFixed(1)}°</span>
                        </div>
                        <input
                            type="range" min="0" max="90" step="0.5" value={angle}
                            onChange={(e) => setAngle(parseFloat(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FFC800] hover:accent-[#FF90E8] transition-all"
                        />
                    </div>

                    {/* Velocity Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                            <span className="text-zinc-500 font-black text-[10px] uppercase tracking-wider">İlk Hız</span>
                            <span className="text-[#FFC800] font-mono text-sm font-bold">{velocity.toFixed(1)} m/s</span>
                        </div>
                        <input
                            type="range" min="10" max="100" step="1" value={velocity}
                            onChange={(e) => setVelocity(parseFloat(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FFC800] hover:accent-[#FF90E8] transition-all"
                        />
                    </div>

                    {/* Launch Button */}
                    <button
                        onClick={launch}
                        disabled={projRef.current?.active}
                        className={cn(
                            "w-full h-14 rounded-xl border-2 border-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[4px_4px_0px_#000]",
                            "bg-[#FFC800] text-black hover:bg-white disabled:opacity-50 disabled:shadow-none"
                        )}
                    >
                        <Play className="w-5 h-5 fill-current" />
                        <span className="font-black text-lg uppercase italic tracking-tighter">ATEŞLE</span>
                    </button>

                    {/* Stats */}
                    {lastResult && (
                        <div className="grid grid-cols-2 gap-2 mt-4 animate-in slide-in-from-bottom-2 fade-in">
                            <div className="bg-zinc-900 p-3 rounded-xl border border-white/5">
                                <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">MENZİL</div>
                                <div className="text-lg font-mono text-white font-bold">{lastResult.range.toFixed(1)}m</div>
                            </div>
                            <div className="bg-zinc-900 p-3 rounded-xl border border-white/5">
                                <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">YÜKSEKLİK</div>
                                <div className="text-lg font-mono text-white font-bold">{lastResult.maxHeight.toFixed(1)}m</div>
                            </div>
                            <div className="col-span-2 bg-zinc-900 p-3 rounded-xl border border-white/5">
                                <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">UÇUŞ SÜRESİ</div>
                                <div className="text-lg font-mono text-white font-bold">{lastResult.time.toFixed(2)}s</div>
                            </div>
                        </div>
                    )}
                </div>
            }
        >
            <div
                ref={containerRef}
                className="w-full h-full relative touch-none"
                onMouseDown={(e) => { setIsDragging(true); handleInteraction(e.clientX, e.clientY); }}
                onMouseMove={(e) => { if (isDragging) handleInteraction(e.clientX, e.clientY); }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={(e) => { setIsDragging(true); handleInteraction(e.touches[0].clientX, e.touches[0].clientY); }}
                onTouchMove={(e) => { if (isDragging) handleInteraction(e.touches[0].clientX, e.touches[0].clientY); }}
                onTouchEnd={() => setIsDragging(false)}
            >
                <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
        </SimWrapper>
    );
}
