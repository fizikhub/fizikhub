"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Info, Play, Pause, RotateCcw, Activity, Waves } from "lucide-react"; // Import Waves icon
import { SimWrapper, SimTask } from "./sim-wrapper";

interface WaveSimProps {
    className?: string;
}

export function WaveSim({ className = "" }: WaveSimProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [frequency, setFrequency] = useState(1.5);
    const [amplitude, setAmplitude] = useState(40);
    const [showSecondWave, setShowSecondWave] = useState(false);
    const [freq2, setFreq2] = useState(1.8);
    const [isPlaying, setIsPlaying] = useState(true);

    const timeRef = useRef(0);

    const wavelength = 200 / frequency;

    // -- Tasks --
    const [tasks, setTasks] = useState<SimTask[]>([
        {
            id: "w1", description: "Frekans ve Dalga Boyu", hint: "Frekansı 2.5 Hz üzerine çıkar ve dalga boyunun (λ) nasıl kısaldığını gör.", isCompleted: false,
            explanation: "Ters Orantı! Frekans (sıklık) arttıkça, dalgalar sıklaşır ve dalga boyu kısalır. (v = λ * f)"
        },
        {
            id: "w2", description: "Genlik Etkisi", hint: "Genliği (A) 70'in üzerine çıkar. Dalga boyu değişiyor mu?", isCompleted: false,
            explanation: "Genlik, dalganın tepe noktasının yüksekliğidir. Enerjiyi temsil eder ama hızı veya dalga boyunu etkilemez!"
        },
        {
            id: "w3", description: "Girişim (Beat)", hint: "2. Dalgayı aktif et ve frekansları birbirine yaklaştır (Fark < 0.2 Hz).", isCompleted: false,
            explanation: "Süperpozisyon! İki dalga üst üste bindiğinde bazen birbirini güçlendirir, bazen sönümler. Buna girişim denir."
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
            if (frequency > 2.5) completeTask(0);
        }
        if (currentTaskIndex === 1 && !tasks[1].isCompleted) {
            if (amplitude > 70) completeTask(1);
        }
        if (currentTaskIndex === 2 && !tasks[2].isCompleted) {
            if (showSecondWave && Math.abs(frequency - freq2) < 0.2 && Math.abs(frequency - freq2) > 0) completeTask(2);
        }
    }, [frequency, amplitude, showSecondWave, freq2, currentTaskIndex, tasks, completeTask]);


    // -- Canvas Logic --
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

            if (!isPlaying) {
                animationId = requestAnimationFrame(draw);
                return; // still loop to catch resize
            }

            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;

            // Clear Background (#09090b matches sim wrapper default)
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, width, height);

            // Grid Pattern
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.stroke();

            // Wave 1 (Main - Green)
            ctx.strokeStyle = "#4ADE80"; // green-400
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.beginPath();
            for (let x = 0; x < width; x += 2) {
                const y = centerY - amplitude * Math.sin((x * frequency * 0.02) - timeRef.current * frequency);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Wave 2 (Optional - Yellow)
            if (showSecondWave) {
                ctx.strokeStyle = "#FACC15"; // yellow-400
                ctx.lineWidth = 4;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                for (let x = 0; x < width; x += 2) {
                    const y = centerY - amplitude * Math.sin((x * freq2 * 0.02) - timeRef.current * freq2);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.setLineDash([]);

                // Sum wave (Resultant - Red/Pink)
                ctx.strokeStyle = "#eff6ff"; // whiteish to stand out? or Red
                ctx.strokeStyle = "#F472B6"; // pink-400
                ctx.lineWidth = 3;
                ctx.beginPath();
                for (let x = 0; x < width; x += 2) {
                    const y1 = amplitude * Math.sin((x * frequency * 0.02) - timeRef.current * frequency);
                    const y2 = amplitude * Math.sin((x * freq2 * 0.02) - timeRef.current * freq2);
                    const y = centerY - (y1 + y2); // Constructive interference visual
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Wavelength indicator (λ)
            if (!showSecondWave) {
                const wlStart = width / 2 - wavelength / 2;
                ctx.strokeStyle = "rgba(255,255,255,0.5)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(wlStart, centerY + 80);
                ctx.lineTo(wlStart + wavelength, centerY + 80);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(wlStart, centerY + 70); ctx.lineTo(wlStart, centerY + 90);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(wlStart + wavelength, centerY + 70); ctx.lineTo(wlStart + wavelength, centerY + 90);
                ctx.stroke();

                ctx.fillStyle = "rgba(255,255,255,0.9)";
                ctx.font = "bold 14px monospace";
                ctx.textAlign = "center";
                ctx.fillText(`λ = ${wavelength.toFixed(0)}`, wlStart + wavelength / 2, centerY + 105);
            }

            timeRef.current += 0.05;
            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [frequency, amplitude, showSecondWave, freq2, isPlaying, wavelength]);

    const resetSim = () => {
        setFrequency(1.5);
        setAmplitude(40);
        setShowSecondWave(false);
        setFreq2(1.8);
        setIsPlaying(true);
    };

    return (
        <SimWrapper
            title="Dalga Laboratuvarı"
            description="Dalga boyu, frekans ve girişim desenlerini incele."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={
                <div className="space-y-6">
                    {/* Control 1 */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/10 group hover:border-green-500/30 transition-colors">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Frekans 1</span>
                            <span className="text-lg font-mono font-bold text-green-400">{frequency.toFixed(1)} Hz</span>
                        </div>
                        <input
                            type="range" min="0.5" max="3" step="0.1" value={frequency}
                            onChange={(e) => setFrequency(Number(e.target.value))}
                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                    </div>

                    {/* Control 2 */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/10">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Genlik (A)</span>
                            <span className="text-lg font-mono font-bold text-white">{amplitude}</span>
                        </div>
                        <input
                            type="range" min="10" max="100" value={amplitude}
                            onChange={(e) => setAmplitude(Number(e.target.value))}
                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                    </div>

                    {/* Toggle Second Wave */}
                    <button
                        onClick={() => setShowSecondWave(!showSecondWave)}
                        className={cn(
                            "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                            showSecondWave
                                ? "bg-yellow-500/10 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                                : "bg-zinc-900 border-white/10 text-zinc-500 hover:bg-zinc-800"
                        )}
                    >
                        <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                            <Waves className="w-4 h-4" /> 2. Dalga (Girişim)
                        </span>
                        <div className={cn("w-3 h-3 rounded-full border border-current", showSecondWave && "bg-current")} />
                    </button>

                    {showSecondWave && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 pt-2">
                            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/10 group hover:border-yellow-500/30 transition-colors">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Frekans 2</span>
                                <span className="text-lg font-mono font-bold text-yellow-500">{freq2.toFixed(1)} Hz</span>
                            </div>
                            <input
                                type="range" min="0.5" max="3" step="0.1" value={freq2}
                                onChange={(e) => setFreq2(Number(e.target.value))}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                            />
                        </div>
                    )}

                    {/* Play/Pause */}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={cn(
                            "w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg",
                            isPlaying
                                ? "bg-zinc-100 text-black hover:bg-white"
                                : "bg-green-600 text-white hover:bg-green-500"
                        )}
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        {isPlaying ? "DURAKLAT" : "DEVAM ET"}
                    </button>
                </div>
            }
        >
            <div ref={containerRef} className="w-full h-full relative bg-[#09090b]">
                <canvas ref={canvasRef} className="block w-full h-full touch-none" />

                {/* Legend Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-md border border-white/5 p-3 rounded-xl flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                            <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">Dalga 1</span>
                        </div>
                        {showSecondWave && (
                            <>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                                    <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">Dalga 2</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.5)]" />
                                    <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">Bileşke</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </SimWrapper>
    );
}
