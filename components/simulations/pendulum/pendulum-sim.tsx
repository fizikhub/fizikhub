"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SimSlider } from "@/components/simulations/ui/sim-slider";
import { SimButton } from "@/components/simulations/ui/sim-button";
import { Play, Pause, RotateCcw, Activity } from "lucide-react";
import p5Types from "p5";

// Dynamic import for p5 to avoid SSR issues
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full bg-neutral-900 text-white font-mono">P5.js Yükleniyor...</div>
});

export default function PendulumSim() {
    const parentRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    // Physics Parameters
    const [length, setLength] = useState(200); // px
    const [gravity, setGravity] = useState(1); // arbitrary scale
    const [startAngle, setStartAngle] = useState(45); // degrees
    const [damping, setDamping] = useState(0.995); // friction

    // Simulation State
    const angleRef = useRef(Math.PI / 4);
    const angleVelocityRef = useRef(0);
    const angleAccelerationRef = useRef(0);
    const originRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);

    // Initial setup
    useEffect(() => {
        angleRef.current = startAngle * (Math.PI / 180);
    }, [startAngle]);

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        if (!parentRef.current) return;
        const width = parentRef.current.clientWidth;
        const height = parentRef.current.clientHeight;
        p5.createCanvas(width, height).parent(canvasParentRef);
        originRef.current = { x: width / 2, y: 100 };
    };

    const windowResized = (p5: p5Types) => {
        if (!parentRef.current) return;
        const width = parentRef.current.clientWidth;
        const height = parentRef.current.clientHeight;
        p5.resizeCanvas(width, height);
        originRef.current = { x: width / 2, y: 100 };
    };

    const draw = (p5: p5Types) => {
        p5.background("#1A1A1A");

        const origin = originRef.current;
        const len = length;
        const g = gravity * 0.4; // scale gravity slightly

        // Physics Update
        if (isPlaying && !isDraggingRef.current) {
            const force = -1 * g * Math.sin(angleRef.current) / (len / 200); // Approx formula, scaled length
            angleAccelerationRef.current = force;
            angleVelocityRef.current += angleAccelerationRef.current;
            angleVelocityRef.current *= damping;
            angleRef.current += angleVelocityRef.current;
        } else if (isDraggingRef.current) {
            // Calculate angle from mouse
            const dx = p5.mouseX - origin.x;
            const dy = p5.mouseY - origin.y;
            angleRef.current = Math.atan2(dx, dy);
            angleVelocityRef.current = 0;
        }

        // Calculate Bob Position
        const bobX = origin.x + len * Math.sin(angleRef.current);
        const bobY = origin.y + len * Math.cos(angleRef.current);

        // Draw Support
        p5.stroke("#333");
        p5.strokeWeight(4);
        p5.line(origin.x - 50, origin.y, origin.x + 50, origin.y);

        // Draw String
        p5.stroke(255);
        p5.strokeWeight(2);
        p5.line(origin.x, origin.y, bobX, bobY);

        // Draw Vertical Dashed Line (Equilibrium)
        p5.stroke(255, 50);
        const ctx = p5.drawingContext as CanvasRenderingContext2D; // Cast to 2D context
        ctx.setLineDash([5, 5]);
        p5.line(origin.x, origin.y, origin.x, origin.y + len + 50);
        ctx.setLineDash([]);

        // Draw Bob
        p5.noStroke();
        p5.fill("#FFC800"); // Yellow
        // Shadow
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#FFC800";
        p5.circle(bobX, bobY, 40);
        ctx.shadowBlur = 0;

        // Draw Angle Arc
        p5.noFill();
        p5.stroke("#3B82F6"); // Blue
        p5.strokeWeight(2);
        p5.arc(origin.x, origin.y, 60, 60, Math.PI / 2, Math.PI / 2 + angleRef.current);

        // Info Text
        p5.fill(255);
        p5.noStroke();
        p5.textSize(12);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(`Açı: ${(angleRef.current * 180 / Math.PI).toFixed(1)}°`, 20, 20);

        // Interaction Logic inside Draw (p5 specific)
        if (p5.mouseIsPressed) {
            const d = p5.dist(p5.mouseX, p5.mouseY, bobX, bobY);
            if (d < 40) {
                isDraggingRef.current = true;
            }
        } else {
            isDraggingRef.current = false;
        }
    };

    const mouseReleased = () => {
        isDraggingRef.current = false;
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] bg-neutral-900 border-t-[3px] border-black">
            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden" ref={parentRef}>
                {/* @ts-ignore - react-p5 types are tricky with dynamic import */}
                <Sketch setup={setup} draw={draw} windowResized={windowResized} mouseReleased={mouseReleased} />

                <div className="absolute top-4 right-4 z-10 pointer-events-none opacity-50 text-white font-mono text-[10px] uppercase tracking-widest text-right">
                    p5.js Visualization Engine<br />
                    Interactive Physics
                </div>
            </div>

            {/* Controls Sidebar */}
            <div className="w-full lg:w-80 bg-white dark:bg-zinc-900 border-t-[3px] lg:border-t-0 lg:border-l-[3px] border-black flex flex-col h-[50vh] lg:h-full overflow-y-auto">
                <div className="p-6 space-y-8 flex-1">

                    {/* Length Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-black uppercase text-xs tracking-wider text-black dark:text-white">İp Uzunluğu</label>
                            <span className="font-mono text-xs font-bold bg-[#FFC800] text-black px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">
                                {length}px
                            </span>
                        </div>
                        <SimSlider
                            value={[length]}
                            onValueChange={(v: number[]) => setLength(v[0])}
                            min={50} max={400} step={1}
                        />
                    </div>

                    {/* Gravity Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-black uppercase text-xs tracking-wider text-black dark:text-text-white">Yerçekimi</label>
                            <span className="font-mono text-xs font-bold bg-[#3B82F6] text-white px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">
                                {gravity}g
                            </span>
                        </div>
                        <SimSlider
                            value={[gravity]}
                            onValueChange={(v: number[]) => setGravity(v[0])}
                            min={0.1} max={3} step={0.1}
                        />
                    </div>

                    {/* Damping Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-black uppercase text-xs tracking-wider text-black dark:text-white">Sürtünme</label>
                            <span className="font-mono text-xs font-bold bg-zinc-200 text-black px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">
                                {((1 - damping) * 1000).toFixed(0)}
                            </span>
                        </div>
                        <SimSlider
                            value={[damping]}
                            onValueChange={(v: number[]) => setDamping(v[0])}
                            min={0.9} max={1} step={0.001}
                        />
                    </div>
                </div>

                {/* Info Box */}
                <div className="px-6 pb-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-400/50 rounded-sm text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        <p className="font-bold mb-1 text-black dark:text-blue-500 uppercase">Periyot Formülü</p>
                        <span className="font-mono bg-white dark:bg-black px-1 rounded">T ≈ 2π√(L/g)</span><br />
                        İp uzunluğu arttıkça periyot artar (yavaşlar). Yerçekimi arttıkça periyot azalır (hızlanır).
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-white dark:bg-zinc-900 border-t-2 border-zinc-100 dark:border-zinc-800 space-y-3 mt-auto">
                    <SimButton onClick={() => setIsPlaying(!isPlaying)} className="w-full gap-2 text-lg h-14" size="lg">
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        {isPlaying ? "DURAKLAT" : "DEVAM ET"}
                    </SimButton>
                    <SimButton variant="secondary" onClick={() => {
                        // Reset physics state
                        angleRef.current = Math.PI / 4;
                        angleVelocityRef.current = 0;
                        angleAccelerationRef.current = 0;
                        setStartAngle(45);
                        setIsPlaying(true);
                    }} className="w-full gap-2 text-xs h-10">
                        <RotateCcw className="w-4 h-4" />
                        BAŞA AL
                    </SimButton>
                </div>
            </div>
        </div>
    );
}
