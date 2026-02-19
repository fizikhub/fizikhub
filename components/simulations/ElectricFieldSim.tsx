"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { Play, Pause, RotateCcw, PlusCircle, MinusCircle, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ChargeType = {
    id: string;
    q: number; // +1 or -1
    x: number;
    y: number;
};

export function ElectricFieldSim({ simData }: { simData: any }) {
    // -------------------------------------------------------------
    // 1. STATE
    // -------------------------------------------------------------
    const canvasWidth = 800;
    const canvasHeight = 600;

    const [charges, setCharges] = useState<ChargeType[]>([
        { id: "c1", q: 1, x: canvasWidth / 2 - 100, y: canvasHeight / 2 },
        { id: "c2", q: -1, x: canvasWidth / 2 + 100, y: canvasHeight / 2 }
    ]);

    const [draggingId, setDraggingId] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const [showGrid, setShowGrid] = useState(true);

    // -------------------------------------------------------------
    // 2. VECTOR FIELD CALCULATIONS
    // -------------------------------------------------------------
    const k = 5000; // Visual scaling constant
    const gridSpacing = 40;

    // Memoize the vector field so it doesn't recalculate on every tiny render unless charges change
    const vectorField = useMemo(() => {
        const vectors = [];
        if (!showGrid || charges.length === 0) return [];

        for (let x = gridSpacing / 2; x < canvasWidth; x += gridSpacing) {
            for (let y = gridSpacing / 2; y < canvasHeight; y += gridSpacing) {
                let Ex = 0;
                let Ey = 0;

                let isVeryClose = false;

                for (const charge of charges) {
                    const dx = x - charge.x;
                    const dy = y - charge.y;
                    const rSq = dx * dx + dy * dy;
                    const r = Math.sqrt(rSq);

                    if (r < 20) {
                        isVeryClose = true;
                        break;
                    }

                    const E_mag = (k * charge.q) / rSq;
                    Ex += E_mag * (dx / r);
                    Ey += E_mag * (dy / r);
                }

                if (isVeryClose) continue; // Don't draw vectors inside/too close to the charge itself

                const E_total = Math.sqrt(Ex * Ex + Ey * Ey);
                if (E_total < 0.01) continue;

                // Normalize for fixed arrow length, but scale opacity by magnitude
                const arrowLen = 15;
                const normEx = (Ex / E_total) * arrowLen;
                const normEy = (Ey / E_total) * arrowLen;

                // Opacity mapping (logarithmic feel)
                const opacity = Math.min(1, E_total * 2);

                // Color mapping: + is red-ish, - is blue-ish
                const hue = E_total > 0 ? (Ex > 0 ? 0 : 220) : 0; // Simplified colors. We can use a unified color for the field.

                vectors.push({ x, y, dx: normEx, dy: normEy, opacity });
            }
        }
        return vectors;
    }, [charges, showGrid]);

    // -------------------------------------------------------------
    // 3. EVENT HANDLERS
    // -------------------------------------------------------------
    const getPointFromEvent = (e: React.PointerEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const CTM = svgRef.current.getScreenCTM();
        if (!CTM) return { x: 0, y: 0 };
        return {
            x: (e.clientX - CTM.e) / CTM.a,
            y: (e.clientY - CTM.f) / CTM.d
        };
    };

    const handlePointerDown = (e: React.PointerEvent, id: string) => {
        e.stopPropagation();
        (e.target as Element).setPointerCapture(e.pointerId);
        setDraggingId(id);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!draggingId) return;
        const pt = getPointFromEvent(e);
        // Clamp to canvas
        const x = Math.max(20, Math.min(canvasWidth - 20, pt.x));
        const y = Math.max(20, Math.min(canvasHeight - 20, pt.y));

        setCharges(prev => prev.map(c => c.id === draggingId ? { ...c, x, y } : c));
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (draggingId) {
            (e.target as Element).releasePointerCapture(e.pointerId);
            setDraggingId(null);
        }
    };

    const addCharge = (q: number) => {
        setCharges(prev => [
            ...prev,
            {
                id: `c-${Date.now()}`,
                q,
                x: canvasWidth / 2 + (Math.random() * 100 - 50),
                y: canvasHeight / 2 + (Math.random() * 100 - 50)
            }
        ]);
    };

    const clearCharges = () => setCharges([]);

    // -------------------------------------------------------------
    // 4. MISSIONS
    // -------------------------------------------------------------
    const [missions, setMissions] = useState([
        {
            id: 1,
            title: "Dipol Yaratımı",
            desc: "Ekrana sadece bir (+) ve bir (-) yük ekle.",
            isCompleted: false,
            condition: () => charges.length === 2 && charges.some(c => c.q > 0) && charges.some(c => c.q < 0),
            successText: "Harika! Elektrik alan çizgilerinin (+)'dan çıkıp (-)'ye girdiğini görüyorsun. Bu yapının adı Dipol'dür."
        },
        {
            id: 2,
            title: "Ortadaki Sıfır Noktası",
            desc: "Ekrana iki TANE (+) yük veya iki TANE (-) yük koy (sadece 2 aynı cins yük olsun).",
            isCompleted: false,
            condition: () => charges.length === 2 && ((charges[0].q > 0 && charges[1].q > 0) || (charges[0].q < 0 && charges[1].q < 0)),
            successText: "Mükemmel! İki aynı cins yük birbirini iter ve alan tam orta noktalarında sıfırlanır (Boşluk bölgesi oluşur)."
        },
        {
            id: 3,
            title: "Sonsuzluğa Doğru",
            desc: "Ekranda sadece 1 tane yük bırak.",
            isCompleted: false,
            condition: () => charges.length === 1,
            successText: "Tek bir noktasal yükün elektrik alanı, yük (+) ise sonsuza doğru, (-) ise sonsuzdan yüke doğru düz çigiler (radyal) halindedir."
        }
    ]);

    useEffect(() => {
        setMissions(prev => prev.map(m => {
            if (!m.isCompleted && m.condition()) {
                return { ...m, isCompleted: true };
            }
            return m;
        }));
    }, [charges]);

    // -------------------------------------------------------------
    // 5. UI COMPONENTS
    // -------------------------------------------------------------
    const Controls = (
        <div className="flex flex-col gap-6">
            <div className="flex gap-2 mb-2 p-2 bg-zinc-900/80 rounded-xl border border-white/5">
                <button
                    onClick={() => addCharge(1)}
                    className="flex-1 flex flex-col items-center justify-center gap-1 bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] py-3 rounded-lg transition-colors active:scale-95"
                >
                    <PlusCircle className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">(+) YÜK EKLE</span>
                </button>
                <button
                    onClick={() => addCharge(-1)}
                    className="flex-1 flex flex-col items-center justify-center gap-1 bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#3B82F6] py-3 rounded-lg transition-colors active:scale-95"
                >
                    <MinusCircle className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">(-) YÜK EKLE</span>
                </button>
            </div>

            <div className="space-y-3">
                <button
                    onClick={clearCharges}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl border border-red-500/10 transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-wider text-xs">Tüm Yükleri Temizle</span>
                </button>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setShowGrid(!showGrid)}>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Vektör Alanı (SVG)</span>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${showGrid ? 'bg-[#38BDF8]' : 'bg-zinc-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${showGrid ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                </div>
            </div>

            {/* Live Data Dashboard */}
            <div className="mt-4 p-4 rounded-xl border border-[#4ADE80]/20 bg-[#4ADE80]/5">
                <p className="text-xs text-[#4ADE80] font-bold text-center uppercase tracking-widest mb-1">Aktif Yük Sayısı</p>
                <p className="text-3xl font-black text-center text-white">{charges.length}</p>
                <p className="text-[10px] text-zinc-400 text-center mt-2">Yükleri fare ile tutup sürükleyebilirsiniz.</p>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-white italic">ELEKTRİK ALAN VEYA UZAYIN BÜKÜLMESİ</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                Elektrik yükleri, etraflarındaki uzayın elektriksel özelliklerini değiştirir. Buna <strong>Elektrik Alanı (E)</strong> denir.
            </p>

            <div className="grid gap-4 mt-4">
                <div className="p-4 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/30 shadow-[0_0_20px_rgba(74,222,128,0.1)] text-center">
                    <span className="text-xs text-[#4ADE80] uppercase font-black block mb-2">Elektrik Alan Şiddeti</span>
                    <p className="text-2xl font-mono text-[#4ADE80]">E = k·q / r²</p>
                </div>

                <ul className="space-y-2 mt-2 text-sm text-zinc-300">
                    <li>• Elektrik alan vektörel bir büyüklüktür.</li>
                    <li>• Çizgiler HER ZAMAN <strong>(+)</strong> yükten çıkar, <strong>(-)</strong> yüke girer.</li>
                    <li>• Alan çizgilerinin sık olduğu yerlerde elektrik alan daha güçlüdür. (r azaldıkça E artar).</li>
                    <li>• Asla birbirlerini kesmezler.</li>
                </ul>
            </div>
        </div>
    );

    const Missions = (
        <div className="space-y-4">
            {missions.map((m) => (
                <div
                    key={m.id}
                    className={`relative p-4 rounded-2xl border transition-all duration-500 overflow-hidden ${m.isCompleted
                            ? "bg-[#4ADE80]/10 border-[#4ADE80]/30"
                            : "bg-black/20 border-white/10"
                        }`}
                >
                    {m.isCompleted && (
                        <div className="absolute top-4 right-4 text-[#4ADE80]">
                            <CheckCircle2 className="w-5 h-5 shadow-inner" />
                        </div>
                    )}
                    <h3 className={`font-black uppercase tracking-tight mb-2 ${m.isCompleted ? 'text-[#4ADE80]' : 'text-white'}`}>
                        {m.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4">{m.desc}</p>

                    <AnimatePresence>
                        {m.isCompleted && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="pt-3 mt-3 border-t border-[#4ADE80]/20 text-xs text-[#4ADE80] font-medium leading-relaxed"
                            >
                                {m.successText}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );

    return (
        <SimulationLayout
            title={simData?.title || "Elektrik Alan ve Yükler"}
            color={simData?.color || "#4ADE80"}
            controlsArea={Controls}
            theoryArea={Theory}
            missionsArea={Missions}
        >
            <div className="w-full h-full p-0 relative flex items-center justify-center">
                <svg
                    ref={svgRef}
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                    preserveAspectRatio="xMidYMid slice"
                    className="origin-center touch-none cursor-crosshair"
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    {/* Vector Field */}
                    {showGrid && vectorField.map((v, i) => (
                        <g key={`v-${i}`} transform={`translate(${v.x}, ${v.y})`}>
                            <line
                                x1="0" y1="0"
                                x2={v.dx} y2={v.dy}
                                stroke="rgba(255,255,255,1)"
                                strokeWidth="1.5"
                                opacity={v.opacity * 0.6}
                            />
                            {/* Arrowhead */}
                            <polygon
                                points={`${v.dx},${v.dy} ${v.dx - v.dx * 0.3 - v.dy * 0.2},${v.dy - v.dy * 0.3 + v.dx * 0.2} ${v.dx - v.dx * 0.3 + v.dy * 0.2},${v.dy - v.dy * 0.3 - v.dx * 0.2}`}
                                fill="rgba(255,255,255,1)"
                                opacity={v.opacity * 0.8}
                            />
                        </g>
                    ))}

                    {/* Charges */}
                    {charges.map(charge => (
                        <g
                            key={charge.id}
                            transform={`translate(${charge.x}, ${charge.y})`}
                            onPointerDown={(e) => handlePointerDown(e, charge.id)}
                            style={{ cursor: draggingId === charge.id ? 'grabbing' : 'grab' }}
                        >
                            {/* Glow Effect */}
                            <circle
                                r="25"
                                fill={charge.q > 0 ? "#EF4444" : "#3B82F6"}
                                opacity="0.2"
                                style={{ filter: `blur(10px)` }}
                            />
                            {/* Core Body */}
                            <circle
                                r="15"
                                fill={charge.q > 0 ? "#EF4444" : "#3B82F6"}
                                stroke="#ffffff"
                                strokeWidth="2"
                                style={{ filter: `drop-shadow(0 0 5px rgba(255,255,255,0.5))` }}
                            />
                            {/* Sign */}
                            <text
                                x="0"
                                y="0"
                                fill="#ffffff"
                                fontSize="20"
                                fontWeight="900"
                                textAnchor="middle"
                                dy="7"
                                pointerEvents="none"
                            >
                                {charge.q > 0 ? "+" : "-"}
                            </text>
                        </g>
                    ))}
                </svg>

                {/* Visual Overlay Instructions if empty */}
                {charges.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center animate-pulse">
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-2">Uzay Boş</p>
                            <p className="text-xs text-zinc-500">Menüden (+) veya (-) yükler ekleyerek elektrik alanı gözlemleyin.</p>
                        </div>
                    </div>
                )}
            </div>
        </SimulationLayout>
    );
}
