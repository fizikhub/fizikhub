"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- FINAL GALAXY IMPLEMENTATION (IMAGE 2 MATCH) ---
function Galaxy({ count = 20000 }) { // 20k stars for density matching photo 2
    const pointsRef = useRef<THREE.Points>(null!);

    // Exact Palette from Image 2
    // Core: Very bright White/Yellow (#FFFDE7)
    // Inner Ring: Golden/Cream (#FFE082)
    // Arms: Gradient from Cyan (#4FC3F7) to Deep Blue (#0288D1)
    // Background dust: Very subtle Indigo (#1A237E)

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorCore = new THREE.Color('#fffbe6');     // Hot White
        const colorInner = new THREE.Color('#f9ca24');    // Golden Yellow
        const colorArmStart = new THREE.Color('#48dbfb'); // Cyan
        const colorArmEnd = new THREE.Color('#0abde3');   // Blue

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Distribution: 
            // 30% Core (Dense ball)
            // 70% Spiral Arms (Classic Spiral)

            const rand = Math.random();
            let x, y, z;
            let color = new THREE.Color();

            if (rand < 0.25) {
                // --- CORE (The Bright Yellow Ball) ---
                // Gaussian distribution for density
                const r = Math.pow(Math.random(), 2) * 2;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1); // Sphere

                // Elliptical core (flattened slightly)
                x = r * Math.sin(phi) * Math.cos(theta);
                y = (r * Math.sin(phi) * Math.sin(theta)) * 0.4;
                z = r * Math.cos(phi) * 0.8;

                // Color: White in dead center, Yellow edges
                color.copy(colorCore);
                if (r > 1) color.lerp(colorInner, 0.8);

            } else {
                // --- SPIRAL ARMS (The Blue Swirls) ---
                // Logarithmic Spiral: r = a * e^(b*theta)

                const armCount = 2; // 2 Major arms typically
                const branchAngle = ((i % armCount) / armCount) * Math.PI * 2;

                // Radius: Starts further out
                const radius = 2 + Math.random() * 7;

                // Spin multiplier (tightness)
                const spinStrength = 4;
                const spinAngle = radius * spinStrength; // Tighter spiral

                // Randomness / Thickness
                const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.8 * radius;
                const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.2; // Tighter vertical
                const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.8 * radius;

                x = Math.cos(branchAngle + spinAngle) * radius + randomX;
                z = Math.sin(branchAngle + spinAngle) * radius + randomZ;
                y = randomY;

                // Color Gradient based on radius
                // Close to center -> Cyan/White. Far -> Deep Blue.
                color.copy(colorArmStart);
                color.lerp(colorArmEnd, radius / 9);

                // Occasional bright blue young star clusters
                if (Math.random() < 0.05) {
                    color.set('#dff9fb'); // White-blue bright star
                }
            }

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        // Consistent slow rotation
        pointsRef.current.rotation.y += delta * 0.04;
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors={true}
                transparent={true}
                opacity={0.9}
            />
        </points>
    );
}

// --- MAIN COMPONENT ---
export function MemeCorner() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="w-full relative group">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className={cn(
                    "relative w-full overflow-hidden",
                    "rounded-xl",
                    "border border-white/5",
                    "aspect-[3/1] sm:aspect-[4/1]", // Cinematic wide
                    "bg-[#000000]",
                )}
            >
                {/* 1. 3D Galaxy Canvas */}
                {mounted && (
                    <div className="absolute inset-0 z-0 scale-125">
                        <Canvas
                            camera={{ position: [0, 9, 7], fov: 40 }} // Tilted viewing angle matching photo 2
                            gl={{ antialias: false, powerPreference: "high-performance" }}
                            dpr={[1, 1.5]} // Performance optimization
                        >
                            <color attach="background" args={["#000000"]} />
                            <Galaxy />
                            {/* Intense Bloom for the Core */}
                            <EffectComposer enableNormalPass={false}>
                                <Bloom
                                    luminanceThreshold={0.2}
                                    mipmapBlur
                                    intensity={1.5} // High intensity for glowing core
                                    radius={0.6}
                                />
                            </EffectComposer>
                        </Canvas>
                    </div>
                )}

                {/* 2. Space Dust Overlay (Subtle) */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]" />

                {/* 3. Text Content - Keeping it clean as requested */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 sm:px-12 select-none pointer-events-none">

                    {/* FZH Originals */}
                    <div className="flex items-center gap-3 overflow-hidden mb-1">
                        <div className="h-[1px] w-6 bg-white/50" />
                        <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-white/70 uppercase">
                            FizikHub Originals
                        </span>
                    </div>

                    {/* HERO */}
                    <div className="flex flex-col">
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                            BİLİMİ
                        </h2>
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white/50 drop-shadow-md">
                            Tİ'YE ALIYORUZ
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <div className="mt-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
                        <span className="text-[10px] sm:text-xs font-bold text-blue-200 tracking-widest uppercase">
                            Ama Ciddili Şekilde
                        </span>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
