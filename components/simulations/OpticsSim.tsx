"use client";

import React, { useState, useEffect } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider } from "./core/ui";
import { CheckCircle2, Eye, Focus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OpticsSim({ simData }: { simData: any }) {
    // -------------------------------------------------------------
    // 1. STATE
    // -------------------------------------------------------------
    const canvasWidth = 800;
    const canvasHeight = 600;
    const centerY = canvasHeight / 2;
    const centerX = canvasWidth / 2;

    const [f, setF] = useState(100); // Focal length (f > 0 Convex, f < 0 Concave)
    const [do_val, setDoVal] = useState(250); // Object distance (positive, left side)
    const [ho, setHo] = useState(80); // Object height

    // -------------------------------------------------------------
    // 2. OPTICS CALCULATIONS
    // -------------------------------------------------------------
    // 1/f = 1/do + 1/di  => di = (do * f) / (do - f)
    // Magnification m = -di / do
    // hi = m * ho

    let di = 0;
    let hi = 0;
    let isReal = false;
    let isInfinity = false;

    if (Math.abs(do_val - f) < 0.1) {
        // Object at focal point -> Infinity
        isInfinity = true;
    } else {
        di = (do_val * f) / (do_val - f);
        const m = -di / do_val;
        hi = m * ho;
        // Real image if di > 0, Virtual if di < 0
        isReal = di > 0;
    }

    const objX = centerX - do_val;
    const imgX = isInfinity ? -9999 : centerX + di;

    // Lens Drawing
    const lensRadiusX = 15;
    const lensRadiusY = 150;

    // -------------------------------------------------------------
    // 3. RAYS CALCULATION
    // -------------------------------------------------------------
    // Ray 1: Parallel to principal axis -> Refracts through/from focal point
    const r1StartX = objX;
    const r1StartY = centerY - ho;
    const r1LensX = centerX;
    const r1LensY = centerY - ho;

    let r1Slope = 0;
    if (f !== 0) {
        if (f > 0) {
            // Convex: passes through focal point on right (centerX + f, centerY)
            r1Slope = (centerY - r1LensY) / (centerX + f - centerX);
        } else {
            // Concave: diverges as if coming from focal point on left (centerX - |f|, centerY)
            r1Slope = (r1LensY - centerY) / (centerX - (centerX + f));
        }
    }
    const r1EndX = canvasWidth;
    const r1EndY = r1LensY + r1Slope * (r1EndX - centerX);

    // Backward extension for Virtual Images
    const r1BackX = 0;
    const r1BackY = r1LensY - r1Slope * centerX;

    // Ray 2: Through optical center (centerX, centerY) -> Unrefracted
    const r2StartX = objX;
    const r2StartY = centerY - ho;
    const r2LensX = centerX;
    const r2LensY = centerY;

    const r2Slope = (centerY - r2StartY) / (centerX - r2StartX);
    const r2EndX = canvasWidth;
    const r2EndY = centerY + r2Slope * (r2EndX - centerX);

    // Backward extension for Virtual Images
    const r2BackX = 0;
    const r2BackY = centerY - r2Slope * centerX;


    // Ray 3: Through/towards left focal point -> Refracts parallel to principal axis
    const r3StartX = objX;
    const r3StartY = centerY - ho;
    let r3LensY = centerY;

    if (f > 0) {
        // Passes through left focal point (centerX - f, centerY)
        const slopeF = (centerY - r3StartY) / (centerX - f - r3StartX);
        r3LensY = r3StartY + slopeF * (centerX - r3StartX);
    } else {
        // Aims for right focal point (centerX + |f|, centerY)
        const slopeF = (centerY - r3StartY) / (centerX - f - r3StartX);
        r3LensY = r3StartY + slopeF * (centerX - r3StartX);
    }
    const r3EndX = canvasWidth;
    const r3EndY = r3LensY;

    const r3BackX = 0;
    const r3BackY = r3LensY;


    // -------------------------------------------------------------
    // 4. MISSIONS
    // -------------------------------------------------------------
    const [missions, setMissions] = useState([
        {
            id: 1,
            title: "Ters ve Gerçek",
            desc: "İnce kenarlı (f>0) mercekle ekranda gerçek bir görüntü oluştur (Cisim odağın dışında olsun).",
            isCompleted: false,
            condition: () => f > 0 && isReal && !isInfinity && do_val > f,
            successText: "Harika! Cisim odak ile sonsuz arasındayken mercek ışınları birleştirerek karşı tarafta gerçek ve TERS bir görüntü oluşturur."
        },
        {
            id: 2,
            title: "Sanal Büyüteç",
            desc: "İnce kenarlı merceği büyüteç gibi kullan! Cismi odak noktasıyla mercek arasına sok.",
            isCompleted: false,
            condition: () => f > 0 && !isReal && do_val < f && do_val > 0,
            successText: "İşte büyüteç! Cisim odağın içindeyken ışınlar kesişemez, ancak uzantıları asıl cismin arkasında daha BÜYÜK ve DÜZ bir sanal görüntü oluşturur."
        },
        {
            id: 3,
            title: "Küçülen Dünya",
            desc: "Kalın kenarlı (ıraksak) bir mercek (negatif f) yap. Görüntüyü incele.",
            isCompleted: false,
            condition: () => f < -20,
            successText: "Kusursuz! Kalın kenarlı mercek ışınları dağıtır. Görüntü HER ZAMAN cisim ile mercek arasındadır, SANALDIR, DÜZDÜR ve cisimden KÜÇÜKTÜR."
        }
    ]);

    useEffect(() => {
        setMissions(prev => prev.map(m => {
            if (!m.isCompleted && m.condition()) {
                return { ...m, isCompleted: true };
            }
            return m;
        }));
    }, [f, do_val, isReal, isInfinity]);

    // -------------------------------------------------------------
    // 5. UI COMPONENTS
    // -------------------------------------------------------------
    const Controls = (
        <div className="flex flex-col gap-6">
            <div className="space-y-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-white px-2 uppercase tracking-widest bg-[#14B8A6] rounded-full py-0.5">Mercek (Lens)</span>
                        <span className="text-xs font-bold text-[#14B8A6]">{f > 0 ? "İnce Kenarlı (Yakınsak)" : f < 0 ? "Kalın Kenarlı (Iraksak)" : "Düz Cam"}</span>
                    </div>
                    <PhysicsSlider label="Odak Uzaklığı (f)" value={f} min={-200} max={200} step={5} unit="px" onChange={setF} color="#14B8A6" />
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-4">
                    <span className="text-[10px] font-black text-black px-2 uppercase tracking-widest bg-[#FCD34D] rounded-full py-0.5">Cisim (Object)</span>
                    <PhysicsSlider label="Cisme Uzaklık (do)" value={do_val} min={20} max={350} step={5} unit="px" onChange={setDoVal} color="#FCD34D" />
                    <PhysicsSlider label="Cisim Boyu (ho)" value={ho} min={10} max={150} step={5} unit="px" onChange={setHo} color="#FDE68A" />
                </div>
            </div>

            {/* Live Data Dashboard */}
            <div className="mt-2 p-4 rounded-xl border border-white/10 bg-black/40 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Görüntü Uzaklığı (di)</p>
                    <p className="text-xl font-mono text-[#F472B6]">
                        {isInfinity ? "Sonsuz" : di.toFixed(1)} <span className="text-sm">px</span>
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Görüntü Boyu (hi)</p>
                    <p className="text-xl font-mono text-[#F472B6]">
                        {isInfinity ? "-" : Math.abs(hi).toFixed(1)} <span className="text-sm">px</span>
                    </p>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/10 flex justify-between items-center">
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Görüntü Tipi</p>
                    <p className="text-sm font-black text-white px-2 py-1 bg-white/10 rounded tracking-widest uppercase">
                        {isInfinity ? "Belirsiz" : isReal ? "Gerçek (Ters)" : "Sanal (Düz)"}
                    </p>
                </div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-white italic">MERCEKLER VE IŞIĞIN KIRILMASI</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                Işık farklı bir ortama girerken kırılır. Mercekler, özel kavisli yapıları sayesinde ışığı belli bir noktada (odak) toplamak veya dağıtmak için tasarlanmıştır.
            </p>

            <div className="grid gap-4 mt-4">
                <div className="p-4 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/30 shadow-[0_0_20px_rgba(20,184,166,0.1)] text-center">
                    <span className="text-xs text-[#14B8A6] uppercase font-black block mb-2">İnce Kenarlı Mercek Denklemi</span>
                    <p className="text-xl font-mono text-[#14B8A6]">1/f = 1/di + 1/do</p>
                </div>

                <ul className="space-y-2 mt-2 text-sm text-zinc-300">
                    <li>• <strong>Gerçek Görüntü:</strong> Işınların kendilerinin kesiştiği yerde oluşur (Perdeye yansıtılabilir).</li>
                    <li>• <strong>Sanal Görüntü:</strong> Işınların uzantılarının kesiştiği yerde oluşur (Gözümüzle merceğin içinden bakarız).</li>
                    <li>• <strong>Yakınsak (Convex - İnce Kenarlı):</strong> Işınları toplar. Odak dışındaki cisimleri ters çevirip büyütür veya küçültür. Odak içindeki cisimleri büyüteç gibi gösterir.</li>
                    <li>• <strong>Iraksak (Concave - Kalın Kenarlı):</strong> Işınları saçar. Görüntüyü her zaman daha küçük, düz ve sanal yapar. (Örn: Miyop gözlüğü).</li>
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
            title={simData?.title || "Geometrik Optik"}
            color={simData?.color || "#14B8A6"}
            controlsArea={Controls}
            theoryArea={Theory}
            missionsArea={Missions}
        >
            <div className="w-full h-full p-0 relative flex items-center justify-center">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="origin-center"
                >
                    {/* Background & Optical Axis */}
                    <rect x="0" y="0" width={canvasWidth} height={canvasHeight} fill="#050510" />

                    {/* Grid lines purely for aesthetics */}
                    <g opacity="0.05">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={canvasHeight} stroke="#fff" strokeWidth="1" />
                        ))}
                        {Array.from({ length: 15 }).map((_, i) => (
                            <line key={`h${i}`} x1="0" y1={i * 40} x2={canvasWidth} y2={i * 40} stroke="#fff" strokeWidth="1" />
                        ))}
                    </g>

                    {/* Principal Axis */}
                    <line x1="0" y1={centerY} x2={canvasWidth} y2={centerY} stroke="#666" strokeWidth="2" strokeDasharray="10 5" />

                    {/* Focal Points */}
                    {Math.abs(f) > 0 && (
                        <>
                            <circle cx={centerX - Math.abs(f)} cy={centerY} r="4" fill="#14B8A6" />
                            <text x={centerX - Math.abs(f)} y={centerY + 15} fill="#14B8A6" fontSize="12" textAnchor="middle" fontWeight="bold">F</text>

                            <circle cx={centerX - 2 * Math.abs(f)} cy={centerY} r="4" fill="#14B8A6" />
                            <text x={centerX - 2 * Math.abs(f)} y={centerY + 15} fill="#14B8A6" fontSize="12" textAnchor="middle" fontWeight="bold">2F</text>

                            <circle cx={centerX + Math.abs(f)} cy={centerY} r="4" fill="#14B8A6" />
                            <text x={centerX + Math.abs(f)} y={centerY + 15} fill="#14B8A6" fontSize="12" textAnchor="middle" fontWeight="bold">F'</text>

                            <circle cx={centerX + 2 * Math.abs(f)} cy={centerY} r="4" fill="#14B8A6" />
                            <text x={centerX + 2 * Math.abs(f)} y={centerY + 15} fill="#14B8A6" fontSize="12" textAnchor="middle" fontWeight="bold">2F'</text>
                        </>
                    )}

                    {/* The Lens (Stylized) */}
                    {f > 0 ? (
                        // Convex Lens
                        <path d={`M ${centerX} ${centerY - lensRadiusY} Q ${centerX + lensRadiusX * 2} ${centerY} ${centerX} ${centerY + lensRadiusY} Q ${centerX - lensRadiusX * 2} ${centerY} ${centerX} ${centerY - lensRadiusY} Z`} fill="#14B8A6" opacity="0.2" stroke="#14B8A6" strokeWidth="2" style={{ filter: "drop-shadow(0 0 10px rgba(20,184,166,0.5))" }} />
                    ) : f < 0 ? (
                        // Concave Lens (Drawn as a specialized shape)
                        <path d={`M ${centerX - lensRadiusX} ${centerY - lensRadiusY} L ${centerX + lensRadiusX} ${centerY - lensRadiusY} Q ${centerX} ${centerY} ${centerX + lensRadiusX} ${centerY + lensRadiusY} L ${centerX - lensRadiusX} ${centerY + lensRadiusY} Q ${centerX} ${centerY} ${centerX - lensRadiusX} ${centerY - lensRadiusY} Z`} fill="#14B8A6" opacity="0.2" stroke="#14B8A6" strokeWidth="2" style={{ filter: "drop-shadow(0 0 10px rgba(20,184,166,0.5))" }} />
                    ) : (
                        <rect x={centerX - 5} y={centerY - lensRadiusY} width="10" height={lensRadiusY * 2} fill="#555" />
                    )}


                    {/* ---------------- RAYS ---------------- */}
                    {Math.abs(f) > 0 && !isInfinity && (
                        <g opacity="0.7">
                            {/* Ray 1: Parallel to refracted */}
                            <line x1={r1StartX} y1={r1StartY} x2={r1LensX} y2={r1LensY} stroke="#EF4444" strokeWidth="2" />
                            <line x1={r1LensX} y1={r1LensY} x2={r1EndX} y2={r1EndY} stroke="#EF4444" strokeWidth="2" />

                            {/* Ray 2: Optical Center */}
                            <line x1={r2StartX} y1={r2StartY} x2={r2EndX} y2={r2EndY} stroke="#3B82F6" strokeWidth="2" />

                            {/* Ray 3: Extraneous Ray just for flair */}
                            <line x1={r3StartX} y1={r3StartY} x2={centerX} y2={r3LensY} stroke="#10B981" strokeWidth="2" />
                            <line x1={centerX} y1={r3LensY} x2={canvasWidth} y2={r3LensY} stroke="#10B981" strokeWidth="2" />

                            {/* Virtual Backward Extensions if Virtual Image */}
                            {!isReal && (
                                <>
                                    <line x1={r1BackX} y1={r1BackY} x2={r1LensX} y2={r1LensY} stroke="#EF4444" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
                                    <line x1={r2BackX} y1={r2BackY} x2={r2LensX} y2={r2LensY} stroke="#3B82F6" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
                                    <line x1={r3BackX} y1={r3BackY} x2={centerX} y2={r3LensY} stroke="#10B981" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
                                </>
                            )}
                        </g>
                    )}

                    {/* ---------------- OBJECT ---------------- */}
                    <g transform={`translate(${objX}, ${centerY})`}>
                        <line x1="0" y1="0" x2="0" y2={-ho} stroke="#FCD34D" strokeWidth="6" strokeLinecap="round" />
                        <polygon points={`0,${-ho - 8} -6,${-ho + 2} 6,${-ho + 2}`} fill="#FCD34D" />
                    </g>

                    {/* ---------------- IMAGE ---------------- */}
                    {!isInfinity && Math.abs(di) < 2000 && (
                        <g transform={`translate(${imgX}, ${centerY})`}>
                            <line
                                x1="0" y1="0" x2="0" y2={-hi}
                                stroke="#F472B6"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={!isReal ? "10 5" : "0"}
                            />
                            <polygon
                                points={`0,${-hi + (hi > 0 ? -8 : 8)} -6,${-hi + (hi > 0 ? 2 : -2)} 6,${-hi + (hi > 0 ? 2 : -2)}`}
                                fill="#F472B6"
                            />

                            <text x="0" y={hi > 0 ? -hi - 15 : -hi + 15} fill="#F472B6" fontSize="12" fontWeight="bold" textAnchor="middle">
                                {isReal ? "Gerçek" : "Sanal"}
                            </text>
                        </g>
                    )}

                    {/* The Eye (Viewing from right) */}
                    <g transform={`translate(${canvasWidth - 50}, ${centerY})`} opacity="0.5">
                        <Eye className="w-12 h-12 text-white/50" />
                        <text x="24" y="35" fill="#fff" fontSize="10" textAnchor="middle" opacity="0.5">GÖZ</text>
                    </g>
                </svg>
            </div>
        </SimulationLayout>
    );
}
