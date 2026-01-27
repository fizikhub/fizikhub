"use client";

import { WebGPUCanvas } from "@/components/webgpu/webgpu-canvas";
import { BlackHoleSimulation } from "@/components/webgpu/black-hole-simulation";

export function WebGPUHero() {
    return (
        <div className="w-full h-[400px] md:h-[500px] mb-8 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            {/* Simulation Context */}
            <div className="absolute inset-0 z-0">
                <WebGPUCanvas cameraPosition={[0, 2, 7]}>
                    <color attach="background" args={["#000000"]} />
                    <BlackHoleSimulation />
                </WebGPUCanvas>
            </div>

            {/* Overlay UI (Optional Instructions) */}
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] text-white/50 uppercase tracking-widest">
                    Interactive WebGPU Simulation
                </div>
            </div>

            <div className="absolute top-4 left-4 z-10 pointer-events-none max-w-xs">
                <h2 className="text-2xl font-black text-white mix-blend-difference">KARADELİK SİMÜLASYONU</h2>
                <p className="text-xs text-white/70 mt-1 font-mono">
                    Işık bükülmesi ve olay ufku simülasyonu.
                    <br />Mouse ile etkileşime geçin.
                </p>
            </div>
        </div>
    );
}
