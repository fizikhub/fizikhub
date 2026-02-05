"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Info, Play, Pause, RotateCcw, Activity } from "lucide-react";

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
    const [challenge, setChallenge] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const timeRef = useRef(0);

    const wavelength = 200 / frequency;
    const beatFreq = Math.abs(frequency - freq2);

    const challenges = [
        { question: "Frekansı artırınca dalga boyuna ne olur?", hint: "Frekansı 1.0'dan 2.5'e çıkar ve λ değerini gözle." },
        { question: "Genliği değiştir, dalga boyunu gözle!", hint: "Genlik arttıkça dalga boyu değişir mi?" },
        { question: "İki dalga ekle ve vuru (beat) gözle!", hint: "2. dalgayı aç, frekansları birbirine yaklaştır." },
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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const draw = () => {
            if (!isPlaying) {
                animationId = requestAnimationFrame(draw);
                return;
            }

            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;

            // Clear Background
            ctx.fillStyle = "#121214";
            ctx.fillRect(0, 0, width, height);

            // Grid Pattern
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();

            // Wave 1 (Main - Matte Emerald)
            ctx.strokeStyle = "#41D375";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.beginPath();
            for (let x = 0; x < width; x += 2) {
                const y = centerY - amplitude * Math.sin((x * frequency * 0.02) - timeRef.current * frequency);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Wave 2 (Optional - Soft Gold)
            if (showSecondWave) {
                ctx.strokeStyle = "#FFD700";
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

                // Sum wave (Resultant - Vibrant Red)
                ctx.strokeStyle = "#FF5757";
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = 0; x < width; x += 2) {
                    const y1 = amplitude * Math.sin((x * frequency * 0.02) - timeRef.current * frequency);
                    const y2 = amplitude * Math.sin((x * freq2 * 0.02) - timeRef.current * freq2);
                    const y = centerY - (y1 + y2) * 0.5;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Wavelength indicator (λ)
            if (!showSecondWave) {
                const wlStart = width / 4;
                ctx.strokeStyle = "rgba(255,255,255,0.4)";
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

                ctx.fillStyle = "rgba(255,255,255,0.8)";
                ctx.font = "bold 12px monospace";
                ctx.textAlign = "center";
                ctx.fillText(`λ = ${wavelength.toFixed(1)}m`, wlStart + wavelength / 2, centerY + 105);
            }

            timeRef.current += 0.05;
            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [frequency, amplitude, showSecondWave, freq2, isPlaying, wavelength]);

    return (
        <div ref={containerRef} className={cn("bg-background min-h-screen flex flex-col font-[family-name:var(--font-outfit)]", className)}>
            {/* Header / Mission Area */}
            <div className="bg-[#41D375]/10 border-b border-white/5 p-4 sm:p-6">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#41D375] flex items-center justify-center text-black border border-black shadow-[2px_2px_0px_#000]">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-[#41D375] font-black text-xs uppercase tracking-[0.2em]">WAVE LAB</span>
                        </div>
                        <h2 className="text-white text-base sm:text-lg font-black tracking-tight uppercase italic">{challenges[challenge].question}</h2>
                        <div className="flex items-center gap-1.5 mt-2">
                            <Info className="w-3 h-3 text-zinc-500" />
                            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{challenges[challenge].hint}</p>
                        </div>
                    </div>
                    <div className="bg-zinc-900 border border-white/10 p-3 rounded-2xl flex items-center gap-6">
                        <div>
                            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest block">FREKANS (f)</span>
                            <span className="text-[#41D375] font-mono text-xl font-black">{frequency.toFixed(2)}Hz</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest block">λ BOYU</span>
                            <span className="text-white font-mono text-xl font-black">{wavelength.toFixed(0)}m</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Canvas Area */}
                <div className="lg:col-span-8 relative bg-[#121214] border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden">
                    <canvas ref={canvasRef} className="w-full h-full object-contain" />

                    {/* Legend Overlay */}
                    <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl flex flex-col gap-2 min-w-[120px]">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#41D375]" />
                                <span className="text-[10px] text-white font-bold uppercase tracking-tighter">Dalga 1</span>
                            </div>
                            {showSecondWave && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#FFD700] border border-white/20" />
                                        <span className="text-[10px] text-white font-bold uppercase tracking-tighter">Dalga 2</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#FF5757]" />
                                        <span className="text-[10px] text-white font-bold uppercase tracking-tighter">Bileşke</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls Sidebar */}
                <div className="lg:col-span-4 p-6 sm:p-8 space-y-8 bg-background">
                    <div className="space-y-6">
                        {/* Control 1 */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                <span className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Frekans 1</span>
                                <span className="text-[#41D375] font-mono text-sm font-black">{frequency.toFixed(1)} Hz</span>
                            </div>
                            <input
                                type="range" min="0.5" max="3" step="0.1" value={frequency}
                                onChange={(e) => setFrequency(Number(e.target.value))}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#41D375]"
                            />
                        </div>

                        {/* Control 2 */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                <span className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Genlik (A)</span>
                                <span className="text-white font-mono text-sm font-black">{amplitude}</span>
                            </div>
                            <input
                                type="range" min="10" max="80" value={amplitude}
                                onChange={(e) => setAmplitude(Number(e.target.value))}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                            />
                        </div>

                        {/* Toggle Second Wave */}
                        <button
                            onClick={() => setShowSecondWave(!showSecondWave)}
                            className={cn(
                                "w-full p-4 rounded-xl border-2 border-black flex items-center justify-between transition-all",
                                showSecondWave ? "bg-[#FFD700] text-black shadow-[4px_4px_0px_#000]" : "bg-zinc-900 text-zinc-500 border-zinc-800"
                            )}
                        >
                            <span className="font-black text-xs uppercase tracking-widest">2. Dalga (Girişim)</span>
                            <div className={cn("w-4 h-4 rounded-full border-2 border-current", showSecondWave && "bg-black")} />
                        </button>

                        {showSecondWave && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                    <span className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Frekans 2</span>
                                    <span className="text-[#FFD700] font-mono text-sm font-black">{freq2.toFixed(1)} Hz</span>
                                </div>
                                <input
                                    type="range" min="0.5" max="3" step="0.1" value={freq2}
                                    onChange={(e) => setFreq2(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                                />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={cn(
                                "h-16 rounded-2xl border-2 border-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[4px_4px_0px_#000]",
                                isPlaying ? "bg-zinc-100 text-black" : "bg-green-500 text-white"
                            )}
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            <span className="font-black text-base uppercase tracking-widest">{isPlaying ? "DURAKLAT" : "DEVAM ET"}</span>
                        </button>

                        <div className="grid grid-cols-4 gap-2">
                            <button
                                onClick={() => { setFrequency(1.5); setAmplitude(40); setShowSecondWave(false); setIsPlaying(true); }}
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
                                        challenge === i ? "bg-[#41D375] text-black" : "bg-zinc-900 text-zinc-500 border-zinc-800 shadow-none hover:bg-zinc-800"
                                    )}
                                >
                                    #{i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#41D375]/5 border border-[#41D375]/10 rounded-2xl p-5 flex gap-3">
                        <div className="w-1.5 h-auto bg-[#41D375] rounded-full" />
                        <p className="text-zinc-500 text-[11px] leading-relaxed font-bold uppercase tracking-tight">
                            Girişim, iki dalganın süperpozisyon ilkesine göre birbirini güçlendirmesi (yapıcı) veya sönümlemesidir (yıkıcı).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
