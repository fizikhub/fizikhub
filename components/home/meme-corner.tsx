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

// --- GALAXY DUST ( The Haze ) ---
function GalaxyDust({ count = 30000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []); // Use same texture, just smaller

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const c_Inner = new THREE.Color('#66aaff'); // Dusty Blue
        const c_Outer = new THREE.Color('#3355aa'); // Deep Dust

        const arms = 2;
        const spin = 3.5;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Dust is mostly in the arms
            const rRandom = Math.pow(Math.random(), 1.5);
            const radius = 1.0 + rRandom * 10;

            const branchAngle = ((i % arms) / arms) * Math.PI * 2;
            const spinAngle = radius * 0.6 * spin;

            // More scatter for dust = "Cloud/Haze" effect
            const scatterBase = 0.4 + (radius * 0.15);
            const randomX = (Math.random() - 0.5) * scatterBase * 2;
            const randomY = (Math.random() - 0.5) * (0.1 + radius * 0.02); // Flat
            const randomZ = (Math.random() - 0.5) * scatterBase * 2;

            const finalAngle = branchAngle + spinAngle;
            const x = Math.cos(finalAngle) * radius + randomX;
            const z = Math.sin(finalAngle) * radius + randomZ;

            positions[i3] = x;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = z;

            const color = new THREE.Color();
            color.copy(c_Inner).lerp(c_Outer, radius / 10);
            color.multiplyScalar(0.6); // Dimmer than stars

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
                size={0.12} // Very small points
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={0.5}
            />
        </points>
    );
}

