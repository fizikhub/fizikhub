"use client";

import { useCallback, useState } from "react";
import { P5Wrapper } from "./P5Wrapper";
import p5 from "p5";

interface ProjectileSimProps {
    className?: string;
}

export function ProjectileSim({ className = "" }: ProjectileSimProps) {
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(50);
    const [gravity, setGravity] = useState(9.8);
    const [showVectors, setShowVectors] = useState(true);
    const [showTrajectory, setShowTrajectory] = useState(true);

    // Calculated values (physics)
    const angleRad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);
    const maxHeight = (vy * vy) / (2 * gravity);
    const flightTime = (2 * vy) / gravity;
    const range = vx * flightTime;

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let projectile: { x: number; y: number; vx: number; vy: number; time: number } | null = null;
        let trail: { x: number; y: number }[] = [];
        let currentMaxHeight = 0;
        let currentRange = 0;
        const groundY = 350;
        const launchX = 80;
        const scale = 3;

        p.setup = () => {
            const canvas = p.createCanvas(parentRef.clientWidth, 450);
            canvas.parent(parentRef);
        };

        const launch = () => {
            const rad = (angle * Math.PI) / 180;
            projectile = {
                x: launchX,
                y: groundY,
                vx: velocity * Math.cos(rad) * scale / 10,
                vy: -velocity * Math.sin(rad) * scale / 10,
                time: 0
            };
            trail = [];
            currentMaxHeight = 0;
            currentRange = 0;
        };

        p.draw = () => {
            p.background(15, 15, 20);

            // Grid
            p.stroke(40, 40, 50);
            p.strokeWeight(1);
            for (let x = 0; x < p.width; x += 50) {
                p.line(x, 0, x, groundY);
                // Distance markers
                if (x > launchX) {
                    p.fill(60, 60, 80);
                    p.noStroke();
                    p.textSize(9);
                    p.text(`${((x - launchX) / scale).toFixed(0)}m`, x - 10, groundY + 15);
                }
            }
            for (let y = 0; y < groundY; y += 50) p.line(0, y, p.width, y);

            // Ground
            p.fill(40, 60, 40);
            p.noStroke();
            p.rect(0, groundY, p.width, p.height - groundY);

            // Grass texture
            p.stroke(60, 100, 60);
            p.strokeWeight(2);
            for (let x = 0; x < p.width; x += 15) {
                p.line(x, groundY, x + 5, groundY - 8);
            }

            // Predicted trajectory (parabola)
            if (showTrajectory && !projectile) {
                p.noFill();
                p.stroke(255, 200, 0, 100);
                p.strokeWeight(2);
                const ctx = p.drawingContext as CanvasRenderingContext2D;
                ctx.setLineDash([8, 8]);

                p.beginShape();
                for (let t = 0; t < flightTime * 1.1; t += 0.05) {
                    const px = launchX + vx * t * scale / 10;
                    const py = groundY - (vy * t - 0.5 * gravity * t * t) * scale / 10;
                    if (py <= groundY && px < p.width) {
                        p.vertex(px, py);
                    }
                }
                p.endShape();
                ctx.setLineDash([]);

                // Max height indicator
                const tMax = vy / gravity;
                const maxX = launchX + vx * tMax * scale / 10;
                const maxY = groundY - maxHeight * scale / 10;

                p.stroke(100, 200, 255, 150);
                ctx.setLineDash([5, 5]);
                p.line(maxX, maxY, maxX, groundY);
                ctx.setLineDash([]);

                p.fill(100, 200, 255);
                p.noStroke();
                p.textSize(10);
                p.text(`H = ${maxHeight.toFixed(1)}m`, maxX + 5, maxY);

                // Range indicator
                const rangeX = launchX + range * scale / 10;
                p.stroke(100, 255, 100, 150);
                p.strokeWeight(2);
                p.line(launchX, groundY + 25, rangeX, groundY + 25);
                p.line(launchX, groundY + 20, launchX, groundY + 30);
                p.line(rangeX, groundY + 20, rangeX, groundY + 30);

                p.fill(100, 255, 100);
                p.noStroke();
                p.text(`R = ${range.toFixed(1)}m`, (launchX + rangeX) / 2 - 20, groundY + 40);
            }

            // Launcher cannon
            p.push();
            p.translate(launchX, groundY);

            // Base
            p.fill(80, 80, 100);
            p.stroke(60, 60, 80);
            p.strokeWeight(3);
            p.rect(-25, -20, 50, 20, 5);

            // Cannon barrel
            p.rotate(-angleRad);
            const gradient = p.drawingContext as CanvasRenderingContext2D;
            const barrelGrad = gradient.createLinearGradient(0, -10, 60, -10);
            barrelGrad.addColorStop(0, '#555555');
            barrelGrad.addColorStop(0.5, '#888888');
            barrelGrad.addColorStop(1, '#444444');
            gradient.fillStyle = barrelGrad;
            p.stroke(40, 40, 50);
            p.strokeWeight(3);
            p.rect(0, -12, 60, 24, 0, 8, 8, 0);
            p.pop();

            // Angle arc
            p.noFill();
            p.stroke(255, 200, 0, 150);
            p.strokeWeight(2);
            p.arc(launchX, groundY, 80, 80, -angleRad, 0);

            p.fill(255, 200, 0);
            p.noStroke();
            p.textSize(12);
            p.text(`${angle}°`, launchX + 45, groundY - 15);

            // Projectile physics
            if (projectile) {
                projectile.vy += (gravity / 60) * scale / 10;
                projectile.x += projectile.vx;
                projectile.y += projectile.vy;
                projectile.time += 1 / 60;

                trail.push({ x: projectile.x, y: projectile.y });

                const height = groundY - projectile.y;
                if (height > currentMaxHeight) currentMaxHeight = height;
                currentRange = projectile.x - launchX;

                // Draw trail
                if (trail.length > 1) {
                    for (let i = 1; i < trail.length; i++) {
                        const alpha = (i / trail.length) * 200;
                        p.stroke(255, 150, 50, alpha);
                        p.strokeWeight(4);
                        p.line(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y);
                    }
                }

                // Velocity vectors
                if (showVectors && projectile.y < groundY) {
                    // Vx (horizontal)
                    p.stroke(100, 200, 255);
                    p.strokeWeight(3);
                    p.line(projectile.x, projectile.y, projectile.x + projectile.vx * 10, projectile.y);
                    p.fill(100, 200, 255);
                    p.noStroke();
                    p.textSize(10);
                    p.text('vₓ', projectile.x + projectile.vx * 10 + 5, projectile.y);

                    // Vy (vertical)
                    p.stroke(255, 100, 100);
                    p.strokeWeight(3);
                    p.line(projectile.x, projectile.y, projectile.x, projectile.y + projectile.vy * 10);
                    p.fill(255, 100, 100);
                    p.noStroke();
                    p.text('vᵧ', projectile.x + 5, projectile.y + projectile.vy * 10);

                    // V total
                    p.stroke(100, 255, 100);
                    p.strokeWeight(3);
                    p.line(projectile.x, projectile.y,
                        projectile.x + projectile.vx * 10,
                        projectile.y + projectile.vy * 10);
                }

                // Projectile
                if (projectile.y < groundY) {
                    p.fill(255, 200, 0);
                    p.stroke(180, 140, 0);
                    p.strokeWeight(3);
                    p.ellipse(projectile.x, projectile.y, 20, 20);

                    // Shine
                    p.noStroke();
                    p.fill(255, 255, 200, 150);
                    p.ellipse(projectile.x - 4, projectile.y - 4, 6, 6);
                }

                // Hit ground
                if (projectile.y >= groundY) {
                    // Impact marker
                    p.fill(255, 100, 50, 150);
                    p.noStroke();
                    p.ellipse(projectile.x, groundY, 30, 10);

                    p.fill(255);
                    p.textSize(12);
                    p.text(`✓ ${(currentRange / scale * 10).toFixed(1)}m`, projectile.x - 20, groundY - 15);
                }
            }

            // Formula panel
            p.fill(20, 20, 30, 240);
            p.stroke(60, 60, 80);
            p.strokeWeight(2);
            p.rect(15, 15, 260, 150, 8);

            p.fill(239, 68, 68);
            p.noStroke();
            p.textSize(14);
            p.text('🎯 PROJEKTİL HAREKETİ', 25, 38);

            p.fill(255);
            p.textSize(11);
            p.text(`v₀ = ${velocity} m/s, θ = ${angle}°`, 25, 58);
            p.text(`vₓ = v₀·cos(θ) = ${vx.toFixed(1)} m/s`, 25, 78);
            p.text(`vᵧ₀ = v₀·sin(θ) = ${vy.toFixed(1)} m/s`, 25, 98);

            p.fill(100, 200, 255);
            p.text(`H = v²sin²θ/(2g) = ${maxHeight.toFixed(1)} m`, 25, 118);
            p.fill(100, 255, 100);
            p.text(`R = v²sin(2θ)/g = ${range.toFixed(1)} m`, 25, 138);
            p.fill(255, 200, 0);
            p.text(`T = 2v·sinθ/g = ${flightTime.toFixed(2)} s`, 25, 158);
        };

        p.mousePressed = () => {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                launch();
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 450);
        };
    }, [angle, velocity, gravity, showVectors, showTrajectory, angleRad, vx, vy, maxHeight, flightTime, range]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[450px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-gradient-to-b from-neutral-800 to-neutral-900 space-y-4">
                <div className="bg-neutral-900 border-2 border-red-400/30 rounded-lg p-3">
                    <p className="text-red-400 font-mono text-sm font-bold mb-2">📊 Hesaplanan Değerler</p>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                        <div><span className="text-neutral-400">Menzil:</span> <span className="text-green-400">{range.toFixed(1)}m</span></div>
                        <div><span className="text-neutral-400">Max H:</span> <span className="text-blue-400">{maxHeight.toFixed(1)}m</span></div>
                        <div><span className="text-neutral-400">Süre:</span> <span className="text-yellow-400">{flightTime.toFixed(2)}s</span></div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-white text-xs font-bold uppercase mb-1">
                            <span>Atış Açısı (θ)</span>
                            <span className="text-yellow-400">{angle}°</span>
                        </div>
                        <input
                            type="range" min="5" max="85" value={angle}
                            onChange={(e) => setAngle(Number(e.target.value))}
                            className="w-full accent-yellow-400"
                        />
                        <div className="flex justify-between text-neutral-500 text-[10px] mt-1">
                            <span>Düşük (5°)</span>
                            <span className="text-yellow-400">Optimum (45°)</span>
                            <span>Yüksek (85°)</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-white text-xs font-bold uppercase mb-1">
                            <span>Başlangıç Hızı (v₀)</span>
                            <span className="text-red-400">{velocity} m/s</span>
                        </div>
                        <input
                            type="range" min="20" max="100" value={velocity}
                            onChange={(e) => setVelocity(Number(e.target.value))}
                            className="w-full accent-red-400"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-white text-xs font-bold cursor-pointer">
                        <input type="checkbox" checked={showVectors} onChange={(e) => setShowVectors(e.target.checked)} className="accent-green-500" />
                        Hız Vektörleri
                    </label>
                    <label className="flex items-center gap-2 text-white text-xs font-bold cursor-pointer">
                        <input type="checkbox" checked={showTrajectory} onChange={(e) => setShowTrajectory(e.target.checked)} className="accent-yellow-500" />
                        Yörünge Tahmini
                    </label>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                    <p className="text-orange-400 text-xs">
                        💡 <strong>Keşfet:</strong> 45° açısı maksimum menzili verir! 30° ve 60° aynı menzile düşer (tamamlayıcı açılar).
                        Tıklayarak ateşle ve formülleri doğrula.
                    </p>
                </div>
            </div>
        </div>
    );
}
