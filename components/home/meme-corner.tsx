"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- HYPER-VISIBLE TEXTURE ---
// A brighter, more solid star texture ensuring visibility even when small
function getBrightStarTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 64; // Higher res for crispness
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const center = 32;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 32);

    // Core is solid white for visibility
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    // Mid is still very bright
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    // Falloff
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}

// --- GALAXY COMPONENT ---
function Galaxy({ count = 20000 }) { // 20k large particles > 60k invisible ones
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getBrightStarTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const c_Core = new THREE.Color('#ffffff');     // Pure White Core
        const c_Inner = new THREE.Color('#fffdb3');    // Light Yellow
        const c_Arm = new THREE.Color('#68ccfd');      // Bright Cyan
        const c_Outer = new THREE.Color('#2e86de');    // Strong Blue

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const angle = Math.random() * Math.PI * 2;

            // Core Heavy Distribution (30% core)
            const isCore = Math.random() < 0.3;

            let x, y, z;
            let color = new THREE.Color();

            if (isCore) {
                // DENSE BRIGHT CORE
                const r = Math.pow(Math.random(), 3) * 2;
                // Flattened sphere
                x = r * Math.cos(angle);
                z = r * Math.sin(angle);
                y = (Math.random() - 0.5) * (2 - r) * 0.5;

                color.copy(c_Core).lerp(c_Inner, r / 2);
            } else {
                // THICK VISIBLE ARMS
                // 3 Arms for fullness
                const armIndex = i % 3;
                const armAngle = (armIndex / 3) * Math.PI * 2;

                const r = 2 + Math.random() * 7; // Radius 2 -> 9
                // Tighter spiral for better shape on mobile
                const spiral = armAngle + (r * 0.5);

                // Random scatter (Thicker arms)
                const randomX = (Math.random() - 0.5) * (0.5 + r * 0.1);
                const randomZ = (Math.random() - 0.5) * (0.5 + r * 0.1);

                x = Math.cos(spiral) * r + randomX;
                z = Math.sin(spiral) * r + randomZ;
                y = (Math.random() - 0.5) * 0.8; // Flat disk

                color.copy(c_Arm).lerp(c_Outer, (r - 2) / 7);

                // Nebulae pops (Magenta)
                if (Math.random() < 0.1) {
                    color.set('#ff00aa');
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
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.1; // Söower, majestic
        }
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={0.7} // HUGE SIZE for visibility
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={1.0} // MAX OPACITY
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
                    "aspect-[3/1] sm:aspect-[4/1]",
                    "bg-black",
                )}
            >
                <div className="absolute inset-0 z-0">
                    <Canvas
                        camera={{ position: [0, 9, 0], fov: 50 }} // TOP DOWN VIEW - BEST FOR MOBILE SHAPE RECOGNITION
                        gl={{
                            antialias: false,
                            powerPreference: "high-performance",
                            alpha: false
                        }}
                        dpr={[1, 2]}
                    >
                        <color attach="background" args={["#000000"]} />

                        <Galaxy />

                        {/* HIGH INTENSITY BLOOM */}
                        <EffectComposer enableNormalPass={false}>
                            <Bloom
                                luminanceThreshold={0.1} // Everything glows a bit
                                mipmapBlur
                                intensity={1.5}
                                radius={0.6}
                            />
                        </EffectComposer>
                    </Canvas>
                </div>

                {/* Text Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 sm:px-12 select-none pointer-events-none">
                    <div className="flex items-center gap-2 mb-2 opacity-80 mix-blend-screen">
                        <div className="w-1 h-3 bg-cyan-400 rounded-full box-shadow-[0_0_10px_cyan]" />
                        <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-cyan-50 uppercase">
                            Cosmos Simulation
                        </span>
                    </div>

                    <div className="flex flex-col drop-shadow-2xl">
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white">
                            BİLİMİ
                        </h2>
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">
                            Tİ'YE ALIYORUZ
                        </h2>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <span className="text-[10px] sm:text-xs font-bold text-cyan-200 tracking-widest uppercase opacity-90">
                            Ama Ciddili Şekilde
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
