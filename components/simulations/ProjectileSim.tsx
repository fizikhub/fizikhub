"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ProjectileSimProps {
    className?: string;
}

export function ProjectileSim({ className = "" }: ProjectileSimProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(50);
    const [challenge, setChallenge] = useState(0);

    // Projectile state
    const projRef = useRef<{ x: number; y: number; vx: number; vy: number; active: boolean } | null>(null);
    const trailRef = useRef<{ x: number; y: number }[]>([]);
    const [lastResult, setLastResult] = useState<{ range: number; maxHeight: number } | null>(null);

    // Physics calculations
    const g = 9.8;
    const angleRad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);
    const theoreticalRange = (velocity * velocity * Math.sin(2 * angleRad)) / g;
    const theoreticalHeight = (vy * vy) / (2 * g);

    const challenges = [
        { question: "Maksimum menzil için en iyi açıyı bul!", hint: "Farklı açıları dene (30°, 45°, 60°)" },
        { question: "50m menzil elde et!", hint: "Açı ve hızı ayarla" },
        { question: "30° ve 60° ile at, menzilleri karşılaştır!", hint: "Bu açılar 'tamamlayıcı' açılar" },
    ];

    const launch = () => {
        const groundY = 250;
        const startX = 50;
        projRef.current = {
            x: startX,
            y: groundY,
            vx: vx * 0.6,
            vy: -vy * 0.6,
            active: true
        };
        trailRef.current = [];
        setLastResult(null);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const groundY = 250;
        const startX = 50;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Clear
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(0, 0, width, height);

            // Ground
            ctx.fillStyle = "#2D5016";
            ctx.fillRect(0, groundY, width, height - groundY);

            // Distance markers
            ctx.fillStyle = "#555";
            ctx.font = "10px sans-serif";
            for (let d = 0; d <= 100; d += 20) {
                const x = startX + d * 3;
                ctx.fillText(`${d}m`, x - 10, groundY + 15);
                ctx.fillRect(x, groundY - 5, 1, 10);
            }

            // Theoretical trajectory (dashed)
            ctx.strokeStyle = "#FFC80044";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            for (let t = 0; t < 10; t += 0.1) {
                const px = startX + vx * t * 0.6;
                const py = groundY - (vy * t - 0.5 * g * t * t) * 0.6;
                if (py > groundY || px > width) break;
                if (t === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // Cannon
            ctx.save();
            ctx.translate(startX, groundY);
            ctx.rotate(-angleRad);
            ctx.fillStyle = "#666";
            ctx.fillRect(0, -8, 40, 16);
            ctx.restore();

            // Angle arc
            ctx.strokeStyle = "#FFC800";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(startX, groundY, 50, -angleRad, 0);
            ctx.stroke();

            ctx.fillStyle = "#FFC800";
            ctx.font = "bold 14px sans-serif";
            ctx.fillText(`${angle}°`, startX + 55, groundY - 10);

            // Trail
            if (trailRef.current.length > 1) {
                ctx.strokeStyle = "#FF6B6B";
                ctx.lineWidth = 3;
                ctx.beginPath();
                trailRef.current.forEach((p, i) => {
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();
            }

            // Projectile physics
            const proj = projRef.current;
            if (proj && proj.active) {
                proj.vy += g * 0.016 * 0.6;
                proj.x += proj.vx;
                proj.y += proj.vy;

                trailRef.current.push({ x: proj.x, y: proj.y });

                // Draw projectile
                ctx.fillStyle = "#FFC800";
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
                ctx.fill();

                // Hit ground
                if (proj.y >= groundY) {
                    proj.active = false;
                    const range = (proj.x - startX) / 3;
                    const maxH = Math.max(...trailRef.current.map(p => groundY - p.y)) / 0.6;
                    setLastResult({ range, maxHeight: maxH });
                }
            }

            // Result display
            if (lastResult) {
                ctx.fillStyle = "#4ADE80";
                ctx.font = "bold 14px sans-serif";
                ctx.fillText(`✓ Menzil: ${lastResult.range.toFixed(1)}m`, startX + theoreticalRange * 3 * 0.6 - 40, groundY - 20);
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [angle, velocity, vx, vy, theoreticalRange, lastResult]);

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
            <canvas ref={canvasRef} width={400} height={280} className="w-full" />

            {/* Formula Box */}
            <div className="bg-black/50 p-3 border-y border-neutral-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-yellow-400 font-mono">R = v²sin(2θ)/g</p>
                        <p className="text-white">Menzil: <span className="text-green-400 font-bold">{theoreticalRange.toFixed(1)}m</span></p>
                    </div>
                    <div>
                        <p className="text-cyan-400 font-mono">H = v²sin²θ/(2g)</p>
                        <p className="text-white">Yükseklik: <span className="text-green-400 font-bold">{theoreticalHeight.toFixed(1)}m</span></p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-bold text-sm">Açı (θ)</span>
                        <span className="text-yellow-400 font-mono text-sm">{angle}°</span>
                    </div>
                    <input
                        type="range" min="10" max="80" value={angle}
                        onChange={(e) => setAngle(Number(e.target.value))}
                        className="w-full h-2 rounded-lg accent-yellow-400"
                    />
                    <div className="flex justify-between text-neutral-500 text-xs">
                        <span>10°</span>
                        <span className="text-yellow-400">45° (max)</span>
                        <span>80°</span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-bold text-sm">Hız (v)</span>
                        <span className="text-red-400 font-mono text-sm">{velocity} m/s</span>
                    </div>
                    <input
                        type="range" min="20" max="80" value={velocity}
                        onChange={(e) => setVelocity(Number(e.target.value))}
                        className="w-full h-2 rounded-lg accent-red-400"
                    />
                </div>

                <button
                    onClick={launch}
                    className="w-full py-3 font-bold text-lg uppercase border-2 border-black bg-green-500 text-white active:bg-green-600"
                >
                    🚀 Ateşle!
                </button>

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
                        ✨ <strong>Keşif:</strong> 45° açısı maksimum menzili verir!
                        30° ve 60° aynı menzile düşer (tamamlayıcı açılar: θ + θ' = 90°).
                    </p>
                </div>
            </div>
        </div>
    );
}
