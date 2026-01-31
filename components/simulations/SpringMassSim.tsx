"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SpringMassSimProps {
    className?: string;
}

export function SpringMassSim({ className = "" }: SpringMassSimProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [springK, setSpringK] = useState(50);
    const [mass, setMass] = useState(2);
    const [isRunning, setIsRunning] = useState(true);
    const [challenge, setChallenge] = useState(0);

    // Physics state
    const posRef = useRef(60);
    const velRef = useRef(0);

    // Formulas
    const omega = Math.sqrt(springK / mass);
    const period = (2 * Math.PI) / omega;
    const frequency = 1 / period;

    const challenges = [
        { question: "Yay sabitini artırınca frekans ne olur?", hint: "k değerini 50'den 100'e çıkar" },
        { question: "Kütleyi artırınca periyot ne olur?", hint: "m değerini 2'den 4'e çıkar" },
        { question: "1 Hz frekans elde et!", hint: "ω = √(k/m), f = ω/2π" },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const damping = 0.998;
        const restY = 80;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;

            // Clear
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(0, 0, width, height);

            // Physics (Hooke's Law)
            if (isRunning) {
                const force = -(springK / 100) * posRef.current;
                const acc = force / mass;
                velRef.current += acc;
                velRef.current *= damping;
                posRef.current += velRef.current;
            }

            const massY = restY + 80 + posRef.current;

            // Draw ceiling
            ctx.fillStyle = "#444";
            ctx.fillRect(centerX - 50, 20, 100, 15);

            // Draw spring (zigzag)
            ctx.strokeStyle = posRef.current > 0 ? "#FF6B6B" : "#4ECDC4";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX, 35);

            const coils = 8;
            const springLength = 80 + posRef.current;
            const coilH = springLength / coils;

            for (let i = 0; i < coils; i++) {
                const y = 35 + (i + 0.5) * coilH;
                const dir = i % 2 === 0 ? 1 : -1;
                ctx.lineTo(centerX + dir * 20, y);
            }
            ctx.lineTo(centerX, massY - 25);
            ctx.stroke();

            // Draw mass
            ctx.fillStyle = "#3B82F6";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 3;
            ctx.fillRect(centerX - 30, massY - 25, 60, 50);
            ctx.strokeRect(centerX - 30, massY - 25, 60, 50);

            // Mass label
            ctx.fillStyle = "#fff";
            ctx.font = "bold 14px monospace";
            ctx.textAlign = "center";
            ctx.fillText(`${mass} kg`, centerX, massY + 5);

            // Equilibrium line
            ctx.strokeStyle = "#4ADE80";
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(centerX - 60, restY + 80);
            ctx.lineTo(centerX + 60, restY + 80);
            ctx.stroke();
            ctx.setLineDash([]);

            // x label
            ctx.fillStyle = "#4ADE80";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("x = 0", centerX + 65, restY + 84);

            // Current displacement
            ctx.fillStyle = "#fff";
            ctx.font = "12px monospace";
            ctx.fillText(`x = ${(posRef.current / 100).toFixed(2)} m`, 20, 50);

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [springK, mass, isRunning]);

    const reset = () => {
        posRef.current = 60;
        velRef.current = 0;
    };

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
                <canvas ref={canvasRef} width={400} height={280} className="w-full" onClick={reset} />

                {/* Formula */}
                <div className="absolute top-4 right-4 bg-black/80 rounded-lg p-3 text-right">
                    <p className="text-cyan-400 font-mono text-xs">F = -kx (Hooke)</p>
                    <p className="text-yellow-400 font-mono text-sm font-bold mt-1">ω = √(k/m)</p>
                    <p className="text-white font-mono text-lg">
                        f = <span className="text-green-400">{frequency.toFixed(2)}</span> Hz
                    </p>
                    <p className="text-white font-mono text-sm">
                        T = <span className="text-green-400">{period.toFixed(2)}</span> s
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-white font-bold text-sm">Yay Sabiti (k)</span>
                            <span className="text-cyan-400 font-mono text-sm">{springK} N/m</span>
                        </div>
                        <input
                            type="range" min="20" max="150" value={springK}
                            onChange={(e) => setSpringK(Number(e.target.value))}
                            className="w-full h-2 rounded-lg accent-cyan-400"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-white font-bold text-sm">Kütle (m)</span>
                            <span className="text-blue-400 font-mono text-sm">{mass} kg</span>
                        </div>
                        <input
                            type="range" min="1" max="5" step="0.5" value={mass}
                            onChange={(e) => setMass(Number(e.target.value))}
                            className="w-full h-2 rounded-lg accent-blue-400"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={cn(
                            "flex-1 py-2 font-bold text-sm border-2 border-black",
                            isRunning ? "bg-red-500 text-white" : "bg-green-500 text-white"
                        )}
                    >
                        {isRunning ? "Durdur" : "Başlat"}
                    </button>
                    <button onClick={reset} className="flex-1 py-2 font-bold text-sm border-2 border-black bg-neutral-700 text-white">
                        Sıfırla
                    </button>
                </div>

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
                        ✨ <strong>Keşif:</strong> k artınca → frekans artar (daha hızlı salınım).
                        m artınca → frekans azalır (daha yavaş).
                    </p>
                </div>
            </div>
        </div>
    );
}
