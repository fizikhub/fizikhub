"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail, Stars } from "@react-three/drei";
import * as THREE from "three";
import { SimWrapper, SimTask } from "@/components/simulations/sim-wrapper";
import { Play, Pause, RotateCcw, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

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
    setPlanets,
    onTaskCheck
}: {
    isPlaying: boolean;
    gravityConstant: number;
    timeScale: number;
    planets: Planet[];
    setPlanets: React.Dispatch<React.SetStateAction<Planet[]>>;
    onTaskCheck: (g: number, t: number, p: Planet[]) => void;
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

            // Sync back
            currentPlanets = currentPlanets.map((p, idx) => ({
                ...p,
                position: nextPositions[idx],
                velocity: nextVelocities[idx]
            }));
        }

        setPlanets(currentPlanets);
        onTaskCheck(gravityConstant, timeScale, currentPlanets);
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
    // -- State --
    const [isPlaying, setIsPlaying] = useState(true);
    const [gravityConstant, setGravityConstant] = useState(0.8);
    const [timeScale, setTimeScale] = useState(1);
    const [planets, setPlanets] = useState<Planet[]>(INITIAL_PLANETS);

    // -- Tasks --
    const [tasks, setTasks] = useState<SimTask[]>([
        {
            id: "s1",
            description: "Yörünge Mimarı",
            hint: "Gezegenleri güneşe yakınlaştırmak için Çekim Sabitini (G) 2.0'ın üzerine çıkar.",
            isCompleted: false,
            explanation: "Muazzam! Kütleçekim kuvveti arttıkça, gezegenler merkeze daha güçlü çekilir ve yörüngeleri daralır."
        },
        {
            id: "s2",
            description: "Zamanın Efendisi",
            hint: "Evrenin dansını hızlandır! Zaman Hızını 2.0x'in üzerine getir.",
            isCompleted: false,
            explanation: "Zaman görecelidir! Simülasyon hızlandıkça gezegenlerin periyotlarını (güneş etrafındaki tur sürelerini) daha net görebilirsin."
        },
        {
            id: "s3",
            description: "Kaos Teorisi",
            hint: "Dengeyi boz! Çekim sabitini 0.5'in altına düşür ve gezegenleri serbest bırak.",
            isCompleted: false,
            explanation: "Ve özgürlük! Çekim kuvveti azaldığında, gezegenlerin mevcut hızları onları yörüngeden koparıp uzay boşluğuna savurur."
        }
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // -- Task Logic --
    const completeTask = useCallback((index: number) => {
        setTasks(prev => {
            if (prev[index].isCompleted) return prev;
            const newTasks = [...prev];
            newTasks[index].isCompleted = true;
            return newTasks;
        });
        setTimeout(() => {
            setCurrentTaskIndex(prev => Math.min(prev + 1, tasks.length - 1));
        }, 1500);
    }, [tasks.length]);

    const handleTaskCheck = (g: number, t: number, p: Planet[]) => {
        if (currentTaskIndex === 0 && !tasks[0].isCompleted) {
            if (g > 2.0) completeTask(0);
        }
        if (currentTaskIndex === 1 && !tasks[1].isCompleted) {
            if (t >= 2.0) completeTask(1);
        }
        if (currentTaskIndex === 2 && !tasks[2].isCompleted) {
            if (g < 0.5) completeTask(2);
        }
    };

    const resetSim = () => {
        setPlanets(INITIAL_PLANETS);
        setGravityConstant(0.8);
        setTimeScale(1);
        setIsPlaying(true);
    };

    return (
        <SimWrapper
            title="Güneş Sistemi"
            description="Newton'un Evrensel Kütleçekim Yasası ve yörünge mekaniği."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={
                <div className="space-y-6">
                    {/* Gravity Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/10 group hover:border-purple-500/30 transition-colors">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Çekim Sabiti (G)</span>
                            <span className="text-lg font-mono font-bold text-purple-400">{gravityConstant.toFixed(1)}</span>
                        </div>
                        <input
                            type="range" min="0.1" max="3.0" step="0.1" value={gravityConstant}
                            onChange={(e) => setGravityConstant(Number(e.target.value))}
                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>

                    {/* Time Scale Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/10 group hover:border-blue-500/30 transition-colors">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Zaman Hızı</span>
                            <span className="text-lg font-mono font-bold text-blue-400">{timeScale.toFixed(1)}x</span>
                        </div>
                        <input
                            type="range" min="0" max="4.0" step="0.1" value={timeScale}
                            onChange={(e) => setTimeScale(Number(e.target.value))}
                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Play/Pause */}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={cn(
                            "w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg",
                            isPlaying
                                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-purple-500"
                                : "bg-zinc-800 text-zinc-400 border border-white/5 hover:bg-zinc-700"
                        )}
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        {isPlaying ? "DURAKLAT" : "BAŞLAT"}
                    </button>

                    {/* Info Box */}
                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl flex gap-3">
                        <TrendingUp className="w-5 h-5 text-purple-400 shrink-0" />
                        <p className="text-[11px] text-purple-200/80 leading-relaxed font-bold">
                            Newton'un yasasına göre kütleler birbirini çeker. Bu çekim kuvveti, gezegenleri yörüngede tutan merkezcil kuvvettir.
                        </p>
                    </div>
                </div>
            }
        >
            <div className="flex-1 relative overflow-hidden bg-black h-full w-full">
                <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
                    <Scene
                        isPlaying={isPlaying}
                        gravityConstant={gravityConstant}
                        timeScale={timeScale}
                        planets={planets}
                        setPlanets={setPlanets}
                        onTaskCheck={handleTaskCheck}
                    />
                </Canvas>

                {/* Overlay Text */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/20 text-[10px] uppercase font-bold tracking-widest pointer-events-none">
                    N-Cisim Simülasyonu
                </div>
                <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-white/40 font-mono text-[10px] hidden sm:block">
                    Sol Tık: Döndür | Sağ Tık: Kaydır | Tekerlek: Yakınlaştır
                </div>
            </div>
        </SimWrapper>
    );
}
