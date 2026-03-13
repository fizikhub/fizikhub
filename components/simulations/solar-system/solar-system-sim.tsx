"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail, Stars } from "@react-three/drei";
import * as THREE from "three";
import { SimulationLayout } from "../core/simulation-layout";
import { PhysicsSlider } from "../core/ui";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";

type Planet = {
    id: number;
    position: [number, number, number];
    velocity: [number, number, number];
    mass: number;
    radius: number;
    color: string;
    trailColor: string;
    fixed?: boolean;
};

const INITIAL_PLANETS: Planet[] = [
    { id: 0, position: [0, 0, 0], velocity: [0, 0, 0], mass: 1000, radius: 2, color: "#D97706", trailColor: "#D97706", fixed: true },
    { id: 1, position: [10, 0, 0], velocity: [0, 0, 8], mass: 1, radius: 0.5, color: "#2563EB", trailColor: "#2563EB" },
    { id: 2, position: [16, 0, 0], velocity: [0, 0, 6], mass: 2, radius: 0.7, color: "#DC2626", trailColor: "#DC2626" }
];

function Scene({ isPlaying, gravityConstant, timeScale, planets, setPlanets, onPhysicsTick }: {
    isPlaying: boolean; gravityConstant: number; timeScale: number;
    planets: Planet[]; setPlanets: React.Dispatch<React.SetStateAction<Planet[]>>; onPhysicsTick: () => void;
}) {
    useFrame((state, delta) => {
        if (!isPlaying) return;
        const subSteps = 4;
        const dt = (delta * timeScale) / subSteps;
        let currentPlanets = [...planets];
        for (let step = 0; step < subSteps; step++) {
            const nextPositions = currentPlanets.map(p => [...p.position] as [number, number, number]);
            const nextVelocities = currentPlanets.map(p => [...p.velocity] as [number, number, number]);
            for (let i = 0; i < currentPlanets.length; i++) {
                if (currentPlanets[i].fixed) continue;
                let fx = 0, fy = 0, fz = 0;
                for (let j = 0; j < currentPlanets.length; j++) {
                    if (i === j) continue;
                    const p1 = currentPlanets[i]; const p2 = currentPlanets[j];
                    const dx = p2.position[0] - p1.position[0];
                    const dy = p2.position[1] - p1.position[1];
                    const dz = p2.position[2] - p1.position[2];
                    const distSq = dx * dx + dy * dy + dz * dz;
                    const dist = Math.sqrt(distSq);
                    if (dist < 0.1) continue;
                    const f = (gravityConstant * p1.mass * p2.mass) / distSq;
                    fx += f * (dx / dist); fy += f * (dy / dist); fz += f * (dz / dist);
                }
                nextVelocities[i][0] += (fx / currentPlanets[i].mass) * dt;
                nextVelocities[i][1] += (fy / currentPlanets[i].mass) * dt;
                nextVelocities[i][2] += (fz / currentPlanets[i].mass) * dt;
            }
            for (let i = 0; i < currentPlanets.length; i++) {
                if (currentPlanets[i].fixed) continue;
                nextPositions[i][0] += nextVelocities[i][0] * dt;
                nextPositions[i][1] += nextVelocities[i][1] * dt;
                nextPositions[i][2] += nextVelocities[i][2] * dt;
            }
            currentPlanets = currentPlanets.map((p, idx) => ({ ...p, position: nextPositions[idx], velocity: nextVelocities[idx] }));
        }
        setPlanets(currentPlanets);
        onPhysicsTick();
    });

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={3} color="#D97706" distance={200} decay={1.5} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
            {planets.map((planet) => (
                <group key={planet.id} position={planet.position}>
                    <Trail width={planet.radius * 2} length={30} color={new THREE.Color(planet.trailColor)} attenuation={(t) => t * t}>
                        <mesh>
                            <sphereGeometry args={[planet.radius, 32, 32]} />
                            <meshStandardMaterial color={planet.color} emissive={planet.id === 0 ? planet.color : "#000000"} emissiveIntensity={planet.id === 0 ? 2 : 0} roughness={0.7} />
                        </mesh>
                    </Trail>
                </group>
            ))}
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </>
    );
}

