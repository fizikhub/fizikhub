"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw } from "lucide-react";
import { SimWrapper, SimTask } from "./sim-wrapper";

interface ProjectileSimProps {
    className?: string;
}

// Physics State (Mutable Ref)
type GameState = {
    // Projectile
    x: number; y: number; vx: number; vy: number;
    active: boolean;
    path: { x: number; y: number }[];
    // Cannon
    angle: number;
    power: number;
    // Environment
    g: number;
    scale: number; // pixels per simulation meter
    // Camera
    camera: { x: number; y: number };
    // Target
    target: { x: number; y: number; w: number; h: number; hit: boolean };
    // Visuals
    landingSpot: { x: number; active: boolean } | null;
};

export function ProjectileSim({ className }: ProjectileSimProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // UI Sync State
    const [isRunning, setIsRunning] = useState(false);
    const [uiAngle, setUiAngle] = useState(45);
    const [uiPower, setUiPower] = useState(50);
    const [simData, setSimData] = useState({ range: 0, height: 0, time: 0 });

    // Tasks (Tutorial Mode)
    // Tasks (Tutorial Mode) - Refined for "Gamified" feel
    const [tasks, setTasks] = useState<SimTask[]>([
        {
            id: "p1",
            description: "İlk Atışını Yap",
            hint: "Sadece 'ATEŞLE' butonuna bas ve topun nereye düştüğünü gör.",
            isCompleted: false,
            explanation: "Tebrikler! Bir cisim fırlatıldığında hem yatay hem de dikey hareket eder."
        },
        {
            id: "p2",
            description: "En Uzağa Git (45°)",
            hint: "Fiziğin altın kuralı: En uzun menzil için açıyı 45° yap ve Hızı 100m/s'ye ayarla.",
            isCompleted: false,
            explanation: "Harika! Hava sürtünmesi olmadığında 45 derece her zaman en uzun menzili verir."
        },
        {
            id: "p3",
            description: "Bulutlara Dokun (Yükseklik)",
            hint: "Topu olabildiğince yükseğe at! Açıyı 80-90° arası yap ve Hızı 120m/s üstüne çıkar.",
            isCompleted: false,
            explanation: "Mükemmel! Dikey hız ne kadar fazlaysa, cisim o kadar yükseğe çıkar."
        },
        {
            id: "p4",
            description: "Hedefi Vur (Keskin Nişancı)",
            hint: "Hedef uzakta belirdi! Deneme-yanılma yaparak tam isabet ettirmeye çalış.",
            isCompleted: false,
            explanation: "İşte bu! Fizik kurallarını kullanarak hedefi tam on ikiden vurdun."
        },
    ]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // Physics Engine
    const state = useRef<GameState>({
        x: 0, y: 0, vx: 0, vy: 0,
        active: false,
        path: [],
        angle: 45,
        power: 50,
        g: 9.81,
        scale: 4, // Will be dynamic
        camera: { x: 0, y: 0 },
        target: { x: 300, y: 0, w: 50, h: 10, hit: false },
        landingSpot: null
    });

    // Initialize/Reset
    const resetSim = useCallback(() => {
        const s = state.current;
        const container = containerRef.current;
        if (!container) return;

        // Reset Physics
        s.active = false;
        s.vx = 0; s.vy = 0;
        s.path = [];
        s.target.hit = false;
        // Keep landing spot until fire? No, clear logic in fire.

        // Reset Camera
        s.camera.x = 0;
        s.camera.y = 0;

        // Reset Position (Ground level is always y=0 in physics, rendering handles offset)
        // Let's use a coordinate system where (0,0) is the cannon muzzle for physics slightly easier,
        // but traditionally we map (x,y) to canvas. 
        // Let's stick to: y=0 is ground in physics.
        s.x = 0;
        s.y = 0;

        // Determine Scale based on width
        // Mobile: Show ~50m width -> scale = width / 50
        // Desktop: Show ~100m width -> scale = width / 100
        const isMobile = container.clientWidth < 640;
        const visibleMeters = isMobile ? 60 : 120;
        s.scale = container.clientWidth / visibleMeters;

        // Randomize target based on visible range + some buffer
        if (currentTaskIndex === 0) {
            // Target between 20m and 80% of max visible range or just a reasonable random distance
            const minRange = 30; // meters
            const maxRange = isMobile ? 150 : 300; // meters
            const targetDist = minRange + Math.random() * (maxRange - minRange);
            s.target.x = targetDist;
        }

        setIsRunning(false);
        setSimData({ range: 0, height: 0, time: 0 });
    }, [currentTaskIndex]);

    const fire = () => {
        const s = state.current;
        if (s.active) return;

        const rad = s.angle * Math.PI / 180;
        const v = s.power; // Direct m/s

        s.active = true;
        s.path = [];
        s.target.hit = false;
        s.landingSpot = null;
        s.x = 0;
        s.y = 0;

        // Initial Velocity
        s.vx = v * Math.cos(rad);
        s.vy = v * Math.sin(rad);

        setIsRunning(true);
    };

    // Task Completion
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
    }, []);

    // Game Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !containerRef.current) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let lastTime = performance.now();

        // Initial Reset
        resetSim();

        const loop = (time: number) => {
            const output = canvasRef.current;
            const container = containerRef.current;
            if (!output || !container) return;

            // Resize handling
            if (output.width !== container.clientWidth || output.height !== container.clientHeight) {
                output.width = container.clientWidth;
                output.height = container.clientHeight;
                // Re-calculate scale if needed, but maybe safer to keep consistent during flight?
                // Let's re-calc scale if NOT active to avoid jump, otherwise keep.
                if (!state.current.active) {
                    const isMobile = container.clientWidth < 640;
                    const visibleMeters = isMobile ? 60 : 120;
                    state.current.scale = container.clientWidth / visibleMeters;
                }
            }

            const dt = Math.min((time - lastTime) / 1000, 0.1);
            lastTime = time;
            const s = state.current;
            const heightPx = output.height;
            const groundY = heightPx - 100; // Ground is 100px from bottom

            // Update Physics
            if (s.active) {
                const timeScale = 3.0; // Speed up simulation 3x
                s.vy -= s.g * dt * timeScale;
                s.x += s.vx * dt * timeScale;
                s.y += s.vy * dt * timeScale;

                s.path.push({ x: s.x, y: s.y });

                // Ground Collision (y <= 0)
                if (s.y <= 0) {
                    s.y = 0;
                    s.active = false;
                    setIsRunning(false);

                    // Results
                    const range = s.x;
                    const maxH = Math.max(...s.path.map(p => p.y));
                    setSimData({
                        range,
                        height: maxH,
                        time: s.path.length * 0.016
                    });

                    // Set Landing Spot
                    s.landingSpot = { x: s.x, active: true };

                    // Check Tasks
                    if (currentTaskIndex === 0 && s.target.hit) completeTask(0);
                    if (currentTaskIndex === 1 && Math.abs(s.angle - 45) < 3 && s.power >= 95) completeTask(1);
                    if (currentTaskIndex === 2 && maxH > 150) completeTask(2);
                }

                // Target Collision
                // Simple AABB. Target is at s.target.x (meters), width s.target.w (meters)
                if (s.y <= s.target.h && s.x >= s.target.x && s.x <= s.target.x + 5) { // 5m generous hit box
                    // Or strictly:
                    // x overlap: [s.x - radius, s.x + radius] overlaps [target.x, target.x + w]
                }
                // Let's use scale for collision to be precise visually
                // But physics-based is better.
                // Target: x start: target.x, x end: target.x + target.w (converted from pixels/meters)
                // Let's explicitly define target width in meters:
                const targetWMeters = Math.max(10, s.target.w / s.scale); // ensure min size
                if (s.x >= s.target.x && s.x <= s.target.x + targetWMeters && s.y <= 2) { // 2m height tolerance
                    s.target.hit = true;
                }
            }

            // Camera Logic (Follow projectile)
            const projectileScreenX = s.x * s.scale - s.camera.x;
            const outputWidth = output.width;

            // Horizontal Follow
            if (projectileScreenX > outputWidth * 0.6) {
                s.camera.x += (projectileScreenX - outputWidth * 0.6) * 0.1;
            }

            // Vertical Follow (Y-axis)
            // Physics Y is up, Canvas Y is down. Origin is at groundY + camera.y
            // Screen Y of projectile = (groundY + camera.y) - (s.y * s.scale)
            // We want projectile to stay below top 20% (e.g. 0.2 * height)
            const targetScreenY = output.height * 0.3; // Aim to keep high projectiles here
            const currentProjScreenY = (groundY + s.camera.y) - (s.y * s.scale);

            if (currentProjScreenY < targetScreenY) {
                // Projectile is too high, move camera UP (which means increasing camera.y, shifting ground down)
                s.camera.y += (targetScreenY - currentProjScreenY) * 0.1;
            } else if (s.camera.y > 0 && !s.active) {
                // Return to ground level smoothly if active
                s.camera.y += (0 - s.camera.y) * 0.05;
            } else if (s.camera.y > 0 && currentProjScreenY > output.height * 0.6) {
                // If dropping down and camera has offset, reduce offset
                s.camera.y += (0 - s.camera.y) * 0.1;
            }

            // Clamp camera.y to not go below 0 (don't show underground)
            // Actually camera.y > 0 means we looked up.
            if (s.camera.y < 0) s.camera.y = 0;

            // Idle return X
            if (!s.active && s.x === 0 && Math.abs(s.camera.x) > 1) {
                s.camera.x += (0 - s.camera.x) * 0.1;
            }


            // --- DRAWING ---
            ctx.fillStyle = "#09090b"; // Canvas bg
            ctx.fillRect(0, 0, output.width, output.height);

            ctx.save();

            // Apply Camera Transform
            // We want y=0 to be at `groundY`
            // and x=0 to be at 50px padding from left relative to camera
            const startX = 50;
            ctx.translate(startX - s.camera.x, groundY + s.camera.y);

            // Draw Grid/Metrics
            const stepMeters = 10;
            const stepPx = stepMeters * s.scale;
            ctx.textAlign = "center";
            ctx.font = "10px monospace";
            ctx.fillStyle = "#444";

            // Calculate visible range for optimization
            const camStartM = (s.camera.x - startX) / s.scale;
            const camEndM = (s.camera.x - startX + output.width) / s.scale;
            const startM = Math.floor(camStartM / 10) * 10;
            const endM = Math.ceil(camEndM / 10) * 10;

            for (let m = Math.max(0, startM); m <= endM; m += stepMeters) {
                const x = m * s.scale;
                ctx.strokeStyle = "rgba(255,255,255,0.1)";
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, -output.height);
                ctx.stroke();

                // Label
                ctx.fillText(`${m}m`, x, 20);
            }

            // Draw Ground
            ctx.fillStyle = "#18181b";
            ctx.fillRect(camStartM * s.scale - 100, 0, (camEndM - camStartM) * s.scale + 200, 100); // Infinite ground illusion
            ctx.fillStyle = "#22c55e"; // Grass
            ctx.fillRect(camStartM * s.scale - 100, 0, (camEndM - camStartM) * s.scale + 200, 2);

            // Draw Target
            if (currentTaskIndex === 0) {
                const tx = s.target.x * s.scale;
                const tw = Math.max(40, s.target.w); // Min 40px visually
                const th = 10;
                ctx.fillStyle = s.target.hit ? "#ef4444" : "#eab308";
                // Glow
                ctx.shadowColor = s.target.hit ? "#ef4444" : "#eab308";
                ctx.shadowBlur = 10;
                ctx.fillRect(tx, -th, tw, th);
                ctx.shadowBlur = 0;
            }

            // Draw Path
            if (s.path.length > 1) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
                ctx.lineWidth = 2;
                // Optimization: only draw visible part? Path is usually short enough.
                ctx.moveTo(s.path[0].x * s.scale, -s.path[0].y * s.scale);
                for (let i = 1; i < s.path.length; i++) {
                    ctx.lineTo(s.path[i].x * s.scale, -s.path[i].y * s.scale);
                }
                ctx.stroke();
            }

            // Draw Cannon
            ctx.save();
            ctx.translate(0, -10); // Cannon wheel axis
            ctx.rotate(-s.angle * Math.PI / 180);
            ctx.fillStyle = "#71717a";
            ctx.fillRect(0, -8, 40, 16); // Barrel
            ctx.restore();

            // Wheel
            ctx.beginPath();
            ctx.arc(0, -10, 12, 0, Math.PI * 2);
            ctx.fillStyle = "#27272a";
            ctx.fill();
            ctx.strokeStyle = "#52525b";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Landing Marker
            if (s.landingSpot && s.landingSpot.active) {
                const lx = s.landingSpot.x * s.scale;
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(lx, 0, 4, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "white";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`${s.landingSpot.x.toFixed(1)}m`, lx, 20);
            }

            // Projectile
            if (s.active || s.path.length > 0) {
                const px = s.x * s.scale;
                const py = -s.y * s.scale;
                ctx.beginPath();
                ctx.arc(px, py, 6, 0, Math.PI * 2);
                ctx.fillStyle = "#fff";
                ctx.fill();
                // Trail effect
                ctx.shadowColor = "white";
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            ctx.restore(); // Restore camera transform

            animationId = requestAnimationFrame(loop);
        };
        animationId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationId);
    }, [currentTaskIndex, completeTask, resetSim]);

    return (
        <SimWrapper
            title="Eğik Atış Laboratuvarı"
            description="Yerçekimi altında cisimlerin hareketini incele."
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            onReset={resetSim}
            controls={
                <div className="space-y-6">
                    {/* Fire Button - Big & Accessible */}
                    <button
                        onClick={fire}
                        disabled={isRunning}
                        className={cn(
                            "w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-lg active:scale-95",
                            isRunning
                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                                : "bg-white text-black hover:bg-zinc-200 border border-transparent shadow-white/10"
                        )}
                    >
                        {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                        {isRunning ? "SİMÜLASYON SÜRÜYOR..." : "ATEŞLE"}
                    </button>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Angle Control */}
                        <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/10 group hover:border-white/20 transition-colors">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">AÇI</span>
                                <span className="text-lg font-mono font-bold text-white bg-white/5 px-2 rounded">{uiAngle}°</span>
                            </div>
                            <div className="relative h-6 flex items-center">
                                <input
                                    type="range" min="0" max="90" value={uiAngle}
                                    disabled={isRunning}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value);
                                        setUiAngle(v);
                                        state.current.angle = v;
                                    }}
                                    className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-white disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Power Control */}
                        <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/10 group hover:border-[#4ADE80]/30 transition-colors">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">HIZ</span>
                                <span className="text-lg font-mono font-bold text-[#4ADE80] bg-[#4ADE80]/10 px-2 rounded">{uiPower}m/s</span>
                            </div>
                            <div className="relative h-6 flex items-center">
                                <input
                                    type="range" min="10" max="150" value={uiPower}
                                    disabled={isRunning}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value);
                                        setUiPower(v);
                                        state.current.power = v;
                                    }}
                                    className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-[#4ADE80] disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Results Display */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-zinc-950 p-3 rounded-xl border border-white/5 text-center">
                            <div className="text-[9px] text-zinc-500 uppercase font-black mb-1">Menzil</div>
                            <div className="text-sm sm:text-base font-mono font-bold text-white">{simData.range.toFixed(1)}m</div>
                        </div>
                        <div className="bg-zinc-950 p-3 rounded-xl border border-white/5 text-center">
                            <div className="text-[9px] text-zinc-500 uppercase font-black mb-1">Yükseklik</div>
                            <div className="text-sm sm:text-base font-mono font-bold text-white">{simData.height.toFixed(1)}m</div>
                        </div>
                        <div className="bg-zinc-950 p-3 rounded-xl border border-white/5 text-center">
                            <div className="text-[9px] text-zinc-500 uppercase font-black mb-1">Süre</div>
                            <div className="text-sm sm:text-base font-mono font-bold text-white">{simData.time.toFixed(1)}s</div>
                        </div>
                    </div>
                </div>
            }
        >
            <div
                ref={containerRef}
                className="w-full h-full relative bg-[#09090b]"
            >
                <canvas ref={canvasRef} className="w-full h-full block touch-none" />

                {/* Overlay Hint */}
                {!isRunning && state.current.path.length === 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 text-sm font-bold pointer-events-none select-none animate-pulse">
                        SİMÜLASYONU BAŞLAT
                    </div>
                )}
            </div>
        </SimWrapper>
    );
}
