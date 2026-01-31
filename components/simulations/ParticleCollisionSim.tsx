"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticleCollisionSimProps {
    className?: string;
}

export function ParticleCollisionSim({ className = "" }: ParticleCollisionSimProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mass1, setMass1] = useState(2);
    const [mass2, setMass2] = useState(2);
    const [isRunning, setIsRunning] = useState(false);
    const [challenge, setChallenge] = useState(0);
    const [result, setResult] = useState<{ before: number; after: number } | null>(null);

    // Particles
    const p1Ref = useRef({ x: 100, y: 150, vx: 3, vy: 0 });
    const p2Ref = useRef({ x: 300, y: 150, vx: -2, vy: 0 });

    const challenges = [
        { question: "Çarpışmadan önce ve sonra toplam momentumu karşılaştır!", hint: "p = m×v, Σp değişmemeli" },
        { question: "Kütleleri eşit yap - çarpışmadan sonra ne olur?", hint: "m₁ = m₂ = 2 kg" },
        { question: "Ağır top hafif topa çarparsa ne olur?", hint: "m₁ = 4, m₂ = 1" },
    ];

    const reset = () => {
        p1Ref.current = { x: 100, y: 150, vx: 3, vy: 0 };
        p2Ref.current = { x: 300, y: 150, vx: -2, vy: 0 };
        setIsRunning(false);
        setResult(null);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let hasCollided = false;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            const p1 = p1Ref.current;
            const p2 = p2Ref.current;

            // Calculate momentum
            const mom1 = mass1 * p1.vx;
            const mom2 = mass2 * p2.vx;
            const totalMom = mom1 + mom2;

            // Clear
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(0, 0, width, height);

            // Track line
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, 150);
            ctx.lineTo(width - 50, 150);
            ctx.stroke();

            // Physics
            if (isRunning) {
                p1.x += p1.vx;
                p2.x += p2.vx;

                // Collision detection
                const r1 = 20 + mass1 * 5;
                const r2 = 20 + mass2 * 5;
                const dist = Math.abs(p2.x - p1.x);

                if (dist < r1 + r2 && !hasCollided) {
                    hasCollided = true;
                    const beforeMom = totalMom;

                    // Elastic collision
                    const v1 = ((mass1 - mass2) * p1.vx + 2 * mass2 * p2.vx) / (mass1 + mass2);
                    const v2 = ((mass2 - mass1) * p2.vx + 2 * mass1 * p1.vx) / (mass1 + mass2);
                    p1.vx = v1;
                    p2.vx = v2;

                    // Separate
                    const overlap = (r1 + r2 - dist) / 2;
                    p1.x -= overlap + 1;
                    p2.x += overlap + 1;

                    setTimeout(() => {
                        const afterMom = mass1 * p1.vx + mass2 * p2.vx;
                        setResult({ before: beforeMom, after: afterMom });
                    }, 500);
                }

                // Wall bounce
                if (p1.x < r1 + 50) { p1.x = r1 + 50; p1.vx *= -0.8; }
                if (p1.x > width - r1 - 50) { p1.x = width - r1 - 50; p1.vx *= -0.8; }
                if (p2.x < r2 + 50) { p2.x = r2 + 50; p2.vx *= -0.8; }
                if (p2.x > width - r2 - 50) { p2.x = width - r2 - 50; p2.vx *= -0.8; }
            }

            // Draw particles
            const drawParticle = (p: typeof p1, m: number, color: string, label: string) => {
                const r = 20 + m * 5;

                ctx.fillStyle = color;
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Velocity arrow
                if (Math.abs(p.vx) > 0.1) {
                    ctx.strokeStyle = "#fff";
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + p.vx * 15, p.y);
                    ctx.stroke();

                    // Arrow head
                    ctx.fillStyle = "#fff";
                    ctx.beginPath();
                    const dir = p.vx > 0 ? 1 : -1;
                    ctx.moveTo(p.x + p.vx * 15, p.y);
                    ctx.lineTo(p.x + p.vx * 15 - dir * 8, p.y - 5);
                    ctx.lineTo(p.x + p.vx * 15 - dir * 8, p.y + 5);
                    ctx.fill();
                }

                // Label
                ctx.fillStyle = "#fff";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`${m}kg`, p.x, p.y + 5);
                ctx.fillText(label, p.x, p.y + r + 20);
            };

            drawParticle(p1, mass1, "#3B82F6", `v₁=${p1.vx.toFixed(1)}`);
            drawParticle(p2, mass2, "#EF4444", `v₂=${p2.vx.toFixed(1)}`);

            // Momentum display
            ctx.fillStyle = "#fff";
            ctx.font = "12px monospace";
            ctx.textAlign = "left";
            ctx.fillText(`p₁ = m₁v₁ = ${mass1}×${p1.vx.toFixed(1)} = ${mom1.toFixed(1)}`, 20, 30);
            ctx.fillText(`p₂ = m₂v₂ = ${mass2}×${p2.vx.toFixed(1)} = ${mom2.toFixed(1)}`, 20, 50);
            ctx.fillStyle = "#4ADE80";
            ctx.fillText(`Σp = ${totalMom.toFixed(1)} kg·m/s`, 20, 70);

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [mass1, mass2, isRunning]);

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
            <canvas ref={canvasRef} width={400} height={220} className="w-full" />

            {/* Result */}
            {result && (
                <div className="bg-green-500/20 border-y border-green-500/50 p-3">
                    <p className="text-green-400 text-sm font-bold text-center">
                        ✓ Önce: Σp = {result.before.toFixed(1)} → Sonra: Σp = {result.after.toFixed(1)}
                        {Math.abs(result.before - result.after) < 0.1 && " (Korundu! ✨)"}
                    </p>
                </div>
            )}

            {/* Formula Box */}
            <div className="bg-black/50 p-3 border-y border-neutral-700">
                <p className="text-orange-400 font-mono text-sm font-bold text-center">
                    Σp<sub>önce</sub> = Σp<sub>sonra</sub> (Momentum Korunumu)
                </p>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-blue-400 font-bold text-sm">Kütle 1</span>
                            <span className="text-blue-400 font-mono text-sm">{mass1} kg</span>
                        </div>
                        <input
                            type="range" min="1" max="5" value={mass1}
                            onChange={(e) => { setMass1(Number(e.target.value)); reset(); }}
                            className="w-full h-2 rounded-lg accent-blue-400"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-red-400 font-bold text-sm">Kütle 2</span>
                            <span className="text-red-400 font-mono text-sm">{mass2} kg</span>
                        </div>
                        <input
                            type="range" min="1" max="5" value={mass2}
                            onChange={(e) => { setMass2(Number(e.target.value)); reset(); }}
                            className="w-full h-2 rounded-lg accent-red-400"
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
                            onClick={() => { setChallenge(i); reset(); }}
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
                        ✨ <strong>Keşif:</strong> Toplam momentum (Σp) her zaman korunur!
                        Ağır cisim hafif cisme çarpınca, hafif cisim hızla fırlar.
                    </p>
                </div>
            </div>
        </div>
    );
}
