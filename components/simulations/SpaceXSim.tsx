"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider } from "./core/ui";
import { Play, Pause, RotateCcw, CheckCircle2, Terminal as TerminalIcon, ShieldAlert } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";

// Custom type for rocket state
type RocketState = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    throttle: number; // 0 to 100
    angle: number; // -90 to 90 degrees (0 is straight up, positive is right)
    fuel: number; // 0 to 100
    time: number; // Flight duration in seconds
};

const INITIAL_ROCKET: RocketState = {
    x: 0,
    y: 10.05, // Earth radius is 10.0, starting slightly above surface
    vx: 0,
    vy: 0,
    throttle: 0,
    angle: 0,
    fuel: 100,
    time: 0
};

// Physics Constants scaled for the simulation
const EARTH_RADIUS = 10.0;
const GRAVITY_MU = 1200.0; // G * M
const MAX_THRUST = 18.0;
const FUEL_BURN_RATE = 7.0; // fuel units consumed per second at 100% throttle
const ATMOSPHERE_HEIGHT = 4.0; // Atmosphere extends from r=10 to r=14
const DRAG_COEFF = 0.08;

export default function SpaceXSim({ simData }: { simData: { title?: string; color?: string; [key: string]: unknown } }) {
    const accentColor = simData?.color || "#A78BFA";
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeScale, setTimeScale] = useState(1);
    const [rocket, setRocket] = useState<RocketState>(INITIAL_ROCKET);
    const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
        "SYSTEM CHECK: Starship Flight Systems Operational.",
        "LAUNCH STANDBY: Awaiting Ignition Command..."
    ]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastTimeRef = useRef<number>(0);
    const trailPoints = useRef<{ x: number; y: number }[]>([]);
    const loggedPhases = useRef({ climb: false, orbit: false });

    // Metrics
    const dist = Math.sqrt(rocket.x * rocket.x + rocket.y * rocket.y);
    const altitude = Math.max(0, dist - EARTH_RADIUS);
    const speed = Math.sqrt(rocket.vx * rocket.vx + rocket.vy * rocket.vy);

    // Aerothermal heating calculation (visual effect during fast atmospheric flight)
    const heatingIntensity = (() => {
        if (altitude >= ATMOSPHERE_HEIGHT) return 0;
        const speedKms = speed * 0.78; // scaled
        if (speedKms < 3) return 0;
        const thickness = Math.exp(-altitude / 1.0);
        return Math.min(1, (speedKms - 3) * thickness * 0.3);
    })();

    // Flight logger helper
    const logEvent = useCallback((msg: string) => {
        setTelemetryLogs(prev => {
            const timeStr = `[T+${rocket.time.toFixed(0).padStart(3, "0")}s]`;
            const logLine = `${timeStr} ${msg}`;
            if (prev[prev.length - 1] === logLine) return prev;
            return [...prev.slice(-30), logLine]; // Keep last 30 logs
        });
    }, [rocket.time]);

    // Tasks / Mission Status
    const [missions, setMissions] = useState([
        {
            id: 1,
            title: "Açılı Yükseliş (Gravity Turn)",
            desc: "1.0 - 3.0 birim arası irtifada roket açısını 45 derece veya daha fazlasına yatırarak yan uçuşa başla.",
            isCompleted: false,
            condition: (r: RocketState, alt: number) => alt >= 1.0 && alt <= 3.0 && Math.abs(r.angle) >= 40,
            successText: "Yerçekimi Dönüşü (Gravity Turn) aktif! Roket, yatay hızını artırmak ve yörünge mekaniğini verimli kullanmak için açı kazandı."
        },
        {
            id: 2,
            title: "Kararlı Dairesel Yörünge",
            desc: "İrtifayı 3.0 birimin üzerinde tutarken kararlı dairesel yörünge hızına (hız ≈ 10.0 birim) ulaşarak motoru kapat.",
            isCompleted: false,
            condition: (r: RocketState, alt: number, vel: number) => alt > 3.0 && Math.abs(vel - 10.0) < 1.2 && r.throttle === 0,
            successText: "Kararlı Yörünge sağlandı! Yerçekimi, merkezcil kuvvetle kusursuz bir dengeye ulaştı. Starship süzülüyor."
        },
        {
            id: 3,
            title: "Kontrollü Dikey İniş (Suicide Burn)",
            desc: "Roketi atmosfere sokarak yavaşlat, ardından irtifa 0.2'den küçükken hızı 1.5 birimin altına düşürerek dikey iniş yap.",
            isCompleted: false,
            condition: (r: RocketState, alt: number, vel: number) => alt < 0.15 && vel < 1.5 && r.fuel < 100,
            successText: "Kusursuz İniş! Starship dikey ve güvenli bir şekilde yeryüzüne temas etti. Görev başarıyla tamamlandı!"
        }
    ]);

    // Track active missions
    useEffect(() => {
        const metMission = missions.find(m => !m.isCompleted && m.condition(rocket, altitude, speed));
        if (metMission) {
            setTimeout(() => {
                setMissions(prev => prev.map(m => {
                    if (m.id === metMission.id) {
                        return { ...m, isCompleted: true };
                    }
                    return m;
                }));
            }, 0);
        }
    }, [rocket, altitude, speed, missions]);

    // Handle game ticks
    const resetSim = () => {
        setRocket(INITIAL_ROCKET);
        setIsPlaying(false);
        setTimeScale(1);
        trailPoints.current = [];
        loggedPhases.current = { climb: false, orbit: false };
        setTelemetryLogs([
            "SYSTEM RESET: Starship Flight Systems Restored.",
            "LAUNCH STANDBY: Awaiting Ignition Command..."
        ]);
        setMissions(prev => prev.map(m => ({ ...m, isCompleted: false })));
    };

    const handleAngleChange = (newAngle: number) => {
        setRocket(prev => ({ ...prev, angle: newAngle }));
    };

    const handleThrottleChange = (newThrottle: number) => {
        setRocket(prev => ({ ...prev, throttle: newThrottle }));
        if (newThrottle > 0 && !isPlaying && rocket.fuel > 0) {
            setIsPlaying(true);
        }
    };

    // Physics Update Loop
    const updatePhysics = useCallback((dt: number) => {
        setRocket(current => {
            const rx = current.x;
            const ry = current.y;
            const dist = Math.sqrt(rx * rx + ry * ry);

            // Ground Crash Check
            if (dist <= EARTH_RADIUS) {
                const isSoft = Math.sqrt(current.vx * current.vx + current.vy * current.vy) < 1.8;
                if (current.vx !== 0 || current.vy !== 0) {
                    if (isSoft) {
                        logEvent("LANDING SUCCESS: Starship has touched down safely.");
                    } else {
                        logEvent("CRITICAL FAILURE: Rapid Unscheduled Disassembly (Crash on Earth).");
                    }
                }
                const nx = rx / dist;
                const ny = ry / dist;
                return {
                    ...current,
                    x: nx * EARTH_RADIUS,
                    y: ny * EARTH_RADIUS,
                    vx: 0,
                    vy: 0,
                    throttle: 0
                };
            }

            let ax = 0;
            let ay = 0;

            // 1. Newtonian Gravity
            const gAcc = GRAVITY_MU / (dist * dist * dist);
            ax -= gAcc * rx;
            ay -= gAcc * ry;

            // 2. Main Rocket Thrust
            if (current.fuel > 0 && current.throttle > 0) {
                const angleRad = (current.angle * Math.PI) / 180;
                // Local radial vector pointing out from Earth center
                const radX = rx / dist;
                const radY = ry / dist;

                // Local horizontal (tangential) vector
                const tangX = -radY;
                const tangY = radX;

                // Rocket orientation relative to local frame
                const dirX = radX * Math.cos(angleRad) + tangX * Math.sin(angleRad);
                const dirY = radY * Math.cos(angleRad) + tangY * Math.sin(angleRad);

                const thrustAcc = MAX_THRUST * (current.throttle / 100);
                ax += thrustAcc * dirX;
                ay += thrustAcc * dirY;
            }

            // 3. Atmospheric Drag
            const alt = dist - EARTH_RADIUS;
            if (alt < ATMOSPHERE_HEIGHT) {
                const vel = Math.sqrt(current.vx * current.vx + current.vy * current.vy);
                if (vel > 0.05) {
                    const density = Math.exp(-alt / 1.1) * 0.28;
                    const dragForce = DRAG_COEFF * density * vel;
                    ax -= (dragForce * current.vx) / vel;
                    ay -= (dragForce * current.vy) / vel;
                }
            }

            // Integrator updates
            const nextFuel = Math.max(0, current.fuel - FUEL_BURN_RATE * (current.throttle / 100) * dt);
            const nextTime = current.time + dt;

            const next = {
                ...current,
                vx: current.vx + ax * dt,
                vy: current.vy + ay * dt,
                x: current.x + (current.vx + 0.5 * ax * dt) * dt,
                y: current.y + (current.vy + 0.5 * ay * dt) * dt,
                fuel: nextFuel,
                time: nextTime
            };

            // Log event indicators
            if (current.fuel > 0 && nextFuel === 0) {
                logEvent("FUEL DEPELTED: Starship fuel tank dry. Thrust zero.");
            }

            return next;
        });
    }, [logEvent]);

    // Canvas rendering loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frameId: number;

        const render = (timestamp: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            const delta = (timestamp - lastTimeRef.current) / 1000;
            lastTimeRef.current = timestamp;

            const dt = Math.min(0.05, delta) * timeScale;
            if (isPlaying) {
                updatePhysics(dt);

                // Add to trail path
                if (trailPoints.current.length === 0 || 
                    Math.hypot(rocket.x - trailPoints.current[trailPoints.current.length - 1].x, rocket.y - trailPoints.current[trailPoints.current.length - 1].y) > 0.1) {
                    trailPoints.current.push({ x: rocket.x, y: rocket.y });
                    if (trailPoints.current.length > 500) trailPoints.current.shift();
                }
            }

            // Clear screen
            ctx.fillStyle = "#030712";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set up viewing coordinate transformation
            // Center is center of canvas
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            
            // View scale mapping (auto-scaling based on rocket distance)
            const maxRadius = Math.max(16, dist * 1.3);
            const scale = Math.min(cx, cy) / maxRadius;

            // Draw Space grid background
            ctx.strokeStyle = "rgba(79, 70, 229, 0.05)";
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Draw Orbit paths and guides
            ctx.strokeStyle = "rgba(79, 70, 229, 0.25)";
            ctx.setLineDash([4, 6]);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx, cy, EARTH_RADIUS * scale, 0, Math.PI * 2);
            ctx.stroke();

            // Atmospheric boundary sphere
            ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
            ctx.beginPath();
            ctx.arc(cx, cy, (EARTH_RADIUS + ATMOSPHERE_HEIGHT) * scale, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash

            // Draw Earth Globe (central sphere)
            const earthScreenRadius = EARTH_RADIUS * scale;
            const grad = ctx.createRadialGradient(cx - 2, cy - 2, 2, cx, cy, earthScreenRadius);
            grad.addColorStop(0, "#1e1b4b"); // Deep Indigo core
            grad.addColorStop(0.7, "#0f172a"); // Slate blue ocean
            grad.addColorStop(1, "#020617"); // Dark void edge
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, earthScreenRadius, 0, Math.PI * 2);
            ctx.fill();

            // Atmosphere radial blue glow ring
            const glowGrad = ctx.createRadialGradient(cx, cy, earthScreenRadius - 5, cx, cy, earthScreenRadius + (ATMOSPHERE_HEIGHT * scale));
            glowGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
            glowGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.25)");
            glowGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, earthScreenRadius + (ATMOSPHERE_HEIGHT * scale), 0, Math.PI * 2);
            ctx.fill();

            // Draw dynamic orbital trajectory line prediction (Keplerian simulation path)
            if (speed > 0.05) {
                ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 4]);
                ctx.beginPath();
                
                // Numerically integrate a lightweight path for prediction
                let px = rocket.x;
                let py = rocket.y;
                let pvx = rocket.vx;
                let pvy = rocket.vy;
                const pDt = 0.1;
                
                for (let i = 0; i < 150; i++) {
                    const pd = Math.hypot(px, py);
                    if (pd < EARTH_RADIUS) break;
                    
                    const pg = GRAVITY_MU / (pd * pd * pd);
                    let pax = -pg * px;
                    let pay = -pg * py;
                    
                    // Atmospheric drag in path prediction
                    const pAlt = pd - EARTH_RADIUS;
                    if (pAlt < ATMOSPHERE_HEIGHT) {
                        const pv = Math.hypot(pvx, pvy);
                        const pDensity = Math.exp(-pAlt / 1.1) * 0.28;
                        const pDrag = DRAG_COEFF * pDensity * pv;
                        pax -= (pDrag * pvx) / pv;
                        pay -= (pDrag * pvy) / pv;
                    }
                    
                    pvx += pax * pDt;
                    pvy += pay * pDt;
                    px += pvx * pDt;
                    py += pvy * pDt;
                    
                    const sx = cx + px * scale;
                    const sy = cy - py * scale;
                    
                    if (i === 0) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                }
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Draw active rocket trail path
            if (trailPoints.current.length > 1) {
                ctx.strokeStyle = accentColor;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(cx + trailPoints.current[0].x * scale, cy - trailPoints.current[0].y * scale);
                for (let i = 1; i < trailPoints.current.length; i++) {
                    ctx.lineTo(cx + trailPoints.current[i].x * scale, cy - trailPoints.current[i].y * scale);
                }
                ctx.stroke();
            }

            // Draw SpaceX Starship Rocket Vector
            const rxScreen = cx + rocket.x * scale;
            const ryScreen = cy - rocket.y * scale;

            ctx.save();
            ctx.translate(rxScreen, ryScreen);
            
            // Rotate rocket to point in its steering direction
            const radialAngle = Math.atan2(rocket.y, rocket.x);
            const steeringRad = (rocket.angle * Math.PI) / 180;
            const finalRotation = Math.PI/2 - radialAngle - steeringRad;
            ctx.rotate(finalRotation);

            // Re-entry aerothermal heat plasma glow effect
            if (heatingIntensity > 0.05) {
                ctx.strokeStyle = `rgba(239, 68, 68, ${heatingIntensity})`;
                ctx.lineWidth = 8;
                ctx.shadowColor = "#ef4444";
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(0, -6, 12, 0, Math.PI, true);
                ctx.stroke();
                ctx.shadowBlur = 0; // Reset shadow
            }

            // Engine Fire plume
            if (isPlaying && rocket.fuel > 0 && rocket.throttle > 0) {
                const plumeLength = 12 + (rocket.throttle / 100) * 16;
                const plumeGrad = ctx.createLinearGradient(0, 10, 0, 10 + plumeLength);
                plumeGrad.addColorStop(0, "#ffffff");
                plumeGrad.addColorStop(0.3, "#f97316"); // bright orange
                plumeGrad.addColorStop(1, "rgba(239, 68, 68, 0)"); // red fade
                ctx.fillStyle = plumeGrad;
                ctx.beginPath();
                ctx.moveTo(-4, 8);
                ctx.lineTo(0, 8 + plumeLength);
                ctx.lineTo(4, 8);
                ctx.closePath();
                ctx.fill();
            }

            // Rocket Body Silhouette
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#1e293b";
            ctx.lineWidth = 1.5;

            // Main body
            ctx.beginPath();
            ctx.moveTo(-3, 8);
            ctx.lineTo(-3, -6);
            ctx.quadraticCurveTo(0, -12, 3, -6); // Nose cone
            ctx.lineTo(3, 8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Fin Wings
            ctx.fillStyle = "#1e293b";
            ctx.beginPath();
            ctx.moveTo(-3, 4);
            ctx.lineTo(-7, 8);
            ctx.lineTo(-3, 8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(3, 4);
            ctx.lineTo(7, 8);
            ctx.lineTo(3, 8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.restore();

            frameId = requestAnimationFrame(render);
        };

        frameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [isPlaying, rocket, dist, timeScale, updatePhysics, accentColor, heatingIntensity, speed]);

    // Handle resizing to fit dynamic layout correctly
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Telemetry Events Logger on state triggers
    useEffect(() => {
        if (altitude > 0.05 && altitude < 1.0 && !loggedPhases.current.climb) {
            logEvent("CLIMB PHASE: Clearing thick lower atmosphere.");
            loggedPhases.current.climb = true;
        }
        if (altitude >= ATMOSPHERE_HEIGHT && altitude < ATMOSPHERE_HEIGHT + 0.5 && !loggedPhases.current.orbit) {
            logEvent("ATMOSPHERE EDGE: Entering orbit environment.");
            loggedPhases.current.orbit = true;
        }
    }, [altitude, logEvent]);

    const Controls = (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 justify-between bg-zinc-900 border-[2px] border-black p-2.5 rounded-xl shadow-[3px_3px_0px_0px_#000]">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#A78BFA] border-[2px] border-black text-black font-black py-2.5 rounded-lg hover:bg-[#C4B5FD] transition-all active:scale-95 uppercase tracking-wider text-xs shadow-[2px_2px_0px_0px_#000]"
                >
                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                    {isPlaying ? "DURDUR" : "IGNITION"}
                </button>
                <button
                    onClick={resetSim}
                    className="flex items-center justify-center w-11 h-11 bg-zinc-800 text-white rounded-lg border-[2px] border-black hover:bg-zinc-700 transition-all active:scale-95 shadow-[2px_2px_0px_0px_#000]"
                >
                    <RotateCcw className="w-4.5 h-4.5" />
                </button>
            </div>

            <div className="space-y-4">
                <PhysicsSlider label="Motor Gücü (Throttle)" value={rocket.throttle} min={0} max={100} step={5} unit="%" onChange={handleThrottleChange} color="#A78BFA" />
                <PhysicsSlider label="Yön Açısı (Pitch)" value={rocket.angle} min={-90} max={90} step={5} unit="°" onChange={handleAngleChange} color="#38BDF8" />
                <PhysicsSlider label="Zaman Çarpanı (t)" value={timeScale} min={0.2} max={4.0} step={0.2} unit="x" onChange={setTimeScale} color="#E2E8F0" />
            </div>

            {/* Premium SpaceX Telemetry Dashboard */}
            <div className="p-4 rounded-xl border-[2px] border-black bg-zinc-950 shadow-[3px_3px_0px_0px_#000] space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-500">
                    <span>Yakıt Seviyesi (Fuel)</span>
                    <span className={rocket.fuel > 20 ? "text-green-400" : "text-red-500 animate-pulse"}>
                        {rocket.fuel.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full h-2.5 rounded border border-black bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-400 transition-all" style={{ width: `${rocket.fuel}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-zinc-900">
                    <div>
                        <p className="text-[9px] text-zinc-500 uppercase font-black tracking-wider">İrtifa (h)</p>
                        <p className="text-base font-mono text-white font-bold">{(altitude * 100).toFixed(0)} km</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-zinc-500 uppercase font-black tracking-wider">Hız (v)</p>
                        <p className="text-base font-mono text-[#A78BFA] font-bold">{(speed * 780).toFixed(0)} m/s</p>
                    </div>
                </div>

                {/* Aerothermal temperature status */}
                {heatingIntensity > 0.05 && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-red-950/20 border border-red-900/50 text-[10px] font-bold text-red-400 animate-pulse">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Aero-Termal Sürtünme Yüksek: {(heatingIntensity * 1800).toFixed(0)} °C
                    </div>
                )}
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Roket Fiziği ve Yörüngeye Giriş</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                Yörüngeye girmek sadece yukarı çıkmak değildir. Roketin Dünya kütleçekim alanında sürekli süzülebilmesi (dairesel serbest düşüş yapması) için merkezcil kuvvetin kütleçekim kuvvetine tam olarak eşit olması gerekir.
            </p>

            <div className="grid gap-4 mt-4">
                <div className="p-4 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/30 text-center">
                    <span className="text-xs text-[#A78BFA] uppercase font-black block mb-2">Yörünge Hızı Formülü</span>
                    <p className="text-2xl font-mono text-[#A78BFA]">{"v = \\sqrt{G \\cdot M / r}"}</p>
                </div>

                <div className="text-sm text-zinc-300 space-y-3 leading-relaxed border-l-2 border-[#A78BFA] pl-4">
                    <p>
                        🛰️ <strong>Yerçekimi Dönüşü (Gravity Turn)</strong>: Fırlatma sonrası dikey yükselen roket, atmosferin kalın tabakalarını geçtikten sonra motor yönünü hafifçe yatırır. Bu aşamadan sonra roket, yerçekiminin doğal çekme etkisini kullanarak yan yönde aşırı hız kazanır.
                    </p>
                    <p>
                        ☄️ <strong>Atmosferik Re-entry</strong>: Yörüngeden çıkmak için roket uçuş yönünün tersine yanma (retro-burn) gerçekleştirir. Hız azaldığında roket atmosfere girer ve yüksek hızlı gaz molekülleriyle sürtünerek termal plazma sıcaklığı üretir (Aerodinamik Sürtünme).
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
                    className={`relative p-4 rounded-xl border-[2px] transition-all duration-500 overflow-hidden ${m.isCompleted
                        ? "bg-[#4ADE80]/10 border-green-700/50 shadow-[0_0_15px_rgba(74,222,128,0.05)]"
                        : "bg-zinc-950 border-black shadow-[2px_2px_0px_0px_#000]"
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
                    <p className="text-xs text-zinc-400 mb-4">{m.desc}</p>

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
            title={simData?.title || "SpaceX Starship Yörünge Simülatörü"}
            color={accentColor}
            controlsArea={Controls}
            theoryArea={Theory}
            missionsArea={Missions}
            simId="spacex"
            parameters={{ altitude, speed, fuel: rocket.fuel, angle: rocket.angle, throttle: rocket.throttle }}
        >
            <div className="w-full h-full flex flex-col md:grid md:grid-rows-[1fr_120px] bg-black">
                {/* Orbital Flight Canvas */}
                <div className="relative w-full h-full min-h-[300px]">
                    <canvas ref={canvasRef} className="w-full h-full block" />
                    <div className="absolute top-4 left-4 z-10 pointer-events-none text-white/40 font-mono text-[9px] uppercase tracking-widest flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
                        <TerminalIcon className="w-3.5 h-3.5 text-[#A78BFA] animate-pulse" />
                        SPACE FLIGHT COMPUTER ENGINE v2.0
                    </div>
                </div>

                {/* Telemetry Log Terminal Dashboard */}
                <div className="border-t border-zinc-900 bg-zinc-950 p-3 flex flex-col min-h-[120px]">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-500 tracking-wider mb-2 border-b border-zinc-900 pb-1.5 shrink-0">
                        <TerminalIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                        Starship Telemetry Command Center Log
                    </div>
                    <div className="flex-1 overflow-y-auto font-mono text-[10px] text-zinc-400 space-y-1 scrollbar-thin select-text">
                        {telemetryLogs.map((log, index) => (
                            <div key={index} className={log.includes("FAILURE") ? "text-red-400" : log.includes("SUCCESS") || log.includes("Yörünge") ? "text-green-400" : "text-zinc-400"}>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SimulationLayout>
    );
}
