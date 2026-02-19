"use client";

import React, { useState, useEffect, useRef } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider, PhysicsToggle } from "./core/ui";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PendulumSim({ simData }: { simData: any }) {
    // -------------------------------------------------------------
    // 1. PHYSICS STATE
    // -------------------------------------------------------------
    const [length, setLength] = useState(2.0); // meters (scaled for display)
    const [gravity, setGravity] = useState(9.81); // m/s²
    const [mass, setMass] = useState(1.0); // kg
    const [damping, setDamping] = useState(0.0); // damping coefficient
    const [initialAngle, setInitialAngle] = useState(45); // degrees

    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [angle, setAngle] = useState(initialAngle * (Math.PI / 180));
    const [velocity, setVelocity] = useState(0);

    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // Derived physics values for display only
    const period = 2 * Math.PI * Math.sqrt(length / gravity);

    // -------------------------------------------------------------
    // 2. SIMULATION ENGINE
    // -------------------------------------------------------------
    const resetSim = () => {
        setIsPlaying(false);
        setTime(0);
        setAngle(initialAngle * (Math.PI / 180));
        setVelocity(0);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    const updatePhysics = (dt: number) => {
        // dt in seconds. Cap to avoid exploding if tab is inactive
        if (dt > 0.1) dt = 0.1;

        setAngle((prevAngle) => {
            setVelocity((prevVel) => {
                // simple verlet or euler: d^2(theta)/dt^2 = -(g/L)*sin(theta) - damping*v
                const acceleration = -(gravity / length) * Math.sin(prevAngle) - damping * prevVel;
                const newVel = prevVel + acceleration * dt;

                // update angle directly inside the setState to ensure synchronous matching
                const newAngle = prevAngle + newVel * dt;
                setAngle(newAngle);
                return newVel;
            });
            // We just updated via closure in setVelocity to prevent race conditions.
            // Return prevAngle, but it gets overwritten instantly by the nested update.
            return prevAngle;
        });

        setTime(t => t + dt);
    };

    const loop = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        if (isPlaying) {
            updatePhysics(dt);
        }
        animationRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(loop);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, gravity, length, damping]); // Re-attach when physics configs change

    // Restart when initial angle changes while stopped
    useEffect(() => {
        if (!isPlaying) {
            setAngle(initialAngle * (Math.PI / 180));
            setVelocity(0);
            setTime(0);
        }
    }, [initialAngle, isPlaying]);

    // -------------------------------------------------------------
    // 3. PEDAGOGICAL MISSIONS
    // -------------------------------------------------------------
    const [missions, setMissions] = useState([
        {
            id: 1,
            title: "Galileo'nun Sırrı",
            desc: "Fizikte periyot kütleye bağlı mıdır? Test etmek için kütleyi 5 kg yaparak simülasyonu başlat.",
            isCompleted: false,
            condition: () => mass >= 5 && isPlaying,
            successText: "Harika! Gördüğün gibi kütle değişse de salınım frekansı hiç değişmedi. Pendulum periyodu (T) sadece uzunluk ve yerçekimine bağlıdır."
        },
        {
            id: 2,
            title: "Dünya Dışı Fizik",
            desc: "Sarkacın çok daha yavaş salınmasını istiyoruz! Yerçekimini Ay seviyesine (yaklaşık 1.6 m/s²) düşür.",
            isCompleted: false,
            condition: () => gravity <= 2.0 && isPlaying,
            successText: "Mükemmel! Periyot (T) yerçekimi (g) ile ters orantılı olduğu için, yerçekimi azaldığında sarkaç çok daha yavaş sallanır."
        }
    ]);

    // Mission condition checker
    useEffect(() => {
        setMissions(prev => prev.map(m => {
            if (!m.isCompleted && m.condition()) {
                return { ...m, isCompleted: true };
            }
            return m;
        }));
    }, [mass, gravity, isPlaying]);

    // -------------------------------------------------------------
    // 4. RENDERERS
    // -------------------------------------------------------------
    const pivot = { x: 50, y: 10 }; // SVG percentages
    const visualLength = length * 15; // Scaling factor
    const bobX = pivot.x + Math.sin(angle) * visualLength;
    const bobY = pivot.y + Math.cos(angle) * visualLength;
    const bobRadius = 2 + (mass * 0.5); // Visual size based on mass

    const Controls = (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 justify-between mb-4 bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#FCD34D] text-black font-black py-3 rounded-lg hover:bg-[#FDE68A] transition-all active:scale-95 uppercase tracking-wider"
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

            <PhysicsSlider
                label="İp Uzunluğu (L)"
                value={length} min={0.5} max={4.0} step={0.1} unit="m"
                onChange={setLength} color="#FCD34D"
            />
            <PhysicsSlider
                label="Yerçekimi (g)"
                value={gravity} min={1.6} max={20.0} step={0.1} unit="m/s²"
                onChange={setGravity} color="#FCD34D"
            />
            <PhysicsSlider
                label="Kütle (m)"
                value={mass} min={0.1} max={10.0} step={0.1} unit="kg"
                onChange={setMass} color="#38BDF8"
            />
            <PhysicsSlider
                label="Başlangıç Açısı"
                value={initialAngle} min={-90} max={90} step={1} unit="°"
                onChange={setInitialAngle} color="#A78BFA"
            />
            <PhysicsSlider
                label="Hava Sürtünmesi"
                value={damping} min={0} max={0.5} step={0.01} unit=""
                onChange={setDamping} color="#F87171"
            />

            {/* Live Data Dashboard */}
            <div className="mt-4 p-4 rounded-xl border border-white/10 bg-black/40 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Teorik Periyot (T)</p>
                    <p className="text-xl font-mono text-[#FCD34D] drop-shadow-md">{period.toFixed(2)}s</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Anlık Açı (θ)</p>
                    <p className="text-xl font-mono text-white">{(angle * 180 / Math.PI).toFixed(1)}°</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Geçen Süre</p>
                    <p className="text-xl font-mono text-white">{time.toFixed(1)}s</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Açısal Hız (ω)</p>
                    <p className="text-xl font-mono text-white">{velocity.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-white italic">BASİT SARKAÇ TEORİSİ</h2>
            <p className="text-zinc-400 leading-relaxed">
                Basit sarkaç, ağırlığı ihmal edilen bir ipe asılmış noktasal bir kütleden oluşur. Küçük açılarda (&lt;15°)
                sarkacın hareketi <strong>Basit Harmonik Hareket (BHH)</strong> kabul edilir.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 my-4 flex justify-center">
                <p className="text-2xl font-mono text-[#FCD34D]">
                    T = 2π √(L/g)
                </p>
            </div>

            <ul className="space-y-3 text-zinc-300">
                <li className="flex gap-2">
                    <span className="text-[#FCD34D] font-bold">L:</span> İp uzunluğu (Metre) - Periyodu doğru orantılı olarak etkiler.
                </li>
                <li className="flex gap-2">
                    <span className="text-[#FCD34D] font-bold">g:</span> Yerçekimi ivmesi - Periyodu ters orantılı olarak etkiler.
                </li>
                <li className="flex gap-2">
                    <span className="text-[#FCD34D] font-bold">m:</span> Kütle - Periyoda HİÇBİR etkisi yoktur!
                </li>
            </ul>
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
            title={simData.title || "Basit Sarkaç"}
            color={simData.color || "#FCD34D"}
            controlsArea={Controls}
            theoryArea={Theory}
            missionsArea={Missions}
        >
            {/* The SVG Canvas */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {/* Pivot indicator */}
                <rect x="40" y="5" width="20" height="2" fill="#333" rx="1" />
                <circle cx={pivot.x} cy={pivot.y} r="1" fill="#666" />

                {/* Center axis guide line */}
                <line x1={pivot.x} y1={pivot.y} x2={pivot.x} y2="90" stroke="#ffffff10" strokeWidth="0.2" strokeDasharray="2 2" />

                {/* Pendulum String */}
                <line
                    x1={pivot.x} y1={pivot.y}
                    x2={bobX} y2={bobY}
                    stroke="#fff"
                    strokeWidth="0.5"
                    opacity={0.7}
                />

                {/* Pendulum Bob / Mass */}
                <circle
                    cx={bobX} cy={bobY}
                    r={bobRadius}
                    fill="#FCD34D"
                    style={{ filter: "drop-shadow(0px 0px 4px rgba(252, 211, 77, 0.5))" }}
                />

                {/* Highlight stroke for the bob */}
                <circle
                    cx={bobX} cy={bobY}
                    r={bobRadius + 0.2}
                    fill="transparent"
                    stroke="#ffffff"
                    strokeWidth="0.2"
                />
            </svg>
        </SimulationLayout>
    );
}
