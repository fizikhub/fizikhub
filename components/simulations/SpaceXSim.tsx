"use client";

import React, { useState, useCallback, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail, Stars } from "@react-three/drei";
import * as THREE from "three";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider } from "./core/ui";
import { Play, Pause, RotateCcw, CheckCircle2, Navigation } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";

// Custom type for rocket state
type RocketState = {
    x: number;
    z: number;
    vx: number;
    vz: number;
    throttle: number; // 0 to 100
    angle: number; // 0 to 360 degrees (0 is straight up, 90 is right)
    fuel: number; // 0 to 100
};

const INITIAL_ROCKET: RocketState = {
    x: 0,
    z: 10.05, // Earth radius is 10.0, starting slightly above surface
    vx: 0,
    vz: 0,
    throttle: 0,
    angle: 0,
    fuel: 100
};

// Physics Constants scaled for the simulation
const EARTH_RADIUS = 10.0;
const GRAVITY_MU = 1200.0; // G * M
const MAX_THRUST = 18.0;
const FUEL_BURN_RATE = 8.0; // fuel units consumed per second at 100% throttle
const ATMOSPHERE_HEIGHT = 4.0; // Atmosphere extends from r=10 to r=14
const DRAG_COEFF = 0.08;

function EarthGroup() {
    return (
        <group>
            {/* Earth Sphere */}
            <mesh>
                <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
                <meshStandardMaterial
                    color="#1e293b"
                    roughness={0.8}
                    metalness={0.2}
                    emissive="#0f172a"
                    emissiveIntensity={0.5}
                />
            </mesh>
            {/* Grid helper on equatorial plane (XZ) */}
            <gridHelper args={[60, 30, "#4f46e5", "#334155"]} position={[0, -0.01, 0]} />
            {/* Atmosphere representation */}
            <mesh>
                <sphereGeometry args={[EARTH_RADIUS + ATMOSPHERE_HEIGHT, 32, 32]} />
                <meshBasicMaterial
                    color="#38bdf8"
                    transparent
                    opacity={0.08}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}

function StarshipModel({ position, angle, thrusting }: { position: [number, number, number]; angle: number; thrusting: boolean }) {
    const rocketRef = useRef<THREE.Group>(null);

    // Dynamic rotation mapping (0 is up along +Z relative to Earth surface initially)
    // We rotate the rocket cylinder according to the steering angle
    const angleRad = (angle * Math.PI) / 180;

    return (
        <group ref={rocketRef} position={position} rotation={[0, 0, -angleRad]}>
            {/* Rocket Body */}
            <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Nose Cone */}
            <mesh position={[0, 1.2, 0]}>
                <coneGeometry args={[0.15, 0.4, 16]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Fins */}
            <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[0.6, 0.2, 0.05]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Engine Flame */}
            {thrusting && (
                <mesh position={[0, -0.8, 0]}>
                    <coneGeometry args={[0.12, 0.6, 16]} />
                    <meshBasicMaterial color="#ff7a00" transparent opacity={0.8} />
                </mesh>
            )}
        </group>
    );
}

