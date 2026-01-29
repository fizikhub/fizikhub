"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- GALAXY COMPONENT ---
function Galaxy({ count = 8000 }) { // 8k stars for mobile safety
    const pointsRef = useRef<THREE.Points>(null!);

    // Galaxy Parameters
    const parameters = {
        count: count,
        size: 0.015,
        radius: 5,
        branches: 3,
        spin: 1,
        randomness: 0.2, // Reduced randomness for tighter arms
        randomnessPower: 3,
        insideColor: '#ff6030',
        outsideColor: '#1b3984',
    };

    const geometry = useMemo(() => {
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);

        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;

            // Position
            const radius = Math.random() * parameters.radius;
            const spinAngle = radius * parameters.spin;
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY * 0.5; // Flatten the galaxy on Y axis
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            // Color
            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / parameters.radius);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [parameters.count]);

    // Animation
    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        pointsRef.current.rotation.y += delta * 0.05; // Slow rotation
        pointsRef.current.rotation.z += delta * 0.005; // Subtle tilt drift
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                size={parameters.size}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors={true}
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
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "relative w-full overflow-hidden",
                    "rounded-xl",
                    "border border-white/5",
                    "aspect-[3/1] sm:aspect-[4/1]", // Ultra-widescreen cinematic ratio
                    "bg-[#020205]", // Deep black fallback
                )}
            >
                {/* 1. 3D Galaxy Canvas */}
                {mounted && (
                    <div className="absolute inset-0 z-0">
                        <Canvas
                            camera={{ position: [0, 3, 5], fov: 50 }}
                            gl={{ antialias: false, powerPreference: "high-performance" }} // Perf opts
                            dpr={[1, 2]} // Clamp pixel ratio
                        >
                            <color attach="background" args={["#020205"]} />
                            <Galaxy />
                            <EffectComposer disableNormalPass>
                                <Bloom
                                    luminanceThreshold={0.2}
                                    mipmapBlur
                                    intensity={0.8}
                                    radius={0.5}
                                />
                            </EffectComposer>
                        </Canvas>
                    </div>
                )}

                {/* 2. Cinematic Vignette & Grain */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />


                {/* 3. UI Content (Overlay) */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 select-none">

                    {/* Upper Tagline */}
                    <div className="flex items-center gap-3 overflow-hidden mb-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 32 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="h-[1px] bg-white/40"
                        />
                        <motion.span
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 0.8 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-white uppercase"
                        >
                            FizikHub Originals
                        </motion.span>
                    </div>

                    {/* HERO TEXT */}
                    <div className="flex flex-col leading-[0.85]">
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            BİLİMİ
                        </h2>
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white mix-blend-overlay">
                            Tİ'YE ALIYORUZ
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <div className="mt-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                        <span className="text-[10px] sm:text-xs font-medium text-emerald-300 tracking-widest uppercase">
                            Ama Ciddili Şekilde
                        </span>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
