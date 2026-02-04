"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SimSlider } from "@/components/simulations/ui/sim-slider";
import { SimButton } from "@/components/simulations/ui/sim-button";
import { Play, Pause, RotateCcw } from "lucide-react";
import p5Types from "p5";
import { SimulationLayout } from "@/components/simulations/ui/simulation-layout";
import { SimulationTheory } from "@/components/simulations/ui/simulation-theory";

// Dynamic import for p5
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full bg-neutral-900 text-white font-mono">P5.js Yükleniyor...</div>
});

export default function WaveSim() {
    const parentRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    // Physics Parameters
    const [frequency, setFrequency] = useState(0.1);
    const [separation, setSeparation] = useState(100);

    // Simulation State
    const timeRef = useRef(0);

    // Performance optimization: Lower resolution for expensive pixel operations
    const RES_SCALE = 4; // Draw at 1/4 resolution

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        const width = canvasParentRef.clientWidth;
        const height = canvasParentRef.clientHeight;
        p5.createCanvas(width, height).parent(canvasParentRef);
        p5.pixelDensity(1); // Force 1:1 pixel density for performance
    };

    const windowResized = (p5: p5Types) => {
        if (parentRef.current) {
            p5.resizeCanvas(parentRef.current.clientWidth, parentRef.current.clientHeight);
        }
    };

    const draw = (p5: p5Types) => {
        if (!isPlaying) return;

        timeRef.current += 1;
        const t = timeRef.current;
        const freq = frequency;

        const w = p5.width;
        const h = p5.height;

        // Source positions
        const s1x = w / 2 - separation;
        const s1y = h / 2;
        const s2x = w / 2 + separation;
        const s2y = h / 2;

        p5.loadPixels();

        // Loop through pixels with step (optimization)
        for (let y = 0; y < h; y += RES_SCALE) {
            for (let x = 0; x < w; x += RES_SCALE) {

                // Distance to source 1
                const d1 = p5.dist(x, y, s1x, s1y);
                // Distance to source 2
                const d2 = p5.dist(x, y, s2x, s2y);

                // Wave function: A * sin(dist - time * speed)
                const w1 = Math.sin(d1 * freq - t * 0.2);
                const w2 = Math.sin(d2 * freq - t * 0.2);

                // Superposition
                const sum = w1 + w2; // Range -2 to 2

                // Map to color
                let r = 0, g = 0, b = 0;

                if (sum > 0) {
                    // Positive (Peaks) -> Yellow
                    const intensity = p5.map(sum, 0, 2, 0, 255);
                    r = intensity;
                    g = intensity * 0.8; // slightly orange/yellow
                    b = 0;
                } else {
                    // Negative (Troughs) -> Blue
                    const intensity = p5.map(sum, -2, 0, 255, 0);
                    r = 0;
                    g = intensity * 0.2;
                    b = intensity;
                }

                // Fill blocks
                for (let dy = 0; dy < RES_SCALE; dy++) {
                    for (let dx = 0; dx < RES_SCALE; dx++) {
                        if (x + dx < w && y + dy < h) {
                            const index = 4 * ((y + dy) * w + (x + dx));
                            p5.pixels[index] = r;
                            p5.pixels[index + 1] = g;
                            p5.pixels[index + 2] = b;
                            p5.pixels[index + 3] = 255;
                        }
                    }
                }
            }
        }

        p5.updatePixels();

        // Draw Sources
        p5.noStroke();
        p5.fill(255);
        p5.circle(s1x, s1y, 10);
        p5.circle(s2x, s2y, 10);
    };

    const Controls = (
        <div className="p-4 lg:p-6 space-y-6 flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="font-black uppercase text-[10px] lg:text-xs tracking-wider text-zinc-500 dark:text-zinc-400">Frekans</label>
                        <span className="font-mono text-[10px] lg:text-xs font-bold bg-[#22C55E] text-white px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">{frequency.toFixed(2)}</span>
                    </div>
                    <SimSlider value={[frequency]} onValueChange={(v: number[]) => setFrequency(v[0])} min={0.02} max={0.2} step={0.01} className="py-1" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="font-black uppercase text-[10px] lg:text-xs tracking-wider text-zinc-500 dark:text-zinc-400">Mesaye</label>
                        <span className="font-mono text-[10px] lg:text-xs font-bold bg-zinc-200 text-black px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">{separation}px</span>
                    </div>
                    <SimSlider value={[separation]} onValueChange={(v: number[]) => setSeparation(v[0])} min={20} max={250} step={10} className="py-1" />
                </div>
            </div>

            <div className="pt-2 space-y-3">
                <SimButton onClick={() => setIsPlaying(!isPlaying)} className="w-full gap-2 text-sm lg:text-lg h-12 lg:h-14" size="lg">
                    {isPlaying ? <Pause className="w-4 h-4 lg:w-5 lg:h-5 fill-current" /> : <Play className="w-4 h-4 lg:w-5 lg:h-5 fill-current" />}
                    {isPlaying ? "DURAKLAT" : "DEVAM ET"}
                </SimButton>
                <SimButton variant="secondary" onClick={() => { setFrequency(0.1); setSeparation(100); }} className="w-full gap-2 text-[10px] lg:text-xs h-9 lg:h-10">
                    <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4" />
                    SIFIRLA
                </SimButton>
            </div>

            <div className="pt-4">
                <SimulationTheory title="Girişim (Interference)">
                    <p>İki veya daha fazla dalganın aynı anda aynı noktada karşılaşarak birbirini güçlendirmesi veya sönümlemesidir.</p>

                    <div className="bg-zinc-50 dark:bg-black/20 p-2 rounded border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
                        y_toplam = y₁ + y₂
                    </div>

                    <ul className="list-disc list-inside space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <li><strong>Yapıcı Girişim (Sarı):</strong> Tepe + Tepe. Dalgalar birbirini güçlendirir.</li>
                        <li><strong>Yıkıcı Girişim (Mavi/Karanlık):</strong> Tepe + Çukur. Dalgalar birbirini sönümler.</li>
                        <li><strong>Süperpozisyon İlkesi:</strong> Bileşke dalga, bireysel dalgaların cebirsel toplamıdır.</li>
                    </ul>
                </SimulationTheory>
            </div>
        </div>
    );

    return (
        <SimulationLayout controls={Controls} title="Dalga Girişimi">
            <div className="flex-1 relative overflow-hidden h-full w-full" ref={parentRef}>
                {/* @ts-ignore */}
                <Sketch setup={setup} draw={draw} windowResized={windowResized} />
                <div className="absolute top-4 right-4 z-10 pointer-events-none opacity-50 text-white font-mono text-[10px] uppercase tracking-widest text-right">
                    p5.js Pixel Engine<br />
                    Superposition
                </div>
            </div>
        </SimulationLayout>
    );
}