function Scene({
    isPlaying,
    rocket,
    setRocket,
    timeScale,
    onPhysicsTick
}: {
    isPlaying: boolean;
    rocket: RocketState;
    setRocket: React.Dispatch<React.SetStateAction<RocketState>>;
    timeScale: number;
    onPhysicsTick: (r: RocketState, alt: number, vel: number) => void;
}) {
    useFrame((state, delta) => {
        if (!isPlaying) return;

        const subSteps = 6;
        const dt = (delta * timeScale) / subSteps;
        const current = { ...rocket };


        for (let step = 0; step < subSteps; step++) {
            const rx = current.x;
            const rz = current.z;
            const dist = Math.sqrt(rx * rx + rz * rz);

            // Crash check
            if (dist <= EARTH_RADIUS) {
                // Rocket hit the ground
                current.vx = 0;
                current.vz = 0;
                // Place back on surface
                const nx = rx / dist;
                const nz = rz / dist;
                current.x = nx * EARTH_RADIUS;
                current.z = nz * EARTH_RADIUS;
                current.throttle = 0;
                break;
            }

            // 1. Gravity Force (a = -mu * r_vec / dist^3)
            const gAcc = GRAVITY_MU / (dist * dist * dist);
            let ax = -gAcc * rx;
            let az = -gAcc * rz;

            // 2. Thrust Force
            if (current.fuel > 0 && current.throttle > 0) {
                // Burning fuel
                current.fuel = Math.max(0, current.fuel - FUEL_BURN_RATE * (current.throttle / 100) * dt);

                const angleRad = (current.angle * Math.PI) / 180;
                // Radial vector from Earth center
                const radX = rx / dist;
                const radZ = rz / dist;

                // Tangential vector (perpendicular, pointing right)
                const tangX = -radZ;
                const tangZ = radX;

                // Rocket orientation relative to local radial
                const dirX = radX * Math.cos(angleRad) + tangX * Math.sin(angleRad);
                const dirZ = radZ * Math.cos(angleRad) + tangZ * Math.sin(angleRad);

                const thrustAcc = (MAX_THRUST * (current.throttle / 100));
                ax += thrustAcc * dirX;
                az += thrustAcc * dirZ;
            }

            // 3. Atmospheric Drag
            const altitude = dist - EARTH_RADIUS;
            if (altitude < ATMOSPHERE_HEIGHT) {
                const vel = Math.sqrt(current.vx * current.vx + current.vz * current.vz);
                if (vel > 0.01) {
                    // Exponential density drop
                    const density = Math.exp(-altitude / 1.2) * 0.25;
                    const dragForce = DRAG_COEFF * density * vel;
                    ax -= (dragForce * current.vx) / vel;
                    az -= (dragForce * current.vz) / vel;
                }
            }

            // Euler integration
            current.vx += ax * dt;
            current.vz += az * dt;
            current.x += current.vx * dt;
            current.z += current.vz * dt;
        }

        setRocket(current);

        const currentDist = Math.sqrt(current.x * current.x + current.z * current.z);
        const currentAlt = Math.max(0, currentDist - EARTH_RADIUS);
        const currentVel = Math.sqrt(current.vx * current.vx + current.vz * current.vz);
        onPhysicsTick(current, currentAlt, currentVel);
    });

    const isThrusting = rocket.fuel > 0 && rocket.throttle > 0 && isPlaying;
    
    // We map X and Z into Three.js coordinates (X, 0, Z)
    return (
        <>
            <ambientLight intensity={0.15} />
            <directionalLight position={[10, 20, 10]} intensity={1.5} color="#e0f2fe" />
            <Stars radius={100} depth={50} count={6000} factor={4} saturation={0.5} fade speed={0.5} />

            <EarthGroup />

            <Trail
                width={0.3}
                length={40}
                color={new THREE.Color("#cbd5e1")}
                attenuation={(t) => t * t}
            >
                <StarshipModel
                    position={[rocket.x, 0, rocket.z]}
                    angle={rocket.angle}
                    thrusting={isThrusting}
                />
            </Trail>

            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </>
    );
}

