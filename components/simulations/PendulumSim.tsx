"use client";

import { useCallback, useState } from "react";
import { P5Wrapper } from "./P5Wrapper";
import p5 from "p5";

interface PendulumSimProps {
    className?: string;
}

export function PendulumSim({ className = "" }: PendulumSimProps) {
    const [length, setLength] = useState(200);
    const [gravity, setGravity] = useState(0.4);
    const [damping, setDamping] = useState(0.995);

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let angle = Math.PI / 4;
        let aVelocity = 0;
        let aAcceleration = 0;

        const originX = () => p.width / 2;
        const originY = () => 50;

        p.setup = () => {
            const canvas = p.createCanvas(parentRef.clientWidth, 400);
            canvas.parent(parentRef);
        };

        p.draw = () => {
            p.background(23, 23, 23);

            // Physics
            aAcceleration = (-gravity / length) * p.sin(angle);
            aVelocity += aAcceleration;
            aVelocity *= damping;
            angle += aVelocity;

            // Calculate bob position
            const bobX = originX() + length * p.sin(angle);
            const bobY = originY() + length * p.cos(angle);

            // Draw rod
            p.stroke(255, 200, 0);
            p.strokeWeight(3);
            p.line(originX(), originY(), bobX, bobY);

            // Draw pivot
            p.fill(59, 130, 246);
            p.noStroke();
            p.ellipse(originX(), originY(), 16, 16);

            // Draw bob
            p.fill(255, 200, 0);
            p.stroke(0);
            p.strokeWeight(3);
            p.ellipse(bobX, bobY, 40, 40);

            // Draw trail
            p.noFill();
            p.stroke(255, 200, 0, 50);
            p.strokeWeight(1);
            p.arc(originX(), originY(), length * 2, length * 2, Math.PI / 2 - Math.PI / 4, Math.PI / 2 + Math.PI / 4);

            // Info
            p.fill(255);
            p.noStroke();
            p.textSize(14);
            p.textFont('monospace');
            p.text(`Açı: ${(angle * 180 / Math.PI).toFixed(1)}°`, 20, 30);
            p.text(`T ≈ 2π√(L/g) = ${(2 * Math.PI * Math.sqrt(length / (gravity * 100))).toFixed(2)}s`, 20, 50);
        };

        p.mousePressed = () => {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                angle = Math.PI / 4;
                aVelocity = 0;
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 400);
        };
    }, [length, gravity, damping]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[400px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-neutral-800 space-y-3">
                <div>
                    <label className="text-white text-xs font-bold uppercase mb-1 block">
                        Uzunluk: {length}px
                    </label>
                    <input
                        type="range"
                        min="100"
                        max="300"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                </div>
                <div>
                    <label className="text-white text-xs font-bold uppercase mb-1 block">
                        Yerçekimi: {gravity.toFixed(2)}
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={gravity}
                        onChange={(e) => setGravity(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                </div>
                <p className="text-neutral-400 text-xs">Tıklayarak sarkacı sıfırlayın</p>
            </div>
        </div>
    );
}
