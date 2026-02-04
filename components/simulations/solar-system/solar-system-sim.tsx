"use client";

import { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail, Stars } from "@react-three/drei";
import * as THREE from "three";
import { SimSlider } from "@/components/simulations/ui/sim-slider";
import { SimButton } from "@/components/simulations/ui/sim-button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { SimulationLayout } from "@/components/simulations/ui/simulation-layout";

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

// Inner Simulation Component
function Scene({
    isPlaying,
    gravityConstant,
    timeScale,
    planets,
    setPlanets
}: {
    isPlaying: boolean;
    gravityConstant: number;
    timeScale: number;
    planets: Planet[];
    setPlanets: React.Dispatch<React.SetStateAction<Planet[]>>;
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

            // Sync back to currentPlanets for next substep
            currentPlanets = currentPlanets.map((p, idx) => ({
                ...p,
                position: nextPositions[idx],
                velocity: nextVelocities[idx]
            }));
        }

        setPlanets(currentPlanets);
    });

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" distance={100} decay={2} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {planets.map((planet) => (
                <group key={planet.id} position={planet.position}>
                    <Trail
                        width={1.5}
                        length={20}
                        color={new THREE.Color(planet.trailColor)}
                        attenuation={(t) => t * t}
                    >
                        <mesh>
                            <sphereGeometry args={[planet.radius, 32, 32]} />
                            <meshStandardMaterial
                                color={planet.color}
                                emissive={planet.id === 0 ? planet.color : "#000000"}
                                emissiveIntensity={planet.id === 0 ? 2 : 0}
                            />
                        </mesh>
                    </Trail>
                </group>
            ))}

            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </>
    );
}

export default function SolarSystemSim() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [gravityConstant, setGravityConstant] = useState(0.8);
    const [timeScale, setTimeScale] = useState(1);
    const [planets, setPlanets] = useState<Planet[]>(INITIAL_PLANETS);

    const resetSim = () => {
        setPlanets(INITIAL_PLANETS);
        setIsPlaying(true);
    };

    const Controls = (
        <div className="p-6 space-y-8 flex-1">
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="font-black uppercase text-xs tracking-wider text-black dark:text-white">Çekim Sabiti (G)</label>
                    <span className="font-mono text-xs font-bold bg-[#A855F7] text-white px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">{gravityConstant.toFixed(1)}</span>
                </div>
                <SimSlider value={[gravityConstant]} onValueChange={(v: number[]) => setGravityConstant(v[0])} min={0.1} max={3} step={0.1} />
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="font-black uppercase text-xs tracking-wider text-black dark:text-white">Zaman Hızı</label>
                    <span className="font-mono text-xs font-bold bg-zinc-200 text-black px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">{timeScale.toFixed(1)}x</span>
                </div>
                <SimSlider value={[timeScale]} onValueChange={(v: number[]) => setTimeScale(v[0])} min={0} max={3} step={0.1} />
            </div>

            <div className="pt-4 space-y-3">
                <SimButton onClick={() => setIsPlaying(!isPlaying)} className="w-full gap-2 text-lg h-14" size="lg">
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    {isPlaying ? "DURAKLAT" : "DEVAM ET"}
                </SimButton>
                <SimButton variant="secondary" onClick={resetSim} className="w-full gap-2 text-xs h-10">
                    <RotateCcw className="w-4 h-4" />
                    BAŞA AL
                </SimButton>
            </div>

            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/10 border-2 border-purple-400/50 rounded-sm text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p className="font-bold mb-1 text-black dark:text-purple-500 uppercase">Kütleçekim Yasası</p>
                <span className="font-mono bg-white dark:bg-black px-1 rounded">F = G(m₁m₂)/r²</span><br />
                Gezegenler arasındaki çekim kuvveti, kütlelerinin çarpımı ile doğru, aralarındaki mesafenin karesi ile ters orantılıdır.
            </div>
        </div>
    );

    return (
        <SimulationLayout controls={Controls} title="Güneş Sistemi">
            <div className="flex-1 relative overflow-hidden bg-black h-full w-full">
                <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
                    <Scene
                        isPlaying={isPlaying}
                        gravityConstant={gravityConstant}
                        timeScale={timeScale}
                        planets={planets}
                        setPlanets={setPlanets}
                    />
                </Canvas>
                <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-50 text-white font-mono text-[10px] uppercase tracking-widest">
                    React Three Fiber Engine<br />
                    N-Body Gravity
                </div>
                <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-white/40 font-mono text-[10px]">
                    Sol Tık: Döndür | Sağ Tık: Kaydır | Tekerlek: Yakınlaştır
                </div>
            </div>
        </SimulationLayout>
    );
}
