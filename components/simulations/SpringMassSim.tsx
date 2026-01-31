"use client";

import { useCallback, useState } from "react";
import { P5Wrapper } from "./P5Wrapper";
import p5 from "p5";

interface SpringMassSimProps {
    className?: string;
}

export function SpringMassSim({ className = "" }: SpringMassSimProps) {
    const [springK, setSpringK] = useState(50);
    const [mass, setMass] = useState(2);
    const [damping, setDamping] = useState(0.995);
    const [showForces, setShowForces] = useState(true);

    // Calculated values
    const angularFreq = Math.sqrt(springK / mass);
    const period = 2 * Math.PI / angularFreq;
    const frequency = 1 / period;

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let yPos = 80;
        let velocity = 0;
        const restLength = 120;
        const anchorY = 40;
        let positionHistory: number[] = [];
        let time = 0;

        p.setup = () => {
            const canvas = p.createCanvas(parentRef.clientWidth, 450);
            canvas.parent(parentRef);
        };

        p.draw = () => {
            p.background(15, 15, 20);

            // Grid
            p.stroke(40, 40, 50);
            p.strokeWeight(1);
            for (let x = 0; x < p.width; x += 40) p.line(x, 0, x, p.height);
            for (let y = 0; y < p.height; y += 40) p.line(0, y, p.width, y);

            const anchorX = p.width * 0.35;
            const massY = anchorY + restLength + yPos;

            // Physics (Hooke's Law: F = -kx)
            const displacement = yPos;
            const springForce = -(springK / 100) * displacement;
            const acceleration = springForce / mass;
            velocity += acceleration;
            velocity *= damping;
            yPos += velocity;
            time += 0.016;

            // Position history for graph
            positionHistory.push(yPos);
            if (positionHistory.length > 200) positionHistory.shift();

            // Draw anchor
            p.fill(80, 80, 100);
            p.stroke(60, 60, 80);
            p.strokeWeight(3);
            p.rect(anchorX - 50, anchorY - 20, 100, 25, 5);

            // Wall pattern
            for (let i = 0; i < 5; i++) {
                p.stroke(100, 100, 120);
                p.line(anchorX - 45 + i * 20, anchorY - 20, anchorX - 55 + i * 20, anchorY + 5);
            }

            // Draw spring (realistic coil)
            const springLen = restLength + yPos;
            const coils = 12;
            const coilHeight = springLen / coils;
            const coilWidth = 25;

            p.noFill();
            p.strokeWeight(4);

            // Spring color based on compression/extension
            if (yPos > 0) {
                p.stroke(255, 150, 50); // Extended - orange
            } else if (yPos < 0) {
                p.stroke(100, 200, 255); // Compressed - blue
            } else {
                p.stroke(200, 200, 200); // Equilibrium - white
            }

            p.beginShape();
            p.vertex(anchorX, anchorY);
            for (let i = 0; i < coils; i++) {
                const y1 = anchorY + (i + 0.25) * coilHeight;
                const y2 = anchorY + (i + 0.75) * coilHeight;
                const dir = i % 2 === 0 ? 1 : -1;
                p.vertex(anchorX + dir * coilWidth, y1);
                p.vertex(anchorX - dir * coilWidth, y2);
            }
            p.vertex(anchorX, massY - 30);
            p.endShape();

            // Force vectors
            if (showForces) {
                // Spring force (blue when pulling up, red when pushing down)
                const forceScale = 2;
                const springForceVis = springForce * forceScale * 50;

                if (Math.abs(springForceVis) > 5) {
                    p.strokeWeight(4);
                    p.stroke(springForce > 0 ? p.color(100, 200, 255) : p.color(255, 100, 100));
                    p.line(anchorX + 50, massY, anchorX + 50, massY - springForceVis);

                    p.push();
                    p.translate(anchorX + 50, massY - springForceVis);
                    p.fill(springForce > 0 ? p.color(100, 200, 255) : p.color(255, 100, 100));
                    p.noStroke();
                    if (springForce > 0) {
                        p.triangle(0, 0, -6, 10, 6, 10);
                    } else {
                        p.triangle(0, 0, -6, -10, 6, -10);
                    }
                    p.pop();

                    p.fill(255);
                    p.noStroke();
                    p.textSize(10);
                    p.text('F = -kx', anchorX + 60, massY - springForceVis / 2);
                }

                // Weight force
                const weightForce = mass * 30;
                p.stroke(255, 200, 0);
                p.strokeWeight(3);
                p.line(anchorX - 50, massY, anchorX - 50, massY + weightForce);

                p.push();
                p.translate(anchorX - 50, massY + weightForce);
                p.fill(255, 200, 0);
                p.noStroke();
                p.triangle(0, 0, -5, -10, 5, -10);
                p.pop();

                p.fill(255, 200, 0);
                p.textSize(10);
                p.text('W = mg', anchorX - 75, massY + weightForce / 2);
            }

            // Mass block with 3D effect
            p.rectMode(p.CENTER);
            const massSize = 50 + mass * 5;

            // Shadow
            p.noStroke();
            p.fill(0, 0, 0, 80);
            p.rect(anchorX + 5, massY + 5, massSize, massSize, 5);

            // Main block
            const gradient = p.drawingContext as CanvasRenderingContext2D;
            const blockGrad = gradient.createLinearGradient(anchorX - massSize / 2, massY, anchorX + massSize / 2, massY);
            blockGrad.addColorStop(0, '#3B82F6');
            blockGrad.addColorStop(0.5, '#60A5FA');
            blockGrad.addColorStop(1, '#2563EB');
            gradient.fillStyle = blockGrad;
            p.stroke(30, 60, 120);
            p.strokeWeight(3);
            p.rect(anchorX, massY, massSize, massSize, 5);

            // Mass label
            p.fill(255);
            p.noStroke();
            p.textSize(14);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(`${mass} kg`, anchorX, massY);
            p.textAlign(p.LEFT, p.BASELINE);
            p.rectMode(p.CORNER);

            // Equilibrium line
            p.stroke(100, 255, 100, 100);
            p.strokeWeight(2);
            const ctx = p.drawingContext as CanvasRenderingContext2D;
            ctx.setLineDash([8, 8]);
            p.line(anchorX - 80, anchorY + restLength, anchorX + 80, anchorY + restLength);
            ctx.setLineDash([]);

            p.fill(100, 255, 100);
            p.textSize(10);
            p.text('x = 0 (Denge)', anchorX - 80, anchorY + restLength - 10);

            // Position-Time Graph
            const graphX = p.width * 0.6;
            const graphY = 60;
            const graphW = p.width * 0.35;
            const graphH = 150;

            p.fill(20, 20, 30, 230);
            p.stroke(60, 60, 80);
            p.strokeWeight(2);
            p.rect(graphX, graphY, graphW, graphH, 5);

            // Graph title
            p.fill(255, 200, 0);
            p.noStroke();
            p.textSize(11);
            p.text('📈 Konum-Zaman Grafiği', graphX + 10, graphY + 18);

            // Axes
            p.stroke(100, 100, 120);
            p.strokeWeight(1);
            p.line(graphX + 30, graphY + graphH / 2, graphX + graphW - 10, graphY + graphH / 2);
            p.line(graphX + 30, graphY + 25, graphX + 30, graphY + graphH - 10);

            // Plot
            p.noFill();
            p.stroke(255, 200, 0);
            p.strokeWeight(2);
            p.beginShape();
            for (let i = 0; i < positionHistory.length; i++) {
                const x = graphX + 35 + (i / 200) * (graphW - 50);
                const y = graphY + graphH / 2 - positionHistory[i] * 0.8;
                p.vertex(x, p.constrain(y, graphY + 25, graphY + graphH - 10));
            }
            p.endShape();

            // Axis labels
            p.fill(150);
            p.textSize(9);
            p.text('x', graphX + graphW - 20, graphY + graphH / 2 - 5);
            p.text('t', graphX + 35, graphY + graphH - 5);

            // Formula panel
            p.fill(20, 20, 30, 240);
            p.stroke(60, 60, 80);
            p.strokeWeight(2);
            p.rect(graphX, graphY + graphH + 20, graphW, 140, 5);

            p.fill(59, 130, 246);
            p.noStroke();
            p.textSize(13);
            p.text('🔗 HOOKE YASASI', graphX + 10, graphY + graphH + 40);

            p.fill(255);
            p.textSize(11);
            p.text(`F = -kx = -${springK} × ${(displacement / 100).toFixed(3)}`, graphX + 10, graphY + graphH + 60);
            p.text(`F = ${(springForce * mass).toFixed(2)} N`, graphX + 10, graphY + graphH + 80);
            p.text(`ω = √(k/m) = ${angularFreq.toFixed(2)} rad/s`, graphX + 10, graphY + graphH + 100);
            p.text(`T = 2π/ω = ${period.toFixed(3)} s`, graphX + 10, graphY + graphH + 120);
            p.text(`f = 1/T = ${frequency.toFixed(2)} Hz`, graphX + 10, graphY + graphH + 140);
        };

        p.mousePressed = () => {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                yPos = 80;
                velocity = 0;
                positionHistory = [];
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 450);
        };
    }, [springK, mass, damping, showForces, angularFreq, period, frequency]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[450px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-gradient-to-b from-neutral-800 to-neutral-900 space-y-4">
                <div className="bg-neutral-900 border-2 border-blue-400/30 rounded-lg p-3">
                    <p className="text-blue-400 font-mono text-sm font-bold mb-2">📊 Hesaplanan Değerler</p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="text-neutral-400">Açısal Frekans (ω):</div>
                        <div className="text-white">{angularFreq.toFixed(2)} rad/s</div>
                        <div className="text-neutral-400">Periyot (T):</div>
                        <div className="text-white">{period.toFixed(3)} s</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-white text-xs font-bold uppercase mb-1">
                            <span>Yay Sabiti (k)</span>
                            <span className="text-blue-400">{springK} N/m</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="150"
                            value={springK}
                            onChange={(e) => setSpringK(Number(e.target.value))}
                            className="w-full accent-blue-400"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-white text-xs font-bold uppercase mb-1">
                            <span>Kütle (m)</span>
                            <span className="text-blue-400">{mass} kg</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="0.5"
                            value={mass}
                            onChange={(e) => setMass(Number(e.target.value))}
                            className="w-full accent-blue-400"
                        />
                    </div>
                </div>

                <label className="flex items-center gap-2 text-white text-xs font-bold uppercase cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showForces}
                        onChange={(e) => setShowForces(e.target.checked)}
                        className="accent-green-500"
                    />
                    Kuvvet Vektörleri
                </label>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-400 text-xs">
                        💡 <strong>Keşfet:</strong> k değerini artırınca periyot azalır, m değerini artırınca periyot artar.
                        ω = √(k/m) formülünü kontrol edin!
                    </p>
                </div>
            </div>
        </div>
    );
}
