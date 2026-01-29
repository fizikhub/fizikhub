"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- PHOTO-REALISTIC GALAXY COMPONENT ---
function Galaxy({ count = 12000 }) { // Increased count for density
    const pointsRef = useRef<THREE.Points>(null!);

    // Reference Image Palette
    // Core: #FDB813 (Warm/Yellow/White)
    // Inner Arms: #C0C0C0 (Dusty White)
    // Outer Arms: #4B0082 to #00BFFF (Deep Purple to Azure)
    // HII Regions (Star Formation): #FF69B4 (Hot Pink)

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorInside = new THREE.Color('#ffeaa7'); // Warm white/yellow core
        const colorOutside = new THREE.Color('#74b9ff'); // Cool blue outer arms
        const colorHII = new THREE.Color('#ff7675'); // Pinkish star formation regions

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // --- BARRED SPIRAL ALGORITHM ---

            // We divide particles into: Core (20%), Bar (15%), Arms (65%)
            const rand = Math.random();
            let x, y, z;
            let color = new THREE.Color();

            if (rand < 0.20) {
                // --- 1. CORE / BULGE (Dense Sphere) ---
                const r = Math.pow(Math.random(), 3) * 1.5; // Dense center
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                x = r * Math.sin(phi) * Math.cos(theta);
                y = (r * Math.sin(phi) * Math.sin(theta)) * 0.6; // Flattened sphere
                z = r * Math.cos(phi) * 0.5;

                color.set('#fffce6'); // Extremely bright core
                color.lerp(new THREE.Color('#fab1a0'), Math.random() * 0.5); // Add some orange tint

            } else if (rand < 0.35) {
                // --- 2. THE BAR (Elongated Structure) ---
                // Linear distribution along X axis with some width
                const len = (Math.random() - 0.5) * 4; // Length of bar
                const width = Math.random() * 0.6; // Thickness of bar
                const height = Math.random() * 0.2; // Vertical thickness (flat)

                // Rotate bar slightly to match image aesthetics if needed, keeping it horizontal for now
                x = len;
                y = (Math.random() - 0.5) * width; // Bar width
                z = (Math.random() - 0.5) * height;

                color.set('#ffeaa7');
                color.lerp(new THREE.Color('#fdcb6e'), Math.random()); // Golden bar

            } else {
                // --- 3. SPIRAL ARMS (Starting from Bar ends) ---
                // Arms start at x = +/- 2
                const armOffset = Math.random() < 0.5 ? 0 : Math.PI; // Two arms
                const branchAngle = armOffset; // Start angle

                // Radius from center (starts at bar end ~2 units, goes out to ~7 units)
                const r = 2 + Math.pow(Math.random(), 1.5) * 5;

                // Logarithmic spiral equation adjustment
                // As r increases, angle increases. 
                const spin = 3; // How much it winds
                const spiralAngle = branchAngle + (r - 2) * 0.5 * spin;

                // Add Randomness (scatter)
                const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * r;
                const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
                const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;

                x = Math.cos(spiralAngle) * r + randomX;
                z = Math.sin(spiralAngle) * r + randomZ;
                y = randomY; // Flattened disc

                // Coloring based on distance
                // Inner arms: Dusty/White. Outer arms: Blue. Random: Pink/Red.
                color.copy(colorInside);
                color.lerp(colorOutside, (r / 7));

                // Add HII Regions (Star formation clumps in arms)
                if (Math.random() < 0.15) {
                    color.lerp(colorHII, 0.8);
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
        pointsRef.current.rotation.y -= delta * 0.03; // Rotate clockwise matches image flow usually
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                size={0.025} // Slightly larger for "photo" feel
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors={true}
                transparent={true}
                opacity={0.8}
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
                    "border border-white/10",
                    "aspect-[3/1] sm:aspect-[4/1]", // Cinematic wide
                    "bg-[#020205]",
                )}
            >
                {/* 1. 3D Galaxy Canvas */}
                {mounted && (
                    <div className="absolute inset-0 z-0 scale-110">
                        <Canvas
                            camera={{ position: [0, 8, 8], fov: 45 }} // Higher angle for "Satellite View"
                            gl={{ antialias: false, powerPreference: "high-performance" }}
                            dpr={[1, 2]}
                        >
                            <color attach="background" args={["#000000"]} />
                            <Galaxy />
                            <EffectComposer enableNormalPass={false}>
                                <Bloom
                                    luminanceThreshold={0.15} // Lower threshold to make arms glow too
                                    mipmapBlur
                                    intensity={1.2} // High intensity for photo-real exposure
                                    radius={0.4}
                                />
                            </EffectComposer>
                        </Canvas>
                    </div>
                )}

                {/* 2. Dust/Grain Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.5)_100%)]" />

                {/* 3. Minimalist UI (Bottom Left) */}
                <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-10 z-20 flex flex-col items-start select-none mix-blend-screen">
                    {/* Tiny Label */}
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-1 bg-white rounded-full" />
                        <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-white/60 uppercase">
                            NGC-7482 Simulation
                        </span>
                    </div>

                    {/* Main Text */}
                    <div className="flex flex-col">
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white drop-shadow-lg">
                            BİLİMİ Tİ'YE
                        </h2>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white drop-shadow-lg">
                            ALIYORUZ.
                        </h2>
                    </div>
                </div>

                {/* 4. Secondary UI (Top Right) - "Ama Ciddili" */}
                <div className="absolute top-4 right-6 sm:top-6 sm:right-10 z-20 select-none">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                        <span className="text-[10px] font-bold text-white/90 tracking-wide uppercase">
                            Ama Ciddili Şekilde
                        </span>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
