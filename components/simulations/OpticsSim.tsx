"use client";

import React, { useState, useEffect } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider } from "./core/ui";
import { CheckCircle2 } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";

export function OpticsSim({ simData }: { simData: any }) {
    const accentColor = simData?.color || "#0C8CE9";
    const canvasWidth = 800;
    const canvasHeight = 600;
    const centerY = canvasHeight / 2;
    const centerX = canvasWidth / 2;

    const [f, setF] = useState(100);
    const [do_val, setDoVal] = useState(250);
    const [ho, setHo] = useState(80);

    // OPTICS CALCULATIONS
    let di = 0; let hi = 0; let isReal = false; let isInfinity = false;
    if (Math.abs(do_val - f) < 0.1) { isInfinity = true; }
    else {
        di = (do_val * f) / (do_val - f);
        const m = -di / do_val;
        hi = m * ho;
        isReal = di > 0;
    }

    const objX = centerX - do_val;
    const imgX = isInfinity ? -9999 : centerX + di;
    const lensRadiusX = 15;
    const lensRadiusY = 150;

    // RAYS
    const r1StartX = objX; const r1StartY = centerY - ho;
    const r1LensX = centerX; const r1LensY = centerY - ho;
    let r1Slope = 0;
    if (f !== 0) {
        if (f > 0) r1Slope = (centerY - r1LensY) / (centerX + f - centerX);
        else r1Slope = (r1LensY - centerY) / (centerX - (centerX + f));
    }
    const r1EndX = canvasWidth; const r1EndY = r1LensY + r1Slope * (r1EndX - centerX);
    const r1BackX = 0; const r1BackY = r1LensY - r1Slope * centerX;

    const r2StartX = objX; const r2StartY = centerY - ho;
    const r2Slope = (centerY - r2StartY) / (centerX - r2StartX);
    const r2EndX = canvasWidth; const r2EndY = centerY + r2Slope * (r2EndX - centerX);
    const r2BackX = 0; const r2BackY = centerY - r2Slope * centerX;

    const r3StartX = objX; const r3StartY = centerY - ho; let r3LensY = centerY;
    if (f > 0) { const slopeF = (centerY - r3StartY) / (centerX - f - r3StartX); r3LensY = r3StartY + slopeF * (centerX - r3StartX); }
    else { const slopeF = (centerY - r3StartY) / (centerX - f - r3StartX); r3LensY = r3StartY + slopeF * (centerX - r3StartX); }
    const r3EndX = canvasWidth; const r3EndY = r3LensY;
    const r3BackX = 0; const r3BackY = r3LensY;

    // MISSIONS
    const [missions, setMissions] = useState([
        { id: 1, title: "Ters ve Gerçek", desc: "İnce kenarlı (f>0) mercekle ekranda gerçek bir görüntü oluştur (Cisim odağın dışında olsun).", isCompleted: false,
            condition: () => f > 0 && isReal && !isInfinity && do_val > f,
            successText: "Harika! Cisim odak ile sonsuz arasındayken mercek ışınları birleştirerek karşı tarafta gerçek ve TERS bir görüntü oluşturur." },
        { id: 2, title: "Sanal Büyüteç", desc: "İnce kenarlı merceği büyüteç gibi kullan! Cismi odak noktasıyla mercek arasına sok.", isCompleted: false,
            condition: () => f > 0 && !isReal && do_val < f && do_val > 0,
            successText: "İşte büyüteç! Cisim odağın içindeyken ışınlar kesişemez, ancak uzantıları asıl cismin arkasında daha BÜYÜK ve DÜZ bir sanal görüntü oluşturur." },
        { id: 3, title: "Küçülen Dünya", desc: "Kalın kenarlı (ıraksak) bir mercek (negatif f) yap. Görüntüyü incele.", isCompleted: false,
            condition: () => f < -20,
            successText: "Kusursuz! Kalın kenarlı mercek ışınları dağıtır. Görüntü HER ZAMAN cisim ile mercek arasındadır, SANALDIR, DÜZDÜR ve cisimden KÜÇÜKTÜR." }
    ]);

    useEffect(() => {
        setMissions(prev => prev.map(m => { if (!m.isCompleted && m.condition()) return { ...m, isCompleted: true }; return m; }));
    }, [f, do_val, isReal, isInfinity]);

    const Controls = (
        <div className="flex flex-col gap-5">
            <div className="p-3 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[2px_2px_0px_0px_#000] space-y-4">
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-black px-2 uppercase tracking-widest rounded py-0.5 border-[2px] border-black" style={{ backgroundColor: accentColor }}>Mercek</span>
                    <span className="text-xs font-bold text-zinc-300">{f > 0 ? "İnce Kenarlı (Yakınsak)" : f < 0 ? "Kalın Kenarlı (Iraksak)" : "Düz Cam"}</span>
                </div>
                <PhysicsSlider label="Odak Uzaklığı (f)" value={f} min={-200} max={200} step={5} unit="px" onChange={setF} color={accentColor} />
            </div>

            <div className="p-3 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[2px_2px_0px_0px_#000] space-y-4">
                <span className="text-[10px] font-black text-black px-2 uppercase tracking-widest rounded py-0.5 border-[2px] border-black" style={{ backgroundColor: "#D97706" }}>Cisim</span>
                <PhysicsSlider label="Cisme Uzaklık (do)" value={do_val} min={20} max={350} step={5} unit="px" onChange={setDoVal} color="#D97706" />
                <PhysicsSlider label="Cisim Boyu (ho)" value={ho} min={10} max={150} step={5} unit="px" onChange={setHo} color="#D97706" />
            </div>

            <div className="p-4 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[3px_3px_0px_0px_#000] grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Görüntü Uzaklığı (di)</p>
                    <p className="text-lg font-mono text-foreground">{isInfinity ? "Sonsuz" : di.toFixed(1)} <span className="text-sm">px</span></p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Görüntü Boyu (hi)</p>
                    <p className="text-lg font-mono text-foreground">{isInfinity ? "-" : Math.abs(hi).toFixed(1)} <span className="text-sm">px</span></p>
                </div>
                <div className="col-span-2 pt-2 border-t border-zinc-700 flex justify-between items-center">
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Görüntü Tipi</p>
                    <p className="text-sm font-black text-black px-2 py-1 rounded border-[2px] border-black shadow-[2px_2px_0px_0px_#000] tracking-widest uppercase" style={{ backgroundColor: isReal ? "#16A34A" : "#D97706", color: "#000" }}>
                        {isInfinity ? "Belirsiz" : isReal ? "Gerçek (Ters)" : "Sanal (Düz)"}
                    </p>
                </div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-5">
            <h2 className="text-xl font-black text-foreground uppercase">Mercekler ve Işığın Kırılması</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                Işık farklı bir ortama girerken kırılır. Mercekler, özel kavisli yapıları sayesinde ışığı belli bir noktada (odak) toplamak veya dağıtmak için tasarlanmıştır.
            </p>
            <div className="grid gap-4 mt-4">
                <div className="p-4 rounded-lg border-[2px] border-black shadow-[3px_3px_0px_0px_#000] text-center" style={{ backgroundColor: accentColor }}>
                    <span className="text-xs text-black uppercase font-black block mb-2">İnce Kenarlı Mercek Denklemi</span>
                    <p className="text-xl font-mono text-black font-bold">1/f = 1/di + 1/do</p>
                </div>
                <ul className="space-y-2 mt-2 text-sm text-zinc-300">
                    <li>• <strong>Gerçek Görüntü:</strong> Işınların kendilerinin kesiştiği yerde oluşur (Perdeye yansıtılabilir).</li>
                    <li>• <strong>Sanal Görüntü:</strong> Işınların uzantılarının kesiştiği yerde oluşur (Gözümüzle merceğin içinden bakarız).</li>
                    <li>• <strong>Yakınsak (Convex):</strong> Işınları toplar. Odak dışındaki cisimleri ters çevirip büyütür veya küçültür.</li>
                    <li>• <strong>Iraksak (Concave):</strong> Işınları saçar. Görüntüyü her zaman daha küçük, düz ve sanal yapar.</li>
                </ul>
            </div>
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
        <SimulationLayout title={simData?.title || "Geometrik Optik"} color={accentColor} controlsArea={Controls} theoryArea={Theory} missionsArea={Missions}>
            <div className="w-full h-full p-0 relative flex items-center justify-center">
                <svg width="100%" height="100%" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} preserveAspectRatio="xMidYMid meet" className="origin-center">
                    <rect x="0" y="0" width={canvasWidth} height={canvasHeight} fill="#1a1a1a" />
                    <g opacity="0.06">
                        {Array.from({ length: 20 }).map((_, i) => (<line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={canvasHeight} stroke="#fff" strokeWidth="1" />))}
                        {Array.from({ length: 15 }).map((_, i) => (<line key={`h${i}`} x1="0" y1={i * 40} x2={canvasWidth} y2={i * 40} stroke="#fff" strokeWidth="1" />))}
                    </g>
                    <line x1="0" y1={centerY} x2={canvasWidth} y2={centerY} stroke="#555" strokeWidth="2" strokeDasharray="10 5" />

                    {Math.abs(f) > 0 && (<>
                        <circle cx={centerX - Math.abs(f)} cy={centerY} r="4" fill={accentColor} />
                        <text x={centerX - Math.abs(f)} y={centerY + 15} fill={accentColor} fontSize="12" textAnchor="middle" fontWeight="bold">F</text>
                        <circle cx={centerX - 2 * Math.abs(f)} cy={centerY} r="4" fill={accentColor} />
                        <text x={centerX - 2 * Math.abs(f)} y={centerY + 15} fill={accentColor} fontSize="12" textAnchor="middle" fontWeight="bold">2F</text>
                        <circle cx={centerX + Math.abs(f)} cy={centerY} r="4" fill={accentColor} />
                        <text x={centerX + Math.abs(f)} y={centerY + 15} fill={accentColor} fontSize="12" textAnchor="middle" fontWeight="bold">F&apos;</text>
                        <circle cx={centerX + 2 * Math.abs(f)} cy={centerY} r="4" fill={accentColor} />
                        <text x={centerX + 2 * Math.abs(f)} y={centerY + 15} fill={accentColor} fontSize="12" textAnchor="middle" fontWeight="bold">2F&apos;</text>
                    </>)}

                    {f > 0 ? (
                        <path d={`M ${centerX} ${centerY - lensRadiusY} Q ${centerX + lensRadiusX * 2} ${centerY} ${centerX} ${centerY + lensRadiusY} Q ${centerX - lensRadiusX * 2} ${centerY} ${centerX} ${centerY - lensRadiusY} Z`} fill={accentColor} opacity="0.25" stroke={accentColor} strokeWidth="2" />
                    ) : f < 0 ? (
                        <path d={`M ${centerX - lensRadiusX} ${centerY - lensRadiusY} L ${centerX + lensRadiusX} ${centerY - lensRadiusY} Q ${centerX} ${centerY} ${centerX + lensRadiusX} ${centerY + lensRadiusY} L ${centerX - lensRadiusX} ${centerY + lensRadiusY} Q ${centerX} ${centerY} ${centerX - lensRadiusX} ${centerY - lensRadiusY} Z`} fill={accentColor} opacity="0.25" stroke={accentColor} strokeWidth="2" />
                    ) : (
                        <rect x={centerX - 5} y={centerY - lensRadiusY} width="10" height={lensRadiusY * 2} fill="#555" />
                    )}

                    {Math.abs(f) > 0 && !isInfinity && (
                        <g opacity="0.7">
                            <line x1={r1StartX} y1={r1StartY} x2={r1LensX} y2={r1LensY} stroke="#DC2626" strokeWidth="2" />
                            <line x1={r1LensX} y1={r1LensY} x2={r1EndX} y2={r1EndY} stroke="#DC2626" strokeWidth="2" />
                            <line x1={r2StartX} y1={r2StartY} x2={r2EndX} y2={r2EndY} stroke="#2563EB" strokeWidth="2" />
                            <line x1={r3StartX} y1={r3StartY} x2={centerX} y2={r3LensY} stroke="#16A34A" strokeWidth="2" />
                            <line x1={centerX} y1={r3LensY} x2={canvasWidth} y2={r3LensY} stroke="#16A34A" strokeWidth="2" />
                            {!isReal && (<>
                                <line x1={r1BackX} y1={r1BackY} x2={r1LensX} y2={r1LensY} stroke="#DC2626" strokeWidth="2" strokeDasharray="5 5" opacity="0.4" />
                                <line x1={r2BackX} y1={r2BackY} x2={centerX} y2={centerY} stroke="#2563EB" strokeWidth="2" strokeDasharray="5 5" opacity="0.4" />
                                <line x1={r3BackX} y1={r3BackY} x2={centerX} y2={r3LensY} stroke="#16A34A" strokeWidth="2" strokeDasharray="5 5" opacity="0.4" />
                            </>)}
                        </g>
                    )}

                    <g transform={`translate(${objX}, ${centerY})`}>
                        <line x1="0" y1="0" x2="0" y2={-ho} stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
                        <polygon points={`0,${-ho - 8} -6,${-ho + 2} 6,${-ho + 2}`} fill="#D97706" />
                    </g>

                    {!isInfinity && Math.abs(di) < 2000 && (
                        <g transform={`translate(${imgX}, ${centerY})`}>
                            <line x1="0" y1="0" x2="0" y2={-hi} stroke="#7C3AED" strokeWidth="6" strokeLinecap="round" strokeDasharray={!isReal ? "10 5" : "0"} />
                            <polygon points={`0,${-hi + (hi > 0 ? -8 : 8)} -6,${-hi + (hi > 0 ? 2 : -2)} 6,${-hi + (hi > 0 ? 2 : -2)}`} fill="#7C3AED" />
                            <text x="0" y={hi > 0 ? -hi - 15 : -hi + 15} fill="#7C3AED" fontSize="12" fontWeight="bold" textAnchor="middle">
                                {isReal ? "Gerçek" : "Sanal"}
                            </text>
                        </g>
                    )}
                </svg>
            </div>
        </SimulationLayout>
    );
}