export default function SolarSystemSim({ simData }: { simData: any }) {
    const accentColor = simData?.color || "#7C3AED";
    const [isPlaying, setIsPlaying] = useState(true);
    const [gravityConstant, setGravityConstant] = useState(0.8);
    const [timeScale, setTimeScale] = useState(1);
    const [planets, setPlanets] = useState<Planet[]>(INITIAL_PLANETS);

    const [missions, setMissions] = useState([
        { id: 1, title: "Yörünge Mimarı", desc: "Çekim Sabitini (G) 2.0'ın üzerine çıkar.", isCompleted: false,
            condition: () => gravityConstant > 2.0 && isPlaying,
            successText: "Muazzam! Kütleçekim kuvveti arttıkça, gezegenler merkeze daha güçlü çekilir ve yörüngeleri daralır." },
        { id: 2, title: "Zamanın Efendisi", desc: "Zaman Hızını 3.0x'in üzerine getir.", isCompleted: false,
            condition: () => timeScale >= 3.0 && isPlaying,
            successText: "Zaman görecelidir! Simülasyon hızlandıkça gezegenlerin periyotlarını daha net görebilirsin." },
        { id: 3, title: "Kaos Teorisi", desc: "Çekim sabitini 0.3'ün altına düşür ve gezegenleri serbest bırak.", isCompleted: false,
            condition: () => gravityConstant < 0.3 && isPlaying,
            successText: "Özgürlük! Çekim kuvveti azaldığında, gezegenlerin mevcut hızları onları yörüngeden koparıp uzay boşluğuna savurur." }
    ]);

    const onPhysicsTick = useCallback(() => {
        setMissions(prev => prev.map(m => { if (!m.isCompleted && m.condition()) return { ...m, isCompleted: true }; return m; }));
    }, [gravityConstant, timeScale, isPlaying]);

    const resetSim = () => { setPlanets(INITIAL_PLANETS); setGravityConstant(0.8); setTimeScale(1); setIsPlaying(true); };

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

            <PhysicsSlider label="Çekim Sabiti (G)" value={gravityConstant} min={0.1} max={3.0} step={0.1} onChange={setGravityConstant} color={accentColor} />
            <PhysicsSlider label="Zaman Çarpanı (t)" value={timeScale} min={0.1} max={5.0} step={0.1} unit="x" onChange={setTimeScale} color="#2563EB" />

            <div className="p-4 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[2px_2px_0px_0px_#000]">
                <p className="text-xs text-zinc-400 leading-relaxed font-bold">
                    Sol Tık: Döndür<br />Sağ Tık: Kaydır<br />Tekerlek: Yakınlaştır/Uzaklaştır
                </p>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-5">
            <h2 className="text-xl font-black text-foreground uppercase">Kütleçekim ve Yörüngeler</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                Gezegenler, yıldızlarının kütleçekim kuvveti tarafından uzayda tutulurlar. Newton&apos;un Evrensel Kütleçekim yasasına göre her kütle diğerini çeker.
            </p>
            <div className="p-4 rounded-lg border-[2px] border-black shadow-[3px_3px_0px_0px_#000] text-center" style={{ backgroundColor: accentColor }}>
                <span className="text-xs text-white uppercase font-black block mb-2">Çekim Kuvveti</span>
                <p className="text-2xl font-mono text-white font-bold">F = G·(m₁·m₂)/r²</p>
            </div>
            <ul className="space-y-2 mt-2 text-sm text-zinc-300">
                <li>• <strong>G:</strong> Evrensel çekim sabiti. Artarsa, çekim güçlenir.</li>
                <li>• <strong>r (Mesafe):</strong> Mesafe karesiyle ters orantılıdır.</li>
                <li>• Eylemsizlik ve Çekim arasındaki denge yörüngeyi oluşturur.</li>
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
        <SimulationLayout title={simData?.title || "Güneş Sistemi (N-Body)"} color={accentColor} controlsArea={Controls} theoryArea={Theory} missionsArea={Missions}>
            <div className="w-full h-full p-0 relative bg-[#0a0a0a]">
                <Canvas camera={{ position: [0, 20, 30], fov: 45 }}>
                    <Scene isPlaying={isPlaying} gravityConstant={gravityConstant} timeScale={timeScale} planets={planets} setPlanets={setPlanets} onPhysicsTick={onPhysicsTick} />
                </Canvas>
                <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                    N-BODY ENGINE v1.2
                </div>
            </div>
        </SimulationLayout>
    );
}
