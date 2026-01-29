"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- TEXTURES ---

// 1. STAR TEXTURE: Hard center for visibility
function getStarTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const center = 16;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 15);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.15, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}

// 2. NEBULA TEXTURE: Pure soft cloud
function getNebulaTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const center = 32;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 32);
    // Soft puffy cloud
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}

// --- STAR FIELD ---
function StarField({ count = 40000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const c_Core = new THREE.Color('#fffae0');    // Warm White
        const c_Inner = new THREE.Color('#bae6ff');   // Pale Blue
        const c_Outer = new THREE.Color('#3388ff');   // Deep Blue

        const arms = 2;
        const spin = 3.5;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const rRandom = Math.pow(Math.random(), 1.5);
            const radius = 0.5 + rRandom * 8;

            const branchAngle = ((i % arms) / arms) * Math.PI * 2;
            const spinAngle = radius * 0.6 * spin;

            const scatterBase = 0.2 + (radius * 0.08);
            const randomX = (Math.random() - 0.5) * scatterBase * 2;
            const randomY = (Math.random() - 0.5) * (0.2 + radius * 0.05);
            const randomZ = (Math.random() - 0.5) * scatterBase * 2;

            const finalAngle = branchAngle + spinAngle;
            const x = Math.cos(finalAngle) * radius + randomX;
            const z = Math.sin(finalAngle) * radius + randomZ;

            positions[i3] = x;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = z;

            const color = new THREE.Color();
            if (radius < 2.5) {
                color.copy(c_Core);
            } else {
                color.copy(c_Inner).lerp(c_Outer, (radius - 2.5) / 6);
                // Random bright blue stars
                if (Math.random() > 0.9) color.set('#ffffff');
            }

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
        if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={0.25}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={0.9}
            />
        </points>
    );
}

// --- VOLUMETRIC NEBULA (MAX VISIBILITY) ---
function NebulaClouds({ count = 8000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getNebulaTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const c_Pink = new THREE.Color('#ff0066');
        const c_Purple = new THREE.Color('#5500aa');
        const c_Blue = new THREE.Color('#0044ff');

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const radius = 2 + Math.random() * 7; // Only in arms
            const angle = Math.random() * Math.PI * 2;

            // Random scatter but following general galaxy shape loosely
            // More vertical scatter for volume
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 1.5;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            // Nebula Colors
            const color = new THREE.Color();
            const mix = Math.random();
            if (mix < 0.33) color.copy(c_Pink);
            else if (mix < 0.66) color.copy(c_Purple);
            else color.copy(c_Blue);

            // Darken them for that 'dust' look
            color.multiplyScalar(0.8);

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
        // Slightly slower rotation for parallax
        if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.03;
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={3.0} // HUUUGE clouds
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={0.5} // High visibility
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
                    "aspect-[3/1] sm:aspect-[4/1]",
                    "bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-[#2e1065] via-[#0f0518] to-black",
                )}
            >
                {/* 1. 3D Galaxy Canvas */}
                <div className="absolute inset-0 z-0">
                    <Canvas
                        camera={{ position: [0, 5, 7], fov: 50 }}
                        gl={{
                            antialias: false,
                            powerPreference: "high-performance",
                            alpha: true // CRITICAL: Allows CSS background to show through!
                        }}
                        dpr={[1, 2]}
                    >
                        {/* No background color here - letting CSS handle it */}

                        <group>
                            <StarField />
                            <NebulaClouds />
                        </group>

                        {/* Bloom */}
                        <EffectComposer enableNormalPass={false}>
                            <Bloom
                                luminanceThreshold={0.2}
                                mipmapBlur
                                intensity={1.1} // Balanced intensity
                                radius={0.5}
                            />
                        </EffectComposer>
                    </Canvas>
                </div>

                {/* 2. Vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

                {/* 3. Text Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 sm:px-12 select-none pointer-events-none">
                    <div className="flex items-center gap-2 mb-2 opacity-80 mix-blend-screen">
                        <div className="w-0.5 h-4 bg-gradient-to-b from-white to-transparent" />
                        <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-white/70 uppercase">
                            Cosmos Simulation
                        </span>
                    </div>

                    <div className="flex flex-col drop-shadow-2xl">
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white">
                            BİLİMİ
                        </h2>
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200">
                            Tİ'YE ALIYORUZ
                        </h2>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <span className="text-[10px] sm:text-xs font-bold text-blue-100 tracking-widest uppercase opacity-80">
                            Ama Ciddili Şekilde
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
