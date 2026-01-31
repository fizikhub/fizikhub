"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PendulumSimProps {
    className?: string;
}

export function PendulumSim({ className = "" }: PendulumSimProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [length, setLength] = useState(150);
    const [isRunning, setIsRunning] = useState(true);
    const [challenge, setChallenge] = useState(0);

    // Physics state
    const angleRef = useRef(Math.PI / 6);
    const velocityRef = useRef(0);

    // Calculated period
    const g = 9.8;
    const period = 2 * Math.PI * Math.sqrt(length / 100 / g);

    const challenges = [
        { question: "Sarkacın uzunluğunu artırınca periyot ne olur?", hint: "Uzunluğu 150'den 250'ye çıkar" },
        { question: "Periyodu 1 saniyeye yaklaştır!", hint: "T = 2π√(L/g) formülünü kullan" },
        { question: "En düşük periyodu bul!", hint: "Uzunluğu azalt" },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const damping = 0.999;
        const gravity = 0.4;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            const originX = width / 2;
            const originY = 40;

            // Clear
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(0, 0, width, height);

            // Physics
            if (isRunning) {
                const acceleration = (-gravity / length) * Math.sin(angleRef.current);
                velocityRef.current += acceleration;
                velocityRef.current *= damping;
                angleRef.current += velocityRef.current;
            }

            // Bob position
            const bobX = originX + length * Math.sin(angleRef.current);
            const bobY = originY + length * Math.cos(angleRef.current);

            // Draw string
            ctx.strokeStyle = "#888";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(bobX, bobY);
            ctx.stroke();

            // Draw pivot
            ctx.fillStyle = "#3B82F6";
            ctx.beginPath();
            ctx.arc(originX, originY, 8, 0, Math.PI * 2);
            ctx.fill();

            // Draw bob
            ctx.fillStyle = "#FFC800";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [length, isRunning]);

    const resetPendulum = () => {
        angleRef.current = Math.PI / 6;
        velocityRef.current = 0;
    };

    return (
        <div className={cn("bg-neutral-900", className)}>
            {/* Challenge Card */}
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
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={280}
                    className="w-full"
                    onClick={resetPendulum}
                />

                {/* Live Formula */}
                <div className="absolute top-4 left-4 bg-black/80 rounded-lg p-3">
                    <p className="text-yellow-400 font-mono text-sm font-bold">T = 2π√(L/g)</p>
                    <p className="text-white font-mono text-lg mt-1">
                        T = <span className="text-green-400">{period.toFixed(2)}</span> saniye
                    </p>
                </div>
            </div>

            {/* Simple Control */}
            <div className="p-4 space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold">Uzunluk (L)</span>
                        <span className="text-yellow-400 font-mono font-bold">{(length / 100).toFixed(2)} m</span>
                    </div>
                    <input
                        type="range"
                        min="50"
                        max="250"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                    <div className="flex justify-between text-neutral-500 text-xs mt-1">
                        <span>Kısa</span>
                        <span>Uzun</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={cn(
                            "flex-1 py-2 font-bold text-sm uppercase border-2 border-black",
                            isRunning
                                ? "bg-red-500 text-white"
                                : "bg-green-500 text-white"
                        )}
                    >
                        {isRunning ? "Durdur" : "Başlat"}
                    </button>
                    <button
                        onClick={resetPendulum}
                        className="flex-1 py-2 font-bold text-sm uppercase border-2 border-black bg-neutral-700 text-white"
                    >
                        Sıfırla
                    </button>
                </div>

                {/* Challenge Navigation */}
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

                {/* Key Insight */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-400 text-xs">
                        ✨ <strong>Önemli:</strong> Periyot sadece uzunluk ve yerçekimine bağlıdır.
                        Kütle periyodu etkilemez!
                    </p>
                </div>
            </div>
        </div>
    );
}
