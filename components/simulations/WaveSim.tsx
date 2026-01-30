"use client";

import { useCallback, useState } from "react";
import { P5Wrapper } from "./P5Wrapper";
import p5 from "p5";

interface WaveSimProps {
    className?: string;
}

export function WaveSim({ className = "" }: WaveSimProps) {
    const [frequency1, setFrequency1] = useState(0.02);
    const [frequency2, setFrequency2] = useState(0.025);
    const [amplitude, setAmplitude] = useState(50);
    const [showInterference, setShowInterference] = useState(true);

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let time = 0;

        p.setup = () => {
            const canvas = p.createCanvas(parentRef.clientWidth, 400);
            canvas.parent(parentRef);
        };

        p.draw = () => {
            p.background(23, 23, 23);

            const centerY = p.height / 2;

            // Draw axis
            p.stroke(255, 255, 255, 30);
            p.strokeWeight(1);
            p.line(0, centerY, p.width, centerY);

            // Wave 1 (blue)
            p.stroke(59, 130, 246);
            p.strokeWeight(2);
            p.noFill();
            p.beginShape();
            for (let x = 0; x < p.width; x++) {
                const y = centerY + amplitude * p.sin(frequency1 * x + time);
                p.vertex(x, y);
            }
            p.endShape();

            // Wave 2 (yellow)
            p.stroke(255, 200, 0);
            p.beginShape();
            for (let x = 0; x < p.width; x++) {
                const y = centerY + amplitude * p.sin(frequency2 * x + time * 1.2);
                p.vertex(x, y);
            }
            p.endShape();

            // Interference (sum)
            if (showInterference) {
                p.stroke(255, 100, 100);
                p.strokeWeight(3);
                p.beginShape();
                for (let x = 0; x < p.width; x++) {
                    const y1 = amplitude * p.sin(frequency1 * x + time);
                    const y2 = amplitude * p.sin(frequency2 * x + time * 1.2);
                    p.vertex(x, centerY + (y1 + y2) / 2);
                }
                p.endShape();
            }

            time += 0.05;

            // Legend
            p.noStroke();
            p.fill(59, 130, 246);
            p.rect(20, 20, 12, 12);
            p.fill(255);
            p.textSize(12);
            p.textFont('monospace');
            p.text(`Dalga 1 (f=${(frequency1 * 100).toFixed(1)})`, 40, 30);

            p.fill(255, 200, 0);
            p.rect(20, 40, 12, 12);
            p.fill(255);
            p.text(`Dalga 2 (f=${(frequency2 * 100).toFixed(1)})`, 40, 50);

            if (showInterference) {
                p.fill(255, 100, 100);
                p.rect(20, 60, 12, 12);
                p.fill(255);
                p.text('Girişim (Süperpozisyon)', 40, 70);
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 400);
        };
    }, [frequency1, frequency2, amplitude, showInterference]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[400px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-neutral-800 space-y-3">
                <div>
                    <label className="text-white text-xs font-bold uppercase mb-1 block">
                        Frekans 1: {(frequency1 * 100).toFixed(1)}
                    </label>
                    <input
                        type="range"
                        min="0.01"
                        max="0.05"
                        step="0.002"
                        value={frequency1}
                        onChange={(e) => setFrequency1(Number(e.target.value))}
                        className="w-full accent-blue-500"
                    />
                </div>
                <div>
                    <label className="text-white text-xs font-bold uppercase mb-1 block">
                        Frekans 2: {(frequency2 * 100).toFixed(1)}
                    </label>
                    <input
                        type="range"
                        min="0.01"
                        max="0.05"
                        step="0.002"
                        value={frequency2}
                        onChange={(e) => setFrequency2(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                </div>
                <div>
                    <label className="text-white text-xs font-bold uppercase mb-1 block">
                        Genlik: {amplitude}
                    </label>
                    <input
                        type="range"
                        min="20"
                        max="100"
                        value={amplitude}
                        onChange={(e) => setAmplitude(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                </div>
                <label className="flex items-center gap-2 text-white text-xs font-bold uppercase cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showInterference}
                        onChange={(e) => setShowInterference(e.target.checked)}
                        className="accent-yellow-400"
                    />
                    Girişimi Göster
                </label>
            </div>
        </div>
    );
}