// --- MAIN STARS ( Bright & Distinct ) ---
function MainStars({ count = 10000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const c_Core = new THREE.Color('#fff5c2');    // Golden Core
        const c_Inner = new THREE.Color('#d4f1ff');   // White-Blue
        const c_Outer = new THREE.Color('#5599ff');   // Electric Blue

        const arms = 2;
        const spin = 3.5;
        const bulgeCount = 4000;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const color = new THREE.Color();

            if (i < bulgeCount) {
                // Bulge
                const r = Math.pow(Math.random(), 3) * 3.0;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = (r * Math.sin(phi) * Math.sin(theta)) * 0.7;
                const z = r * Math.cos(phi);

                positions[i3] = x;
                positions[i3 + 1] = y;
                positions[i3 + 2] = z;

                color.copy(c_Core);
                // Core brilliance
                if (Math.random() > 0.7) color.multiplyScalar(1.5);

            } else {
                // Arms
                const rRandom = Math.pow(Math.random(), 1.5);
                const radius = 2.5 + rRandom * 8;

                const branchAngle = ((i % arms) / arms) * Math.PI * 2;
                const spinAngle = radius * 0.6 * spin;

                // Tighter scatter for main stars = "Structure"
                const scatterBase = 0.15 + (radius * 0.05);
                const randomX = (Math.random() - 0.5) * scatterBase * 2;
                const randomY = (Math.random() - 0.5) * (0.2 + radius * 0.05);
                const randomZ = (Math.random() - 0.5) * scatterBase * 2;

                const finalAngle = branchAngle + spinAngle;
                const x = Math.cos(finalAngle) * radius + randomX;
                const z = Math.sin(finalAngle) * radius + randomZ;

                positions[i3] = x;
                positions[i3 + 1] = randomY;
                positions[i3 + 2] = z;

                color.copy(c_Inner).lerp(c_Outer, (radius - 2.5) / 6);

                // Occasional Red Giants / Bright Stars
                const rand = Math.random();
                if (rand > 0.95) color.set('#ffffff').multiplyScalar(2.0); // Super bright
                else if (rand > 0.90) color.set('#ffccaa'); // Red/Orange giant
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
                size={0.3} // Larger, distinct stars
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={1.0}
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

        // Deep Navy & Purple Theme
        const c_Pink = new THREE.Color('#aa00ff');   // Violet highlights
        const c_Purple = new THREE.Color('#4400ff'); // Deep Indigo
        const c_Blue = new THREE.Color('#001155');   // Very Dark Navy

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const radius = 1 + Math.random() * 10;
            const angle = Math.random() * Math.PI * 2;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 3.0; // Volume

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            const color = new THREE.Color();
            const mix = Math.random();
            if (mix < 0.33) color.copy(c_Pink);
            else if (mix < 0.66) color.copy(c_Purple);
            else color.copy(c_Blue);

            // Boost brightness
            color.multiplyScalar(1.2);

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
        if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.02;
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={3.0} // Large volumetric look
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={0.5}
            />
        </points>
    );
}

// --- DISTANT BACKGROUND STARS ---
function BackgroundStars({ count = 2000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const c_White = new THREE.Color('#ffffff');
        const c_Blue = new THREE.Color('#aaaaff');

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Distant Sphere
            const r = 20 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            const color = new THREE.Color();
            color.copy(Math.random() > 0.5 ? c_White : c_Blue);

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
        if (pointsRef.current) pointsRef.current.rotation.y -= delta * 0.005; // Very slow counter-rotation
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={0.15} // Tiny distant dots
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={0.6} // Faint
            />
        </points>
    );
}

// --- MAIN COMPONENT ---
export function MemeCorner() {
    return (
        <div className="w-full relative group">
            {/* GLOBAL STYLES for animations */}
            <style jsx global>{`
                @keyframes gradient-flow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%) rotate(25deg); }
                    100% { transform: translateX(200%) rotate(25deg); }
                }
                @keyframes badge-wiggle {
                    0%, 100% { transform: rotate(-3deg); }
                    50% { transform: rotate(1deg); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.7; }
                }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                className={cn(
                    "relative w-full overflow-hidden cursor-pointer",
                    // NEO-BRUTALIST TOKENS
                    "rounded-[8px]",
                    "border-[3px] border-black",
                    "shadow-[4px_4px_0px_0px_#000]",
                    "transition-shadow duration-200 hover:shadow-[6px_6px_0px_0px_#000]",
                    // Size & Background
                    "h-[180px] sm:h-[240px]",
                    "bg-[radial-gradient(120%_120%_at_50%_50%,_#2a0a45_0%,_#050514_50%,_#000000_100%)]",
                )}
            >
                {/* HUD CORNERS - Enhanced with Glow */}
                <svg className="absolute top-2 right-2 w-6 h-6 text-cyan-400/40 z-20 animate-[pulse-glow_3s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 9V1H15" />
                </svg>
                <svg className="absolute bottom-2 left-2 w-6 h-6 text-cyan-400/40 z-20 animate-[pulse-glow_3s_ease-in-out_infinite_0.5s]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 15V23H9" />
                </svg>
                <svg className="absolute bottom-2 right-2 w-6 h-6 text-purple-400/30 z-20 animate-[pulse-glow_3s_ease-in-out_infinite_1s]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 15V23H15" />
                </svg>

                {/* SCANLINES - Retro Effect */}
                <div
                    className="absolute inset-0 z-[2] pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`
                    }}
                />

                {/* SHIMMER EFFECT */}
                <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
                    <div
                        className="absolute inset-0 w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_4s_ease-in-out_infinite]"
                        style={{ top: '-50%' }}
                    />
                </div>

                {/* VISUAL NOISE */}
                <div
                    className="absolute inset-0 z-[1] opacity-20 pointer-events-none mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                />

                {/* 3D Canvas */}
                <div className="absolute inset-0 z-0">
                    <Canvas
                        camera={{ position: [0, 5, 7], fov: 50 }}
                        gl={{
                            antialias: false,
                            powerPreference: "high-performance",
                            alpha: true
                        }}
                        dpr={[1, 2]}
                    >
                        <group>
                            <BackgroundStars />
                            <GalaxyDust />
                            <MainStars />
                            <NebulaClouds />
                        </group>

                        <EffectComposer enableNormalPass={false}>
                            <Bloom
                                luminanceThreshold={0.2}
                                mipmapBlur
                                intensity={1.1}
                                radius={0.5}
                            />
                        </EffectComposer>
                    </Canvas>
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

                {/* TEXT OVERLAY */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none pointer-events-none p-4 pb-8 sm:pb-12">

                    {/* Main Title */}
                    <div className="flex flex-col items-center justify-center">
                        {/* Top: Spaced Out */}
                        <h2 className="font-[family-name:var(--font-outfit)] text-sm sm:text-lg font-bold tracking-[0.6em] text-blue-200/80 uppercase mb-1 sm:mb-2 ml-1 drop-shadow-lg">
                            BİLİMİ
                        </h2>

                        {/* Bottom: Animated Gradient Text */}
                        <h2
                            className="font-[family-name:var(--font-outfit)] text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] pt-2 pb-2 pl-2 pr-2"
                            style={{
                                background: 'linear-gradient(90deg, #fff, #93c5fd, #c084fc, #fff)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'gradient-flow 4s ease infinite',
                                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                            }}
                        >
                            Tİ'YE ALIYORUZ
                        </h2>

                        {/* BADGE - Mood below text */}
                        <motion.div
                            className="mt-2 sm:mt-3 transform origin-center"
                            animate={{ rotate: [-2, 2, -2] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="inline-block bg-[#FFC800] border-[2px] border-black text-black px-3 py-1 sm:px-4 sm:py-1.5 font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:scale-110 transition-transform">
                                AMA CİDDİLİ ŞEKİLDE
                            </span>
                        </motion.div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
