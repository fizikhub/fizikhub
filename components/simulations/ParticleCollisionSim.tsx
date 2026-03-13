"use client";

import React, { useState, useEffect, useRef } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider } from "./core/ui";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";

export function ParticleCollisionSim({ simData }: { simData: any }) {
    const accentColor = simData?.color || "#DC2626";
    const canvasWidth = 800;
    const canvasHeight = 400;

    const [mass1, setMass1] = useState(2);
    const [mass2, setMass2] = useState(2);
    const [initV1, setInitV1] = useState(5);
    const [initV2, setInitV2] = useState(-3);
    const [restitution, setRestitution] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [x1, setX1] = useState(200);
    const [x2, setX2] = useState(600);
    const [v1, setV1] = useState(5);
    const [v2, setV2] = useState(-3);
    const [hasCollided, setHasCollided] = useState(false);
    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    const resetSim = () => { setIsPlaying(false); setX1(200); setX2(600); setV1(initV1); setV2(initV2); setHasCollided(false); lastTimeRef.current = 0; if (animationRef.current) cancelAnimationFrame(animationRef.current); };

    useEffect(() => { if (!isPlaying && !hasCollided) { setV1(initV1); setV2(initV2); } }, [initV1, initV2, isPlaying, hasCollided]);

    const radius1 = 20 + Math.sqrt(mass1) * 8;
    const radius2 = 20 + Math.sqrt(mass2) * 8;

    const loop = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;
        if (isPlaying) {
            const tick = dt * 15;
            setX1(prevX1 => {
                let nextX1 = prevX1 + v1 * tick;
                setX2(prevX2 => {
                    let nextX2 = prevX2 + v2 * tick;
                    if (nextX1 - radius1 < 0) { nextX1 = radius1; setV1(v => Math.abs(v) * restitution); }
                    if (nextX2 + radius2 > canvasWidth) { nextX2 = canvasWidth - radius2; setV2(v => -Math.abs(v) * restitution); }
                    if (nextX2 - radius2 < 0) { nextX2 = radius2; setV2(v => Math.abs(v) * restitution); }
                    if (nextX1 + radius1 > canvasWidth) { nextX1 = canvasWidth - radius1; setV1(v => -Math.abs(v) * restitution); }
                    const dx = nextX2 - nextX1;
                    const minDist = radius1 + radius2;
                    if (Math.abs(dx) < minDist) {
                        setHasCollided(true);
                        const overlap = minDist - Math.abs(dx);
                        const push1 = (mass2 / (mass1 + mass2)) * overlap;
                        const push2 = (mass1 / (mass1 + mass2)) * overlap;
                        if (nextX1 < nextX2) { nextX1 -= push1; nextX2 += push2; } else { nextX1 += push1; nextX2 -= push2; }
                        const curV1 = v1; const curV2 = v2;
                        const newV1 = ((mass1 - restitution * mass2) * curV1 + mass2 * (1 + restitution) * curV2) / (mass1 + mass2);
                        const newV2 = (mass1 * (1 + restitution) * curV1 + (mass2 - restitution * mass1) * curV2) / (mass1 + mass2);
                        setV1(newV1); setV2(newV2);
                    }
                    return nextX2;
                });
                return nextX1;
            });
        }
        animationRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(loop);
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [isPlaying, mass1, mass2, restitution, v1, v2]);

    const [missions, setMissions] = useState([
        { id: 1, title: "Mükemmel Aktarım", desc: "Kütleleri eşitle (m1=m2), e=1. Bir cismi durdur (hız=0) ve diğerini çarptır.", isCompleted: false,
            condition: () => mass1 === mass2 && restitution === 1 && (initV1 === 0 || initV2 === 0) && hasCollided && isPlaying,
            successText: "Kütleleri eşit cisimler esnek çarpışırsa hızlarını birbirlerine aktarırlar!" },
        { id: 2, title: "Kenetlenme (İnelastik)", desc: "e=0 yapıp cisimlerin yapışıp birlikte hareket etmesini sağla.", isCompleted: false,
            condition: () => restitution === 0 && hasCollided && isPlaying && Math.abs(v1 - v2) < 0.1,
            successText: "Tamamen inelastik çarpışmalarda cisimler kenetlenir. Kinetik enerjinin bir kısmı ısıya dönüşür." },
        { id: 3, title: "Ağır Sıklet Şoku", desc: "m1≥8kg, m2≤2kg, hız>3, e≈1 yapıp çarptır.", isCompleted: false,
            condition: () => mass1 >= 8 && mass2 <= 2 && initV1 > 3 && restitution > 0.8 && hasCollided,
            successText: "Küçük cisim devasa bir hızla fırladı! Dev kütlenin momentumu kendini korurken ufaklık inanılmaz hızlanmak zorundadır." }
    ]);

    useEffect(() => { setMissions(prev => prev.map(m => { if (!m.isCompleted && m.condition()) return { ...m, isCompleted: true }; return m; })); }, [mass1, mass2, restitution, initV1, initV2, hasCollided, isPlaying, v1, v2]);

    const Controls = (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <button onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 text-white font-black py-3 rounded-lg border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all uppercase tracking-wider text-sm"
                    style={{ backgroundColor: accentColor }}>
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                    {isPlaying ? "DURDUR" : "BAŞLAT"}
                </button>
                <button onClick={resetSim} className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-lg border-[3px] border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95">
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="p-3 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[2px_2px_0px_0px_#000] space-y-4">
                <span className="text-[10px] font-black text-white px-2 uppercase tracking-widest rounded py-0.5 border-[2px] border-black bg-blue-600">Cisim 1 (Mavi)</span>
                <PhysicsSlider label="Kütle (m1)" value={mass1} min={1} max={10} step={1} unit="kg" onChange={setMass1} color="#2563EB" />
                <PhysicsSlider label="İlk Hız (v1)" value={initV1} min={-10} max={10} step={1} unit="m/s" onChange={setInitV1} color="#2563EB" />
            </div>

            <div className="p-3 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[2px_2px_0px_0px_#000] space-y-4">
                <span className="text-[10px] font-black text-black px-2 uppercase tracking-widest rounded py-0.5 border-[2px] border-black bg-amber-500">Cisim 2 (Amber)</span>
                <PhysicsSlider label="Kütle (m2)" value={mass2} min={1} max={10} step={1} unit="kg" onChange={setMass2} color="#D97706" />
                <PhysicsSlider label="İlk Hız (v2)" value={initV2} min={-10} max={10} step={1} unit="m/s" onChange={setInitV2} color="#D97706" />
            </div>

            <div className="p-3 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[2px_2px_0px_0px_#000]">
                <PhysicsSlider label="Esneklik (e)" value={restitution} min={0} max={1} step={0.1} onChange={setRestitution} color="#16A34A" />
            </div>

            <div className="p-4 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[3px_3px_0px_0px_#000] grid grid-cols-2 gap-4">
                <div><p className="text-[10px] text-zinc-500 uppercase font-black">Momentum (1)</p><p className="text-xl font-mono text-blue-500">{(mass1 * v1).toFixed(1)} Ns</p></div>
                <div><p className="text-[10px] text-zinc-500 uppercase font-black">Momentum (2)</p><p className="text-xl font-mono text-amber-500">{(mass2 * v2).toFixed(1)} Ns</p></div>
                <div className="col-span-2 pt-2 border-t border-zinc-700">
                    <p className="text-[10px] text-zinc-500 uppercase font-black text-center">Toplam Sistem Momentumu</p>
                    <p className="text-2xl font-mono text-foreground text-center">{(mass1 * v1 + mass2 * v2).toFixed(1)} Ns</p>
                </div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-5">
            <h2 className="text-xl font-black text-foreground uppercase">Momentum Korunumu P(i) = P(f)</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">Dışarıdan net bir kuvvet etki etmediği sürece, bir sistemin toplam momentumu <strong>DAİMA</strong> korunur.</p>
            <div className="p-4 rounded-lg border-[2px] border-black shadow-[3px_3px_0px_0px_#000] text-center" style={{ backgroundColor: accentColor }}>
                <span className="text-xs text-white uppercase font-black block mb-2">Momentum Denklemi</span>
                <p className="text-lg font-mono text-white font-bold">m₁·v₁i + m₂·v₂i = m₁·v₁f + m₂·v₂f</p>
            </div>
            <ul className="space-y-2 mt-2 text-sm text-zinc-300">
                <li>• <strong>Momentum (P = m·v):</strong> Kütle ve hızın çarpımıdır, vektöreldir.</li>
                <li>• <strong>e=1 (Esnek):</strong> Kinetik enerji tamamen korunur.</li>
                <li>• <strong>e=0 (İnelastik):</strong> Cisimler kenetlenir, kinetik enerji ısı/sese dönüşür.</li>
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
        <SimulationLayout title={simData?.title || "1D Çarpışmalar"} color={accentColor} controlsArea={Controls} theoryArea={Theory} missionsArea={Missions}>
            <div className="w-full h-full p-0 relative flex items-center justify-center">
                <svg width="100%" height="100%" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} preserveAspectRatio="xMidYMid meet" className="origin-center">
                    <line x1="0" y1={canvasHeight / 2 + 50} x2={canvasWidth} y2={canvasHeight / 2 + 50} stroke="#444" strokeWidth="4" />
                    <rect x="0" y={canvasHeight / 2 + 50} width={canvasWidth} height="20" fill="#222" />

                    <g transform={`translate(${x1}, ${canvasHeight / 2 + 50 - radius1})`}>
                        <circle r={radius1} fill="#2563EB" stroke="#000" strokeWidth="3" />
                        <text x="0" y="5" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">{mass1}kg</text>
                        {Math.abs(v1) > 0.1 && (
                            <g opacity="0.8" transform={`translate(0, -${radius1 + 10})`}>
                                <line x1="0" y1="0" x2={v1 * 10} y2="0" stroke="#fff" strokeWidth="3" />
                                <polygon points={`${v1 * 10},0 ${v1 * 10 - Math.sign(v1) * 8},-4 ${v1 * 10 - Math.sign(v1) * 8},4`} fill="#fff" />
                                <text x={v1 * 10 / 2} y="-10" fill="#fff" fontSize="12" textAnchor="middle">{Math.abs(v1).toFixed(1)}</text>
                            </g>
                        )}
                    </g>

                    <g transform={`translate(${x2}, ${canvasHeight / 2 + 50 - radius2})`}>
                        <circle r={radius2} fill="#D97706" stroke="#000" strokeWidth="3" />
                        <text x="0" y="5" fill="#000" fontSize="14" fontWeight="bold" textAnchor="middle">{mass2}kg</text>
                        {Math.abs(v2) > 0.1 && (
                            <g opacity="0.8" transform={`translate(0, -${radius2 + 10})`}>
                                <line x1="0" y1="0" x2={v2 * 10} y2="0" stroke="#fff" strokeWidth="3" />
                                <polygon points={`${v2 * 10},0 ${v2 * 10 - Math.sign(v2) * 8},-4 ${v2 * 10 - Math.sign(v2) * 8},4`} fill="#fff" />
                                <text x={v2 * 10 / 2} y="-10" fill="#fff" fontSize="12" textAnchor="middle">{Math.abs(v2).toFixed(1)}</text>
                            </g>
                        )}
                    </g>

                    <AnimatePresence>
                        {hasCollided && isPlaying && Math.abs(x1 - x2) < radius1 + radius2 + 5 && (
                            <motion.circle initial={{ opacity: 1, r: 0 }} animate={{ opacity: 0, r: 100 }} exit={{ opacity: 0 }} cx={(x1 + x2) / 2} cy={canvasHeight / 2 + 50 - Math.max(radius1, radius2)} fill="transparent" stroke="#FFF" strokeWidth="5" />
                        )}
                    </AnimatePresence>
                </svg>
            </div>
        </SimulationLayout>
    );
}
