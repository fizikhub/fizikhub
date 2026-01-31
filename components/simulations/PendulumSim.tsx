"use client";

import { useCallback, useState } from "react";
import { P5Wrapper } from "./P5Wrapper";
import p5 from "p5";

interface PendulumSimProps {
    className?: string;
}

export function PendulumSim({ className = "" }: PendulumSimProps) {
    const [length, setLength] = useState(200);
    const [gravity, setGravity] = useState(9.8);
    const [mass, setMass] = useState(1);
    const [damping, setDamping] = useState(0.999);
    const [showVectors, setShowVectors] = useState(true);
    const [showEnergy, setShowEnergy] = useState(true);

    // Calculated values
    const period = 2 * Math.PI * Math.sqrt(length / 100 / gravity);
    const frequency = 1 / period;

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let angle = Math.PI / 4;
        let aVelocity = 0;
        let aAcceleration = 0;
        let time = 0;
        let trail: { x: number; y: number; t: number }[] = [];

        const originX = () => p.width / 2;
        const originY = () => 80;
        const scaledG = gravity / 100;
        const scaledL = length;

        p.setup = () => {
            const canvas = p.createCanvas(parentRef.clientWidth, 450);
            canvas.parent(parentRef);
        };

        p.draw = () => {
            p.background(15, 15, 20);

            // Grid background
            p.stroke(40, 40, 50);
            p.strokeWeight(1);
            for (let x = 0; x < p.width; x += 40) {
                p.line(x, 0, x, p.height);
            }
            for (let y = 0; y < p.height; y += 40) {
                p.line(0, y, p.width, y);
            }

            // Physics calculation
            aAcceleration = (-scaledG / scaledL) * p.sin(angle);
            aVelocity += aAcceleration;
            aVelocity *= damping;
            angle += aVelocity;
            time += 0.016;

            // Calculate bob position
            const bobX = originX() + scaledL * p.sin(angle);
            const bobY = originY() + scaledL * p.cos(angle);

            // Trail effect
            trail.push({ x: bobX, y: bobY, t: time });
            if (trail.length > 60) trail.shift();

            // Draw trail with gradient
            p.noFill();
            for (let i = 1; i < trail.length; i++) {
                const alpha = (i / trail.length) * 150;
                p.stroke(255, 200, 0, alpha);
                p.strokeWeight(3);
                p.line(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y);
            }

            // Draw arc path
            p.noFill();
            p.stroke(255, 255, 255, 30);
            p.strokeWeight(2);
            p.arc(originX(), originY(), scaledL * 2, scaledL * 2, Math.PI / 2 - 0.8, Math.PI / 2 + 0.8);

            // Pivot point
            p.fill(100, 100, 120);
            p.stroke(60, 60, 80);
            p.strokeWeight(3);
            p.rect(originX() - 30, originY() - 15, 60, 15);

            // Rod with gradient effect
            const gradient = p.drawingContext as CanvasRenderingContext2D;
            const rodGradient = gradient.createLinearGradient(originX(), originY(), bobX, bobY);
            rodGradient.addColorStop(0, '#888888');
            rodGradient.addColorStop(1, '#444444');
            gradient.strokeStyle = rodGradient;
            gradient.lineWidth = 4;
            gradient.beginPath();
            gradient.moveTo(originX(), originY());
            gradient.lineTo(bobX, bobY);
            gradient.stroke();

            // Velocity vector
            if (showVectors) {
                const tangentX = p.cos(angle);
                const tangentY = -p.sin(angle);
                const velMag = aVelocity * scaledL * 3;

                p.stroke(0, 255, 100);
                p.strokeWeight(3);
                p.line(bobX, bobY, bobX + tangentX * velMag, bobY + tangentY * velMag);

                // Arrow head
                p.push();
                p.translate(bobX + tangentX * velMag, bobY + tangentY * velMag);
                p.rotate(p.atan2(tangentY, tangentX));
                p.fill(0, 255, 100);
                p.noStroke();
                p.triangle(0, 0, -10, -5, -10, 5);
                p.pop();

                // Gravity vector
                const gForce = mass * 30;
                p.stroke(255, 100, 100);
                p.strokeWeight(3);
                p.line(bobX, bobY, bobX, bobY + gForce);

                p.push();
                p.translate(bobX, bobY + gForce);
                p.fill(255, 100, 100);
                p.noStroke();
                p.triangle(0, 0, -5, -10, 5, -10);
                p.pop();
            }

            // Bob with shine effect
            p.fill(255, 200, 0);
            p.stroke(180, 140, 0);
            p.strokeWeight(4);
            const bobSize = 30 + mass * 10;
            p.ellipse(bobX, bobY, bobSize, bobSize);

            // Shine
            p.noStroke();
            p.fill(255, 255, 200, 150);
            p.ellipse(bobX - bobSize / 5, bobY - bobSize / 5, bobSize / 3, bobSize / 3);

            // Energy bar
            if (showEnergy) {
                const maxHeight = scaledL * (1 - p.cos(Math.PI / 4));
                const currentHeight = scaledL * (1 - p.cos(angle));
                const PE = (currentHeight / maxHeight);
                const KE = 1 - PE;

                // Energy bar background
                p.fill(30, 30, 40);
                p.stroke(60, 60, 80);
                p.strokeWeight(2);
                p.rect(p.width - 60, 80, 30, 200);

                // Potential Energy (blue)
                p.noStroke();
                p.fill(59, 130, 246);
                p.rect(p.width - 58, 80 + (1 - PE) * 196, 26, PE * 196);

                // Kinetic Energy (red)
                p.fill(239, 68, 68);
                p.rect(p.width - 58, 80 + PE * 196, 26, KE * 196);

                // Labels
                p.fill(255);
                p.textSize(10);
                p.textFont('monospace');
                p.text('PE', p.width - 52, 70);
                p.text('KE', p.width - 52, 295);
            }

            // Formula panel
            p.fill(20, 20, 30, 240);
            p.stroke(60, 60, 80);
            p.strokeWeight(2);
            p.rect(15, 15, 280, 130, 8);

            p.fill(255, 200, 0);
            p.noStroke();
            p.textSize(14);
            p.textFont('monospace');
            p.text('📐 SARKAÇ FİZİĞİ', 25, 38);

            p.fill(255);
            p.textSize(12);
            const angleDeg = (angle * 180 / Math.PI).toFixed(1);
            p.text(`θ = ${angleDeg}°`, 25, 60);
            p.text(`T = 2π√(L/g) = ${period.toFixed(2)} s`, 25, 80);
            p.text(`f = 1/T = ${frequency.toFixed(2)} Hz`, 25, 100);
            p.text(`ω = ${(aVelocity * 60).toFixed(2)} rad/s`, 25, 120);
            p.text(`a = -(g/L)sin(θ) = ${(aAcceleration * 1000).toFixed(2)}`, 25, 140);
        };

        p.mousePressed = () => {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                angle = Math.PI / 4;
                aVelocity = 0;
                trail = [];
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 450);
        };
    }, [length, gravity, mass, damping, showVectors, showEnergy, period, frequency]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[450px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-gradient-to-b from-neutral-800 to-neutral-900 space-y-4">
                {/* Formula Card */}
                <div className="bg-neutral-900 border-2 border-yellow-400/30 rounded-lg p-3">
                    <p className="text-yellow-400 font-mono text-sm font-bold mb-2">📊 Hesaplanan Değerler</p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="text-neutral-400">Periyot (T):</div>
                        <div className="text-white">{period.toFixed(3)} s</div>
                        <div className="text-neutral-400">Frekans (f):</div>
                        <div className="text-white">{frequency.toFixed(3)} Hz</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-white text-xs font-bold uppercase mb-1">
                            <span>İp Uzunluğu (L)</span>
                            <span className="text-yellow-400">{(length / 100).toFixed(2)} m</span>
                        </div>
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
                        <div className="flex justify-between text-white text-xs font-bold uppercase mb-1">
                            <span>Yerçekimi (g)</span>
                            <span className="text-yellow-400">{gravity.toFixed(1)} m/s²</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            step="0.1"
                            value={gravity}
                            onChange={(e) => setGravity(Number(e.target.value))}
                            className="w-full accent-yellow-400"
                        />
                        <div className="flex justify-between text-neutral-500 text-[10px] mt-1">
                            <span>🌙 Ay (1.6)</span>
                            <span>🌍 Dünya (9.8)</span>
                            <span>♃ Jüpiter (24.8)</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-white text-xs font-bold uppercase mb-1">
                            <span>Kütle (m)</span>
                            <span className="text-yellow-400">{mass.toFixed(1)} kg</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={mass}
                            onChange={(e) => setMass(Number(e.target.value))}
                            className="w-full accent-yellow-400"
                        />
                    </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-white text-xs font-bold uppercase cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showVectors}
                            onChange={(e) => setShowVectors(e.target.checked)}
                            className="accent-green-500"
                        />
                        Vektörler
                    </label>
                    <label className="flex items-center gap-2 text-white text-xs font-bold uppercase cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showEnergy}
                            onChange={(e) => setShowEnergy(e.target.checked)}
                            className="accent-blue-500"
                        />
                        Enerji
                    </label>
                </div>

                {/* Hint */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-blue-400 text-xs">
                        💡 <strong>İpucu:</strong> Periyot, kütle ile değişmez! Sadece uzunluk ve yerçekimi etkiler.
                        T = 2π√(L/g) formülünde m yoktur.
                    </p>
                </div>
            </div>
        </div>
    );
}
