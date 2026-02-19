"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail, Stars } from "@react-three/drei";
import * as THREE from "three";
import { SimulationLayout } from "../core/simulation-layout";
import { PhysicsSlider } from "../core/ui";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Planet Data Type
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
    {
        id: 0,
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        mass: 1000,
        radius: 2,
        color: "#FDB813", // Sun Yellow
        trailColor: "#FDB813",
        fixed: true
    },
    {
        id: 1,
        position: [10, 0, 0],
        velocity: [0, 0, 8], // Initial velocity for orbit
        mass: 1,
        radius: 0.5,
        color: "#3B82F6", // Earth Blue
        trailColor: "#60A5FA"
    },
    {
        id: 2,
        position: [16, 0, 0],
        velocity: [0, 0, 6],
        mass: 2,
        radius: 0.7,
        color: "#EF4444", // Mars Red
        trailColor: "#F87171"
    }
];

function Scene({
    isPlaying,
    gravityConstant,
    timeScale,
    planets,
    setPlanets,
    onPhysicsTick
}: {
    isPlaying: boolean;
    gravityConstant: number;
    timeScale: number;
    planets: Planet[];
    setPlanets: React.Dispatch<React.SetStateAction<Planet[]>>;
    onPhysicsTick: () => void;
}) {
    useFrame((state, delta) => {
        if (!isPlaying) return;

        const subSteps = 4; // Sub-stepping for stability
        const dt = (delta * timeScale) / subSteps;
        let currentPlanets = [...planets];

        for (let step = 0; step < subSteps; step++) {
            const nextPositions = currentPlanets.map(p => [...p.position] as [number, number, number]);
            const nextVelocities = currentPlanets.map(p => [...p.velocity] as [number, number, number]);

            // Calculate Forces
            for (let i = 0; i < currentPlanets.length; i++) {
                if (currentPlanets[i].fixed) continue;

                let fx = 0, fy = 0, fz = 0;

                for (let j = 0; j < currentPlanets.length; j++) {
                    if (i === j) continue;

                    const p1 = currentPlanets[i];
                    const p2 = currentPlanets[j];

                    const dx = p2.position[0] - p1.position[0];
                    const dy = p2.position[1] - p1.position[1];
                    const dz = p2.position[2] - p1.position[2];

                    const distSq = dx * dx + dy * dy + dz * dz;
                    const dist = Math.sqrt(distSq);

                    if (dist < 0.1) continue; // Softening

                    const f = (gravityConstant * p1.mass * p2.mass) / distSq;

                    fx += f * (dx / dist);
                    fy += f * (dy / dist);
                    fz += f * (dz / dist);
                }

                // Update Velocity (F = ma -> a = F/m)
                nextVelocities[i][0] += (fx / currentPlanets[i].mass) * dt;
                nextVelocities[i][1] += (fy / currentPlanets[i].mass) * dt;
                nextVelocities[i][2] += (fz / currentPlanets[i].mass) * dt;
            }

            // Update Positions
            for (let i = 0; i < currentPlanets.length; i++) {
                if (currentPlanets[i].fixed) continue;
                nextPositions[i][0] += nextVelocities[i][0] * dt;
                nextPositions[i][1] += nextVelocities[i][1] * dt;
                nextPositions[i][2] += nextVelocities[i][2] * dt;
            }

            currentPlanets = currentPlanets.map((p, idx) => ({
                ...p,
                position: nextPositions[idx],
                velocity: nextVelocities[idx]
            }));
        }

        setPlanets(currentPlanets);
        onPhysicsTick();
    });

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={3} color="#FDB813" distance={200} decay={1.5} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />

            {planets.map((planet) => (
                <group key={planet.id} position={planet.position}>
                    <Trail
                        width={planet.radius * 2}
                        length={30}
                        color={new THREE.Color(planet.trailColor)}
                        attenuation={(t) => t * t}
                    >
                        <mesh>
                            <sphereGeometry args={[planet.radius, 32, 32]} />
                            <meshStandardMaterial
                                color={planet.color}
                                emissive={planet.id === 0 ? planet.color : "#000000"}
                                emissiveIntensity={planet.id === 0 ? 2 : 0}
                                roughness={0.7}
                            />
                        </mesh>
                    </Trail>
                </group>
            ))}

            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </>
    );
}

