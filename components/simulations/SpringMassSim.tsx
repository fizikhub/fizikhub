"use client";

import React, { useState, useEffect, useRef } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider, PhysicsToggle } from "./core/ui";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SpringMassSim({ simData }: { simData: any }) {
    // -------------------------------------------------------------
    // 1. PHYSICS STATE
    // -------------------------------------------------------------
    // Spring parameters
    const [springConstant, setSpringConstant] = useState(20); // k (N/m)
    const [mass, setMass] = useState(2); // m (kg)
    const [damping, setDamping] = useState(0.5); // b (kg/s)
    const [gravity, setGravity] = useState(9.81); // g (m/s²)
    const [showForces, setShowForces] = useState(true);

    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);

    // Initial / Unstretched state
    const unstretchedLength = 50;
    const [y, setY] = useState(50); // Displacement from unstretched length (m)
    const [velocity, setVelocity] = useState(0); // m/s

    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // -------------------------------------------------------------
    // 2. SIMULATION ENGINE
    // -------------------------------------------------------------
    const equilibriumY = (mass * gravity) / springConstant;
    const period = 2 * Math.PI * Math.sqrt(mass / springConstant);

    // Total stretch = y
    // System energy
    const kineticEnergy = 0.5 * mass * velocity * velocity;
    const springPotentialEnergy = 0.5 * springConstant * y * y;
    const gravityPotentialEnergy = mass * gravity * (100 - y); // Reference at bottom
    const totalEnergy = kineticEnergy + springPotentialEnergy + gravityPotentialEnergy;

    const resetSim = () => {
        setIsPlaying(false);
        setTime(0);
        setY(equilibriumY + 30); // Start displaced from equilibrium!
        setVelocity(0);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    const updatePhysics = (dt: number) => {
        if (dt > 0.1) dt = 0.1; // cap

        setY((prevY) => {
            setVelocity((prevV) => {
                // F_net = m*g - k*y - b*v
                // a = g - (k/m)*y - (b/m)*v
                const acceleration = gravity - (springConstant / mass) * prevY - (damping / mass) * prevV;
                const newV = prevV + acceleration * dt;

                const newY = prevY + newV * dt;
                setY(newY);
                return newV;
            });
            return prevY;
        });
        setTime(t => t + dt);
    };

    const loop = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        if (isPlaying) {
            updatePhysics(dt * 2); // 2x playback speed
        }
        animationRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(loop);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, springConstant, mass, damping, gravity]);

    // Force restart initially when params severely change while stopped (to prevent weird states)
    useEffect(() => {
        if (!isPlaying) {
            // Keep current y, but update equilibrium visual hints
        }
    }, [mass, springConstant, isPlaying]);

    // Initial setup
    useEffect(() => {
        resetSim();
    }, []);

    // -------------------------------------------------------------
    // 3. RENDER CALCULATIONS (SVG)
    // -------------------------------------------------------------
    const canvasWidth = 800;
    const canvasHeight = 600;

    const scale = 3; // 1 meter = 3 pixels on SVG for y-axis

    const visualPivotY = 50;
    const visualMassY = visualPivotY + unstretchedLength + (y * scale);
    const visualEquilibriumY = visualPivotY + unstretchedLength + (equilibriumY * scale);

    // Spring drawing function (Zig-zag)
    const generateSpringPath = (startY: number, endY: number) => {
        const coils = 12;
        const width = 20;
        const height = endY - startY;
        const coilHeight = height / coils;

        // Straight part at top and bottom
        let path = `M ${canvasWidth / 2} ${startY} `;

        for (let i = 0; i < coils; i++) {
            const currentY = startY + (i * coilHeight);
            const nextY = startY + ((i + 1) * coilHeight);
            const midY = (currentY + nextY) / 2;

            if (i % 2 === 0) {
                path += `L ${canvasWidth / 2 - width} ${midY} L ${canvasWidth / 2 + width} ${nextY} `;
            } else {
                path += `L ${canvasWidth / 2 + width} ${midY} L ${canvasWidth / 2 - width} ${nextY} `;
            }
        }
        path += `L ${canvasWidth / 2} ${endY}`;
        return path;
    };

    const springPath = generateSpringPath(visualPivotY, visualMassY - 15); // -15 to attach to top of mass box

    // -------------------------------------------------------------
    // 4. PEDAGOGICAL MISSIONS
    // -------------------------------------------------------------
    const [missions, setMissions] = useState([
        {
            id: 1,
            title: "Yüksek Frekans",
            desc: "Yay sarkacının çok hızlı titreşmesini sağla! (Yay sabiti 'k'yı maksimuma, kütleyi 'm'yi minimuma getir).",
            isCompleted: false,
            condition: () => springConstant >= 50 && mass <= 1.0 && isPlaying,
            successText: "Mükemmel! Periyot formülü T=2π√(m/k) olduğuna göre, kütle azaldıkça ve yay sertleştikçe (k arttıkça) titreşim inanılmaz hızlanır."
        },
        {
            id: 2,
            title: "Sönümleme Etkisi",
            desc: "Titreşen yaya bir hava/sıvı sürtünmesi (damping) uygula, katsayıyısını 2.0 yapıp yavaşça durmasını sağla.",
            isCompleted: false,
            condition: () => damping >= 2.0 && isPlaying,
            successText: "Harika! Sönümleme kuvveti hız ile ters yönlü çalışarak sistemin mekanik enerjisini ısıya dönüştürür ve hareketi durdurur."
        }
    ]);

    useEffect(() => {
        setMissions(prev => prev.map(m => {
            if (!m.isCompleted && m.condition()) {
                return { ...m, isCompleted: true };
            }
            return m;
        }));
    }, [springConstant, mass, damping, isPlaying]);

    // -------------------------------------------------------------
    // 5. UI COMPONENTS
    // -------------------------------------------------------------
    const Controls = (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 justify-between mb-2 bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#60A5FA] text-black font-black py-3 rounded-lg hover:bg-[#93C5FD] transition-all active:scale-95 uppercase tracking-wider"
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
                <PhysicsSlider label="Yay Sabiti (k)" value={springConstant} min={5} max={50} step={1} unit="N/m" onChange={setSpringConstant} color="#60A5FA" />
                <PhysicsSlider label="Kütle (m)" value={mass} min={0.5} max={10} step={0.5} unit="kg" onChange={setMass} color="#FCD34D" />
                <PhysicsSlider label="Sönümleme (b)" value={damping} min={0} max={3} step={0.1} unit="kg/s" onChange={setDamping} color="#FF6B6B" />
                <PhysicsSlider label="Yerçekimi (g)" value={gravity} min={0} max={20} step={0.5} unit="m/s²" onChange={setGravity} color="#A78BFA" />
                <PhysicsToggle label="Kuvvet Vektörlerini Göster" checked={showForces} onChange={setShowForces} color="#4ADE80" />
            </div>

            {/* Live Data Dashboard */}
            <div className="mt-2 p-4 rounded-xl border border-white/10 bg-black/40 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Teorik Periyot</p>
                    <p className="text-xl font-mono text-white">{period.toFixed(2)}s</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Uzanım (y)</p>
                    <p className="text-xl font-mono text-[#60A5FA] drop-shadow-md">{y.toFixed(2)}m</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Potansiyel Enerji</p>
                    <p className="text-xl font-mono text-[#4ADE80]">{springPotentialEnergy.toFixed(0)} J</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Kinetik Enerji</p>
                    <p className="text-xl font-mono text-[#FCD34D]">{kineticEnergy.toFixed(0)} J</p>
                </div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-white italic">HOOKE YASASI VE ENERJİ</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                Esnek bir yay, denge konumundan uzaklaştırıldığında, onu tekrar denge konumuna getirmeye çalışan bir <strong>geri çağırıcı kuvvet (Restoring Force)</strong> oluşur.
            </p>

            <div className="grid gap-4 mt-4">
                <div className="p-4 rounded-xl bg-[#60A5FA]/10 border border-[#60A5FA]/30 shadow-[0_0_20px_rgba(96,165,250,0.1)] text-center">
                    <span className="text-xs text-[#60A5FA] uppercase font-black block mb-2">Hooke Yasası</span>
                    <p className="text-2xl font-mono text-[#60A5FA]">F = -k · y</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FCD34D]/10 border border-[#FCD34D]/30 text-center">
                    <span className="text-xs text-[#FCD34D] uppercase font-black block mb-2">Salınım Periyodu</span>
                    <p className="text-xl font-mono text-[#FCD34D]">T = 2π √(m/k)</p>
                </div>

                <ul className="space-y-2 mt-2 text-sm text-zinc-300">
                    <li>• <strong>k (Yay Sabiti):</strong> Yayın sertliğini belirler. K arttıkça yay zor uzar, hareket hızlanır (Periyot azalır).</li>
                    <li>• <strong>m (Kütle):</strong> Eylemsizlik yaratır. Kütle arttıkça hareket yavaşlar (Periyot artar).</li>
                    <li>• Sönümleme (Damping), mekanik enerjinin ısıya dönüşüp kaybolmasına yol açar, sistem zamanla durur.</li>
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

    const forceGravity = mass * gravity;
    const forceSpring = -springConstant * y;

    return (
        <SimulationLayout
            title={simData.title || "Yay-Kütle Sistemi"}
            color={simData.color || "#60A5FA"}
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
                    {/* Background Ceiling */}
                    <rect x="0" y="0" width={canvasWidth} height={visualPivotY} fill="#111" />
                    <line x1="0" y1={visualPivotY} x2={canvasWidth} y2={visualPivotY} stroke="#333" strokeWidth="4" />
                    {/* Ceiling mount point */}
                    <path d={`M ${canvasWidth / 2 - 20} ${visualPivotY} L ${canvasWidth / 2 + 20} ${visualPivotY} L ${canvasWidth / 2} ${visualPivotY + 10} Z`} fill="#444" />

                    {/* The Spring */}
                    <path
                        d={springPath}
                        fill="none"
                        stroke="#60A5FA"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: "drop-shadow(0px 0px 5px rgba(96,165,250,0.5))" }}
                    />

                    {/* Equilibrium Reference Line */}
                    {y !== equilibriumY && (
                        <g opacity="0.3">
                            <line x1={canvasWidth / 2 - 100} y1={visualEquilibriumY} x2={canvasWidth / 2 + 100} y2={visualEquilibriumY} stroke="#fff" strokeWidth="1" strokeDasharray="5 5" />
                            <text x={canvasWidth / 2 + 110} y={visualEquilibriumY + 4} fill="#fff" fontSize="12" fontFamily="monospace">Denge</text>
                        </g>
                    )}

                    {/* The Mass Block */}
                    <g transform={`translate(${canvasWidth / 2 - 25}, ${visualMassY - 15})`}>
                        <rect
                            width="50"
                            height="50"
                            rx="8"
                            fill="#FCD34D"
                            style={{ filter: "drop-shadow(0px 0px 10px rgba(252,211,77,0.4))" }}
                        />
                        <text x="25" y="30" fill="#000" fontSize="16" fontWeight="bold" textAnchor="middle">{mass.toFixed(1)}kg</text>

                        {/* Force Vectors */}
                        {showForces && (
                            <g transform="translate(25, 25)">
                                {/* Gravity Vector (Down) */}
                                {forceGravity > 0 && (
                                    <g opacity="0.8">
                                        <line x1="15" y1="0" x2="15" y2={forceGravity * 1.5} stroke="#38BDF8" strokeWidth="3" />
                                        <polygon points={`15,${forceGravity * 1.5 + 5} 12,${forceGravity * 1.5} 18,${forceGravity * 1.5}`} fill="#38BDF8" />
                                    </g>
                                )}

                                {/* Spring Hooke Force Vector (Upwards if stretched, Downwards if compressed) */}
                                {Math.abs(forceSpring) > 0.1 && (
                                    <g opacity="0.8">
                                        <line x1="-15" y1="0" x2="-15" y2={forceSpring * 1.5} stroke="#FF6B6B" strokeWidth="3" />
                                        <polygon points={`-15,${forceSpring * 1.5 - Math.sign(forceSpring) * 5} -18,${forceSpring * 1.5} -12,${forceSpring * 1.5}`} fill="#FF6B6B" />
                                    </g>
                                )}
                            </g>
                        )}
                    </g>
                </svg>
            </div>
        </SimulationLayout>
    );
}
