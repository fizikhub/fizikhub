"use client";

import { useCallback, useState } from "react";
import { P5Wrapper } from "./P5Wrapper";
import p5 from "p5";

interface ElectricFieldSimProps {
    className?: string;
}

interface Charge {
    x: number;
    y: number;
    q: number; // positive or negative
}

export function ElectricFieldSim({ className = "" }: ElectricFieldSimProps) {
    const [charges, setCharges] = useState<Charge[]>([
        { x: 150, y: 200, q: 1 },
        { x: 350, y: 200, q: -1 }
    ]);
    const [showFieldLines, setShowFieldLines] = useState(true);

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let dragging: number | null = null;

        p.setup = () => {
            const canvas = p.createCanvas(parentRef.clientWidth, 400);
            canvas.parent(parentRef);
        };

        const calculateField = (x: number, y: number): { ex: number; ey: number } => {
            let ex = 0;
            let ey = 0;

            for (const charge of charges) {
                const dx = x - charge.x;
                const dy = y - charge.y;
                const r = Math.sqrt(dx * dx + dy * dy);
                if (r < 20) continue;

                const k = 1000;
                const magnitude = (k * Math.abs(charge.q)) / (r * r);
                const angle = Math.atan2(dy, dx);

                if (charge.q > 0) {
                    ex += magnitude * Math.cos(angle);
                    ey += magnitude * Math.sin(angle);
                } else {
                    ex -= magnitude * Math.cos(angle);
                    ey -= magnitude * Math.sin(angle);
                }
            }

            return { ex, ey };
        };

        p.draw = () => {
            p.background(23, 23, 23);

            // Draw field lines
            if (showFieldLines) {
                p.stroke(255, 255, 255, 40);
                p.strokeWeight(1);

                const gridSize = 25;
                for (let x = gridSize; x < p.width; x += gridSize) {
                    for (let y = gridSize; y < p.height; y += gridSize) {
                        const field = calculateField(x, y);
                        const magnitude = Math.sqrt(field.ex * field.ex + field.ey * field.ey);
                        if (magnitude > 0.1) {
                            const len = Math.min(magnitude * 2, 15);
                            const nx = field.ex / magnitude;
                            const ny = field.ey / magnitude;

                            p.line(x, y, x + nx * len, y + ny * len);

                            // Arrow head
                            const arrowSize = 3;
                            const ax = x + nx * len;
                            const ay = y + ny * len;
                            p.push();
                            p.translate(ax, ay);
                            p.rotate(Math.atan2(ny, nx));
                            p.line(0, 0, -arrowSize, -arrowSize);
                            p.line(0, 0, -arrowSize, arrowSize);
                            p.pop();
                        }
                    }
                }
            }

            // Draw charges
            for (let i = 0; i < charges.length; i++) {
                const charge = charges[i];

                // Glow effect
                p.noStroke();
                const glowColor = charge.q > 0 ? [255, 100, 100] : [100, 100, 255];
                for (let r = 40; r > 20; r -= 5) {
                    p.fill(glowColor[0], glowColor[1], glowColor[2], (40 - r) * 3);
                    p.ellipse(charge.x, charge.y, r * 2, r * 2);
                }

                // Main circle
                p.fill(charge.q > 0 ? p.color(255, 100, 100) : p.color(100, 100, 255));
                p.stroke(0);
                p.strokeWeight(3);
                p.ellipse(charge.x, charge.y, 40, 40);

                // +/- symbol
                p.stroke(255);
                p.strokeWeight(4);
                if (charge.q > 0) {
                    p.line(charge.x - 10, charge.y, charge.x + 10, charge.y);
                    p.line(charge.x, charge.y - 10, charge.x, charge.y + 10);
                } else {
                    p.line(charge.x - 10, charge.y, charge.x + 10, charge.y);
                }
            }

            // Instructions
            p.fill(255);
            p.noStroke();
            p.textSize(12);
            p.textFont('monospace');
            p.text('Yükleri sürükleyebilirsiniz', 20, 25);
            p.text('Tıklayarak yeni yük ekleyin', 20, 45);

            // Legend
            p.fill(255, 100, 100);
            p.ellipse(p.width - 80, 25, 15, 15);
            p.fill(255);
            p.text('+', p.width - 83, 29);
            p.text('Pozitif', p.width - 60, 29);

            p.fill(100, 100, 255);
            p.ellipse(p.width - 80, 45, 15, 15);
            p.fill(255);
            p.text('−', p.width - 83, 49);
            p.text('Negatif', p.width - 60, 49);
        };

        p.mousePressed = () => {
            if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;

            // Check if clicking on existing charge
            for (let i = 0; i < charges.length; i++) {
                const d = p.dist(p.mouseX, p.mouseY, charges[i].x, charges[i].y);
                if (d < 25) {
                    dragging = i;
                    return;
                }
            }

            // Add new charge
            const newQ = charges.length % 2 === 0 ? 1 : -1;
            setCharges([...charges, { x: p.mouseX, y: p.mouseY, q: newQ }]);
        };

        p.mouseDragged = () => {
            if (dragging !== null) {
                const newCharges = [...charges];
                newCharges[dragging] = {
                    ...newCharges[dragging],
                    x: p.mouseX,
                    y: p.mouseY
                };
                setCharges(newCharges);
            }
        };

        p.mouseReleased = () => {
            dragging = null;
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 400);
        };
    }, [charges, showFieldLines, setCharges]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[400px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-neutral-800 space-y-3">
                <label className="flex items-center gap-2 text-white text-xs font-bold uppercase cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showFieldLines}
                        onChange={(e) => setShowFieldLines(e.target.checked)}
                        className="accent-yellow-400"
                    />
                    Alan Çizgilerini Göster
                </label>
                <button
                    onClick={() => setCharges([{ x: 150, y: 200, q: 1 }, { x: 350, y: 200, q: -1 }])}
                    className="px-4 py-2 bg-yellow-400 text-black font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    Sıfırla
                </button>
                <p className="text-neutral-400 text-xs">E = kq/r² (Coulomb Yasası)</p>
            </div>
        </div>
    );
}
