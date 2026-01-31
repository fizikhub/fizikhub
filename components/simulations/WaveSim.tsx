"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WaveSimProps {
    className?: string;
}

export function WaveSim({ className = "" }: WaveSimProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [frequency, setFrequency] = useState(1);
    const [amplitude, setAmplitude] = useState(40);
    const [showSecondWave, setShowSecondWave] = useState(false);
    const [freq2, setFreq2] = useState(1.2);
    const [challenge, setChallenge] = useState(0);

    const timeRef = useRef(0);

    const wavelength = 200 / frequency;
    const beatFreq = Math.abs(frequency - freq2);

    const challenges = [
        { question: "Frekansı artırınca dalga boyuna ne olur?", hint: "f değerini 1'den 2'ye çıkar" },
        { question: "Genliği değiştir, dalga boyunu gözle!", hint: "Genlik dalga boyunu etkiler mi?" },
        { question: "İki dalga ekle ve vuru (beat) gözle!", hint: "2. dalgayı aç, frekansları farklı yap" },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;

            // Clear
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(0, 0, width, height);

            // Grid
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();

            // Wave 1 (main)
            ctx.strokeStyle = "#3B82F6";
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let x = 0; x < width; x++) {
                const y = centerY - amplitude * Math.sin((x * frequency * 0.02) - timeRef.current * frequency);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Wave 2 (optional)
            if (showSecondWave) {
                ctx.strokeStyle = "#FFC800";
                ctx.lineWidth = 3;
                ctx.beginPath();
                for (let x = 0; x < width; x++) {
                    const y = centerY - amplitude * Math.sin((x * freq2 * 0.02) - timeRef.current * freq2);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();

                // Sum wave (interference)
                ctx.strokeStyle = "#EF4444";
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = 0; x < width; x++) {
                    const y1 = amplitude * Math.sin((x * frequency * 0.02) - timeRef.current * frequency);
                    const y2 = amplitude * Math.sin((x * freq2 * 0.02) - timeRef.current * freq2);
                    const y = centerY - (y1 + y2) * 0.5;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Wavelength indicator
            ctx.strokeStyle = "#4ADE80";
            ctx.lineWidth = 2;
            const wlStart = 50;
            ctx.beginPath();
            ctx.moveTo(wlStart, centerY + 60);
            ctx.lineTo(wlStart + wavelength, centerY + 60);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(wlStart, centerY + 50);
            ctx.lineTo(wlStart, centerY + 70);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(wlStart + wavelength, centerY + 50);
            ctx.lineTo(wlStart + wavelength, centerY + 70);
            ctx.stroke();

            ctx.fillStyle = "#4ADE80";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`λ = ${wavelength.toFixed(0)} px`, wlStart + wavelength / 2, centerY + 85);

            timeRef.current += 0.05;
            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [frequency, amplitude, showSecondWave, freq2, wavelength]);

    return (
        <div className={cn("bg-neutral-900", className)}>
            {/* Challenge */}
            <div className="bg-blue-500/10 border-b-2 border-blue-500/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🎯</span>
                    <span className="text-blue-400 font-bold text-sm uppercase">Görev {challenge + 1}</span>
                </div>
                <p className="text-white text-sm font-medium">{challenges[challenge].question}</p>
                <p className="text-neutral-400 text-xs mt-1">💡 {challenges[challenge].hint}</p>
            </div>

            {/* Canvas */}
            <div className="relative">
                <canvas ref={canvasRef} width={400} height={200} className="w-full" />

                {/* Legend */}
                <div className="absolute top-2 right-2 bg-black/80 rounded-lg p-2 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-1 bg-blue-500"></div>
                        <span className="text-white">Dalga 1</span>
                    </div>
                    {showSecondWave && (
                        <>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-4 h-1 bg-yellow-400"></div>
                                <span className="text-white">Dalga 2</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-red-500"></div>
                                <span className="text-white">Toplam</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Formula Box */}
            <div className="bg-black/50 p-3 border-y border-neutral-700">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-yellow-400 font-mono text-sm">v = f × λ</p>
                        <p className="text-neutral-400 text-xs">Dalga hızı = Frekans × Dalga boyu</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white font-mono">f = <span className="text-blue-400">{frequency.toFixed(1)}</span> Hz</p>
                        <p className="text-white font-mono">λ = <span className="text-green-400">{wavelength.toFixed(0)}</span> px</p>
                        {showSecondWave && (
                            <p className="text-white font-mono text-xs">Vuru = <span className="text-red-400">{beatFreq.toFixed(2)}</span> Hz</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-bold text-sm">Frekans (f)</span>
                        <span className="text-blue-400 font-mono text-sm">{frequency.toFixed(1)} Hz</span>
                    </div>
                    <input
                        type="range" min="0.5" max="3" step="0.1" value={frequency}
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        className="w-full h-2 rounded-lg accent-blue-400"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-bold text-sm">Genlik (A)</span>
                        <span className="text-purple-400 font-mono text-sm">{amplitude}</span>
                    </div>
                    <input
                        type="range" min="10" max="60" value={amplitude}
                        onChange={(e) => setAmplitude(Number(e.target.value))}
                        className="w-full h-2 rounded-lg accent-purple-400"
                    />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showSecondWave}
                        onChange={(e) => setShowSecondWave(e.target.checked)}
                        className="w-4 h-4 accent-yellow-400"
                    />
                    <span className="text-white text-sm font-bold">2. Dalga (Girişim)</span>
                </label>

                {showSecondWave && (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-yellow-400 font-bold text-sm">Frekans 2</span>
                            <span className="text-yellow-400 font-mono text-sm">{freq2.toFixed(1)} Hz</span>
                        </div>
                        <input
                            type="range" min="0.5" max="3" step="0.1" value={freq2}
                            onChange={(e) => setFreq2(Number(e.target.value))}
                            className="w-full h-2 rounded-lg accent-yellow-400"
                        />
                    </div>
                )}

                <div className="flex gap-2">
                    {challenges.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setChallenge(i)}
                            className={cn(
                                "flex-1 py-1 text-xs font-bold border-2 border-black",
                                challenge === i ? "bg-blue-500 text-white" : "bg-neutral-800 text-neutral-400"
                            )}
                        >
                            Görev {i + 1}
                        </button>
                    ))}
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-400 text-xs">
                        ✨ <strong>Keşif:</strong> Frekans arttıkça dalga boyu kısalır!
                        Genlik değişince dalga boyu değişmez - sadece yükseklik değişir.
                    </p>
                </div>
            </div>
        </div>
    );
}
