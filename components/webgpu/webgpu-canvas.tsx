"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { View } from "lucide-react";

interface WebGPUCanvasProps {
    children: React.ReactNode;
    className?: string;
    cameraPosition?: [number, number, number];
}

export function WebGPUCanvas({ children, className, cameraPosition = [0, 0, 5] }: WebGPUCanvasProps) {
    const [mounted, setMounted] = useState(false);
    const [gpuTier, setGpuTier] = useState<'high' | 'low' | 'unknown'>('unknown');

    useEffect(() => {
        setMounted(true);
        // Simple heuristic for mobile/low-power
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        setGpuTier(isMobile ? 'low' : 'high');
    }, []);

    if (!mounted) return <div className="w-full h-full bg-black/20 animate-pulse" />;

    return (
        <div className={className}>
            <Canvas
                camera={{ position: cameraPosition, fov: 45 }}
                dpr={typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio) : 1}
                gl={{
                    antialias: gpuTier === 'high',
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: true
                }}
            >
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            </Canvas>
        </div>
    );
}
