"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ElectricFieldSimProps {
    className?: string;
}

export function ElectricFieldSim({ className = "" }: ElectricFieldSimProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [charge1, setCharge1] = useState({ x: 150, y: 150, q: 1 });
    const [charge2, setCharge2] = useState({ x: 300, y: 150, q: -1 });
    const [showField, setShowField] = useState(true);
    const [challenge, setChallenge] = useState(0);

    const draggingRef = useRef<number | null>(null);

    // Distance and force
    const dx = charge2.x - charge1.x;
    const dy = charge2.y - charge1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const distanceM = distance / 50; // 50px = 1m
    const k = 8.99e9;
    const force = (k * Math.abs(charge1.q * charge2.q)) / (distanceM * distanceM);
    const forceType = charge1.q * charge2.q > 0 ? "İtme" : "Çekme";

    const challenges = [
        { question: "Yükleri birbirine yaklaştırınca kuvvet ne olur?", hint: "Mesafeyi yarıya indir" },
        { question: "Aynı işaretli iki yük koy - ne olur?", hint: "Her iki yükü de pozitif yap" },
        { question: "Kuvveti 4 kat artır!", hint: "F ∝ 1/r² - mesafeyi yarıya indir" },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Clear
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(0, 0, width, height);

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

                        const len = Math.min(15, mag * 2);
                        const nx = ex / mag;
                        const ny = ey / mag;

                        ctx.strokeStyle = `rgba(255, 200, 0, ${Math.min(0.8, mag * 0.3)})`;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + nx * len, y + ny * len);
                        ctx.stroke();
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
                ctx.fillStyle = q > 0 ? "#EF4444" : "#3B82F6";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(x, y, 25, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // +/- symbol
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(x - 10, y);
                ctx.lineTo(x + 10, y);
                ctx.stroke();
                if (q > 0) {
                    ctx.beginPath();
                    ctx.moveTo(x, y - 10);
                    ctx.lineTo(x, y + 10);
                    ctx.stroke();
                }

                // Label
                ctx.fillStyle = "#fff";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(q > 0 ? "+1C" : "-1C", x, y + 45);
            };

            drawCharge(charge1.x, charge1.y, charge1.q);
            drawCharge(charge2.x, charge2.y, charge2.q);

            // Distance label
            ctx.fillStyle = "#888";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`r = ${distanceM.toFixed(2)}m`, (charge1.x + charge2.x) / 2, (charge1.y + charge2.y) / 2 - 15);
        };

        draw();
    }, [charge1, charge2, showField, distanceM, forceType]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const d1 = Math.sqrt((x - charge1.x) ** 2 + (y - charge1.y) ** 2);
        const d2 = Math.sqrt((x - charge2.x) ** 2 + (y - charge2.y) ** 2);

        if (d1 < 30) draggingRef.current = 1;
        else if (d2 < 30) draggingRef.current = 2;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
            <canvas
                ref={canvasRef}
                width={400}
                height={260}
                className="w-full cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />

            {/* Formula Box */}
            <div className="bg-black/50 p-3 border-y border-neutral-700">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-purple-400 font-mono text-sm font-bold">F = k·|q₁·q₂|/r²</p>
                        <p className="text-neutral-400 text-xs">k = 8.99×10⁹ N·m²/C²</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white font-mono">
                            F = <span className={forceType === "Çekme" ? "text-green-400" : "text-red-400"}>{force.toExponential(2)}</span> N
                        </p>
                        <p className={cn("text-sm font-bold", forceType === "Çekme" ? "text-green-400" : "text-red-400")}>
                            ({forceType})
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3">
                <div className="flex gap-4">
                    <button
                        onClick={() => setCharge1({ ...charge1, q: charge1.q > 0 ? -1 : 1 })}
                        className={cn(
                            "flex-1 py-2 font-bold text-sm border-2 border-black",
                            charge1.q > 0 ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                        )}
                    >
                        Yük 1: {charge1.q > 0 ? "+1C" : "-1C"}
                    </button>
                    <button
                        onClick={() => setCharge2({ ...charge2, q: charge2.q > 0 ? -1 : 1 })}
                        className={cn(
                            "flex-1 py-2 font-bold text-sm border-2 border-black",
                            charge2.q > 0 ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                        )}
                    >
                        Yük 2: {charge2.q > 0 ? "+1C" : "-1C"}
                    </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showField}
                        onChange={(e) => setShowField(e.target.checked)}
                        className="w-4 h-4 accent-yellow-400"
                    />
                    <span className="text-white text-sm font-bold">Alan Çizgileri</span>
                </label>

                <p className="text-neutral-400 text-xs text-center">💡 Yükleri sürükleyerek hareket ettir</p>

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
                        ✨ <strong>Keşif:</strong> Aynı işaretli yükler iter, zıt işaretliler çeker!
                        Mesafe yarıya inince kuvvet 4 katına çıkar (F ∝ 1/r²).
                    </p>
                </div>
            </div>
        </div>
    );
}
