"use client";

import React, { useState, useEffect, useRef } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider, PhysicsToggle } from "./core/ui";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";

export function PendulumSim({ simData }: { simData: any }) {
    const accentColor = simData?.color || "#D97706";
    // 1. PHYSICS STATE
    const [length, setLength] = useState(2.0);
    const [gravity, setGravity] = useState(9.81);
    const [mass, setMass] = useState(1.0);
    const [damping, setDamping] = useState(0.0);
    const [initialAngle, setInitialAngle] = useState(45);

    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [angle, setAngle] = useState(initialAngle * (Math.PI / 180));
    const [velocity, setVelocity] = useState(0);

    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const period = 2 * Math.PI * Math.sqrt(length / gravity);

    // 2. ENGINE
    const resetSim = () => {
        setIsPlaying(false);
        setTime(0);
        setAngle(initialAngle * (Math.PI / 180));
        setVelocity(0);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    const updatePhysics = (dt: number) => {
        if (dt > 0.1) dt = 0.1;
        setAngle((prevAngle) => {
            setVelocity((prevVel) => {
                const acceleration = -(gravity / length) * Math.sin(prevAngle) - damping * prevVel;
                const newVel = prevVel + acceleration * dt;
                const newAngle = prevAngle + newVel * dt;
                setAngle(newAngle);
                return newVel;
            });
            return prevAngle;
        });
        setTime(t => t + dt);
    };

    const loop = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;
        if (isPlaying) updatePhysics(dt);
        animationRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(loop);
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [isPlaying, gravity, length, damping]);

    useEffect(() => {
        if (!isPlaying) {
            setAngle(initialAngle * (Math.PI / 180));
            setVelocity(0);
            setTime(0);
        }
    }, [initialAngle, isPlaying]);

    // 3. MISSIONS
    const [missions, setMissions] = useState([
        {
            id: 1, title: "Galileo'nun Sırrı",
            desc: "Fizikte periyot kütleye bağlı mıdır? Test etmek için kütleyi 5 kg yaparak simülasyonu başlat.",
            isCompleted: false,
            condition: () => mass >= 5 && isPlaying,
            successText: "Harika! Gördüğün gibi kütle değişse de salınım frekansı hiç değişmedi. Pendulum periyodu (T) sadece uzunluk ve yerçekimine bağlıdır."
        },
        {
            id: 2, title: "Dünya Dışı Fizik",
            desc: "Sarkacın çok daha yavaş salınmasını istiyoruz! Yerçekimini Ay seviyesine (yaklaşık 1.6 m/s²) düşür.",
            isCompleted: false,
            condition: () => gravity <= 2.0 && isPlaying,
            successText: "Mükemmel! Periyot (T) yerçekimi (g) ile ters orantılı olduğu için, yerçekimi azaldığında sarkaç çok daha yavaş sallanır."
        }
    ]);

    useEffect(() => {
        setMissions(prev => prev.map(m => {
            if (!m.isCompleted && m.condition()) return { ...m, isCompleted: true };
            return m;
        }));
    }, [mass, gravity, isPlaying]);

    // 4. RENDER
    const pivot = { x: 50, y: 10 };
    const visualLength = length * 15;
    const bobX = pivot.x + Math.sin(angle) * visualLength;
    const bobY = pivot.y + Math.cos(angle) * visualLength;
    const bobRadius = 2 + (mass * 0.5);

    const Controls = (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 text-black font-black py-3 rounded-lg border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all uppercase tracking-wider text-sm"
                    style={{ backgroundColor: accentColor }}
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
                    {isPlaying ? "DURDUR" : "BAŞLAT"}
                </button>
                <button
                    onClick={resetSim}
                    className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-lg border-[3px] border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <PhysicsSlider label="İp Uzunluğu (L)" value={length} min={0.5} max={4.0} step={0.1} unit="m" onChange={setLength} color={accentColor} />
            <PhysicsSlider label="Yerçekimi (g)" value={gravity} min={1.6} max={20.0} step={0.1} unit="m/s²" onChange={setGravity} color="#D97706" />
            <PhysicsSlider label="Kütle (m)" value={mass} min={0.1} max={10.0} step={0.1} unit="kg" onChange={setMass} color="#2563EB" />
            <PhysicsSlider label="Başlangıç Açısı" value={initialAngle} min={-90} max={90} step={1} unit="°" onChange={setInitialAngle} color="#7C3AED" />
            <PhysicsSlider label="Hava Sürtünmesi" value={damping} min={0} max={0.5} step={0.01} onChange={setDamping} color="#DC2626" />

            <div className="p-4 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[3px_3px_0px_0px_#000] grid grid-cols-2 gap-3">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Teorik Periyot (T)</p>
                    <p className="text-lg font-mono" style={{ color: accentColor }}>{period.toFixed(2)}s</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Anlık Açı (θ)</p>
                    <p className="text-lg font-mono text-foreground">{(angle * 180 / Math.PI).toFixed(1)}°</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Geçen Süre</p>
                    <p className="text-lg font-mono text-foreground">{time.toFixed(1)}s</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Açısal Hız (ω)</p>
                    <p className="text-lg font-mono text-foreground">{velocity.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-5">
            <h2 className="text-xl font-black text-foreground uppercase">Basit Sarkaç Teorisi</h2>
            <p className="text-zinc-400 leading-relaxed">
                Basit sarkaç, ağırlığı ihmal edilen bir ipe asılmış noktasal bir kütleden oluşur. Küçük açılarda (&lt;15°)
                sarkacın hareketi <strong>Basit Harmonik Hareket (BHH)</strong> kabul edilir.
            </p>

            <div className="p-4 rounded-lg border-[2px] border-black shadow-[3px_3px_0px_0px_#000] flex justify-center" style={{ backgroundColor: accentColor }}>
                <p className="text-2xl font-mono text-black font-bold">T = 2π √(L/g)</p>
            </div>

            <ul className="space-y-3 text-zinc-300 text-sm">
                <li className="flex gap-2"><span className="font-bold" style={{ color: accentColor }}>L:</span> İp uzunluğu (Metre) - Periyodu doğru orantılı olarak etkiler.</li>
                <li className="flex gap-2"><span className="font-bold" style={{ color: accentColor }}>g:</span> Yerçekimi ivmesi - Periyodu ters orantılı olarak etkiler.</li>
                <li className="flex gap-2"><span className="font-bold" style={{ color: accentColor }}>m:</span> Kütle - Periyoda HİÇBİR etkisi yoktur!</li>
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
                    <AnimatePresence>
                        {m.isCompleted && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                className="pt-3 mt-3 border-t border-green-800 text-xs text-green-500 font-medium leading-relaxed">
                                {m.successText}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );

    return (
        <SimulationLayout title={simData.title || "Basit Sarkaç"} color={accentColor} controlsArea={Controls} theoryArea={Theory} missionsArea={Missions}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <rect x="40" y="5" width="20" height="2" fill="#444" rx="1" />
                <circle cx={pivot.x} cy={pivot.y} r="1" fill="#666" />
                <line x1={pivot.x} y1={pivot.y} x2={pivot.x} y2="90" stroke="#ffffff10" strokeWidth="0.2" strokeDasharray="2 2" />
                <line x1={pivot.x} y1={pivot.y} x2={bobX} y2={bobY} stroke="#fff" strokeWidth="0.5" opacity={0.7} />
                <circle cx={bobX} cy={bobY} r={bobRadius} fill={accentColor} />
                <circle cx={bobX} cy={bobY} r={bobRadius + 0.2} fill="transparent" stroke="#ffffff" strokeWidth="0.2" />
            </svg>
        </SimulationLayout>
    );
}
