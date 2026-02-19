"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider, PhysicsToggle } from "./core/ui";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProjectileSim({ simData }: { simData: any }) {
    // -------------------------------------------------------------
    // 1. PHYSICS STATE
    // -------------------------------------------------------------
    const [velocity, setVelocity] = useState(20); // m/s
    const [angle, setAngle] = useState(45); // degrees
    const [gravity, setGravity] = useState(9.81); // m/s²
    const [height, setHeight] = useState(0); // m
    const [showVectors, setShowVectors] = useState(true);

    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);

    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // Derived values for static trajectory and UI
    const thetaRad = angle * (Math.PI / 180);
    const v0x = velocity * Math.cos(thetaRad);
    const v0y = velocity * Math.sin(thetaRad);

    // Calculate time of flight (quadratic formula: 0 = h + v0y*t - 0.5*g*t^2)
    const timeOfFlight = useMemo(() => {
        const a = -0.5 * gravity;
        const b = v0y;
        const c = height;
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return 0; // Should not happen
        const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return Math.max(t1, t2); // We want the positive root
    }, [v0y, gravity, height]);

    const maxRange = v0x * timeOfFlight;
    const maxHeight = height + (v0y * v0y) / (2 * gravity);

    // -------------------------------------------------------------
    // 2. SIMULATION ENGINE
    // -------------------------------------------------------------
    const resetSim = () => {
        setIsPlaying(false);
        setTime(0);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    const loop = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        if (isPlaying) {
            setTime(prev => {
                const nextTime = prev + (dt * 2); // 2x speed for better visual experience
                if (nextTime >= timeOfFlight) {
                    setIsPlaying(false);
                    return timeOfFlight;
                }
                return nextTime;
            });
        }
        animationRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(loop);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, timeOfFlight]);

    // Reset when parameters change
    useEffect(() => {
        if (!isPlaying) {
            setTime(0);
        }
    }, [velocity, angle, height, gravity, isPlaying]);

    // -------------------------------------------------------------
    // 3. RENDER CALCULATIONS (SVG)
    // -------------------------------------------------------------
    // We want the SVG to automatically scale to mostly fit the max height and max range.
    // However, constant zooming can be dizzying. We'll set a generous static viewBox
    // or slightly adaptive bounds.
    const viewWidth = Math.max(100, maxRange * 1.2);
    const viewHeight = Math.max(50, maxHeight * 1.5);

    // Y-axis is inverted in SVG (0 is top). 
    // We will draw standard physics coordinates and just use a transform in SVG.

    // Generate the predicted trajectory path
    const trajectoryPoints = useMemo(() => {
        const points = [];
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * timeOfFlight;
            const px = v0x * t;
            const py = height + (v0y * t) - 0.5 * gravity * t * t;
            points.push(`${px},${py}`);
        }
        return points.join(" ");
    }, [v0x, v0y, gravity, height, timeOfFlight]);

    // Current projectile position
    const currentX = v0x * time;
    const currentY = height + (v0y * time) - 0.5 * gravity * time * time;

    // Current velocity components mapping
    const currentVx = v0x;
    const currentVy = v0y - gravity * time;
    const speed = Math.sqrt(currentVx * currentVx + currentVy * currentVy);

    // -------------------------------------------------------------
    // 4. PEDAGOGICAL MISSIONS
    // -------------------------------------------------------------
    const [missions, setMissions] = useState([
        {
            id: 1,
            title: "Maksimum Menzil",
            desc: "Aynı hızla bir topu yatayda en uzağa atmak için (maksimum R) açıyı kaç derece yapmalısın? Açıyı bul ve atışı tamamla.",
            isCompleted: false,
            condition: () => angle === 45 && time >= timeOfFlight - 0.1 && timeOfFlight > 0,
            successText: "Harika! Hava sürtünmesi olmadığında 45°'lik açı yatayda (Menzil) maksimum mesafeyi verir."
        },
        {
            id: 2,
            title: "Dikine Atış",
            desc: "Cismi doğrudan yukarı fırlatıp başlangıç noktasına yatay (X) ekseninde ilerlemeden düşmesini sağla.",
            isCompleted: false,
            condition: () => angle === 90 && time >= timeOfFlight - 0.1 && timeOfFlight > 0,
            successText: "Tebrikler! 90° açıyla atış yaptığında yatay hız (Vx = 0) olduğu için cisim yatayda hiç yol almaz."
        },
        {
            id: 3,
            title: "Yörünge Zirvesi",
            desc: "Maksimum yüksekliği (H) en az 40 metreye çıkar ve atışı izle.",
            isCompleted: false,
            condition: () => maxHeight >= 40 && time >= timeOfFlight - 0.1,
            successText: "Çok iyi! Maksimum yükseklik; ilk hıza ve atış açısının sinüs değerine bağlıdır."
        }
    ]);

    useEffect(() => {
        setMissions(prev => prev.map(m => {
            if (!m.isCompleted && m.condition()) {
                return { ...m, isCompleted: true };
            }
            return m;
        }));
    }, [angle, time, timeOfFlight, maxHeight]);

    // -------------------------------------------------------------
    // 5. UI COMPONENTS
    // -------------------------------------------------------------
    const Controls = (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 justify-between mb-4 bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B6B] text-black font-black py-3 rounded-lg hover:bg-[#FF8E8E] transition-all active:scale-95 uppercase tracking-wider"
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
                    {isPlaying ? "DURDUR" : "ATEŞLE!"}
                </button>
                <button
                    onClick={resetSim}
                    className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white active:scale-95"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <PhysicsSlider label="İlk Hız (V₀)" value={velocity} min={5} max={50} step={1} unit="m/s" onChange={setVelocity} color="#FF6B6B" />
            <PhysicsSlider label="Atış Açısı (θ)" value={angle} min={0} max={90} step={1} unit="°" onChange={setAngle} color="#38BDF8" />
            <PhysicsSlider label="Yükseklik (h₀)" value={height} min={0} max={50} step={1} unit="m" onChange={setHeight} color="#A78BFA" />
            <PhysicsSlider label="Yerçekimi (g)" value={gravity} min={1} max={25} step={0.1} unit="m/s²" onChange={setGravity} color="#FCD34D" />
            <PhysicsToggle label="Hız Vektörlerini Göster" checked={showVectors} onChange={setShowVectors} color="#4ADE80" />

            {/* Live Data Dashboard */}
            <div className="mt-4 p-4 rounded-xl border border-white/10 bg-black/40 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Havada Kalma</p>
                    <p className="text-xl font-mono text-white">{time.toFixed(2)} / {timeOfFlight.toFixed(2)}s</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Maksimum Menzil</p>
                    <p className="text-xl font-mono text-[#FF6B6B] drop-shadow-md">{maxRange.toFixed(1)}m</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Anlık Hız (v)</p>
                    <p className="text-xl font-mono text-white">{speed.toFixed(1)} m/s</p>
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Maks Yükseklik</p>
                    <p className="text-xl font-mono text-[#38BDF8]">{maxHeight.toFixed(1)}m</p>
                </div>
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-5">
            <h2 className="text-xl font-black text-white italic">EĞİK ATIŞ TEORİSİ</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                Eğik atış (Projectile Motion), yerçekimi etkisi altındaki bir cismin iki boyutlu düzlemde yaptığı harekettir.
                <strong>Yatayda (X) hız sabittir, dikeyde (Y) ise yerçekiminden dolayı değişken ivmeli bir hareket vardır.</strong>
            </p>

            <div className="grid gap-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Yatay Hız & Konum</span>
                    <p className="text-sm font-mono text-[#FF6B6B]">Vₓ = V₀·cos(θ)</p>
                    <p className="text-sm font-mono text-white mt-1">X = Vₓ·t</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Dikey Hız & Konum</span>
                    <p className="text-sm font-mono text-[#38BDF8]">V_y = V₀·sin(θ) - g·t</p>
                    <p className="text-sm font-mono text-white mt-1">Y = Y₀ + V₀_y·t - ½g·t²</p>
                </div>
                <div className="p-3 rounded-lg bg-white/10 border border-[#FCD34D]/30 shadow-[0_0_15px_rgba(252,211,77,0.1)]">
                    <span className="text-[11px] text-[#FCD34D] uppercase font-black block mb-1">Maksimum Menzil (R)</span>
                    <p className="text-base font-mono text-[#FCD34D] drop-shadow-md">R = (V₀² · sin(2θ)) / g</p>
                    <p className="text-xs text-zinc-400 mt-2 font-medium">Bu formüle göre hava sürtünmesiz ortamda maksimum menzil için <strong>sin(2θ) = 1</strong> olmalıdır, yani <strong>θ = 45°</strong> gerekir.</p>
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
            title={simData.title || "Atış Hareketi"}
            color={simData.color || "#FF6B6B"}
            controlsArea={Controls}
            theoryArea={Theory}
            missionsArea={Missions}
        >
            {/* The SVG Canvas wrapper */}
            {/* We apply a CSS transform scale(1, -1) to invert the Y-axis so standard Math applies exactly visually! */}
            <div className="w-full h-full p-8 relative">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`-5 -5 ${viewWidth + 10} ${viewHeight + 10}`}
                    preserveAspectRatio="xMidYMax meet"
                    className="overflow-visible"
                >
                    <g transform={`translate(0, ${viewHeight}) scale(1, -1)`}>
                        {/* Grid / Background aesthetics */}
                        <g className="text-white/5" stroke="currentColor" strokeWidth={viewWidth / 100}>
                            {[...Array(10)].map((_, i) => (
                                <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2={viewHeight} />
                            ))}
                            {[...Array(5)].map((_, i) => (
                                <line key={`h${i}`} x1="0" y1={i * 20} x2={viewWidth} y2={i * 20} />
                            ))}
                        </g>

                        {/* Ground Line */}
                        <line x1="-10" y1="0" x2={viewWidth + 50} y2="0" stroke="#fff" strokeWidth={viewWidth / 150} opacity="0.3" />

                        {/* Starting Platform (if height > 0) */}
                        {height > 0 && (
                            <rect x="-10" y="0" width="10" height={height} fill="#fff" opacity="0.1" />
                        )}

                        {/* Trajectory Prediction Path (Dashed) */}
                        <polyline
                            points={trajectoryPoints}
                            fill="none"
                            stroke="#FF6B6B"
                            strokeWidth={viewWidth / 100}
                            strokeDasharray="4 8"
                            opacity="0.4"
                        />

                        {/* Max Height Indicator */}
                        {maxHeight > 5 && (
                            <g opacity="0.3">
                                <line x1={maxRange / 2} y1="0" x2={maxRange / 2} y2={maxHeight} stroke="#38BDF8" strokeWidth={viewWidth / 150} strokeDasharray="3 3" />
                            </g>
                        )}

                        {/* The Projectile Component */}
                        <g transform={`translate(${currentX}, ${currentY})`}>
                            {/* The Ball */}
                            <circle
                                r={viewWidth > 200 ? 3 : 2}
                                fill="#FFF"
                                style={{ filter: "drop-shadow(0px 0px 8px rgba(255, 107, 107, 1))" }}
                            />
                            <circle
                                r={viewWidth > 200 ? 1.5 : 1}
                                fill="#FF6B6B"
                            />

                            {/* Velocity Vectors */}
                            {showVectors && time > 0 && time < timeOfFlight && (
                                <g>
                                    {/* X Velocity (Red) */}
                                    <line x1="0" y1="0" x2={currentVx} y2="0" stroke="#FF6B6B" strokeWidth={viewWidth / 150} />
                                    <polygon points={`${currentVx},0 ${currentVx - 3},-2 ${currentVx - 3},2`} fill="#FF6B6B" />

                                    {/* Y Velocity (Blue) */}
                                    {/* Note: since scale(1,-1) is active, positive Y points UP, which matches currentVy */}
                                    <line x1="0" y1="0" x2="0" y2={currentVy} stroke="#38BDF8" strokeWidth={viewWidth / 150} />
                                    <polygon points={`0,${currentVy} -2,${currentVy - Math.sign(currentVy) * 3} 2,${currentVy - Math.sign(currentVy) * 3}`} fill="#38BDF8" />

                                    {/* Total Velocity (White) */}
                                    <line x1="0" y1="0" x2={currentVx} y2={currentVy} stroke="#FFFFFF" strokeWidth={viewWidth / 200} opacity="0.5" />
                                </g>
                            )}
                        </g>
                    </g>
                </svg>
            </div>
        </SimulationLayout>
    );
}