export default function SpaceXSim({ simData }: { simData: { title?: string; color?: string; [key: string]: unknown } }) {
    const accentColor = simData?.color || "#A78BFA";
    const [isPlaying, setIsPlaying] = useState(true);
    const [timeScale, setTimeScale] = useState(1);
    const [rocket, setRocket] = useState<RocketState>(INITIAL_ROCKET);

    // Live Metrics
    const dist = Math.sqrt(rocket.x * rocket.x + rocket.z * rocket.z);
    const altitude = Math.max(0, dist - EARTH_RADIUS);
    const speed = Math.sqrt(rocket.vx * rocket.vx + rocket.vz * rocket.vz);

    // Tasks / Mission Status
    const [missions, setMissions] = useState([
        {
            id: 1,
            title: "Açılı Yükseliş (Gravity Turn)",
            desc: "1.0 - 3.0 birim arası irtifada roket açısını 45 dereceye veya daha fazlasına yatırarak yan uçuşa başla.",
            isCompleted: false,
            condition: (r: RocketState, alt: number) => alt >= 1.0 && alt <= 3.0 && Math.abs(r.angle) >= 40,
            successText: "Mükemmel! Atmosferin en kalın tabakasını geçtikten sonra roketi yatay eksende bükmek (gravity turn), yörünge hızı kazanmak için en verimli yoldur."
        },
        {
            id: 2,
            title: "Kararlı Dairesel Yörünge",
            desc: "İrtifayı 3.0 birimin üzerinde tutarken kararlı dairesel yörünge hızına (hız ≈ 10.0 birim) ulaşarak motoru kapat.",
            isCompleted: false,
            condition: (r: RocketState, alt: number, vel: number) => alt > 3.0 && Math.abs(vel - 10.0) < 1.2 && r.throttle === 0,
            successText: "Yörünge Başarılı! Kütleçekim kuvveti, merkezcil kuvvete tamamen eşitlendi. Starship artık motor gücü kullanmadan yörüngede süzülecek."
        },
        {
            id: 3,
            title: "Kontrollü Dikey İniş (Suicide Burn)",
            desc: "Roketi atmosfere sokarak yavaşlat, ardından irtifa 0.2'den küçükken hızı 1.5 birimin altına düşürerek yumuşak iniş yap.",
            isCompleted: false,
            condition: (r: RocketState, alt: number, vel: number) => alt < 0.15 && vel < 1.5 && r.fuel < 100, // landed successfully
            successText: "İnanılmaz! SpaceX Starship yeryüzüne dikey ve güvenli şekilde iniş yaptı. Elon Musk gurur duyuyor!"
        }
    ]);

    const onPhysicsTick = useCallback((r: RocketState, alt: number, vel: number) => {
        setMissions(prev => prev.map(m => {
            if (!m.isCompleted && m.condition(r, alt, vel)) {
                return { ...m, isCompleted: true };
            }
            return m;
        }));
    }, []);

    const resetSim = () => {
        setRocket(INITIAL_ROCKET);
        setIsPlaying(true);
        setTimeScale(1);
    };

    const handleAngleChange = (newAngle: number) => {
        setRocket(prev => ({ ...prev, angle: newAngle }));
    };

    const handleThrottleChange = (newThrottle: number) => {
        setRocket(prev => ({ ...prev, throttle: newThrottle }));
    };

    const Controls = (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 justify-between bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/10">
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
                <PhysicsSlider label="Motor Gücü (Throttle)" value={rocket.throttle} min={0} max={100} step={5} unit="%" onChange={handleThrottleChange} color="#A78BFA" />
                <PhysicsSlider label="Yön Açısı (Pitch)" value={rocket.angle} min={-90} max={90} step={5} unit="°" onChange={handleAngleChange} color="#38BDF8" />
                <PhysicsSlider label="Zaman Çarpanı (t)" value={timeScale} min={0.2} max={4.0} step={0.2} unit="x" onChange={setTimeScale} color="#E2E8F0" />
            </div>

            {/* Metric Displays */}
            <div className="p-4 rounded-xl border border-[#A78BFA]/30 bg-black/40 shadow-inner space-y-3">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-bold uppercase">Kalan Yakıt</span>
                    <span className={`font-mono font-black ${rocket.fuel > 20 ? 'text-green-400' : 'text-red-500 animate-pulse'}`}>{rocket.fuel.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 rounded bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500" style={{ width: `${rocket.fuel}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-black">Yükseklik (h)</p>
                        <p className="text-base font-mono text-white">{(altitude * 100).toFixed(0)} km</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-black">Yörünge Hızı (v)</p>
                        <p className="text-base font-mono text-[#A78BFA]">{(speed * 780).toFixed(0)} m/s</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-white italic">YÖRÜNGE MEKANİĞİ VE GRAVITY TURN</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                Yörüngeye yerleşmek sadece dikey yükselmek değildir. Dünya'nın kütleçekiminden kurtulup sürekli düşüş haline (yörüngeye) girmek için muazzam bir yatay hıza ihtiyaç vardır.
            </p>

            <div className="grid gap-4 mt-4">
                <div className="p-4 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/30 text-center">
                    <span className="text-xs text-[#A78BFA] uppercase font-black block mb-2">Yörünge Hızı Formülü</span>
                    <p className="text-2xl font-mono text-[#A78BFA]">{"v = \\sqrt{G \\cdot M / r}"}</p>
                </div>


                <div className="text-sm text-zinc-300 space-y-3 leading-relaxed">
                    <p>
                        💡 <strong>Gravity Turn (Yerçekimi Dönüşü)</strong>: Roket yükselirken atmosferin kalın tabakalarını geçtikten sonra yana doğru eğilir. Bu sayede yerçekimi roketi doğal olarak yatay yönde hızlandırır ve yakıt verimliliği maksimuma çıkar.
                    </p>
                    <p>
                        🌡️ <strong>Atmosferik Sürtünme</strong>: 0 ile 400 km arası irtifada kalın bir hava katmanı bulunur. Bu bölgede çok hızlı gitmek, sürtünmeden dolayı roketin kinetik enerjisini ısıya dönüştürür ve roketi yavaşlatır (Aerodinamik Sürtünme).
                    </p>
                </div>
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
                            <CheckCircle2 className="w-5 h-5" />
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
            title={simData?.title || "Starship Yörünge Simülatörü"}
            color={accentColor}
            controlsArea={Controls}
            theoryArea={Theory}
            missionsArea={Missions}
            simId="spacex"
            parameters={{ altitude, speed, fuel: rocket.fuel, angle: rocket.angle, throttle: rocket.throttle }}
        >
            <div className="w-full h-full p-0 relative bg-black">
                <Canvas camera={{ position: [0, 0, 32], fov: 45 }}>
                    <Scene
                        isPlaying={isPlaying}
                        rocket={rocket}
                        setRocket={setRocket}
                        timeScale={timeScale}
                        onPhysicsTick={onPhysicsTick}
                    />
                </Canvas>

                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />

                <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-[#A78BFA]/40 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 animate-pulse" />
                    SPACEX TRAJECTORY ENGINE v2.0
                </div>
            </div>
        </SimulationLayout>
    );
}
