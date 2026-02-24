"use client";

import React, { useState, useEffect } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider } from "./core/ui";
import { CheckCircle2, Eye } from "lucide-react";
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
    let di = 0;
    let hi = 0;
    let isReal = false;
    let isInfinity = false;

    if (Math.abs(do_val - f) < 0.1) {
        isInfinity = true;
    } else {
        di = (do_val * f) / (do_val - f);
        const m = -di / do_val;
        hi = m * ho;
        isReal = di > 0;
    }

    const objX = centerX - do_val;
    const imgX = isInfinity ? -9999 : centerX + di;

    const lensRadiusX = 15;
    const lensRadiusY = 150;

    // -------------------------------------------------------------
    // 3. RAYS CALCULATION
    // -------------------------------------------------------------
    const r1StartX = objX;
    const r1StartY = centerY - ho;
    const r1LensX = centerX;
    const r1LensY = centerY - ho;

    let r1Slope = 0;
    if (f !== 0) {
        if (f > 0) {
            r1Slope = (centerY - r1LensY) / (centerX + f - centerX);
        } else {
            r1Slope = (r1LensY - centerY) / (centerX - (centerX + f));
        }
    }
    const r1EndX = canvasWidth;
    const r1EndY = r1LensY + r1Slope * (r1EndX - centerX);
    const r1BackX = 0;
    const r1BackY = r1LensY - r1Slope * centerX;

    const r2StartX = objX;
    const r2StartY = centerY - ho;
    const r2LensX = centerX;
    const r2LensY = centerY;

    const r2Slope = (centerY - r2StartY) / (centerX - r2StartX);
    const r2EndX = canvasWidth;
    const r2EndY = centerY + r2Slope * (r2EndX - centerX);
    const r2BackX = 0;
    const r2BackY = centerY - r2Slope * centerX;

    const r3StartX = objX;
    const r3StartY = centerY - ho;
    let r3LensY = centerY;

    if (f > 0) {
        const slopeF = (centerY - r3StartY) / (centerX - f - r3StartX);
        r3LensY = r3StartY + slopeF * (centerX - r3StartX);
    } else {
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
            title: "TERS VE GERÇEK",
            desc: "İnce kenarlı (f>0) mercekle ekranda gerçek bir görüntü oluştur (Cisim odağın dışında olsun).",
            isCompleted: false,
            condition: () => f > 0 && isReal && !isInfinity && do_val > f,
            successText: "HARİKA! Cisim odak ile sonsuz arasındayken mercek ışınları birleştirerek karşı tarafta gerçek ve TERS bir görüntü oluşturur."
        },
        {
            id: 2,
            title: "SANAL BÜYÜTEÇ",
            desc: "İnce kenarlı merceği büyüteç gibi kullan! Cismi odak noktasıyla mercek arasına sok.",
            isCompleted: false,
            condition: () => f > 0 && !isReal && do_val < f && do_val > 0,
            successText: "İŞTE BÜYÜTEÇ! Cisim odağın içindeyken ışınlar kesişemez, ancak uzantıları asıl cismin arkasında daha BÜYÜK ve DÜZ bir sanal görüntü oluşturur."
        },
        {
            id: 3,
            title: "KÜÇÜLEN DÜNYA",
            desc: "Kalın kenarlı (ıraksak) bir mercek (negatif f) yap. Görüntüyü incele.",
            isCompleted: false,
            condition: () => f < -20,
            successText: "KUSURSUZ! Kalın kenarlı mercek ışınları dağıtır. Görüntü HER ZAMAN cisim ile mercek arasındadır, SANALDIR, DÜZDÜR ve cisimden KÜÇÜKTÜR."
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
        <div className="flex flex-col gap-6 w-[96%] mx-auto mt-4">
            <div className="p-5 bg-white border-[4px] border-black shadow-[6px_6px_0px_#000] rotate-1">
                <div className="flex justify-between items-center mb-6 border-b-[3px] border-black pb-2">
                    <span className="text-xl font-black text-black uppercase tracking-tighter">MERCEK (LENS)</span>
                    <span className="text-sm font-black bg-[#14B8A6] border-[2px] border-black px-2 shadow-[2px_2px_0px_#000] uppercase">
                        {f > 0 ? "YAKINSAK" : f < 0 ? "IRAKSAK" : "DÜZ CAM"}
                    </span>
                </div>
                <PhysicsSlider label="Odak Uzaklığı (f)" value={f} min={-200} max={200} step={5} unit="px" onChange={setF} color="#14B8A6" />
            </div>

            <div className="p-5 bg-white border-[4px] border-black shadow-[6px_6px_0px_#000] -rotate-1 mt-4">
                <div className="flex justify-between items-center mb-6 border-b-[3px] border-black pb-2">
                    <span className="text-xl font-black text-black uppercase tracking-tighter">CİSİM (OBJECT)</span>
                </div>
                <PhysicsSlider label="Cisme Uzaklık (do)" value={do_val} min={20} max={350} step={5} unit="px" onChange={setDoVal} color="#FACC15" />
                <div className="my-8"></div>
                <PhysicsSlider label="Cisim Boyu (ho)" value={ho} min={10} max={150} step={5} unit="px" onChange={setHo} color="#FACC15" />
            </div>

            {/* Live Data Dashboard */}
            <div className="mt-8 p-4 bg-black border-[4px] border-black shadow-[6px_6px_0px_#14B8A6] grid grid-cols-2 gap-4 text-white">
                <div>
                    <p className="text-sm text-[#14B8A6] uppercase font-black">GÖR. UZAKLIĞI (di)</p>
                    <p className="text-3xl font-black tracking-tighter">
                        {isInfinity ? "SONSUZ" : di.toFixed(1)}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-[#14B8A6] uppercase font-black">GÖR. BOYU (hi)</p>
                    <p className="text-3xl font-black tracking-tighter">
                        {isInfinity ? "-" : Math.abs(hi).toFixed(1)}
                    </p>
                </div>
                <div className="col-span-2 pt-2 border-t-[4px] border-dashed border-[#14B8A6]/50 flex justify-between items-center mt-2">
                    <p className="text-lg text-[#14B8A6] uppercase font-black">GÖRÜNTÜ TİPİ</p>
                    <p className="text-xl font-black bg-white text-black px-2 border-[2px] border-black uppercase shadow-[2px_2px_0px_#14B8A6]">
                        {isInfinity ? "BELİRSİZ" : isReal ? "GERÇEK (TERS)" : "SANAL (DÜZ)"}
                    </p>
                </div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-8 p-4">
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter leading-none border-b-[4px] border-black pb-4">
                MERCEKLER VE IŞIĞIN KIRILMASI
            </h2>
            <p className="text-lg font-bold leading-tight border-l-[4px] border-black pl-4">
                Işık farklı bir ortama girerken kırılır. Mercekler, özel kavisli yapıları sayesinde ışığı belli bir noktada (odak) toplamak veya dağıtmak için tasarlanmıştır.
            </p>

            <div className="p-6 bg-[#14B8A6] border-[4px] border-black shadow-[8px_8px_0px_#000] text-center rotate-1 my-8">
                <span className="text-black uppercase font-black block mb-2 text-xl tracking-tighter">İNCE KENARLI MERCEK DENKLEMİ</span>
                <p className="text-4xl font-black text-white text-stroke-black drop-shadow-[2px_2px_0px_#000]">1/f = 1/di + 1/do</p>
            </div>

            <ul className="space-y-4 text-sm md:text-base font-bold uppercase">
                <li className="flex gap-4 items-start"><span className="text-xl">👉</span> <span><strong className="text-black bg-white px-1 border-2 border-black">Gerçek Görüntü:</strong> Işınların kendilerinin kesiştiği yerde oluşur (Perdeye yansıtılabilir).</span></li>
                <li className="flex gap-4 items-start"><span className="text-xl">👉</span> <span><strong className="text-black bg-white px-1 border-2 border-black">Sanal Görüntü:</strong> Işınların uzantılarının kesiştiği yerde oluşur (Gözümüzle merceğin içinden bakarız).</span></li>
                <li className="flex gap-4 items-start"><span className="text-xl">🔍</span> <span><strong className="text-black bg-[#FACC15] px-1 border-2 border-black">Yakınsak (İnce Kenarlı):</strong> Işınları toplar. Odak dışındaki cisimleri ters çevirip büyütür veya küçültür. Odak içindeki cisimleri büyüteç gibi gösterir.</span></li>
                <li className="flex gap-4 items-start"><span className="text-xl">🕶️</span> <span><strong className="text-black border-2 border-black px-1 line-through">Iraksak (Kalın Kenarlı):</strong> Işınları saçar. Görüntüyü her zaman daha küçük, düz ve sanal yapar. (Örn: Miyop gözlüğü).</span></li>
            </ul>
        </div>
    );

    const Missions = (
        <div className="space-y-6 pt-4">
            {missions.map((m) => (
                <div
                    key={m.id}
                    className={`relative p-6 border-[4px] border-black shadow-[6px_6px_0px_#000] transition-all duration-300 ${m.isCompleted
                        ? "bg-[#4ADE80] scale-[1.02] shadow-[8px_8px_0px_#000]"
                        : "bg-white hover:bg-zinc-100"
                        }`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <h3 className={`text-2xl font-black uppercase tracking-tighter leading-none w-4/5 ${m.isCompleted ? 'text-black' : 'text-black'}`}>
                            {m.title}
                        </h3>
                        {m.isCompleted && (
                            <div className="text-black border-2 border-black rounded-full bg-white p-1 shadow-[2px_2px_0px_#000]">
                                <CheckCircle2 className="w-8 h-8 stroke-[3px]" />
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-bold uppercase leading-snug border-t-[3px] border-black pt-4">{m.desc}</p>

                    <AnimatePresence>
                        {m.isCompleted && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="pt-4 mt-4 border-t-[4px] border-dashed border-black text-sm text-black font-black uppercase leading-tight bg-white p-4"
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
            title={simData?.title || "GEOMETRİK OPTİK"}
            color={simData?.color || "#14B8A6"}
            controlsArea={Controls}
            theoryArea={Theory}
            missionsArea={Missions}
        >
            <div className="w-full h-full p-0 relative flex items-center justify-center bg-[#FFFDF0]">
                {/* SVG Canvas optimized for Brutalism */}
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="origin-center"
                >
                    {/* Background Grid */}
                    <g opacity="0.3">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={canvasHeight} stroke="#000" strokeWidth="1" />
                        ))}
                        {Array.from({ length: 15 }).map((_, i) => (
                            <line key={`h${i}`} x1="0" y1={i * 40} x2={canvasWidth} y2={i * 40} stroke="#000" strokeWidth="1" />
                        ))}
                    </g>

                    {/* Principal Axis */}
                    <line x1="0" y1={centerY} x2={canvasWidth} y2={centerY} stroke="#000" strokeWidth="4" strokeDasharray="16 8" />

                    {/* Focal Points Base Axis Marking */}
                    <line x1={centerX} y1={centerY - 20} x2={centerX} y2={centerY + 20} stroke="#000" strokeWidth="6" />

                    {/* Focal Points */}
                    {Math.abs(f) > 0 && (
                        <>
                            <circle cx={centerX - Math.abs(f)} cy={centerY} r="6" fill="#FFF" stroke="#000" strokeWidth="3" />
                            <text x={centerX - Math.abs(f)} y={centerY + 24} fill="#000" fontSize="18" textAnchor="middle" fontWeight="900" fontFamily="sans-serif">F</text>

                            <circle cx={centerX - 2 * Math.abs(f)} cy={centerY} r="6" fill="#FFF" stroke="#000" strokeWidth="3" />
                            <text x={centerX - 2 * Math.abs(f)} y={centerY + 24} fill="#000" fontSize="18" textAnchor="middle" fontWeight="900" fontFamily="sans-serif">2F</text>

                            <circle cx={centerX + Math.abs(f)} cy={centerY} r="6" fill="#FFF" stroke="#000" strokeWidth="3" />
                            <text x={centerX + Math.abs(f)} y={centerY + 24} fill="#000" fontSize="18" textAnchor="middle" fontWeight="900" fontFamily="sans-serif">F'</text>

                            <circle cx={centerX + 2 * Math.abs(f)} cy={centerY} r="6" fill="#FFF" stroke="#000" strokeWidth="3" />
                            <text x={centerX + 2 * Math.abs(f)} y={centerY + 24} fill="#000" fontSize="18" textAnchor="middle" fontWeight="900" fontFamily="sans-serif">2F'</text>
                        </>
                    )}

                    {/* The Lens (Brutalist Style) */}
                    {f > 0 ? (
                        // Convex Lens
                        <path d={`M ${centerX} ${centerY - lensRadiusY} Q ${centerX + lensRadiusX * 2} ${centerY} ${centerX} ${centerY + lensRadiusY} Q ${centerX - lensRadiusX * 2} ${centerY} ${centerX} ${centerY - lensRadiusY} Z`} fill="#14B8A6" stroke="#000" strokeWidth="5" />
                    ) : f < 0 ? (
                        // Concave Lens
                        <path d={`M ${centerX - lensRadiusX} ${centerY - lensRadiusY} L ${centerX + lensRadiusX} ${centerY - lensRadiusY} Q ${centerX} ${centerY} ${centerX + lensRadiusX} ${centerY + lensRadiusY} L ${centerX - lensRadiusX} ${centerY + lensRadiusY} Q ${centerX} ${centerY} ${centerX - lensRadiusX} ${centerY - lensRadiusY} Z`} fill="#14B8A6" stroke="#000" strokeWidth="5" />
                    ) : (
                        // Flat Glass
                        <rect x={centerX - 10} y={centerY - lensRadiusY} width="20" height={lensRadiusY * 2} fill="#FFF" stroke="#000" strokeWidth="4" />
                    )}


                    {/* ---------------- RAYS ---------------- */}
                    {Math.abs(f) > 0 && !isInfinity && (
                        <g>
                            {/* Ray 1: Parallel to refracted */}
                            <line x1={r1StartX} y1={r1StartY} x2={r1LensX} y2={r1LensY} stroke="#EF4444" strokeWidth="5" />
                            <line x1={r1LensX} y1={r1LensY} x2={r1EndX} y2={r1EndY} stroke="#EF4444" strokeWidth="5" />

                            {/* Ray 2: Optical Center */}
                            <line x1={r2StartX} y1={r2StartY} x2={r2EndX} y2={r2EndY} stroke="#3B82F6" strokeWidth="5" />

                            {/* Ray 3: Extraneous Ray just for flair */}
                            <line x1={r3StartX} y1={r3StartY} x2={centerX} y2={r3LensY} stroke="#10B981" strokeWidth="5" />
                            <line x1={centerX} y1={r3LensY} x2={canvasWidth} y2={r3LensY} stroke="#10B981" strokeWidth="5" />

                            {/* Virtual Backward Extensions if Virtual Image */}
                            {!isReal && (
                                <>
                                    <line x1={r1BackX} y1={r1BackY} x2={r1LensX} y2={r1LensY} stroke="#EF4444" strokeWidth="4" strokeDasharray="8 8" />
                                    <line x1={r2BackX} y1={r2BackY} x2={r2LensX} y2={r2LensY} stroke="#3B82F6" strokeWidth="4" strokeDasharray="8 8" />
                                    <line x1={r3BackX} y1={r3BackY} x2={centerX} y2={r3LensY} stroke="#10B981" strokeWidth="4" strokeDasharray="8 8" />
                                </>
                            )}
                        </g>
                    )}

                    {/* ---------------- OBJECT ---------------- */}
                    <g transform={`translate(${objX}, ${centerY})`}>
                        <line x1="0" y1="0" x2="0" y2={-ho} stroke="#000" strokeWidth="12" strokeLinecap="square" />
                        <line x1="0" y1="0" x2="0" y2={-ho} stroke="#FACC15" strokeWidth="6" strokeLinecap="square" />
                        {/* Triangle Tip with stroke */}
                        <polygon points={`0,${-ho - 12} -10,${-ho + 4} 10,${-ho + 4}`} fill="#FACC15" stroke="#000" strokeWidth="4" strokeLinejoin="miter" />
                    </g>

                    {/* ---------------- IMAGE ---------------- */}
                    {!isInfinity && Math.abs(di) < 2000 && (
                        <g transform={`translate(${imgX}, ${centerY})`}>
                            <line
                                x1="0" y1="0" x2="0" y2={-hi}
                                stroke="#000" strokeWidth="12" strokeLinecap="square"
                                strokeDasharray={!isReal ? "12 12" : "0"}
                            />
                            <line
                                x1="0" y1="0" x2="0" y2={-hi}
                                stroke="#F472B6" strokeWidth="6" strokeLinecap="square"
                                strokeDasharray={!isReal ? "12 12" : "0"}
                            />
                            {/* Triangle Tip */}
                            <polygon
                                points={`0,${-hi + (hi > 0 ? -12 : 12)} -10,${-hi + (hi > 0 ? 4 : -4)} 10,${-hi + (hi > 0 ? 4 : -4)}`}
                                fill="#F472B6" stroke="#000" strokeWidth="4" strokeLinejoin="miter"
                            />

                            <text x="0" y={hi > 0 ? -hi - 30 : -hi + 30} fill="#000" fontSize="16" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" className="bg-white px-2">
                                {isReal ? "GERÇEK" : "SANAL"}
                            </text>
                        </g>
                    )}

                    {/* The Eye (Viewing from right) */}
                    <g transform={`translate(${canvasWidth - 70}, ${centerY})`} opacity="1">
                        <rect x="-10" y="-30" width="80" height="60" fill="#FFF" stroke="#000" strokeWidth="4" />
                        <Eye className="w-16 h-16 text-black absolute" style={{ transform: 'translate(10px, -20px)' }} />
                        <text x="30" y="45" fill="#000" fontSize="18" textAnchor="middle" fontWeight="900" fontFamily="sans-serif">GÖZ</text>
                    </g>
                </svg>
            </div>
            <style jsx global>{`
                .text-stroke-black {
                    -webkit-text-stroke: 2px black;
                }
            `}</style>
        </SimulationLayout>
    );
}
