"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SimSlider } from "@/components/simulations/ui/sim-slider";
import { SimButton } from "@/components/simulations/ui/sim-button";
import { RotateCcw } from "lucide-react";
import p5Types from "p5";
import { SimulationLayout } from "@/components/simulations/ui/simulation-layout";

// Dynamic import for p5 to avoid SSR issues
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full bg-neutral-900 text-white font-mono">P5.js Yükleniyor...</div>
});

export default function PendulumSim() {
    const parentRef = useRef<HTMLDivElement>(null);

    // Physics Parameters
    const [length, setLength] = useState(200); // px
    const [gravity, setGravity] = useState(1); // arbitrary scale
    const [damping, setDamping] = useState(0.995); // friction

    // Simulation State
    const angleRef = useRef(Math.PI / 4);
    const aVelocityRef = useRef(0);
    const aAccelerationRef = useRef(0);
    const isDraggingRef = useRef(false);

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        // Use the parent dimensions provided by SimulationLayout's canvas area
        const width = canvasParentRef.clientWidth;
        const height = canvasParentRef.clientHeight;
        p5.createCanvas(width, height).parent(canvasParentRef);
        p5.frameRate(60);
    };

    const windowResized = (p5: p5Types) => {
        if (parentRef.current) {
            p5.resizeCanvas(parentRef.current.clientWidth, parentRef.current.clientHeight);
        }
    };

    const draw = (p5: p5Types) => {
        const width = p5.width;

        p5.background("#1A1A1A");

        // Physics Logic
        if (!isDraggingRef.current) {
            const force = -1 * gravity * 0.4 * Math.sin(angleRef.current);
            aAccelerationRef.current = force / (length * 0.01); // scaling
            aVelocityRef.current += aAccelerationRef.current;
            aVelocityRef.current *= damping;
            angleRef.current += aVelocityRef.current;
        } else {
            // Dragging Logic
            const originX = width / 2;
            const originY = 50;
            const dx = p5.mouseX - originX;
            const dy = p5.mouseY - originY;
            angleRef.current = Math.atan2(dx, dy);
            aVelocityRef.current = 0; // Reset velocity while dragging
        }

        // Positions
        const origin = { x: width / 2, y: 50 };
        const bobX = origin.x + length * Math.sin(angleRef.current);
        const bobY = origin.y + length * Math.cos(angleRef.current);

        // Draw Support point
        p5.stroke("#333");
        p5.strokeWeight(4);
        p5.line(origin.x - 50, origin.y, origin.x + 50, origin.y);

        // Draw String
        p5.stroke(255);
        p5.strokeWeight(2);
        p5.line(origin.x, origin.y, bobX, bobY);

        // Draw Support pivot
        p5.fill(255);
        p5.noStroke();
        p5.circle(origin.x, origin.y, 8);

        // Draw Vertical Dashed Line (Equilibrium)
        p5.stroke(255, 50);
        const ctx = p5.drawingContext as CanvasRenderingContext2D;
        ctx.setLineDash([5, 5]);
        p5.line(origin.x, origin.y, origin.x, origin.y + length + 50);
        ctx.setLineDash([]);

        // Draw Bob
        p5.noStroke();
        p5.fill("#FFC800");
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

        // Interaction Logic for Mouse
        if (p5.mouseIsPressed) {
            const d = p5.dist(p5.mouseX, p5.mouseY, bobX, bobY);
            // Wider grab area for mobile
            if (d < 60) {
                isDraggingRef.current = true;
            }
        }
    };

    // Add specific Touch Handlers for better mobile support
    const touchStarted = (p5: p5Types) => {
        // Prevent default browser behavior if touching inside canvas
        if (p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height) {
            return false;
        }
        return true;
    };

    const mouseReleased = () => {
        isDraggingRef.current = false;
    };

    const Controls = (
        <div className="p-4 lg:p-6 space-y-6 flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-6">
                <div className="space-y-2 col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-center">
                        <label className="font-black uppercase text-[10px] lg:text-xs tracking-wider text-zinc-500 dark:text-zinc-400">İp Uzunluğu</label>
                        <span className="font-mono text-[10px] lg:text-xs font-bold bg-[#FFC800] text-black px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">{length}px</span>
                    </div>
                    <SimSlider value={[length]} onValueChange={(v: number[]) => setLength(v[0])} min={50} max={350} step={1} className="py-1" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="font-black uppercase text-[10px] lg:text-xs tracking-wider text-zinc-500 dark:text-zinc-400">Yerçekimi</label>
                        <span className="font-mono text-[10px] lg:text-xs font-bold bg-[#3B82F6] text-white px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">{gravity}g</span>
                    </div>
                    <SimSlider value={[gravity]} onValueChange={(v: number[]) => setGravity(v[0])} min={0.1} max={3} step={0.1} className="py-1" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="font-black uppercase text-[10px] lg:text-xs tracking-wider text-zinc-500 dark:text-zinc-400">Sürtünme</label>
                        <span className="font-mono text-[10px] lg:text-xs font-bold bg-zinc-200 text-black px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                            {((1 - damping) * 1000).toFixed(0)}
                        </span>
                    </div>
                    <SimSlider value={[damping]} onValueChange={(v: number[]) => setDamping(v[0])} min={0.9} max={1} step={0.001} className="py-1" />
                </div>
            </div>

            <div className="mt-auto pt-4">
                <SimButton onClick={() => {
                    angleRef.current = Math.PI / 4;
                    aVelocityRef.current = 0;
                    aAccelerationRef.current = 0;
                }} className="w-full gap-2 text-[10px] lg:text-xs h-9 lg:h-10">
                    <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4" />
                    BAŞA AL
                </SimButton>
            </div>

            <div className="hidden lg:block mt-6 p-4 bg-purple-50 dark:bg-purple-900/10 border-2 border-purple-400/50 rounded-sm text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p className="font-bold mb-1 text-black dark:text-purple-500 uppercase">İpucu</p>
                Sarkaç topunu (bob) tutup sürükleyerek açıyı değiştirebilirsiniz.
            </div>
        </div>
    );

    return (
        <SimulationLayout controls={Controls} title="Basit Sarkaç">
            <div className="flex-1 relative overflow-hidden h-full w-full" ref={parentRef}>
                {/* @ts-ignore */}
                <Sketch
                    setup={setup}
                    draw={draw}
                    windowResized={windowResized}
                    mouseReleased={mouseReleased}
                    touchStarted={touchStarted}
                />
                <div className="absolute top-4 right-4 z-10 pointer-events-none opacity-50 text-white font-mono text-[10px] uppercase tracking-widest text-right">
                    p5.js Harmonic Motion<br />
                    Canvas Render
                </div>
            </div>
        </SimulationLayout>
    );
}
