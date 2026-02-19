"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Zap, Magnet, Info, RotateCcw, Plus, Minus } from "lucide-react";
import { SimWrapper, SimTask } from "./sim-wrapper";

interface ElectricFieldSimProps {
    className?: string;
}

export function ElectricFieldSim({ className = "" }: ElectricFieldSimProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [charge1, setCharge1] = useState({ x: 150, y: 150, q: 1 });
    const [charge2, setCharge2] = useState({ x: 300, y: 150, q: -1 });
    const [showField, setShowField] = useState(true);

    const draggingRef = useRef<number | null>(null);

    // Distance and force logic
    const dx = charge2.x - charge1.x;
    const dy = charge2.y - charge1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const distanceM = distance / 50; // 50px = 1m
    const k = 8.99e9;
    const force = (k * Math.abs(charge1.q * charge2.q)) / (Math.max(0.1, distanceM) ** 2); // Avoid div by zero
    const forceType = charge1.q * charge2.q > 0 ? "İtme" : "Çekme";

    // -- Tasks --
    const [tasks, setTasks] = useState<SimTask[]>([
        {
            id: "e1", description: "Coulomb Yasası", hint: "Yükleri birbirine yaklaştır (mesafe < 2m) ve kuvvetin nasıl arttığını gör.", isCompleted: false,
            explanation: "Coulomb Yasası: Kuvvet, mesafenin karesiyle ters orantılıdır (F ∝ 1/r²). Yaklaştıkça kuvvet patlayarak artar!"
        },
        {
            id: "e2", description: "İtme Kuvveti", hint: "İki yükü de aynı işaretli yap (İkisi de Pozitif veya Negatif).", isCompleted: false,
            explanation: "Zıt yükler çeker, aynı yükler iter. Elektrik alan çizgileri artık birbirini büküyor, birleşmiyor."
        },
        {
            id: "e3", description: "Süper Güç", hint: "Mesafeyi 1m yap ve yüklerden birini -1C veya +1C'den farklı bir değere (örn. +2C değil ama şimdilik sabit) değiştir... Şaka, sadece mesafeyi 1.5m altına düşür ve kuvveti hisset.", isCompleted: false,
            explanation: "Mesafeyi azalttığında kuvvetin ne kadar hızlı büyüdüğüne dikkat et. Elektroniğin temeli budur!"
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

    // Check Tasks
    useEffect(() => {
        if (currentTaskIndex === 0 && !tasks[0].isCompleted) {
            if (distanceM < 2.0) completeTask(0);
        }
        if (currentTaskIndex === 1 && !tasks[1].isCompleted) {
            if (charge1.q * charge2.q > 0) completeTask(1);
        }
        if (currentTaskIndex === 2 && !tasks[2].isCompleted) {
            if (distanceM < 1.5) completeTask(2);
        }
    }, [distanceM, charge1.q, charge2.q, currentTaskIndex, tasks, completeTask]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !containerRef.current) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const draw = () => {
            // Resize handling
            if (containerRef.current && (canvas.width !== containerRef.current.clientWidth || canvas.height !== containerRef.current.clientHeight)) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }

            const width = canvas.width;
            const height = canvas.height;

            // Clear (#09090b)
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, width, height);

            // Grid Pattern
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }

            // Field lines (simple arrows)
            if (showField) {
                const gridSize = 40;
                for (let x = gridSize; x < width; x += gridSize) {
                    for (let y = gridSize; y < height; y += gridSize) {
                        // Skip near charges
                        const d1 = Math.sqrt((x - charge1.x) ** 2 + (y - charge1.y) ** 2);
                        const d2 = Math.sqrt((x - charge2.x) ** 2 + (y - charge2.y) ** 2);
                        if (d1 < 40 || d2 < 40) continue;

                        // Calculate field from both charges
                        let ex = 0, ey = 0;

                        // From charge 1
                        const dx1 = x - charge1.x;
                        const dy1 = y - charge1.y;
                        const r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
                        const e1 = 1000 * Math.abs(charge1.q) / (r1 * r1);
                        const dir1 = charge1.q > 0 ? 1 : -1;
                        ex += dir1 * e1 * dx1 / r1;
                        ey += dir1 * e1 * dy1 / r1;

                        // From charge 2
                        const dx2 = x - charge2.x;
                        const dy2 = y - charge2.y;
                        const r2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                        const e2 = 1000 * Math.abs(charge2.q) / (r2 * r2);
                        const dir2 = charge2.q > 0 ? 1 : -1;
                        ex += dir2 * e2 * dx2 / r2;
                        ey += dir2 * e2 * dy2 / r2;

                        const mag = Math.sqrt(ex * ex + ey * ey);
                        if (mag < 1) continue;

                        const len = Math.min(20, mag * 2);
                        const nx = ex / mag;
                        const ny = ey / mag;

                        ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(0.6, mag * 0.2)})`; // Blueish field
                        if (charge1.q > 0 || charge2.q > 0) ctx.strokeStyle = `rgba(239, 68, 68, ${Math.min(0.6, mag * 0.2)})`; // Reddish if positive involved? 
                        // Let's stick to electric blue/purple theme
                        ctx.strokeStyle = `rgba(168, 85, 247, ${Math.min(0.5, mag * 0.3)})`;

                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + nx * len, y + ny * len);
                        ctx.stroke();

                        // Arrow head
                        ctx.beginPath();
                        ctx.arc(x + nx * len, y + ny * len, 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            // Force line between charges
            ctx.strokeStyle = forceType === "Çekme" ? "#4ADE80" : "#EF4444";
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();
            ctx.moveTo(charge1.x, charge1.y);
            ctx.lineTo(charge2.x, charge2.y);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw charges
            const drawCharge = (x: number, y: number, q: number) => {
                ctx.save();
                ctx.translate(x, y);
                // Glow
                const color = q > 0 ? "#EF4444" : "#3B82F6";
                ctx.shadowColor = color;
                ctx.shadowBlur = 30;

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(0, 0, 20, 0, Math.PI * 2);
                ctx.fill();

                // Ring
                ctx.strokeStyle = "white";
                ctx.lineWidth = 2;
                ctx.stroke();

                // Symbol
                ctx.fillStyle = "white";
                ctx.font = "bold 20px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(q > 0 ? "+" : "-", 0, 1);

                ctx.restore();
            };

            drawCharge(charge1.x, charge1.y, charge1.q);
            drawCharge(charge2.x, charge2.y, charge2.q);

            // Distance label
            ctx.fillStyle = "#A1A1AA";
            ctx.font = "bold 12px monospace";
            ctx.textAlign = "center";
            ctx.fillText(`r = ${distanceM.toFixed(2)}m`, (charge1.x + charge2.x) / 2, (charge1.y + charge2.y) / 2 - 20);

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [charge1, charge2, showField, distanceM, forceType]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const d1 = Math.sqrt((x - charge1.x) ** 2 + (y - charge1.y) ** 2);
        const d2 = Math.sqrt((x - charge2.x) ** 2 + (y - charge2.y) ** 2);

        if (d1 < 30) draggingRef.current = 1;
        else if (d2 < 30) draggingRef.current = 2;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (draggingRef.current === null) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = Math.max(30, Math.min(canvasRef.current!.width - 30, e.clientX - rect.left));
        const y = Math.max(30, Math.min(canvasRef.current!.height - 30, e.clientY - rect.top));

        if (draggingRef.current === 1) setCharge1({ ...charge1, x, y });
        else if (draggingRef.current === 2) setCharge2({ ...charge2, x, y });
    };

    const handleMouseUp = () => {
        draggingRef.current = null;
    };

    const resetSim = () => {
        setCharge1({ x: 150, y: 150, q: 1 });
        setCharge2({ x: 300, y: 150, q: -1 });
        setShowField(true);
    };

    return (
        <SimWrapper
            title="Elektrik Alan"
            description="Yükler arasındaki etkileşimi ve elektrik alan çizgilerini keşfet."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={
                <div className="space-y-6">
                    {/* Force Display */}
                    <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2">
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">ELEKTRİKSEL KUVVET (F)</span>
                        <div className="flex items-baseline gap-1">
                            <span className={cn("text-2xl font-mono font-black", forceType === "Çekme" ? "text-green-400" : "text-red-400")}>
                                {force.toExponential(2)}
                            </span>
                            <span className="text-zinc-500 font-bold text-xs">N</span>
                        </div>
                        <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", forceType === "Çekme" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                            {forceType}
                        </div>
                    </div>

                    {/* Charge Controls */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Charge 1 */}
                        <div className="space-y-2">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase block text-center">Yük 1 (q₁)</span>
                            <button
                                onClick={() => setCharge1({ ...charge1, q: charge1.q * -1 })}
                                className={cn(
                                    "w-full py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all shadow-md active:scale-95",
                                    charge1.q > 0 ? "bg-red-500 border-red-400 text-white shadow-red-500/20" : "bg-blue-500 border-blue-400 text-white shadow-blue-500/20"
                                )}
                            >
                                {charge1.q > 0 ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                1C
                            </button>
                        </div>
                        {/* Charge 2 */}
                        <div className="space-y-2">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase block text-center">Yük 2 (q₂)</span>
                            <button
                                onClick={() => setCharge2({ ...charge2, q: charge2.q * -1 })}
                                className={cn(
                                    "w-full py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all shadow-md active:scale-95",
                                    charge2.q > 0 ? "bg-red-500 border-red-400 text-white shadow-red-500/20" : "bg-blue-500 border-blue-400 text-white shadow-blue-500/20"
                                )}
                            >
                                {charge2.q > 0 ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                1C
                            </button>
                        </div>
                    </div>

                    {/* Field Lines Toggle */}
                    <button
                        onClick={() => setShowField(!showField)}
                        className={cn(
                            "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                            showField
                                ? "bg-purple-500/10 border-purple-500 text-purple-400"
                                : "bg-zinc-900 border-white/10 text-zinc-500 hover:bg-zinc-800"
                        )}
                    >
                        <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Alan Çizgileri
                        </span>
                        <div className={cn("w-3 h-3 rounded-full border border-current", showField && "bg-current")} />
                    </button>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                        <Magnet className="w-5 h-5 text-blue-400 shrink-0" />
                        <p className="text-[11px] text-blue-200/80 leading-relaxed font-bold">
                            Coulomb Yasası: Yükler arasındaki kuvvet, yüklerin çarpımıyla doğru, aradaki mesafenin karesiyle ters orantılıdır.
                        </p>
                    </div>
                </div>
            }
        >
            <div
                ref={containerRef}
                className="w-full h-full relative bg-[#09090b] touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={(e) => {
                    // Basic touch support map to mouse
                    const touch = e.touches[0];
                    handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as any);
                }}
                onTouchMove={(e) => {
                    const touch = e.touches[0];
                    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as any);
                }}
                onTouchEnd={handleMouseUp}
            >
                <canvas ref={canvasRef} className="block w-full h-full" />
                <div className="absolute top-4 right-4 text-[10px] text-zinc-600 font-mono pointer-events-none uppercase tracking-widest hidden sm:block">
                    ELECTRO LAB
                </div>
            </div>
        </SimWrapper>
    );
}
