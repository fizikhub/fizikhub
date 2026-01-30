"use client";

import { useCallback, useState } from "react";
import { P5Wrapper } from "./P5Wrapper";
import p5 from "p5";

interface SpringMassSimProps {
    className?: string;
}

export function SpringMassSim({ className = "" }: SpringMassSimProps) {
    const [springK, setSpringK] = useState(0.1);
    const [mass, setMass] = useState(20);
    const [damping, setDamping] = useState(0.98);

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let yPos = 0;
        let velocity = 0;
        const restLength = 150;
        const anchorY = 50;

        p.setup = () => {
            const canvas = p.createCanvas(parentRef.clientWidth, 400);
            canvas.parent(parentRef);
            yPos = 100; // Initial stretch
        };

        p.draw = () => {
            p.background(23, 23, 23);

            const anchorX = p.width / 2;
            const massY = anchorY + restLength + yPos;

            // Physics (Hooke's Law: F = -kx)
            const force = -springK * yPos;
            const acceleration = force / (mass / 100);
            velocity += acceleration;
            velocity *= damping;
            yPos += velocity;

            // Draw anchor
            p.fill(59, 130, 246);
            p.noStroke();
            p.rect(anchorX - 40, anchorY - 10, 80, 15);

            // Draw spring (zigzag)
            p.stroke(255, 200, 0);
            p.strokeWeight(3);
            p.noFill();
            const coils = 10;
            const springLen = restLength + yPos;
            const coilHeight = springLen / coils;
            const coilWidth = 20;

            p.beginShape();
            p.vertex(anchorX, anchorY);
            for (let i = 0; i < coils; i++) {
                const y1 = anchorY + (i + 0.25) * coilHeight;
                const y2 = anchorY + (i + 0.75) * coilHeight;
                const dir = i % 2 === 0 ? 1 : -1;
                p.vertex(anchorX + dir * coilWidth, y1);
                p.vertex(anchorX - dir * coilWidth, y2);
            }
            p.vertex(anchorX, massY);
            p.endShape();

            // Draw mass
            p.fill(255, 200, 0);
            p.stroke(0);
            p.strokeWeight(3);
            p.rectMode(p.CENTER);
            p.rect(anchorX, massY + 25, 50, 50);
            p.rectMode(p.CORNER);

            // Info
            p.fill(255);
            p.noStroke();
            p.textSize(14);
            p.textFont('monospace');
            p.text(`F = -kx = ${(force * 100).toFixed(1)} N`, 20, 30);
            p.text(`x = ${yPos.toFixed(1)} px`, 20, 50);
            p.text(`k = ${springK.toFixed(2)} N/m`, 20, 70);

            // Equilibrium line (dashed)
            p.stroke(255, 255, 255, 50);
            p.strokeWeight(1);
            const ctx = p.drawingContext as CanvasRenderingContext2D;
            ctx.setLineDash([5, 5]);
            p.line(anchorX - 60, anchorY + restLength, anchorX + 60, anchorY + restLength);
            ctx.setLineDash([]);
        };

        p.mousePressed = () => {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                yPos = 100;
                velocity = 0;
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 400);
        };
    }, [springK, mass, damping]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[400px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-neutral-800 space-y-3">
                <div>
                    <label className="text-white text-xs font-bold uppercase mb-1 block">
                        Yay Sabiti (k): {springK.toFixed(2)}
                    </label>
                    <input
                        type="range"
                        min="0.02"
                        max="0.3"
                        step="0.01"
                        value={springK}
                        onChange={(e) => setSpringK(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                </div>
                <div>
                    <label className="text-white text-xs font-bold uppercase mb-1 block">
                        Kütle: {mass}
                    </label>
                    <input
                        type="range"
                        min="5"
                        max="50"
                        value={mass}
                        onChange={(e) => setMass(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                </div>
                <p className="text-neutral-400 text-xs">Hooke Yasası: F = -kx</p>
            </div>
        </div>
    );
}
