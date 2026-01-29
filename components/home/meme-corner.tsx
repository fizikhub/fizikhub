"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- TEXTURE GENERATION (Robust) ---
function getSoftStarTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const center = 16;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 14);
    // Soft core
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    // Glow falloff
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}

// --- ULTIMATE GALAXY SIMULATION ---
function Galaxy({ count = 60000 }) { // High density for realism
    const pointsRef = useRef<THREE.Points>(null!);

    // Generate texture once
    const texture = useMemo(() => getSoftStarTexture(), []);

    // --- GEOMETRY GENERATION ---
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count); // Per-star size override

        // Color Palette (Based on Reference Images)
        const c_Core = new THREE.Color('#fff4bd');    // Warm Yellow/White
        const c_InnerArm = new THREE.Color('#b3e0ff'); // Pale Blue
        const c_OuterArm = new THREE.Color('#409cff'); // Deep Azure
        const c_Nebula = new THREE.Color('#d44383');   // Pink/Red HII Regions
        const c_Dust = new THREE.Color('#483475');     // Darker Purple Dust

        // Spiral Parameters
        const arms = 2; // Classic Barred Spiral usually has 2 main arms
        const spin = 4; // How tightly wound

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Distribution: 
            // 20% Core (Bulge)
            // 80% Disk (Spiral Arms)
            const isCore = Math.random() < 0.20;
            let x, y, z;
            let color = new THREE.Color();
            let size = 1.0;

            if (isCore) {
                // --- CORE (Bulge) ---
                const r = Math.pow(Math.random(), 2) * 1.5; // Dense center
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                // Flattened Sphere (Bulge)
                x = r * Math.sin(phi) * Math.cos(theta);
                y = (r * Math.sin(phi) * Math.sin(theta)) * 0.6;
                z = r * Math.cos(phi) * 0.6;

                // Core Colors: Hot White -> Warm Yellow
                color.copy(c_Core);
                if (r > 0.8) color.lerp(new THREE.Color('#ffd700'), Math.random() * 0.5);

                size = 1.5 + Math.random(); // Larger core stars
            } else {
                // --- DISC (Spiral Arms) ---
                // Angle for the arms
                const branchAngle = ((i % arms) / arms) * Math.PI * 2;

                // Radius: Start from outside the core (1.5) up to 9
                // Use pow to distribute more stars closer to center (density wave)
                const radius = 1.5 + Math.pow(Math.random(), 1.2) * 7.5;

                // Spiral Equation
                const spinAngle = radius * 0.7 * spin; // Winding

                // Randomness (Scatter)
                // Tighter scatter near center, wider at edges
                const randomOffset = Math.pow(Math.random(), 2);
                const scatterAmp = 0.3 + (radius * 0.1);

                const randomX = (Math.random() - 0.5) * scatterAmp * 2;
                const randomY = (Math.random() - 0.5) * (0.2 + radius * 0.05); // Vertical thickness increases slightly
                const randomZ = (Math.random() - 0.5) * scatterAmp * 2;

                const finalAngle = branchAngle + spinAngle;

                x = Math.cos(finalAngle) * radius + randomX;
                z = Math.sin(finalAngle) * radius + randomZ;
                y = randomY;

                // --- COLORING ---
                // Base gradient: Inner Blue -> Outer Deep Blue
                color.copy(c_InnerArm);
                color.lerp(c_OuterArm, (radius / 9));

                // Nebula / Dust Injection (Random clumps)
                // Use Perlin-like noise simulation via simple randomness for clumpiness
                const noiseCheck = Math.random();
                if (noiseCheck > 0.95) {
                    // Bright young blue stars
                    color.set('#ffffff');
                    size = 2.0;
                } else if (noiseCheck > 0.85) {
                    // Pink Nebulas (HII Regions)
                    color.lerp(c_Nebula, 0.8);
                    size = 2.5; // Nebulas look bigger/softer
                } else if (noiseCheck < 0.05) {
                    // Dark Dust
                    color.lerp(c_Dust, 0.9);
                    size = 1.2;
                }
            }

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = size;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        // We can't easily pass 'size' to standard PointsMaterial without modifying shaders.
        // For robustness, we will rely on sizeAttenuation and the texture alpha to fake strict size control.
        // If we strictly need variable sizes, we'd need a ShaderMaterial (which caused mobile issues before).
        // Strategy: Use a balanced default size that works for both.
        return geo;
    }, [count]);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        // Majestic slow rotation
        pointsRef.current.rotation.y += delta * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={0.12} // Tuned for balance between 60k count and per-star definition
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors={true}
                transparent={true}
                opacity={0.85}
            />
        </points>
    );
}

// --- MAIN COMPONENT ---
export function MemeCorner() {
    return (
        <div className="w-full relative group">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className={cn(
                    "relative w-full overflow-hidden",
                    "rounded-xl",
                    "border border-white/5",
                    "aspect-[3/1] sm:aspect-[4/1]", // Cinematic 21:9 ratio
                    "bg-black",
                )}
            >
                {/* 1. 3D Galaxy Canvas */}
                <div className="absolute inset-0 z-0">
                    <Canvas
                        camera={{ position: [0, 8, 8], fov: 40 }} // Perfect "Desktop Wallpaper" angle
                        gl={{
                            antialias: false,
                            powerPreference: "high-performance",
                            alpha: false,
                        }}
                        dpr={[1, 2]} // Crisp on mobile
                    >
                        <color attach="background" args={["#010103"]} /> {/* Almost black */}

                        <Galaxy />

                        {/* BLOOM: The secret sauce for realism */}
                        <EffectComposer enableNormalPass={false}>
                            <Bloom
                                luminanceThreshold={0.25} // Only brightest stars glow
                                mipmapBlur
                                intensity={1.5} // Epic glow
                                radius={0.5}
                            />
                        </EffectComposer>
                    </Canvas>
                </div>

                {/* 2. Cinematic Vignette (top/bottom bars feel) */}
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />

                {/* 3. Text Overlay (Minimalist & Premium) */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 sm:px-12 select-none pointer-events-none">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-2 opacity-80 mix-blend-screen">
                        <div className="w-1 h-3 bg-gradient-to-b from-cyan-300 to-blue-600 rounded-full" />
                        <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-cyan-50 uppercase">
                            Cosmos Simulation
                        </span>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col drop-shadow-2xl">
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white">
                            BİLİMİ
                        </h2>
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white/90 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white/50">
                            Tİ'YE ALIYORUZ
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <div className="mt-4 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                        <span className="text-[10px] sm:text-xs font-bold text-emerald-100 tracking-widest uppercase opacity-90">
                            Ama Ciddili Şekilde
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
