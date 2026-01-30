"use client";

import { useCallback, useState } from "react";
import { P5Wrapper } from "./P5Wrapper";
import p5 from "p5";

interface ProjectileSimProps {
    className?: string;
}

export function ProjectileSim({ className = "" }: ProjectileSimProps) {
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(15);
    const [gravity, setGravity] = useState(0.2);

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let projectile: { x: number; y: number; vx: number; vy: number } | null = null;
        let trail: { x: number; y: number }[] = [];
        let maxHeight = 0;
        let distance = 0;
        const groundY = 350;
        const launchX = 50;

        p.setup = () => {
            const canvas = p.createCanvas(parentRef.clientWidth, 400);
            canvas.parent(parentRef);
        };

        const launch = () => {
            const rad = (angle * Math.PI) / 180;
            projectile = {
                x: launchX,
                y: groundY,
                vx: velocity * Math.cos(rad),
                vy: -velocity * Math.sin(rad)
            };
            trail = [];
            maxHeight = 0;
            distance = 0;
        };

        p.draw = () => {
            p.background(23, 23, 23);

            // Ground
            p.fill(60, 60, 60);
            p.noStroke();
            p.rect(0, groundY, p.width, p.height - groundY);

            // Grid lines
            p.stroke(255, 255, 255, 20);
            p.strokeWeight(1);
            for (let x = 0; x < p.width; x += 50) {
                p.line(x, 0, x, groundY);
            }
            for (let y = 0; y < groundY; y += 50) {
                p.line(0, y, p.width, y);
            }

            // Launcher
            p.push();
            p.translate(launchX, groundY);
            p.rotate((-angle * Math.PI) / 180);
            p.fill(59, 130, 246);
            p.stroke(0);
            p.strokeWeight(3);
            p.rect(0, -8, 40, 16);
            p.pop();

            // Projectile physics
            if (projectile && projectile.y <= groundY) {
                trail.push({ x: projectile.x, y: projectile.y });
                if (trail.length > 500) trail.shift();

                projectile.vy += gravity;
                projectile.x += projectile.vx;
                projectile.y += projectile.vy;

                const height = groundY - projectile.y;
                if (height > maxHeight) maxHeight = height;
                distance = projectile.x - launchX;

                if (projectile.y >= groundY) {
                    projectile.y = groundY;
                }
            }

            // Draw trail
            p.noFill();
            p.stroke(255, 200, 0, 100);
            p.strokeWeight(2);
            p.beginShape();
            for (const point of trail) {
                p.vertex(point.x, point.y);
            }
            p.endShape();

            // Draw projectile
            if (projectile) {
                p.fill(255, 200, 0);
                p.stroke(0);
                p.strokeWeight(3);
                p.ellipse(projectile.x, projectile.y, 20, 20);
            }

            // Info
            p.fill(255);
            p.noStroke();
            p.textSize(14);
            p.textFont('monospace');
            p.text(`Açı: ${angle}°`, 20, 30);
            p.text(`Hız: ${velocity} m/s`, 20, 50);
            p.text(`Max Yükseklik: ${maxHeight.toFixed(1)} px`, 20, 70);
            p.text(`Mesafe: ${distance.toFixed(1)} px`, 20, 90);

            // Launch button hint
            if (!projectile || projectile.y >= groundY) {
                p.fill(255, 200, 0);
                p.textSize(12);
                p.text('Ateşlemek için tıklayın', p.width / 2 - 70, groundY + 30);
            }
        };

        p.mousePressed = () => {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                launch();
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 400);
        };
    }, [angle, velocity, gravity]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[400px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-neutral-800 space-y-3">
                <div>
                    <label className="text-white text-xs font-bold uppercase mb-1 block">
                        Atış Açısı: {angle}°
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="80"
                        value={angle}
                        onChange={(e) => setAngle(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                </div>
                <div>
                    <label className="text-white text-xs font-bold uppercase mb-1 block">
                        Başlangıç Hızı: {velocity} m/s
                    </label>
                    <input
                        type="range"
                        min="5"
                        max="25"
                        value={velocity}
                        onChange={(e) => setVelocity(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                </div>
                <div>
                    <label className="text-white text-xs font-bold uppercase mb-1 block">
                        Yerçekimi: {gravity.toFixed(2)}
                    </label>
                    <input
                        type="range"
                        min="0.05"
                        max="0.5"
                        step="0.05"
                        value={gravity}
                        onChange={(e) => setGravity(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                </div>
            </div>
        </div>
    );
}
