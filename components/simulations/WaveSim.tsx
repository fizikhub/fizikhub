"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider, PhysicsToggle } from "./core/ui";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WaveSim({ simData }: { simData: any }) {
    // -------------------------------------------------------------
    // 1. PHYSICS STATE
    // -------------------------------------------------------------
    // Wave 1
    const [amp1, setAmp1] = useState(30);
    const [freq1, setFreq1] = useState(2); // Hz visually
    const [speed1, setSpeed1] = useState(50); // visual speed

    // Wave 2
    const [amp2, setAmp2] = useState(30);
    const [freq2, setFreq2] = useState(2);
    const [speed2, setSpeed2] = useState(50);
    const [phaseShift, setPhaseShift] = useState(0); // degrees

    const [showComponents, setShowComponents] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);

    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // -------------------------------------------------------------
    // 2. SIMULATION ENGINE
    // -------------------------------------------------------------
    const resetSim = () => {
        setIsPlaying(false);
        setTime(0);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    const loop = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        if (isPlaying) {
            setTime(t => t + dt);
        }
        animationRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(loop);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying]);

    // -------------------------------------------------------------
    // 3. RENDER CALCULATIONS (SVG)
    // -------------------------------------------------------------
    const viewWidth = 1000;
    const viewHeight = 200;
    const pointsCount = 200; // Resolution
    const dx = viewWidth / pointsCount;

    // We build the path strings memoized per frame
    // Mathematically: y = A * sin(k*x - omega*t)
    // Here we'll map k = freq * const, omega = speed * const
    const phaseRad = phaseShift * (Math.PI / 180);

    let path1 = "";
    let path2 = "";
    let pathResult = "";

    for (let i = 0; i <= pointsCount; i++) {
        const x = i * dx;

        // k defines how many full cycles fit in viewWidth based on frequency
        const k1 = (freq1 * Math.PI * 2) / viewWidth;
        const omega1 = speed1;
        const y1 = amp1 * Math.sin(k1 * x - omega1 * time);

        const k2 = (freq2 * Math.PI * 2) / viewWidth;
        const omega2 = speed2;
        const y2 = amp2 * Math.sin(k2 * x - omega2 * time + phaseRad);

        const yRes = y1 + y2;

        const cmd = i === 0 ? "M" : "L";
        path1 += `${cmd} ${x},${y1} `;
        path2 += `${cmd} ${x},${y2} `;
        pathResult += `${cmd} ${x},${yRes} `;
    }

    // Peak amplitude dynamically (naive max bounding box)
    const maxPossAmp = amp1 + amp2;

    // -------------------------------------------------------------
    // 4. PEDAGOGICAL MISSIONS
    // -------------------------------------------------------------
    const [missions, setMissions] = useState([
        {
            id: 1,
            title: "Tam Yıkıcı Girişim",
            desc: "İki dalganın birbirini tamamen sönümlemesi (yok etmesi) için Faz Farkını ayarlayın. (İpucu: Dalgalar aynı genlik ve aynı frekansta ters gitmeli).",
            isCompleted: false,
            condition: () => amp1 === amp2 && freq1 === freq2 && phaseShift === 180 && isPlaying,
            successText: "Harika! İki dalga arasında 180° faz farkı olduğunda, birinin tepesi diğerinin çukuruna denk gelir ve birbirlerini yok ederler. Buna 'Yıkıcı Girişim' (Destructive Interference) denir."
        },
        {
            id: 2,
            title: "Maksimum Yapıcı Girişim",
            desc: "İki dalgayı da 30 birim genliğe getirip faz farkını 0 yapın, böylece 60 birimlik dev bir beyaz dalga elde edin!",
            isCompleted: false,
            condition: () => amp1 === 30 && amp2 === 30 && phaseShift === 0 && isPlaying,
            successText: "Mükemmel! Genlikler aynı yönde üst üste bindiği için toplam genlik fırladı. Buna 'Yapıcı Girişim' (Constructive Interference) denir."
        }
    ]);

    useEffect(() => {
        setMissions(prev => prev.map(m => {
            if (!m.isCompleted && m.condition()) {
                return { ...m, isCompleted: true };
            }
            return m;
        }));
    }, [amp1, amp2, freq1, freq2, phaseShift, isPlaying]);

    // -------------------------------------------------------------
    // 5. UI COMPONENTS
    // -------------------------------------------------------------
    const Controls = (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 justify-between mb-2 bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#4ADE80] text-black font-black py-3 rounded-lg hover:bg-[#6EE7B7] transition-all active:scale-95 uppercase tracking-wider"
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
                    {isPlaying ? "DURDUR" : "BAŞLAT"}
                </button>
                <button
                    onClick={resetSim}
                    className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white active:scale-95"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="p-4 rounded-xl border border-[#FF6B6B]/30 bg-[#FF6B6B]/5">
                    <h3 className="text-xs font-black text-[#FF6B6B] uppercase mb-4 tracking-widest">1. Dalga (Kırmızı)</h3>
                    <PhysicsSlider label="Genlik (A₁)" value={amp1} min={0} max={50} step={1} onChange={setAmp1} color="#FF6B6B" />
                    <PhysicsSlider label="Frekans (f₁)" value={freq1} min={0.5} max={5} step={0.1} onChange={setFreq1} color="#FF6B6B" />
                </div>

                <div className="p-4 rounded-xl border border-[#38BDF8]/30 bg-[#38BDF8]/5">
                    <h3 className="text-xs font-black text-[#38BDF8] uppercase mb-4 tracking-widest">2. Dalga (Mavi)</h3>
                    <PhysicsSlider label="Genlik (A₂)" value={amp2} min={0} max={50} step={1} onChange={setAmp2} color="#38BDF8" />
                    <PhysicsSlider label="Frekans (f₂)" value={freq2} min={0.5} max={5} step={0.1} onChange={setFreq2} color="#38BDF8" />
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-xs font-black text-white uppercase mb-4 tracking-widest">Etkileşim (Girişim)</h3>
                    <PhysicsSlider label="Faz Farkı (Δφ)" value={phaseShift} min={0} max={360} step={15} unit="°" onChange={setPhaseShift} color="#A78BFA" />
                    <PhysicsToggle label="Bileşen Dalgaları Göster" checked={showComponents} onChange={setShowComponents} color="#FCD34D" />
                </div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-white italic">SÜPERPOZİSYON İLKESİ</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                İki veya daha fazla dalga aynı ortamda karşılaştıklarında birbirlerinin içinden geçerler. Kesiştikleri
                noktalarda dalgaların anlık genliklerinin cebirsel toplamı, "Bileşke Dalga"yı oluşturur.
            </p>

            <div className="grid gap-4 mt-6">
                <div className="p-4 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/30 shadow-[0_0_20px_rgba(74,222,128,0.1)]">
                    <span className="text-xs text-[#4ADE80] uppercase font-black block mb-2">Yapıcı Girişim</span>
                    <p className="text-sm text-zinc-300">
                        Dalgalar <strong>aynı fazda (Δφ = 0°, 360°)</strong> karşılaştığında tepeler tepelerle, çukurlar çukurlarla üst üste biner. Sonuçta genlik maksimum olur.
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <span className="text-xs text-red-500 uppercase font-black block mb-2">Yıkıcı Girişim</span>
                    <p className="text-sm text-zinc-300">
                        Dalgalar <strong>zıt fazda (Δφ = 180°)</strong> karşılaştığında birinin tepesi diğerinin çukuruna gelir. Genlikleri eşitse birbirlerini tamamen sönümlerler (toplam = 0).
                    </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className="text-sm font-mono text-white">y(x,t) = y₁(x,t) + y₂(x,t)</p>
                </div>
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
            title={simData.title || "Dalga Girişimi"}
            color={simData.color || "#4ADE80"}
            controlsArea={Controls}
            theoryArea={Theory}
            missionsArea={Missions}
        >
            <div className="w-full h-full p-4 relative flex items-center justify-center">
                <div className="w-full relative h-[400px]">
                    {/* Max Envelope Indicator */}
                    <div
                        className="absolute inset-x-0 mx-auto border-t border-b border-white/10 transition-all duration-300"
                        style={{
                            top: `calc(50% - ${maxPossAmp}px)`,
                            height: `${maxPossAmp * 2}px`,
                            background: 'linear-gradient(to bottom, transparent 49%, rgba(255,255,255,0.05) 50%, transparent 51%)'
                        }}
                    />

                    <svg
                        width="100%"
                        height="100%"
                        viewBox={`0 -100 ${viewWidth} 200`}
                        preserveAspectRatio="none"
                        className="absolute inset-0 drop-shadow-2xl"
                    >
                        {/* Axis */}
                        <line x1="0" y1="0" x2={viewWidth} y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5 5" />

                        <AnimatePresence>
                            {showComponents && (
                                <motion.g
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {/* Wave 1 */}
                                    <path
                                        d={path1}
                                        fill="none"
                                        stroke="#FF6B6B"
                                        strokeWidth="3"
                                        opacity="0.6"
                                        style={{ filter: "drop-shadow(0px 0px 5px rgba(255,107,107,0.5))" }}
                                    />
                                    {/* Wave 2 */}
                                    <path
                                        d={path2}
                                        fill="none"
                                        stroke="#38BDF8"
                                        strokeWidth="3"
                                        opacity="0.6"
                                        style={{ filter: "drop-shadow(0px 0px 5px rgba(56,189,248,0.5))" }}
                                    />
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Resultant Wave */}
                        <path
                            d={pathResult}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="5"
                            style={{ filter: "drop-shadow(0px 0px 10px rgba(255,255,255,0.8))" }}
                        />
                    </svg>
                </div>
            </div>
        </SimulationLayout>
    );
}
