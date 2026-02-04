"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { SimSlider } from "@/components/simulations/ui/sim-slider";
import { SimButton } from "@/components/simulations/ui/sim-button";
import { RotateCcw, Target, Trash2 } from "lucide-react";
import { SimulationLayout } from "@/components/simulations/ui/simulation-layout";

export default function ProjectileSim() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);

    // Physics Parameters
    const [velocity, setVelocity] = useState(15);
    const [angle, setAngle] = useState(45);
    const [gravity, setGravity] = useState(1);
    const [restitution, setRestitution] = useState(0.8);

    // Initialize Matter.js
    useEffect(() => {
        if (!sceneRef.current) return;

        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint,
            Body = Matter.Body;

        // Create engine
        const engine = Engine.create();
        engine.gravity.y = gravity;
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
                showVelocity: true
            }
        });
        renderRef.current = render;

        // Bodies
        const width = sceneRef.current.clientWidth;
        const height = sceneRef.current.clientHeight;

        const ground = Bodies.rectangle(width / 2, height + 20, width, 60, {
            isStatic: true,
            label: "Ground",
            render: { fillStyle: '#333333' }
        });

        const leftWall = Bodies.rectangle(-20, height / 2, 40, height, {
            isStatic: true,
            render: { visible: false }
        });

        const rightWall = Bodies.rectangle(width + 20, height / 2, 40, height, {
            isStatic: true,
            render: { visible: false }
        });

        Composite.add(engine.world, [ground, leftWall, rightWall]);

        // Mouse Control
        const mouse = Mouse.create(render.canvas);

        // FIX: Enable touch actions slightly to allow some browser interaction, 
        // but mostly we want to prevent scroll when interacting with canvas.
        // However, since we used touch-action: none in CSS, we should stick to it.
        render.canvas.style.touchAction = "none";

        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // Run
        Render.run(render);
        const runner = Runner.create();
        runnerRef.current = runner;
        Runner.run(runner, engine);

        // Resize
        const handleResize = () => {
            if (sceneRef.current && renderRef.current) {
                const w = sceneRef.current.clientWidth;
                const h = sceneRef.current.clientHeight;
                renderRef.current.canvas.width = w;
                renderRef.current.canvas.height = h;

                Body.setPosition(ground, { x: w / 2, y: h + 20 });
                Body.setPosition(leftWall, { x: -20, y: h / 2 });
                Body.setPosition(rightWall, { x: w + 20, y: h / 2 });
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
            if (engineRef.current) {
                Matter.World.clear(engineRef.current.world, false);
                Matter.Engine.clear(engineRef.current);
            }
        };
    }, []);

    // Gravity Update
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.gravity.y = gravity;
        }
    }, [gravity]);

    const fireProjectile = useCallback(() => {
        if (!engineRef.current || !renderRef.current) return;

        const Bodies = Matter.Bodies;
        const Composite = Matter.Composite;
        const Body = Matter.Body;

        const startX = 100;
        const startY = renderRef.current.options.height! - 100;

        const rad = angle * (Math.PI / 180);
        const vx = velocity * Math.cos(rad);
        const vy = -velocity * Math.sin(rad);

        const projectile = Bodies.circle(startX, startY, 15, {
            restitution: restitution,
            friction: 0.005,
            density: 0.04,
            label: "Projectile",
            render: { fillStyle: '#EF4444' }
        });

        Body.setVelocity(projectile, { x: vx, y: vy });
        Composite.add(engineRef.current.world, projectile);
    }, [velocity, angle, restitution]);

    const clearProjectiles = () => {
        if (!engineRef.current) return;
        const Composite = Matter.Composite;
        const bodies = Composite.allBodies(engineRef.current.world);
        const projectiles = bodies.filter(b => b.label === "Projectile");
        Composite.remove(engineRef.current.world, projectiles);
    };

    const Controls = (
        <div className="p-4 lg:p-6 space-y-6 flex-1">
            {/* Controls Content Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-6">
                <div className="space-y-2 col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-center">
                        <label className="font-black uppercase text-[10px] lg:text-xs tracking-wider text-zinc-500 dark:text-zinc-400">Fırlatma Hızı</label>
                        <span className="font-mono text-[10px] lg:text-xs font-bold bg-[#FFC800] text-black px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                            {velocity} m/s
                        </span>
                    </div>
                    <SimSlider value={[velocity]} onValueChange={(v) => setVelocity(v[0])} min={1} max={30} step={1} className="py-1" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="font-black uppercase text-[10px] lg:text-xs tracking-wider text-zinc-500 dark:text-zinc-400">Açı</label>
                        <span className="font-mono text-[10px] lg:text-xs font-bold bg-[#3B82F6] text-white px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                            {angle}°
                        </span>
                    </div>
                    <SimSlider value={[angle]} onValueChange={(v) => setAngle(v[0])} min={0} max={90} step={1} className="py-1" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="font-black uppercase text-[10px] lg:text-xs tracking-wider text-zinc-500 dark:text-zinc-400">Yerçekimi</label>
                        <span className="font-mono text-[10px] lg:text-xs font-bold bg-zinc-200 text-black px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                            {gravity}g
                        </span>
                    </div>
                    <SimSlider value={[gravity]} onValueChange={(v) => setGravity(v[0])} min={0} max={3} step={0.1} className="py-1" />
                </div>

                <div className="space-y-2 col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-center">
                        <label className="font-black uppercase text-[10px] lg:text-xs tracking-wider text-zinc-500 dark:text-zinc-400">Esneklik</label>
                        <span className="font-mono text-[10px] lg:text-xs font-bold bg-zinc-200 text-black px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                            {(restitution * 100).toFixed(0)}%
                        </span>
                    </div>
                    <SimSlider value={[restitution]} onValueChange={(v) => setRestitution(v[0])} min={0} max={1} step={0.1} className="py-1" />
                </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-3">
                <SimButton onClick={fireProjectile} className="w-full gap-2 text-sm lg:text-lg h-12 lg:h-14" size="lg">
                    <Target className="w-4 h-4 lg:w-5 lg:h-5" />
                    ATEŞLE
                </SimButton>
                <div className="grid grid-cols-2 gap-3">
                    <SimButton variant="secondary" onClick={clearProjectiles} className="w-full gap-2 text-[10px] lg:text-xs h-9 lg:h-10">
                        <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                        TEMİZLE
                    </SimButton>
                    <SimButton variant="ghost" onClick={() => { setVelocity(15); setAngle(45); }} className="w-full gap-2 text-[10px] lg:text-xs h-9 lg:h-10">
                        <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4" />
                        SIFIRLA
                    </SimButton>
                </div>
            </div>

            <div className="hidden lg:block mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-400/50 rounded-sm text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p className="font-bold mb-1 text-black dark:text-yellow-500 uppercase">Nasıl Çalışır?</p>
                Ayarladığınız hız ve açı vektörlerine göre cismin yörüngesi hesaplanır.
            </div>
        </div>
    );

    return (
        <SimulationLayout controls={Controls} title="Atış Hareketi">
            <div ref={sceneRef} className="w-full h-full bg-[#1A1A1A] relative shadow-inner">
                {/* Cannon Visual */}
                <div className="absolute bottom-10 left-10 pointer-events-none opacity-50 z-10">
                    <div
                        className="w-20 h-2 bg-red-500 origin-left transform -translate-y-1/2 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-transform duration-75"
                        style={{ transform: `rotate(-${angle}deg)` }}
                    />
                </div>
                <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-30 text-white font-mono text-[10px] uppercase tracking-widest">
                    Matter.js Physics v0.19<br />
                    Rigid Body Dynamics
                </div>
            </div>
        </SimulationLayout>
    );
}
