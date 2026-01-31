"use client";

import { useCallback, useState } from "react";
import { P5Wrapper } from "./P5Wrapper";
import p5 from "p5";

interface WaveSimProps {
    className?: string;
}

export function WaveSim({ className = "" }: WaveSimProps) {
    const [frequency1, setFrequency1] = useState(1);
    const [frequency2, setFrequency2] = useState(1.2);
    const [amplitude1, setAmplitude1] = useState(40);
    const [amplitude2, setAmplitude2] = useState(40);
    const [showWave1, setShowWave1] = useState(true);
    const [showWave2, setShowWave2] = useState(true);
    const [showSum, setShowSum] = useState(true);

    // Beat frequency
    const beatFreq = Math.abs(frequency1 - frequency2);
    const wavelength1 = 100 / frequency1;
    const wavelength2 = 100 / frequency2;

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let time = 0;

        p.setup = () => {
            const canvas = p.createCanvas(parentRef.clientWidth, 400);
            canvas.parent(parentRef);
        };

        p.draw = () => {
            p.background(15, 15, 20);

            // Grid
            p.stroke(40, 40, 50);
            p.strokeWeight(1);
            for (let x = 0; x < p.width; x += 40) p.line(x, 0, x, p.height);
            for (let y = 0; y < p.height; y += 40) p.line(0, y, p.width, y);

            const centerY = 200;
            const waveWidth = p.width - 40;
            const startX = 20;

            // Draw axis
            p.stroke(100, 100, 120);
            p.strokeWeight(2);
            p.line(startX, centerY, startX + waveWidth, centerY);

            // Axis arrow
            p.fill(100, 100, 120);
            p.noStroke();
            p.triangle(startX + waveWidth, centerY, startX + waveWidth - 10, centerY - 5, startX + waveWidth - 10, centerY + 5);

            // x label
            p.textSize(12);
            p.text('x', startX + waveWidth - 5, centerY + 20);

            // Calculate waves
            const wave1Points: number[] = [];
            const wave2Points: number[] = [];
            const sumPoints: number[] = [];

            for (let x = 0; x < waveWidth; x++) {
                const phase1 = (x * frequency1 * 0.05) - (time * frequency1 * 2);
                const phase2 = (x * frequency2 * 0.05) - (time * frequency2 * 2);

                const y1 = amplitude1 * Math.sin(phase1);
                const y2 = amplitude2 * Math.sin(phase2);

                wave1Points.push(y1);
                wave2Points.push(y2);
                sumPoints.push(y1 + y2);
            }

            // Draw Wave 1 (blue)
            if (showWave1) {
                p.noFill();
                p.stroke(59, 130, 246);
                p.strokeWeight(3);
                p.beginShape();
                for (let x = 0; x < waveWidth; x++) {
                    p.vertex(startX + x, centerY - wave1Points[x]);
                }
                p.endShape();
            }

            // Draw Wave 2 (yellow)
            if (showWave2) {
                p.noFill();
                p.stroke(255, 200, 0);
                p.strokeWeight(3);
                p.beginShape();
                for (let x = 0; x < waveWidth; x++) {
                    p.vertex(startX + x, centerY - wave2Points[x]);
                }
                p.endShape();
            }

            // Draw Sum (interference)
            if (showSum) {
                p.noFill();
                p.stroke(255, 100, 150);
                p.strokeWeight(4);
                p.beginShape();
                for (let x = 0; x < waveWidth; x++) {
                    p.vertex(startX + x, centerY - sumPoints[x] * 0.5);
                }
                p.endShape();
            }

            // Amplitude guides
            p.stroke(255, 255, 255, 30);
            p.strokeWeight(1);
            const ctx = p.drawingContext as CanvasRenderingContext2D;
            ctx.setLineDash([5, 5]);
            p.line(startX, centerY - amplitude1, startX + waveWidth, centerY - amplitude1);
            p.line(startX, centerY + amplitude1, startX + waveWidth, centerY + amplitude1);
            ctx.setLineDash([]);

            // Wavelength indicator for wave 1
            if (showWave1) {
                const wlStart = 50;
                p.stroke(59, 130, 246);
                p.strokeWeight(2);
                p.line(startX + wlStart, centerY + 70, startX + wlStart + wavelength1, centerY + 70);
                p.line(startX + wlStart, centerY + 60, startX + wlStart, centerY + 80);
                p.line(startX + wlStart + wavelength1, centerY + 60, startX + wlStart + wavelength1, centerY + 80);

                p.fill(59, 130, 246);
                p.noStroke();
                p.textSize(10);
                p.text(`λ₁ = ${wavelength1.toFixed(0)}`, startX + wlStart + wavelength1 / 2 - 15, centerY + 90);
            }

            time += 0.016;

            // Info Panel
            p.fill(20, 20, 30, 240);
            p.stroke(60, 60, 80);
            p.strokeWeight(2);
            p.rect(15, 15, 280, 130, 8);

            p.fill(255, 100, 150);
            p.noStroke();
            p.textSize(14);
            p.text('🌊 DALGA GİRİŞİMİ', 25, 38);

            p.textSize(11);

            // Wave 1 info
            p.fill(59, 130, 246);
            p.rect(25, 48, 10, 10);
            p.fill(255);
            p.text(`Dalga 1: f₁ = ${frequency1.toFixed(1)} Hz, A₁ = ${amplitude1}`, 40, 57);

            // Wave 2 info
            p.fill(255, 200, 0);
            p.rect(25, 68, 10, 10);
            p.fill(255);
            p.text(`Dalga 2: f₂ = ${frequency2.toFixed(1)} Hz, A₂ = ${amplitude2}`, 40, 77);

            // Sum info
            p.fill(255, 100, 150);
            p.rect(25, 88, 10, 10);
            p.fill(255);
            p.text(`Süperpozisyon: y = y₁ + y₂`, 40, 97);

            // Beat frequency
            p.fill(100, 255, 200);
            p.text(`Vuru Frekansı: |f₁-f₂| = ${beatFreq.toFixed(2)} Hz`, 25, 120);

            // Interference type indicator
            const interferenceType = beatFreq < 0.1 ?
                (amplitude1 === amplitude2 ? "TAM YAPICI GİRİŞİM" : "YAPICI GİRİŞİM") :
                "VURUŞUM (BEAT)";
            p.fill(150, 255, 150);
            p.text(`Durum: ${interferenceType}`, 25, 140);
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 400);
        };
    }, [frequency1, frequency2, amplitude1, amplitude2, showWave1, showWave2, showSum, beatFreq, wavelength1, wavelength2]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[400px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-gradient-to-b from-neutral-800 to-neutral-900 space-y-4">
                <div className="bg-neutral-900 border-2 border-pink-400/30 rounded-lg p-3">
                    <p className="text-pink-400 font-mono text-sm font-bold mb-2">📊 Dalga Formülleri</p>
                    <div className="text-xs font-mono space-y-1">
                        <p className="text-blue-400">y₁ = {amplitude1}·sin(2π·{frequency1.toFixed(1)}·t)</p>
                        <p className="text-yellow-400">y₂ = {amplitude2}·sin(2π·{frequency2.toFixed(1)}·t)</p>
                        <p className="text-pink-400">y = y₁ + y₂ (Süperpozisyon)</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex justify-between text-blue-400 text-xs font-bold uppercase mb-1">
                            <span>Frekans 1 (f₁)</span>
                            <span>{frequency1.toFixed(1)} Hz</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={frequency1}
                            onChange={(e) => setFrequency1(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-yellow-400 text-xs font-bold uppercase mb-1">
                            <span>Frekans 2 (f₂)</span>
                            <span>{frequency2.toFixed(1)} Hz</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={frequency2}
                            onChange={(e) => setFrequency2(Number(e.target.value))}
                            className="w-full accent-yellow-400"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-blue-400 text-xs font-bold uppercase mb-1">
                            <span>Genlik 1 (A₁)</span>
                            <span>{amplitude1}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="60"
                            value={amplitude1}
                            onChange={(e) => setAmplitude1(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-yellow-400 text-xs font-bold uppercase mb-1">
                            <span>Genlik 2 (A₂)</span>
                            <span>{amplitude2}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="60"
                            value={amplitude2}
                            onChange={(e) => setAmplitude2(Number(e.target.value))}
                            className="w-full accent-yellow-400"
                        />
                    </div>
                </div>

                <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-blue-400 text-xs font-bold cursor-pointer">
                        <input type="checkbox" checked={showWave1} onChange={(e) => setShowWave1(e.target.checked)} className="accent-blue-500" />
                        Dalga 1
                    </label>
                    <label className="flex items-center gap-2 text-yellow-400 text-xs font-bold cursor-pointer">
                        <input type="checkbox" checked={showWave2} onChange={(e) => setShowWave2(e.target.checked)} className="accent-yellow-400" />
                        Dalga 2
                    </label>
                    <label className="flex items-center gap-2 text-pink-400 text-xs font-bold cursor-pointer">
                        <input type="checkbox" checked={showSum} onChange={(e) => setShowSum(e.target.checked)} className="accent-pink-500" />
                        Süperpozisyon
                    </label>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <p className="text-purple-400 text-xs">
                        💡 <strong>Dene:</strong> İki frekansı birbirine eşitle ve yapıcı girişimi gör!
                        Farklı frekanslarla vuru (beat) olayını gözlemle. Vuru frekansı = |f₁ - f₂|
                    </p>
                </div>
            </div>
        </div>
    );
}
