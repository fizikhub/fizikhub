"use client";

import { useCallback, useState, useRef } from "react";
import { P5Wrapper } from "./P5Wrapper";
import p5 from "p5";

interface ElectricFieldSimProps {
    className?: string;
}

interface Charge {
    x: number;
    y: number;
    q: number;
}

export function ElectricFieldSim({ className = "" }: ElectricFieldSimProps) {
    const [chargesState, setChargesState] = useState<Charge[]>([
        { x: 200, y: 200, q: 2 },
        { x: 400, y: 200, q: -2 }
    ]);
    const [showFieldLines, setShowFieldLines] = useState(true);
    const [showPotential, setShowPotential] = useState(false);
    const chargesRef = useRef(chargesState);
    chargesRef.current = chargesState;

    const k = 8.99e9; // Coulomb constant

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let dragging: number | null = null;

        p.setup = () => {
            const canvas = p.createCanvas(parentRef.clientWidth, 400);
            canvas.parent(parentRef);
        };

        const calculateField = (px: number, py: number): { ex: number; ey: number; magnitude: number } => {
            let ex = 0;
            let ey = 0;

            for (const charge of chargesRef.current) {
                const dx = px - charge.x;
                const dy = py - charge.y;
                const r = Math.sqrt(dx * dx + dy * dy);
                if (r < 25) continue;

                const magnitude = 5000 * Math.abs(charge.q) / (r * r);
                const angle = Math.atan2(dy, dx);

                if (charge.q > 0) {
                    ex += magnitude * Math.cos(angle);
                    ey += magnitude * Math.sin(angle);
                } else {
                    ex -= magnitude * Math.cos(angle);
                    ey -= magnitude * Math.sin(angle);
                }
            }

            return { ex, ey, magnitude: Math.sqrt(ex * ex + ey * ey) };
        };

        const calculatePotential = (px: number, py: number): number => {
            let V = 0;
            for (const charge of chargesRef.current) {
                const dx = px - charge.x;
                const dy = py - charge.y;
                const r = Math.sqrt(dx * dx + dy * dy);
                if (r < 25) continue;
                V += charge.q / r * 100;
            }
            return V;
        };

        p.draw = () => {
            p.background(15, 15, 20);

            // Potential field (heat map)
            if (showPotential) {
                p.loadPixels();
                for (let x = 0; x < p.width; x += 4) {
                    for (let y = 0; y < p.height; y += 4) {
                        const V = calculatePotential(x, y);
                        const normalizedV = p.constrain(V / 10, -1, 1);

                        let r, g, b;
                        if (normalizedV > 0) {
                            r = 255 * normalizedV;
                            g = 50 * normalizedV;
                            b = 50 * normalizedV;
                        } else {
                            r = 50 * (-normalizedV);
                            g = 50 * (-normalizedV);
                            b = 255 * (-normalizedV);
                        }

                        p.noStroke();
                        p.fill(r, g, b, 80);
                        p.rect(x, y, 4, 4);
                    }
                }
            }

            // Field lines (vector field)
            if (showFieldLines) {
                const gridSize = 30;
                for (let x = gridSize; x < p.width; x += gridSize) {
                    for (let y = gridSize; y < p.height; y += gridSize) {
                        const field = calculateField(x, y);
                        if (field.magnitude > 0.5) {
                            const len = p.constrain(field.magnitude * 0.5, 5, 20);
                            const nx = field.ex / field.magnitude;
                            const ny = field.ey / field.magnitude;

                            // Color based on magnitude
                            const intensity = p.constrain(field.magnitude * 5, 50, 255);
                            p.stroke(intensity, intensity * 0.8, 100, 180);
                            p.strokeWeight(2);
                            p.line(x, y, x + nx * len, y + ny * len);

                            // Arrow head
                            p.push();
                            p.translate(x + nx * len, y + ny * len);
                            p.rotate(Math.atan2(ny, nx));
                            p.fill(intensity, intensity * 0.8, 100);
                            p.noStroke();
                            p.triangle(0, 0, -6, -3, -6, 3);
                            p.pop();
                        }
                    }
                }
            }

            // Field lines emanating from charges (streamlines)
            if (showFieldLines) {
                for (const charge of chargesRef.current) {
                    if (charge.q > 0) {
                        // Draw streamlines from positive charges
                        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
                            let lx = charge.x + 30 * Math.cos(a);
                            let ly = charge.y + 30 * Math.sin(a);

                            p.noFill();
                            p.stroke(255, 100, 100, 100);
                            p.strokeWeight(1);
                            p.beginShape();

                            for (let step = 0; step < 100; step++) {
                                const field = calculateField(lx, ly);
                                if (field.magnitude < 0.1) break;
                                if (lx < 0 || lx > p.width || ly < 0 || ly > p.height) break;

                                p.vertex(lx, ly);
                                lx += field.ex / field.magnitude * 5;
                                ly += field.ey / field.magnitude * 5;
                            }
                            p.endShape();
                        }
                    }
                }
            }

            // Draw charges
            for (let i = 0; i < chargesRef.current.length; i++) {
                const charge = chargesRef.current[i];
                const size = 40 + Math.abs(charge.q) * 8;

                // Glow effect
                for (let r = size + 20; r > size; r -= 5) {
                    const alpha = (size + 20 - r) * 8;
                    if (charge.q > 0) {
                        p.fill(255, 100, 100, alpha);
                    } else {
                        p.fill(100, 100, 255, alpha);
                    }
                    p.noStroke();
                    p.ellipse(charge.x, charge.y, r * 2, r * 2);
                }

                // Main circle with gradient
                const gradient = p.drawingContext as CanvasRenderingContext2D;
                const grad = gradient.createRadialGradient(
                    charge.x - size / 3, charge.y - size / 3, 0,
                    charge.x, charge.y, size
                );

                if (charge.q > 0) {
                    grad.addColorStop(0, '#FF8888');
                    grad.addColorStop(0.5, '#FF4444');
                    grad.addColorStop(1, '#CC0000');
                } else {
                    grad.addColorStop(0, '#8888FF');
                    grad.addColorStop(0.5, '#4444FF');
                    grad.addColorStop(1, '#0000CC');
                }

                gradient.fillStyle = grad;
                p.stroke(charge.q > 0 ? '#880000' : '#000088');
                p.strokeWeight(3);
                p.ellipse(charge.x, charge.y, size, size);

                // +/- symbol
                p.stroke(255);
                p.strokeWeight(4);
                if (charge.q > 0) {
                    p.line(charge.x - 12, charge.y, charge.x + 12, charge.y);
                    p.line(charge.x, charge.y - 12, charge.x, charge.y + 12);
                } else {
                    p.line(charge.x - 12, charge.y, charge.x + 12, charge.y);
                }

                // Charge value
                p.fill(255);
                p.noStroke();
                p.textSize(10);
                p.textAlign(p.CENTER);
                p.text(`${charge.q > 0 ? '+' : ''}${charge.q}C`, charge.x, charge.y + size / 2 + 15);
                p.textAlign(p.LEFT);
            }

            // Calculate force between charges (if 2 charges)
            if (chargesRef.current.length >= 2) {
                const c1 = chargesRef.current[0];
                const c2 = chargesRef.current[1];
                const dx = c2.x - c1.x;
                const dy = c2.y - c1.y;
                const r = Math.sqrt(dx * dx + dy * dy);
                const rMeters = r / 50; // Scale: 50px = 1m
                const F = (k * Math.abs(c1.q * c2.q)) / (rMeters * rMeters);
                const forceType = c1.q * c2.q > 0 ? "İtme" : "Çekme";

                // Info panel
                p.fill(20, 20, 30, 240);
                p.stroke(60, 60, 80);
                p.strokeWeight(2);
                p.rect(15, 15, 280, 120, 8);

                p.fill(167, 139, 250);
                p.noStroke();
                p.textSize(14);
                p.textAlign(p.LEFT);
                p.text('⚡ COULOMB YASASI', 25, 38);

                p.fill(255);
                p.textSize(11);
                p.text(`F = k·|q₁·q₂|/r²`, 25, 58);
                p.text(`k = 8.99×10⁹ N·m²/C²`, 25, 78);
                p.text(`r = ${rMeters.toFixed(2)} m`, 25, 98);

                p.fill(c1.q * c2.q > 0 ? p.color(255, 150, 150) : p.color(150, 255, 150));
                p.text(`F = ${F.toExponential(2)} N (${forceType})`, 25, 118);
            }

            // Instructions
            p.fill(150);
            p.textSize(10);
            p.textAlign(p.LEFT);
            p.text('Yükleri sürükle • Tıkla = yeni yük', 15, p.height - 15);
        };

        p.mousePressed = () => {
            if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;

            for (let i = 0; i < chargesRef.current.length; i++) {
                const d = p.dist(p.mouseX, p.mouseY, chargesRef.current[i].x, chargesRef.current[i].y);
                if (d < 30) {
                    dragging = i;
                    return;
                }
            }

            // Add new charge
            const newQ = chargesRef.current.length % 2 === 0 ? 1 : -1;
            setChargesState([...chargesRef.current, { x: p.mouseX, y: p.mouseY, q: newQ }]);
        };

        p.mouseDragged = () => {
            if (dragging !== null && p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                const newCharges = [...chargesRef.current];
                newCharges[dragging] = { ...newCharges[dragging], x: p.mouseX, y: p.mouseY };
                setChargesState(newCharges);
            }
        };

        p.mouseReleased = () => {
            dragging = null;
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 400);
        };
    }, [showFieldLines, showPotential]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[400px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-gradient-to-b from-neutral-800 to-neutral-900 space-y-4">
                <div className="bg-neutral-900 border-2 border-purple-400/30 rounded-lg p-3">
                    <p className="text-purple-400 font-mono text-sm font-bold mb-2">⚡ Coulomb Yasası</p>
                    <p className="text-white font-mono text-xs">F = k · |q₁ · q₂| / r²</p>
                    <p className="text-neutral-400 text-xs mt-1">k = 8.99 × 10⁹ N·m²/C²</p>
                </div>

                <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-white text-xs font-bold cursor-pointer">
                        <input type="checkbox" checked={showFieldLines} onChange={(e) => setShowFieldLines(e.target.checked)} className="accent-yellow-500" />
                        Alan Çizgileri
                    </label>
                    <label className="flex items-center gap-2 text-white text-xs font-bold cursor-pointer">
                        <input type="checkbox" checked={showPotential} onChange={(e) => setShowPotential(e.target.checked)} className="accent-purple-500" />
                        Potansiyel Haritası
                    </label>
                </div>

                <button
                    onClick={() => setChargesState([{ x: 200, y: 200, q: 2 }, { x: 400, y: 200, q: -2 }])}
                    className="px-4 py-2 bg-purple-500 text-white font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    Sıfırla
                </button>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-blue-400 text-xs">
                        💡 <strong>İpucu:</strong> Aynı işaretli yükler iter, zıt işaretli yükler çeker.
                        Mesafe arttıkça kuvvet r² ile azalır!
                    </p>
                </div>
            </div>
        </div>
    );
}
