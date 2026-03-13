"use client";

import React, { useState, useEffect, useRef } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider, PhysicsToggle } from "./core/ui";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";

export function SpringMassSim({ simData }: { simData: any }) {
    const accentColor = simData?.color || "#2563EB";
    // STATE
    const [springConstant, setSpringConstant] = useState(20);
    const [mass, setMass] = useState(2);
    const [damping, setDamping] = useState(0.5);
    const [gravity, setGravity] = useState(9.81);
    const [showForces, setShowForces] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const unstretchedLength = 50;
    const [y, setY] = useState(50);
    const [velocity, setVelocity] = useState(0);
    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    const equilibriumY = (mass * gravity) / springConstant;
    const period = 2 * Math.PI * Math.sqrt(mass / springConstant);
    const kineticEnergy = 0.5 * mass * velocity * velocity;
    const springPotentialEnergy = 0.5 * springConstant * y * y;

    const resetSim = () => { setIsPlaying(false); setTime(0); setY(equilibriumY + 30); setVelocity(0); if (animationRef.current) cancelAnimationFrame(animationRef.current); };

    const updatePhysics = (dt: number) => {
        if (dt > 0.1) dt = 0.1;
        setY((prevY) => {
            setVelocity((prevV) => {
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
        if (isPlaying) updatePhysics(dt * 2);
        animationRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(loop);
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [isPlaying, springConstant, mass, damping, gravity]);

    useEffect(() => { resetSim(); }, []);

    const canvasWidth = 800;
    const canvasHeight = 600;
    const scale = 3;
    const visualPivotY = 50;
    const visualMassY = visualPivotY + unstretchedLength + (y * scale);
    const visualEquilibriumY = visualPivotY + unstretchedLength + (equilibriumY * scale);

    const generateSpringPath = (startY: number, endY: number) => {
        const coils = 12; const width = 20; const coilHeight = (endY - startY) / coils;
        let path = `M ${canvasWidth / 2} ${startY} `;
        for (let i = 0; i < coils; i++) {
            const currentY = startY + (i * coilHeight);
            const nextY = startY + ((i + 1) * coilHeight);
            const midY = (currentY + nextY) / 2;
            if (i % 2 === 0) path += `L ${canvasWidth / 2 - width} ${midY} L ${canvasWidth / 2 + width} ${nextY} `;
            else path += `L ${canvasWidth / 2 + width} ${midY} L ${canvasWidth / 2 - width} ${nextY} `;
        }
        path += `L ${canvasWidth / 2} ${endY}`;
        return path;
    };
    const springPath = generateSpringPath(visualPivotY, visualMassY - 15);

    const [missions, setMissions] = useState([
        { id: 1, title: "Yüksek Frekans", desc: "Yay sabiti 'k'yı maksimuma, kütleyi 'm'yi minimuma getirip simülasyonu başlat.", isCompleted: false,
            condition: () => springConstant >= 50 && mass <= 1.0 && isPlaying,
            successText: "Mükemmel! Periyot formülü T=2π√(m/k) olduğuna göre, kütle azaldıkça ve yay sertleştikçe titreşim hızlanır." },
        { id: 2, title: "Sönümleme Etkisi", desc: "Sönümleme katsayısını 2.0 yapıp yavaşça durmasını sağla.", isCompleted: false,
            condition: () => damping >= 2.0 && isPlaying,
            successText: "Harika! Sönümleme kuvveti hız ile ters yönlü çalışarak sistemin mekanik enerjisini ısıya dönüştürür ve hareketi durdurur." }
    ]);

    useEffect(() => { setMissions(prev => prev.map(m => { if (!m.isCompleted && m.condition()) return { ...m, isCompleted: true }; return m; })); }, [springConstant, mass, damping, isPlaying]);

    const forceGravity = mass * gravity;
    const forceSpring = -springConstant * y;

    const Controls = (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <button onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 text-black font-black py-3 rounded-lg border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all uppercase tracking-wider text-sm"
                    style={{ backgroundColor: accentColor, color: '#fff' }}>
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                    {isPlaying ? "DURDUR" : "BAŞLAT"}
                </button>
                <button onClick={resetSim} className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-lg border-[3px] border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95">
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>
            <PhysicsSlider label="Yay Sabiti (k)" value={springConstant} min={5} max={50} step={1} unit="N/m" onChange={setSpringConstant} color={accentColor} />
            <PhysicsSlider label="Kütle (m)" value={mass} min={0.5} max={10} step={0.5} unit="kg" onChange={setMass} color="#D97706" />
            <PhysicsSlider label="Sönümleme (b)" value={damping} min={0} max={3} step={0.1} unit="kg/s" onChange={setDamping} color="#DC2626" />
            <PhysicsSlider label="Yerçekimi (g)" value={gravity} min={0} max={20} step={0.5} unit="m/s²" onChange={setGravity} color="#7C3AED" />
            <PhysicsToggle label="Kuvvet Vektörlerini Göster" checked={showForces} onChange={setShowForces} color={accentColor} />

            <div className="p-4 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[3px_3px_0px_0px_#000] grid grid-cols-2 gap-3">
                <div><p className="text-[10px] text-zinc-500 uppercase font-black">Teorik Periyot</p><p className="text-lg font-mono text-foreground">{period.toFixed(2)}s</p></div>
                <div><p className="text-[10px] text-zinc-500 uppercase font-black">Uzanım (y)</p><p className="text-lg font-mono" style={{ color: accentColor }}>{y.toFixed(2)}m</p></div>
                <div><p className="text-[10px] text-zinc-500 uppercase font-black">Potansiyel Enerji</p><p className="text-lg font-mono text-green-600">{springPotentialEnergy.toFixed(0)} J</p></div>
                <div><p className="text-[10px] text-zinc-500 uppercase font-black">Kinetik Enerji</p><p className="text-lg font-mono" style={{ color: "#D97706" }}>{kineticEnergy.toFixed(0)} J</p></div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-5">
            <h2 className="text-xl font-black text-foreground uppercase">Hooke Yasası ve Enerji</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">Esnek bir yay, denge konumundan uzaklaştırıldığında, onu tekrar denge konumuna getirmeye çalışan bir <strong>geri çağırıcı kuvvet</strong> oluşur.</p>
            <div className="grid gap-4 mt-4">
                <div className="p-4 rounded-lg border-[2px] border-black shadow-[3px_3px_0px_0px_#000] text-center" style={{ backgroundColor: accentColor }}>
                    <span className="text-xs text-white uppercase font-black block mb-2">Hooke Yasası</span>
                    <p className="text-2xl font-mono text-white font-bold">F = -k · y</p>
                </div>
                <div className="p-4 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-center" style={{ backgroundColor: "#D97706" }}>
                    <span className="text-xs text-black uppercase font-black block mb-2">Salınım Periyodu</span>
                    <p className="text-xl font-mono text-black font-bold">T = 2π √(m/k)</p>
                </div>
                <ul className="space-y-2 mt-2 text-sm text-zinc-300">
                    <li>• <strong>k (Yay Sabiti):</strong> Yayın sertliğini belirler. K arttıkça hareket hızlanır.</li>
                    <li>• <strong>m (Kütle):</strong> Eylemsizlik yaratır. Kütle arttıkça hareket yavaşlar.</li>
                    <li>• Sönümleme (Damping), mekanik enerjinin ısıya dönüşüp kaybolmasına yol açar.</li>
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
        <SimulationLayout title={simData.title || "Yay-Kütle Sistemi"} color={accentColor} controlsArea={Controls} theoryArea={Theory} missionsArea={Missions}>
            <div className="w-full h-full p-0 relative flex items-center justify-center">
                <svg width="100%" height="100%" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} preserveAspectRatio="xMidYMid meet" className="origin-center">
                    <rect x="0" y="0" width={canvasWidth} height={visualPivotY} fill="#222" />
                    <line x1="0" y1={visualPivotY} x2={canvasWidth} y2={visualPivotY} stroke="#444" strokeWidth="4" />
                    <path d={`M ${canvasWidth / 2 - 20} ${visualPivotY} L ${canvasWidth / 2 + 20} ${visualPivotY} L ${canvasWidth / 2} ${visualPivotY + 10} Z`} fill="#555" />

                    <path d={springPath} fill="none" stroke={accentColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                    {y !== equilibriumY && (
                        <g opacity="0.3"><line x1={canvasWidth / 2 - 100} y1={visualEquilibriumY} x2={canvasWidth / 2 + 100} y2={visualEquilibriumY} stroke="#fff" strokeWidth="1" strokeDasharray="5 5" />
                        <text x={canvasWidth / 2 + 110} y={visualEquilibriumY + 4} fill="#fff" fontSize="12" fontFamily="monospace">Denge</text></g>
                    )}

                    <g transform={`translate(${canvasWidth / 2 - 25}, ${visualMassY - 15})`}>
                        <rect width="50" height="50" rx="4" fill="#D97706" stroke="#000" strokeWidth="3" />
                        <text x="25" y="30" fill="#000" fontSize="16" fontWeight="bold" textAnchor="middle">{mass.toFixed(1)}kg</text>
                        {showForces && (
                            <g transform="translate(25, 25)">
                                {forceGravity > 0 && (<g opacity="0.8"><line x1="15" y1="0" x2="15" y2={forceGravity * 1.5} stroke="#2563EB" strokeWidth="3" /><polygon points={`15,${forceGravity * 1.5 + 5} 12,${forceGravity * 1.5} 18,${forceGravity * 1.5}`} fill="#2563EB" /></g>)}
                                {Math.abs(forceSpring) > 0.1 && (<g opacity="0.8"><line x1="-15" y1="0" x2="-15" y2={forceSpring * 1.5} stroke="#DC2626" strokeWidth="3" /><polygon points={`-15,${forceSpring * 1.5 - Math.sign(forceSpring) * 5} -18,${forceSpring * 1.5} -12,${forceSpring * 1.5}`} fill="#DC2626" /></g>)}
                            </g>
                        )}
                    </g>
                </svg>
            </div>
        </SimulationLayout>
    );
}
