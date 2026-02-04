"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SimSlider } from "@/components/simulations/ui/sim-slider";
import { SimButton } from "@/components/simulations/ui/sim-button";
import { Play, Pause, RotateCcw } from "lucide-react";
import p5Types from "p5";

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
    const [amplitude, setAmplitude] = useState(127);

    // Simulation State
    const timeRef = useRef(0);

    // Performance optimization: Lower resolution for expensive pixel operations
    const RES_SCALE = 4; // Draw at 1/4 resolution

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        if (!parentRef.current) return;
        const width = parentRef.current.clientWidth;
        const height = parentRef.current.clientHeight;
        const canvas = p5.createCanvas(width, height).parent(canvasParentRef);
        p5.pixelDensity(1); // Force 1:1 pixel density for performance
    };

    const windowResized = (p5: p5Types) => {
        if (!parentRef.current) return;
        const width = parentRef.current.clientWidth;
        const height = parentRef.current.clientHeight;
        p5.resizeCanvas(width, height);
    };

    const draw = (p5: p5Types) => {
        if (!isPlaying) return;

        timeRef.current += 1;
        const t = timeRef.current;
        const freq = frequency;
        const amp = amplitude; // Max color intensity

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
                // -2 -> black/blue, 0 -> grey, 2 -> white/yellow
                // Let's use a heatmap style: Blue (trough) -> Black -> Red/Yellow (peak)
                // Or proper interference: Black (destructive) -> Color (constructive)

                // Simple Greyscale Interference
                // const val = p5.map(sum, -2, 2, 0, 255);

                // Color Map
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

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] bg-neutral-900 border-t-[3px] border-black">
            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden" ref={parentRef}>
                {/* @ts-ignore */}
                <Sketch setup={setup} draw={draw} windowResized={windowResized} />

                <div className="absolute top-4 right-4 z-10 pointer-events-none opacity-50 text-white font-mono text-[10px] uppercase tracking-widest text-right">
                    p5.js Pixel Engine<br />
                    Superposition Principle
                </div>
            </div>

            {/* Controls Sidebar */}
            <div className="w-full lg:w-80 bg-white dark:bg-zinc-900 border-t-[3px] lg:border-t-0 lg:border-l-[3px] border-black flex flex-col h-[50vh] lg:h-full overflow-y-auto">
                <div className="p-6 space-y-8 flex-1">

                    {/* Frequency Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-black uppercase text-xs tracking-wider text-black dark:text-white">Frekans / Dalga Boyu</label>
                            <span className="font-mono text-xs font-bold bg-[#22C55E] text-white px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">
                                {frequency.toFixed(2)}
                            </span>
                        </div>
                        <SimSlider
                            value={[frequency]}
                            onValueChange={(v: number[]) => setFrequency(v[0])}
                            min={0.02} max={0.2} step={0.01}
                        />
                    </div>

                    {/* Separation Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-black uppercase text-xs tracking-wider text-black dark:text-white">Kaynak Mesafesi</label>
                            <span className="font-mono text-xs font-bold bg-zinc-200 text-black px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">
                                {separation}px
                            </span>
                        </div>
                        <SimSlider
                            value={[separation]}
                            onValueChange={(v: number[]) => setSeparation(v[0])}
                            min={20} max={250} step={10}
                        />
                    </div>
                </div>

                {/* Info Box */}
                <div className="px-6 pb-6">
                    <div className="p-4 bg-green-50 dark:bg-green-900/10 border-2 border-green-400/50 rounded-sm text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        <p className="font-bold mb-1 text-black dark:text-green-500 uppercase">Girişim (Interference)</p>
                        İki dalga kaynağının oluşturduğu desen. <br />
                        <span className="text-[#FFC800] font-bold">Sarı</span> bölgeler yapıcı girişim (tepe+tepe),
                        <span className="text-blue-500 font-bold"> Mavi</span> bölgeler yıkıcı girişim (çukur+çukur) alanlarıdır.
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-white dark:bg-zinc-900 border-t-2 border-zinc-100 dark:border-zinc-800 space-y-3 mt-auto">
                    <SimButton onClick={() => setIsPlaying(!isPlaying)} className="w-full gap-2 text-lg h-14" size="lg">
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        {isPlaying ? "DURAKLAT" : "DEVAM ET"}
                    </SimButton>
                    <SimButton variant="secondary" onClick={() => {
                        setFrequency(0.1);
                        setSeparation(100);
                    }} className="w-full gap-2 text-xs h-10">
                        <RotateCcw className="w-4 h-4" />
                        SIFIRLA
                    </SimButton>
                </div>
            </div>
        </div>
    );
}
