"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { SimSlider } from "@/components/simulations/ui/sim-slider";
import { SimButton } from "@/components/simulations/ui/sim-button";
import { Play, RotateCcw, Trash2 } from "lucide-react";

export default function ProjectileSim() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Physics Parameters
    const [velocity, setVelocity] = useState(18); // m/s (scaled)
    const [angle, setAngle] = useState(45); // degrees
    const [gravity, setGravity] = useState(1); // multiplier
    const [restitution, setRestitution] = useState(0.8); // bounciness

    // UI State
    const [isSceneReady, setIsSceneReady] = useState(false);

    // Initialize Matter.js
    useEffect(() => {
        if (!sceneRef.current) return;

        // Clean up previous instance if exists (React Strict Mode double-invokes)
        if (engineRef.current) return;

        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        // Create engine
        const engine = Engine.create();
        engineRef.current = engine;

        // Create renderer
        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: sceneRef.current.clientWidth,
                height: sceneRef.current.clientHeight,
                background: '#1A1A1A',
                wireframes: false,
                pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
                showVelocity: true // Show velocity vectors for educational purpose
            }
        });
        renderRef.current = render;
        canvasRef.current = render.canvas;

        // Create Static Bodies (Ground and Walls)
        const width = sceneRef.current.clientWidth;
        const height = sceneRef.current.clientHeight;

        const ground = Bodies.rectangle(width / 2, height - 20, width, 40, {
            isStatic: true,
            label: "Ground",
            render: { fillStyle: '#333333' }
        });

        const leftWall = Bodies.rectangle(0, height / 2, 20, height, {
            isStatic: true,
            render: { visible: false }
        });

        const rightWall = Bodies.rectangle(width, height / 2, 20, height, {
            isStatic: true,
            render: { visible: false }
        });

        // Cannon Base (Visual)
        const cannonBase = Bodies.rectangle(100, height - 50, 40, 20, {
            isStatic: true,
            render: { fillStyle: '#666' }
        });

        Composite.add(engine.world, [ground, leftWall, rightWall, cannonBase]);

        // Add Mouse Control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // Start runner
        const runner = Runner.create();
        runnerRef.current = runner;
        Runner.run(runner, engine);
        Render.run(render);

        setIsSceneReady(true);

        // Resize handler
        const handleResize = () => {
            if (sceneRef.current && renderRef.current) {
                const w = sceneRef.current.clientWidth;
                const h = sceneRef.current.clientHeight;
                renderRef.current.canvas.width = w;
                renderRef.current.canvas.height = h;

                // Reposition ground
                Matter.Body.setPosition(ground, { x: w / 2, y: h - 20 });
                Matter.Body.setPosition(rightWall, { x: w, y: h / 2 });
                Matter.Body.setPosition(cannonBase, { x: 100, y: h - 50 });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (renderRef.current) {
                Render.stop(renderRef.current);
                if (renderRef.current.canvas) renderRef.current.canvas.remove();
            }
            if (runnerRef.current) Runner.stop(runnerRef.current);
            if (engineRef.current) Matter.Engine.clear(engineRef.current);
            engineRef.current = null;
        };
    }, []);

    // Update Gravity when changed
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.gravity.y = gravity;
        }
    }, [gravity]);

    // Fire Projectile
    const fireProjectile = useCallback(() => {
        if (!engineRef.current || !sceneRef.current) return;

        const Bodies = Matter.Bodies;
        const Composite = Matter.Composite;
        const Body = Matter.Body;

        const height = sceneRef.current.clientHeight;
        const startX = 100;
        const startY = height - 80;

        // Calculate velocity vector components
        // Angle is typically measured from horizontal right, anti-clockwise. 
        // In canvas, Y is down, so negative sin for up.
        const rad = angle * (Math.PI / 180);
        const vx = velocity * Math.cos(rad);
        const vy = -velocity * Math.sin(rad);

        const projectile = Bodies.circle(startX, startY, 12, {
            restitution: restitution,
            friction: 0.005,
            density: 0.04,
            label: "Projectile",
            render: {
                fillStyle: '#EF4444',
                strokeStyle: '#000',
                lineWidth: 2
            }
        });

        // Set initial velocity
        Body.setVelocity(projectile, { x: vx, y: vy });
        Composite.add(engineRef.current.world, projectile);

    }, [velocity, angle, restitution]);

    // Clear Projectiles
    const clearProjectiles = () => {
        if (!engineRef.current) return;
        const Composite = Matter.Composite;
        const bodies = Composite.allBodies(engineRef.current.world);

        // Filter out static bodies (ground, walls)
        const projectiles = bodies.filter(b => b.label === "Projectile");
        Composite.remove(engineRef.current.world, projectiles);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] bg-neutral-900 border-t-[3px] border-black">
            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden cursor-crosshair group touch-none" ref={sceneRef}>
                <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-50 text-white font-mono text-[10px] uppercase tracking-widest">
                    Matter.js Physics Engine v0.19
                </div>

                {/* Visual Guide for Cannon Angle */}
                <div
                    className="absolute z-0 pointer-events-none origin-bottom-left border-b-2 border-dashed border-white/20 w-32"
                    style={{
                        left: '100px',
                        bottom: '50px',
                        transform: `rotate(-${angle}deg)`
                    }}
                />
            </div>

            {/* Controls Sidebar - Neo-Brutalist Style */}
            <div className="w-full lg:w-80 bg-white dark:bg-zinc-900 border-t-[3px] lg:border-t-0 lg:border-l-[3px] border-black flex flex-col h-[50vh] lg:h-full overflow-y-auto">

                {/* Scrollable Controls */}
                <div className="p-6 space-y-8 flex-1">

                    {/* Velocity Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-black uppercase text-xs tracking-wider text-black dark:text-white">Fırlatma Hızı</label>
                            <span className="font-mono text-xs font-bold bg-[#FFC800] text-black px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">
                                {velocity} m/s
                            </span>
                        </div>
                        <SimSlider
                            value={[velocity]}
                            onValueChange={(v: number[]) => setVelocity(v[0])}
                            min={1} max={30} step={1}
                        />
                    </div>

                    {/* Angle Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-black uppercase text-xs tracking-wider text-black dark:text-white">Fırlatma Açısı</label>
                            <span className="font-mono text-xs font-bold bg-[#3B82F6] text-white px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">
                                {angle}°
                            </span>
                        </div>
                        <SimSlider
                            value={[angle]}
                            onValueChange={(v: number[]) => setAngle(v[0])}
                            min={0} max={90} step={1}
                        />
                    </div>

                    {/* Gravity Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-black uppercase text-xs tracking-wider text-black dark:text-white">Yerçekimi</label>
                            <span className="font-mono text-xs font-bold bg-zinc-200 text-black px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">
                                {gravity}g
                            </span>
                        </div>
                        <SimSlider
                            value={[gravity]}
                            onValueChange={(v: number[]) => setGravity(v[0])}
                            min={0} max={3} step={0.1}
                        />
                    </div>

                    {/* Restitution (Bounciness) Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-black uppercase text-xs tracking-wider text-black dark:text-white">Esneklik</label>
                            <span className="font-mono text-xs font-bold bg-zinc-200 text-black px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">
                                {(restitution * 100).toFixed(0)}%
                            </span>
                        </div>
                        <SimSlider
                            value={[restitution]}
                            onValueChange={(v: number[]) => setRestitution(v[0])}
                            min={0} max={1} step={0.1}
                        />
                    </div>
                </div>

                {/* Info Box */}
                <div className="px-6 pb-6">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-400/50 rounded-sm text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        <p className="font-bold mb-1 text-black dark:text-yellow-500 uppercase">Nasıl Çalışır?</p>
                        Ayarladığınız hız ve açı vektörlerine göre cismin yörüngesi hesaplanır. Hava sürtünmesi (friction) ihmal edilebilir düzeydedir (0.005).
                    </div>
                </div>

                {/* Action Buttons (Fixed Bottom) */}
                <div className="p-6 bg-white dark:bg-zinc-900 border-t-2 border-zinc-100 dark:border-zinc-800 space-y-3 mt-auto">
                    <SimButton onClick={fireProjectile} className="w-full gap-2 text-lg h-14" size="lg">
                        <Play className="w-5 h-5 fill-current" />
                        ATEŞLE
                    </SimButton>
                    <div className="grid grid-cols-2 gap-3">
                        <SimButton variant="secondary" onClick={clearProjectiles} className="w-full gap-2 text-xs h-10">
                            <Trash2 className="w-4 h-4" />
                            TEMİZLE
                        </SimButton>
                        <SimButton variant="ghost" onClick={() => { setVelocity(18); setAngle(45); }} className="w-full gap-2 text-xs h-10">
                            <RotateCcw className="w-4 h-4" />
                            SIFIRLA
                        </SimButton>
                    </div>
                </div>

            </div>
        </div>
    );
}
