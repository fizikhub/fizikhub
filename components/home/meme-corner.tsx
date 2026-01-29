"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- TEXTURE GENERATOR ---
// Generates a soft glow texture on the fly to avoid 'square stars'
function getStarTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    // Radial gradient for soft star look
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.premultiplyAlpha = true; // Fix black artifacts
    return texture;
}

// --- REFINED GALAXY IMPLEMENTATION ---
function Galaxy({ count = 15000 }) {
    const pointsRef = useRef<THREE.Points>(null!);

    // Lazy load texture
    const texture = useMemo(() => getStarTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count); // Per-particle size randomizer

        const colorCore = new THREE.Color('#ffffff');     // Pure White Core
        const colorInner = new THREE.Color('#ffeaa7');    // Soft Warmth
        const colorArmStart = new THREE.Color('#48dbfb'); // Cyan
        const colorArmEnd = new THREE.Color('#5f27cd');   // Deep Violet/Blue (More contrast)

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const rand = Math.random();
            let x, y, z;
            let color = new THREE.Color();
            let size = 1;

            if (rand < 0.15) {
                // --- CORE (Smaller, Denser, Brighter) ---
                const r = Math.pow(Math.random(), 3) * 1.5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                x = r * Math.sin(phi) * Math.cos(theta);
                y = (r * Math.sin(phi) * Math.sin(theta)) * 0.3; // Very flat
                z = r * Math.cos(phi) * 0.6;

                color.copy(colorCore);
                if (r > 0.8) color.lerp(colorInner, 0.5);
                size = 1.5 + Math.random(); // Bigger core stars

            } else {
                // --- SPIRAL ARMS (Clean & Tighter) ---
                const armCount = 2;
                const branchAngle = ((i % armCount) / armCount) * Math.PI * 2;

                // Radius distribution: focused mid-range
                const radius = 1.5 + Math.pow(Math.random(), 0.8) * 8;

                // Spin: Tighter winding
                const spinStrength = 5;
                const spinAngle = radius * spinStrength * 0.15; // Adjusted spin calc

                // Randomness: Much lower for defined arms
                // Gaussian-like falloff for better arm definition
                const randomX = Math.pow(Math.random(), 4) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius;
                const randomZ = Math.pow(Math.random(), 4) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius;
                const randomY = Math.pow(Math.random(), 4) * (Math.random() < 0.5 ? 1 : -1) * 0.5; // Very flat disc

                x = Math.cos(branchAngle + spinAngle) * radius + randomX;
                z = Math.sin(branchAngle + spinAngle) * radius + randomZ;
                y = randomY;

                // Color Gradient
                color.copy(colorArmStart);
                color.lerp(colorArmEnd, radius / 8); // Darker blue at edges

                // Size variation
                size = 0.5 + Math.random() * 0.8;
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
        // geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); // Used if shader, here standard materal uses uniform size mostly or sizeAtt gives effect.
        // We stick to standard PointMaterial for simplicity and use randomness in loop 
        return geo;
    }, [count]);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        pointsRef.current.rotation.y += delta * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture} // Soft star texture!
                size={0.15}   // Visually larger due to transparency, but softer
                sizeAttenuation={true}
                depthWrite={false}
                vertexColors={true}
                transparent={true}
                opacity={0.8}
                alphaMap={texture} // Ensure transparency shape
                alphaTest={0.01}
            />
        </points>
    );
}

// --- MAIN COMPONENT ---
export function MemeCorner() {
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
                    "aspect-[3/1] sm:aspect-[4/1]",
                    "bg-black",
                )}
            >
                {/* 1. 3D Galaxy Canvas */}
                <div className="absolute inset-0 z-0 scale-110">
                    <Canvas
                        camera={{ position: [0, 8, 8], fov: 35 }}
                        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
                        dpr={[1, 2]}
                    >
                        <color attach="background" args={["#000000"]} />
                        <Galaxy />
                        <EffectComposer enableNormalPass={false}>
                            <Bloom
                                luminanceThreshold={0.3} // Higher threshold = less blowout
                                mipmapBlur
                                intensity={1.2}
                                radius={0.5}
                            />
                        </EffectComposer>
                    </Canvas>
                </div>

                {/* 2. Overlays */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

                {/* 3. Text Content */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 sm:px-12 select-none pointer-events-none">
                    <div className="flex items-center gap-2 mb-1 opacity-60">
                        <div className="h-[1px] w-4 bg-white" />
                        <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-white uppercase">
                            FizikHub Originals
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
                            BİLİMİ
                        </h2>
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-white/60">
                            Tİ'YE ALIYORUZ
                        </h2>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />
                        <span className="text-[10px] sm:text-xs font-bold text-cyan-200 tracking-widest uppercase opacity-80">
                            Ama Ciddili Şekilde
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