export default function SolarSystemSim({ simData }: { simData: any }) {
    // -- State --
    const [isPlaying, setIsPlaying] = useState(true);
    const [gravityConstant, setGravityConstant] = useState(0.8);
    const [timeScale, setTimeScale] = useState(1);
    const [planets, setPlanets] = useState<Planet[]>(INITIAL_PLANETS);

    // -- Tasks / Missions --
    const [missions, setMissions] = useState([
        {
            id: 1,
            title: "Yörünge Mimarı",
            desc: "Gezegenleri güneşe yakınlaştırmak için Çekim Sabitini (G) 2.0'ın üzerine çıkar.",
            isCompleted: false,
            condition: () => gravityConstant > 2.0 && isPlaying,
            successText: "Muazzam! Kütleçekim kuvveti arttıkça, gezegenler merkeze daha güçlü çekilir ve yörüngeleri daralır."
        },
        {
            id: 2,
            title: "Zamanın Efendisi",
            desc: "Evrenin dansını hızlandır! Zaman Hızını 3.0x'in üzerine getir.",
            isCompleted: false,
            condition: () => timeScale >= 3.0 && isPlaying,
            successText: "Zaman görecelidir! Simülasyon hızlandıkça gezegenlerin periyotlarını (güneş etrafındaki tur sürelerini) daha net görebilirsin."
        },
        {
            id: 3,
            title: "Kaos Teorisi",
            desc: "Dengeyi boz! Çekim sabitini 0.3'ün altına düşür ve gezegenleri serbest bırak.",
            isCompleted: false,
            condition: () => gravityConstant < 0.3 && isPlaying,
            successText: "Ve özgürlük! Çekim kuvveti azaldığında, gezegenlerin mevcut hızları onları yörüngeden koparıp uzay boşluğuna savurur."
        }
    ]);

    const onPhysicsTick = useCallback(() => {
        setMissions(prev => prev.map(m => {
            if (!m.isCompleted && m.condition()) {
                return { ...m, isCompleted: true };
            }
            return m;
        }));
    }, [gravityConstant, timeScale, isPlaying]);

    const resetSim = () => {
        setPlanets(INITIAL_PLANETS);
        setGravityConstant(0.8);
        setTimeScale(1);
        setIsPlaying(true);
    };

    // -------------------------------------------------------------
    // 5. UI COMPONENTS
    // -------------------------------------------------------------
    const Controls = (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 justify-between mb-2 bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#A78BFA] text-black font-black py-3 rounded-lg hover:bg-[#C4B5FD] transition-all active:scale-95 uppercase tracking-wider"
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
                <PhysicsSlider label="Çekim Sabiti (G)" value={gravityConstant} min={0.1} max={3.0} step={0.1} onChange={setGravityConstant} color="#A78BFA" />
                <PhysicsSlider label="Zaman Çarpanı (t)" value={timeScale} min={0.1} max={5.0} step={0.1} unit="x" onChange={setTimeScale} color="#38BDF8" />
            </div>

            <div className="mt-4 p-4 rounded-xl border border-[#A78BFA]/30 bg-[#A78BFA]/5 flex gap-3">
                <p className="text-xs text-[#A78BFA] leading-relaxed font-bold">
                    Sol Tık: Döndür<br />Sağ Tık: Kaydır<br />Tekerlek: Yakınlaştır/Uzaklaştır
                </p>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-white italic">KÜTLEÇEKİM VE YÖRÜNGELER</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                Gezegenler, yıldızlarının kütleçekim kuvveti tarafından uzayda tutulurlar. Newton'un Evrensel Kütleçekim
                yasasına göre her kütle diğerini çeker.
            </p>

            <div className="grid gap-4 mt-4">
                <div className="p-4 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/30 shadow-[0_0_20px_rgba(167,139,250,0.1)] text-center">
                    <span className="text-xs text-[#A78BFA] uppercase font-black block mb-2">Çekim Kuvveti</span>
                    <p className="text-2xl font-mono text-[#A78BFA]">F = G·(m₁·m₂)/r²</p>
                </div>

                <ul className="space-y-2 mt-2 text-sm text-zinc-300">
                    <li>• <strong>G:</strong> Evrensel çekim sabiti. Formüldeki simülasyon ayarlayıcısıdır. Artarsa, çekim güçlenir.</li>
                    <li>• <strong>r (Mesafe):</strong> Mesafe karesiyle ters orantılıdır, gezegen yıldıza yaklaştıkça inanılmaz şekilde hızlanır.</li>
                    <li>• Eylemsizlik ve Çekim arasındaki denge yörüngeyi oluşturur.</li>
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
            title={simData?.title || "Güneş Sistemi (N-Body)"}
            color={simData?.color || "#A78BFA"}
            controlsArea={Controls}
            theoryArea={Theory}
            missionsArea={Missions}
        >
            <div className="w-full h-full p-0 relative bg-black">
                <Canvas camera={{ position: [0, 20, 30], fov: 45 }}>
                    <Scene
                        isPlaying={isPlaying}
                        gravityConstant={gravityConstant}
                        timeScale={timeScale}
                        planets={planets}
                        setPlanets={setPlanets}
                        onPhysicsTick={onPhysicsTick}
                    />
                </Canvas>

                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />

                <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-[#A78BFA]/40 font-mono text-[10px] uppercase tracking-widest">
                    N-BODY ENGINE v1.2
                </div>
            </div>
        </SimulationLayout>
    );
}
