"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Target, Info, Activity, Weight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SimWrapper, SimTask } from "./sim-wrapper";
import { Simulation } from "./data";

interface SpringMassSimProps {
    className?: string;
    content?: Simulation['content'];
}

export function SpringMassSim({ className = "", content }: SpringMassSimProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [springK, setSpringK] = useState(50);
    const [mass, setMass] = useState(2);
    const [isRunning, setIsRunning] = useState(true);

    // Chart Data
    const [chartData, setChartData] = useState<{ t: number, x: number }[]>([]);
    const frameCountRef = useRef(0);
    const timeRef = useRef(0);

    // Physics state
    const posRef = useRef(60);
    const velRef = useRef(0);

    // Formulas
    const omega = Math.sqrt(springK / mass);
    const period = (2 * Math.PI) / omega;
    const frequency = 1 / period;

    // -- Tasks --
    const [tasks, setTasks] = useState<SimTask[]>([
        {
            id: "sm1", description: "Yay Sabiti ve Hız", hint: "Yay sabitini (k) 100 N/m üzerine çıkar ve salınımın nasıl hızlandığını gör.", isCompleted: false,
            explanation: "Sert yaylar (yüksek k) cismi daha hızlı geri çeker, bu da periyodu kısaltır ve frekansı artırır (f ∝ √k)."
        },
        {
            id: "sm2", description: "Kütle ve Hantallık", hint: "Kütleyi (m) 5 kg üzerine çıkar. Hareketin nasıl yavaşladığını hisset.", isCompleted: false,
            explanation: "Kütle eylemsizliktir. Kütle arttıkça cismin hızını değiştirmek zorlaşır, bu yüzden salınım yavaşlar (T ∝ √m)."
        },
        {
            id: "sm3", description: "Hedef Frekans", hint: "Yaklaşık 1.0 Hz (±0.1) frekans elde etmeye çalış. (İpucu: k=40, m=1 civarı?)", isCompleted: false,
            explanation: "Tebrikler! Doğal frekans, sistemin serbest bırakıldığında salınmak istediği frekanstır."
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
            if (springK > 100) completeTask(0);
        }
        if (currentTaskIndex === 1 && !tasks[1].isCompleted) {
            if (mass > 5) completeTask(1);
        }
        if (currentTaskIndex === 2 && !tasks[2].isCompleted) {
            if (Math.abs(frequency - 1.0) < 0.1) completeTask(2);
        }
    }, [springK, mass, frequency, currentTaskIndex, tasks, completeTask]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !containerRef.current) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const damping = 0.998;
        const restY = 80;

        const draw = () => {
            // Resize handling
            if (containerRef.current && (canvas.width !== containerRef.current.clientWidth || canvas.height !== containerRef.current.clientHeight)) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }

            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;

            // Clear with site background color (#09090b matches sim wrapper)
            ctx.fillStyle = "#09090b";
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

                // Update Time
                timeRef.current += 0.016; // Approx 60fps

                // Update Chart Data (Throttle: every 5 frames)
                frameCountRef.current++;
                if (frameCountRef.current % 5 === 0) {
                    setChartData(prev => {
                        const newData = [...prev, { t: parseFloat(timeRef.current.toFixed(1)), x: Math.round(posRef.current) }];
                        if (newData.length > 50) return newData.slice(newData.length - 50);
                        return newData;
                    });
                }
            }

            const massY = restY + 120 + posRef.current; // Lowered a bit

            // Draw ceiling
            ctx.fillStyle = "#27272a";
            ctx.fillRect(centerX - 60, 20, 120, 12);
            ctx.strokeStyle = "#52525b";
            ctx.lineWidth = 2;
            ctx.strokeRect(centerX - 60, 20, 120, 12);

            // Draw spring (zigzag)
            // Color based on tension?
            const tension = Math.abs(posRef.current);
            ctx.strokeStyle = posRef.current > 0 ? "#60A5FA" : "#F87171"; // Blue (stretch) / Red (compress)
            ctx.lineWidth = 4;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(centerX, 32);

            const coils = 12;
            const springLength = 120 + posRef.current;
            const coilH = springLength / coils;

            for (let i = 0; i < coils; i++) {
                const y = 32 + (i + 0.5) * coilH;
                const dir = i % 2 === 0 ? 1 : -1;
                ctx.lineTo(centerX + dir * 20, y);
            }
            ctx.lineTo(centerX, massY - 25);
            ctx.stroke();

            // Draw mass
            ctx.fillStyle = "#3B82F6"; // Blue-500
            ctx.strokeStyle = "#1E3A8A"; // Blue-900
            ctx.lineWidth = 3;
            // Mass Shadow
            ctx.shadowBlur = 20;
            ctx.shadowColor = "rgba(59, 130, 246, 0.3)";
            ctx.fillRect(centerX - 35, massY - 25, 70, 50);
            ctx.shadowBlur = 0;
            ctx.strokeRect(centerX - 35, massY - 25, 70, 50);

            // Mass label
            ctx.fillStyle = "#fff";
            ctx.font = "bold 14px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`${mass} kg`, centerX, massY + 5);

            // Equilibrium line
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.moveTo(centerX - 120, restY + 120);
            ctx.lineTo(centerX + 120, restY + 120);
            ctx.stroke();
            ctx.setLineDash([]);

            // Labels
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.font = "10px monospace tracking-widest";
            ctx.textAlign = "right";
            ctx.fillText("DENGE KONUMU", centerX - 130, restY + 124);

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [springK, mass, isRunning]);

    const resetSim = () => {
        setSpringK(50);
        setMass(2);
        setIsRunning(true);
        posRef.current = 60;
        velRef.current = 0;
        setChartData([]);
        timeRef.current = 0;
    };

    // Custom Chart Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900 border border-white/10 p-2 rounded-lg shadow-xl">
                    <p className="text-[10px] text-zinc-400 font-mono mb-1">{label}s</p>
                    <p className="text-xs font-bold text-blue-400">
                        Konum: {payload[0].value}px
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <SimWrapper
            title="Yay Sarkaç"
            description="Hooke Yasası ve Basit Harmonik Hareket simülasyonu."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            content={content}
            charts={
                <div className="h-[300px] w-full mt-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Zaman - Konum Grafiği</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis
                                dataKey="t"
                                stroke="#52525b"
                                tick={{ fontSize: 10 }}
                                tickFormatter={(val: any) => val + 's'}
                            />
                            <YAxis
                                stroke="#52525b"
                                tick={{ fontSize: 10 }}
                                domain={[-150, 150]}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="x"
                                stroke="#60A5FA"
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            }
            controls={
                <div className="space-y-6">
                    {/* Live Data */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Periyot (T)</span>
                            <span className="text-white font-mono text-xl font-bold">{period.toFixed(2)}s</span>
                        </div>
                        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Frekans (f)</span>
                            <span className="text-green-400 font-mono text-xl font-bold">{frequency.toFixed(2)}Hz</span>
                        </div>
                    </div>

                    {/* Spring Constant Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/10 group hover:border-blue-500/30 transition-colors">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-3 h-3" /> Yay Sabiti (k)
                            </span>
                            <span className="text-lg font-mono font-bold text-blue-400">{springK} N/m</span>
                        </div>
                        <input
                            type="range" min="20" max="150" value={springK}
                            onChange={(e) => setSpringK(Number(e.target.value))}
                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Mass Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/10 group hover:border-red-500/30 transition-colors">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <Weight className="w-3 h-3" /> Kütle (m)
                            </span>
                            <span className="text-lg font-mono font-bold text-red-400">{mass} kg</span>
                        </div>
                        <input
                            type="range" min="0.5" max="10" step="0.5" value={mass}
                            onChange={(e) => setMass(Number(e.target.value))}
                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                    </div>

                    {/* Play/Pause */}
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={cn(
                            "w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg",
                            isRunning
                                ? "bg-zinc-100 text-black hover:bg-white"
                                : "bg-green-600 text-white hover:bg-green-500"
                        )}
                    >
                        {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        {isRunning ? "DURAKLAT" : "DEVAM ET"}
                    </button>
                </div>
            }
        >
            <div ref={containerRef} className="w-full h-full relative bg-[#09090b] touch-none">
                <canvas ref={canvasRef} className="block w-full h-full" />

                {/* Overlay Info */}
                <div className="absolute top-4 right-4 text-right pointer-events-none hidden sm:block">
                    <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest mb-1">
                        SIMPLE HARMONIC MOTION
                    </div>
                    <div className="text-[10px] text-zinc-700 font-mono">
                        ω = √(k/m) = {omega.toFixed(2)} rad/s
                    </div>
                </div>
            </div>
        </SimWrapper>
    );
}

