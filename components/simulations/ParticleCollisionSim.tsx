"use client";

import React, { useState, useEffect, useRef } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider } from "./core/ui";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ParticleCollisionSim({ simData }: { simData: any }) {
    // -------------------------------------------------------------
    // 1. STATE
    // -------------------------------------------------------------
    const canvasWidth = 800;
    const canvasHeight = 400;

    const [mass1, setMass1] = useState(2);
    const [mass2, setMass2] = useState(2);
    const [initV1, setInitV1] = useState(5);
    const [initV2, setInitV2] = useState(-3);
    const [restitution, setRestitution] = useState(1); // e = 1 (elastic), 0 (inelastic)

    const [isPlaying, setIsPlaying] = useState(false);

    // Physics Engine State
    const [x1, setX1] = useState(200);
    const [x2, setX2] = useState(600);
    const [v1, setV1] = useState(initV1);
    const [v2, setV2] = useState(initV2);
    const [hasCollided, setHasCollided] = useState(false);

    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // Initial / Reset
    const resetSim = () => {
        setIsPlaying(false);
        setX1(200);
        setX2(600);
        setV1(initV1);
        setV2(initV2);
        setHasCollided(false);
        lastTimeRef.current = 0;
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    // Keep initial velocities synced when stopped
    useEffect(() => {
        if (!isPlaying && !hasCollided) {
            setV1(initV1);
            setV2(initV2);
        }
    }, [initV1, initV2, isPlaying, hasCollided]);

    // -------------------------------------------------------------
    // 2. SIMULATION ENGINE
    // -------------------------------------------------------------
    const radius1 = 20 + Math.sqrt(mass1) * 8;
    const radius2 = 20 + Math.sqrt(mass2) * 8;

    const loop = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        if (isPlaying) {
            // Speed factor
            const tick = dt * 15;

            setX1(prevX1 => {
                let nextX1 = prevX1 + v1 * tick;
                setX2(prevX2 => {
                    let nextX2 = prevX2 + v2 * tick;

                    // Check Wall Collisions
                    // Wall 1 (Left)
                    if (nextX1 - radius1 < 0) {
                        nextX1 = radius1;
                        setV1(v => Math.abs(v) * restitution);
                    }
                    // Wall 2 (Right)
                    if (nextX2 + radius2 > canvasWidth) {
                        nextX2 = canvasWidth - radius2;
                        setV2(v => -Math.abs(v) * restitution);
                    }

                    // Same for crossed bounds (just in case they swap)
                    if (nextX2 - radius2 < 0) {
                        nextX2 = radius2;
                        setV2(v => Math.abs(v) * restitution);
                    }
                    if (nextX1 + radius1 > canvasWidth) {
                        nextX1 = canvasWidth - radius1;
                        setV1(v => -Math.abs(v) * restitution);
                    }

                    // Check Particle Collision
                    // Since it's 1D and Particle 1 is usually left of Particle 2:
                    const dx = nextX2 - nextX1;
                    const minDist = radius1 + radius2;

                    if (Math.abs(dx) < minDist) {
                        // They collided!
                        setHasCollided(true);

                        // Separate them so they don't get stuck
                        const overlap = minDist - Math.abs(dx);
                        const push1 = (mass2 / (mass1 + mass2)) * overlap;
                        const push2 = (mass1 / (mass1 + mass2)) * overlap;

                        // Assume X1 is actually on the left
                        if (nextX1 < nextX2) {
                            nextX1 -= push1;
                            nextX2 += push2;
                        } else {
                            nextX1 += push1;
                            nextX2 -= push2;
                        }

                        // Calculate new velocities (1D Collision Formula)
                        const curV1 = v1;
                        const curV2 = v2;
                        const newV1 = ((mass1 - restitution * mass2) * curV1 + mass2 * (1 + restitution) * curV2) / (mass1 + mass2);
                        const newV2 = (mass1 * (1 + restitution) * curV1 + (mass2 - restitution * mass1) * curV2) / (mass1 + mass2);
                        setV1(newV1);
                        setV2(newV2);
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
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, mass1, mass2, restitution, v1, v2]);

    // -------------------------------------------------------------
    // 3. MISSIONS
    // -------------------------------------------------------------
    const [missions, setMissions] = useState([
        {
            id: 1,
            title: "Mükemmel Aktarım",
            desc: "Kütleleri eşitle (m1 = m2). Esneklik 1 olsun. Bir cismi durdur (hız=0) ve diğerini ona çarptır.",
            isCompleted: false,
            condition: () => mass1 === mass2 && restitution === 1 && (initV1 === 0 || initV2 === 0) && hasCollided && isPlaying,
            successText: "Kütleleri eşit cisimler esnek çarpışırsa hızlarını birbirlerine aktarırlar! Duran cisim hareketlenir, çarpan durur."
        },
        {
            id: 2,
            title: "Kenetlenme (İnelastik)",
            desc: "Çarpışma sonrasında cisimlerin yapışıp birlikte hareket etmesini sağla (e=0 ve zıt yönlü hızlar).",
            isCompleted: false,
            condition: () => restitution === 0 && hasCollided && isPlaying && Math.abs(v1 - v2) < 0.1,
            successText: "Tamamen esnek olmayan çarpışmalarda cisimler kenetlenir (e=0). Kinetik enerjinin bir kısmı ısıya dönüşür."
        },
        {
            id: 3,
            title: "Ağır Sıklet Şoku",
            desc: "m1'i devasa (10kg), m2'yi küçücük (1kg) yap. Esneklik 1 olsun. m1'i m2'ye hızlıca çarptır.",
            isCompleted: false,
            condition: () => mass1 >= 8 && mass2 <= 2 && initV1 > 3 && restitution > 0.8 && hasCollided,
            successText: "Küçük cisim devasa bir hızla fırlar! Çünkü dev kütlenin momentumu kendini korumak isterken ufaklık bu enerjiyi taşımak için inanılmaz hızlanmak zorundadır."
        }
    ]);

    useEffect(() => {
        setMissions(prev => prev.map(m => {
            if (!m.isCompleted && m.condition()) {
                return { ...m, isCompleted: true };
            }
            return m;
        }));
    }, [mass1, mass2, restitution, initV1, initV2, hasCollided, isPlaying, v1, v2]);

    // -------------------------------------------------------------
    // 4. UI COMPONENTS
    // -------------------------------------------------------------
    const Controls = (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 justify-between mb-2 bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#F87171] text-black font-black py-3 rounded-lg hover:bg-[#FCA5A5] transition-all active:scale-95 uppercase tracking-wider"
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
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-4">
                    <span className="text-[10px] font-black text-white px-2 uppercase tracking-widest bg-[#3B82F6] rounded-full py-0.5">Cisim 1 (Mavi)</span>
                    <PhysicsSlider label="Kütle (m1)" value={mass1} min={1} max={10} step={1} unit="kg" onChange={setMass1} color="#3B82F6" />
                    <PhysicsSlider label="İlk Hız (v1)" value={initV1} min={-10} max={10} step={1} unit="m/s" onChange={setInitV1} color="#60A5FA" />
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-4">
                    <span className="text-[10px] font-black text-black px-2 uppercase tracking-widest bg-[#FCD34D] rounded-full py-0.5">Cisim 2 (Sarı)</span>
                    <PhysicsSlider label="Kütle (m2)" value={mass2} min={1} max={10} step={1} unit="kg" onChange={setMass2} color="#FCD34D" />
                    <PhysicsSlider label="İlk Hız (v2)" value={initV2} min={-10} max={10} step={1} unit="m/s" onChange={setInitV2} color="#FDE68A" />
                </div>

                <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl">
                    <PhysicsSlider label="Esneklik (e)" value={restitution} min={0} max={1} step={0.1} onChange={setRestitution} color="#10B981" />
                </div>
            </div>

            {/* Live Data Dashboard */}
            <div className="mt-2 p-4 rounded-xl border border-white/10 bg-black/40 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Momentum (1)</p>
                    <p className="text-xl font-mono text-[#3B82F6]">{(mass1 * v1).toFixed(1)} Ns</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Momentum (2)</p>
                    <p className="text-xl font-mono text-[#FCD34D]">{(mass2 * v2).toFixed(1)} Ns</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-500 uppercase font-black text-center">Toplam Sistem Momentumu</p>
                    <p className="text-2xl font-mono text-white text-center">{(mass1 * v1 + mass2 * v2).toFixed(1)} Ns</p>
                </div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-white italic">MOMENTUM KORUNUMU P(i) = P(f)</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                Dışarıdan net bir kuvvet etki etmediği sürece, bir sistemin toplam momentumu <strong>DAİMA</strong> korunur.
            </p>

            <div className="grid gap-4 mt-4">
                <div className="p-4 rounded-xl bg-[#F87171]/10 border border-[#F87171]/30 shadow-[0_0_20px_rgba(248,113,113,0.1)] text-center">
                    <span className="text-xs text-[#F87171] uppercase font-black block mb-2">Momentum Denklemı</span>
                    <p className="text-lg font-mono text-[#F87171]">m₁·v₁i + m₂·v₂i = m₁·v₁f + m₂·v₂f</p>
                </div>

                <ul className="space-y-2 mt-2 text-sm text-zinc-300">
                    <li>• <strong>Momentum (P = m·v):</strong> Kütle ve hızın çarpımıdır, vektöreldir (yönü vardır).</li>
                    <li>• <strong>Esneklik (e):</strong> Çarpışmanın türünü belirler. <br /><br /><strong>e=1 (Esnek)</strong>: Kinetik enerji tamamen korunur.<br /><strong>e=0 (İnelastik)</strong>: Cisimler kenetlenir, kinetik enerji ısı/sese dönüşerek azalır.</li>
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

    const P1MomentumSize = Math.max(10, Math.abs(mass1 * v1) * 2);
    const P2MomentumSize = Math.max(10, Math.abs(mass2 * v2) * 2);

    return (
        <SimulationLayout
            title={simData?.title || "1D Çarpışmalar"}
            color={simData?.color || "#F87171"}
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
                    {/* Track/Ground */}
                    <line x1="0" y1={canvasHeight / 2 + 50} x2={canvasWidth} y2={canvasHeight / 2 + 50} stroke="#333" strokeWidth="4" />
                    <rect x="0" y={canvasHeight / 2 + 50} width={canvasWidth} height="20" fill="#111" />

                    {/* Particle 1 */}
                    <g transform={`translate(${x1}, ${canvasHeight / 2 + 50 - radius1})`}>
                        <circle
                            r={radius1}
                            fill="#3B82F6"
                            style={{ filter: "drop-shadow(0px 0px 10px rgba(59,130,246,0.6))" }}
                        />
                        <text x="0" y="5" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">{mass1}kg</text>

                        {/* Velocity Vector */}
                        {Math.abs(v1) > 0.1 && (
                            <g opacity="0.8" transform={`translate(0, -${radius1 + 10})`}>
                                <line x1="0" y1="0" x2={v1 * 10} y2="0" stroke="#fff" strokeWidth="3" />
                                <polygon
                                    points={`${v1 * 10},0 ${v1 * 10 - Math.sign(v1) * 8},-4 ${v1 * 10 - Math.sign(v1) * 8},4`}
                                    fill="#fff"
                                />
                                <text x={v1 * 10 / 2} y="-10" fill="#fff" fontSize="12" textAnchor="middle">{Math.abs(v1).toFixed(1)}</text>
                            </g>
                        )}
                    </g>

                    {/* Particle 2 */}
                    <g transform={`translate(${x2}, ${canvasHeight / 2 + 50 - radius2})`}>
                        <circle
                            r={radius2}
                            fill="#FCD34D"
                            style={{ filter: "drop-shadow(0px 0px 10px rgba(252,211,77,0.6))" }}
                        />
                        <text x="0" y="5" fill="#000" fontSize="14" fontWeight="bold" textAnchor="middle">{mass2}kg</text>

                        {/* Velocity Vector */}
                        {Math.abs(v2) > 0.1 && (
                            <g opacity="0.8" transform={`translate(0, -${radius2 + 10})`}>
                                <line x1="0" y1="0" x2={v2 * 10} y2="0" stroke="#fff" strokeWidth="3" />
                                <polygon
                                    points={`${v2 * 10},0 ${v2 * 10 - Math.sign(v2) * 8},-4 ${v2 * 10 - Math.sign(v2) * 8},4`}
                                    fill="#fff"
                                />
                                <text x={v2 * 10 / 2} y="-10" fill="#fff" fontSize="12" textAnchor="middle">{Math.abs(v2).toFixed(1)}</text>
                            </g>
                        )}
                    </g>

                    {/* Collision Flash Effect */}
                    <AnimatePresence>
                        {hasCollided && isPlaying && Math.abs(x1 - x2) < radius1 + radius2 + 5 && (
                            <motion.circle
                                initial={{ opacity: 1, r: 0 }}
                                animate={{ opacity: 0, r: 100 }}
                                exit={{ opacity: 0 }}
                                cx={(x1 + x2) / 2}
                                cy={canvasHeight / 2 + 50 - Math.max(radius1, radius2)}
                                fill="transparent"
                                stroke="#FFF"
                                strokeWidth="5"
                            />
                        )}
                    </AnimatePresence>
                </svg>
            </div>
        </SimulationLayout>
    );
}
