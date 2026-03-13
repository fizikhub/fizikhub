"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PlusCircle, MinusCircle, Trash2, CheckCircle2 } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";

type ChargeType = { id: string; q: number; x: number; y: number; };

export function ElectricFieldSim({ simData }: { simData: any }) {
    const accentColor = simData?.color || "#0891B2";
    const canvasWidth = 800;
    const canvasHeight = 600;

    const [charges, setCharges] = useState<ChargeType[]>([
        { id: "c1", q: 1, x: canvasWidth / 2 - 100, y: canvasHeight / 2 },
        { id: "c2", q: -1, x: canvasWidth / 2 + 100, y: canvasHeight / 2 }
    ]);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [showGrid, setShowGrid] = useState(true);

    const k = 5000;
    const gridSpacing = 40;

    const vectorField = useMemo(() => {
        const vectors = [];
        if (!showGrid || charges.length === 0) return [];
        for (let x = gridSpacing / 2; x < canvasWidth; x += gridSpacing) {
            for (let y = gridSpacing / 2; y < canvasHeight; y += gridSpacing) {
                let Ex = 0; let Ey = 0; let isVeryClose = false;
                for (const charge of charges) {
                    const dx = x - charge.x; const dy = y - charge.y;
                    const rSq = dx * dx + dy * dy; const r = Math.sqrt(rSq);
                    if (r < 20) { isVeryClose = true; break; }
                    const E_mag = (k * charge.q) / rSq;
                    Ex += E_mag * (dx / r); Ey += E_mag * (dy / r);
                }
                if (isVeryClose) continue;
                const E_total = Math.sqrt(Ex * Ex + Ey * Ey);
                if (E_total < 0.01) continue;
                const arrowLen = 15;
                const normEx = (Ex / E_total) * arrowLen;
                const normEy = (Ey / E_total) * arrowLen;
                const opacity = Math.min(1, E_total * 2);
                vectors.push({ x, y, dx: normEx, dy: normEy, opacity });
            }
        }
        return vectors;
    }, [charges, showGrid]);

    const getPointFromEvent = (e: React.PointerEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const CTM = svgRef.current.getScreenCTM();
        if (!CTM) return { x: 0, y: 0 };
        return { x: (e.clientX - CTM.e) / CTM.a, y: (e.clientY - CTM.f) / CTM.d };
    };

    const handlePointerDown = (e: React.PointerEvent, id: string) => { e.stopPropagation(); (e.target as Element).setPointerCapture(e.pointerId); setDraggingId(id); };
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!draggingId) return;
        const pt = getPointFromEvent(e);
        const x = Math.max(20, Math.min(canvasWidth - 20, pt.x));
        const y = Math.max(20, Math.min(canvasHeight - 20, pt.y));
        setCharges(prev => prev.map(c => c.id === draggingId ? { ...c, x, y } : c));
    };
    const handlePointerUp = (e: React.PointerEvent) => { if (draggingId) { (e.target as Element).releasePointerCapture(e.pointerId); setDraggingId(null); } };
    const addCharge = (q: number) => { setCharges(prev => [...prev, { id: `c-${Date.now()}`, q, x: canvasWidth / 2 + (Math.random() * 100 - 50), y: canvasHeight / 2 + (Math.random() * 100 - 50) }]); };
    const clearCharges = () => setCharges([]);

    const [missions, setMissions] = useState([
        { id: 1, title: "Dipol Yaratımı", desc: "Ekrana sadece bir (+) ve bir (-) yük ekle.", isCompleted: false,
            condition: () => charges.length === 2 && charges.some(c => c.q > 0) && charges.some(c => c.q < 0),
            successText: "Harika! Elektrik alan çizgilerinin (+)'dan çıkıp (-)'ye girdiğini görüyorsun. Bu yapının adı Dipol'dür." },
        { id: 2, title: "Ortadaki Sıfır Noktası", desc: "Ekrana iki aynı cins yük koy (sadece iki + veya iki -).", isCompleted: false,
            condition: () => charges.length === 2 && ((charges[0].q > 0 && charges[1].q > 0) || (charges[0].q < 0 && charges[1].q < 0)),
            successText: "Mükemmel! İki aynı cins yük birbirini iter ve alan tam orta noktalarında sıfırlanır." },
        { id: 3, title: "Sonsuzluğa Doğru", desc: "Ekranda sadece 1 tane yük bırak.", isCompleted: false,
            condition: () => charges.length === 1,
            successText: "Tek bir noktasal yükün elektrik alanı, yük (+) ise sonsuza doğru, (-) ise sonsuzdan yüke doğru radyal halindedir." }
    ]);

    useEffect(() => { setMissions(prev => prev.map(m => { if (!m.isCompleted && m.condition()) return { ...m, isCompleted: true }; return m; })); }, [charges]);

    const Controls = (
        <div className="flex flex-col gap-5">
            <div className="flex gap-2 p-2 bg-zinc-900 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                <button onClick={() => addCharge(1)} className="flex-1 flex flex-col items-center justify-center gap-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-md transition-colors active:scale-95 border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]">
                    <PlusCircle className="w-6 h-6" />
                    <span className="text-[9px] font-black uppercase tracking-widest">(+) Yük Ekle</span>
                </button>
                <button onClick={() => addCharge(-1)} className="flex-1 flex flex-col items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-md transition-colors active:scale-95 border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]">
                    <MinusCircle className="w-6 h-6" />
                    <span className="text-[9px] font-black uppercase tracking-widest">(-) Yük Ekle</span>
                </button>
            </div>

            <button onClick={clearCharges} className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
                <Trash2 className="w-5 h-5" /><span className="font-bold uppercase tracking-wider text-xs">Tüm Yükleri Temizle</span>
            </button>

            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border-[2px] border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-zinc-800 transition-colors" onClick={() => setShowGrid(!showGrid)}>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Vektör Alanı</span>
                <div className={`w-10 h-6 rounded-md p-1 transition-colors border-[2px] border-black ${showGrid ? '' : 'bg-zinc-700'}`} style={{ backgroundColor: showGrid ? accentColor : undefined }}>
                    <div className={`w-4 h-4 bg-white border-[1px] border-black rounded-sm transition-transform ${showGrid ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
            </div>

            <div className="p-4 rounded-lg border-[2px] border-black shadow-[3px_3px_0px_0px_#000]" style={{ backgroundColor: accentColor }}>
                <p className="text-xs text-black font-bold text-center uppercase tracking-widest mb-1">Aktif Yük Sayısı</p>
                <p className="text-3xl font-black text-center text-black">{charges.length}</p>
                <p className="text-[10px] text-black/60 text-center mt-2">Yükleri fare ile tutup sürükleyebilirsiniz.</p>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-5">
            <h2 className="text-xl font-black text-foreground uppercase">Elektrik Alan</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">Elektrik yükleri, etraflarındaki uzayın elektriksel özelliklerini değiştirir. Buna <strong>Elektrik Alanı (E)</strong> denir.</p>
            <div className="p-4 rounded-lg border-[2px] border-black shadow-[3px_3px_0px_0px_#000] text-center" style={{ backgroundColor: accentColor }}>
                <span className="text-xs text-black uppercase font-black block mb-2">Elektrik Alan Şiddeti</span>
                <p className="text-2xl font-mono text-black font-bold">E = k·q / r²</p>
            </div>
            <ul className="space-y-2 mt-2 text-sm text-zinc-300">
                <li>• Çizgiler HER ZAMAN <strong>(+)</strong> yükten çıkar, <strong>(-)</strong> yüke girer.</li>
                <li>• Alan çizgilerinin sık olduğu yerlerde alan daha güçlüdür.</li>
                <li>• Çizgiler asla birbirlerini kesmezler.</li>
            </ul>
        </div>
    );

    const Missions = (
        <div className="space-y-4">
            {missions.map((m) => (
                <div key={m.id} className={`relative p-4 rounded-lg border-[2px] transition-all duration-500 overflow-hidden ${m.isCompleted ? "border-green-700 bg-green-900/20" : "border-black bg-zinc-900 shadow-[2px_2px_0px_0px_#000]"}`}>
                    {m.isCompleted && <div className="absolute top-4 right-4 text-green-600"><CheckCircle2 className="w-5 h-5" /></div>}
                    <h3 className={`font-black uppercase tracking-tight mb-2 ${m.isCompleted ? 'text-green-500' : 'text-foreground'}`}>{m.title}</h3>
                    <p className="text-sm text-zinc-400 mb-4">{m.desc}</p>
                    <AnimatePresence>{m.isCompleted && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-3 mt-3 border-t border-green-800 text-xs text-green-500 font-medium leading-relaxed">{m.successText}</motion.div>
                    )}</AnimatePresence>
                </div>
            ))}
        </div>
    );

    return (
        <SimulationLayout title={simData?.title || "Elektrik Alan ve Yükler"} color={accentColor} controlsArea={Controls} theoryArea={Theory} missionsArea={Missions}>
            <div className="w-full h-full p-0 relative flex items-center justify-center">
                <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} preserveAspectRatio="xMidYMid slice" className="origin-center touch-none cursor-crosshair" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                    {showGrid && vectorField.map((v, i) => (
                        <g key={`v-${i}`} transform={`translate(${v.x}, ${v.y})`}>
                            <line x1="0" y1="0" x2={v.dx} y2={v.dy} stroke="rgba(255,255,255,1)" strokeWidth="1.5" opacity={v.opacity * 0.6} />
                            <polygon points={`${v.dx},${v.dy} ${v.dx - v.dx * 0.3 - v.dy * 0.2},${v.dy - v.dy * 0.3 + v.dx * 0.2} ${v.dx - v.dx * 0.3 + v.dy * 0.2},${v.dy - v.dy * 0.3 - v.dx * 0.2}`} fill="rgba(255,255,255,1)" opacity={v.opacity * 0.8} />
                        </g>
                    ))}
                    {charges.map(charge => (
                        <g key={charge.id} transform={`translate(${charge.x}, ${charge.y})`} onPointerDown={(e) => handlePointerDown(e, charge.id)} style={{ cursor: draggingId === charge.id ? 'grabbing' : 'grab' }}>
                            <circle r="15" fill={charge.q > 0 ? "#DC2626" : "#2563EB"} stroke="#000" strokeWidth="3" />
                            <text x="0" y="0" fill="#ffffff" fontSize="20" fontWeight="900" textAnchor="middle" dy="7" pointerEvents="none">{charge.q > 0 ? "+" : "-"}</text>
                        </g>
                    ))}
                </svg>
                {charges.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-zinc-900 px-6 py-4 rounded-lg border-[3px] border-black shadow-[4px_4px_0px_0px_#000] text-center">
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-2">Uzay Boş</p>
                            <p className="text-xs text-zinc-500">Menüden (+) veya (-) yükler ekleyerek elektrik alanı gözlemleyin.</p>
                        </div>
                    </div>
                )}
            </div>
        </SimulationLayout>
    );
}
