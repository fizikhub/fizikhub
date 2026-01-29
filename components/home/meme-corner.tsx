"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- TEXTURE ---
// Robust soft glow for stars
const STAR_TEXTURE_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACvElEQVR4nO2Wy24TQRCG/6537NiO7yQOISSEiBBIvAB1b70Cl+E1eA0uEw9A4gEIV4SEkDi243g3jh/z1U55s7vj2Injzq52pZVWU/Vf/1Vd1T0z+F/L+K/L+K/L+M8X31/9svqz+tXq16qD1YtVq/qj6rerfS+O4y4A1+sN/tTr9R0ANwC4g8GgC8Du9XpdAPb16k+rP606q66s3q/eX/1t1Vv9fl/d3t7+bYAwDM1gMDCj0ciMxyMznU7MdDox0+nUTKdTMxqNzGAwMMPh0MzNzV2v1+s3AHh6ejrz+XzH5/Md3+fzHb/f7/h8vuPz+Y4fDodmZ2fn2nQ6/Q7A7e1tM5lM7HA4tO12a9vttm2327bdbtt2u7XtdmuHw8FsbW2Zg4ODq/V6/RaATqdjZrMZOxwObbvd2u12a7fbrd1ut3a73drtdmu3263tdju7vb01BwcHV6r1ev0SgM7Ojjk8PLTtduuw263DbrcOu9067HbrsNutw263Dtvt1g6HQzMyMnKlXq//DEA3Nzd2fHxs2+32Ybfbh93uHna7fdjt9mG324fd7h52u3vY7e5hu93a8fGxGR8fv1Sv138EoF6vm/Pzc9tutw+73T/sdv+w2/3DbvcPu90/7Hb/sNv9w273D9vtnR0fH5uJiYlLAPx+v5mamtr1+XyH7/f7Dt/v9x2+3+87fL/fd/h+v+/w/X7f8bu7uzM1NXXJ5/Mdv9/vO3y/33f4fr/v8P1+3+H7/b7D9/t9x+/3+44/NTV1yefzHb/f7zt8v993+H6/7/D9ft/h+/2+w/f7fcfv7u7O1NTUJQD6/b6Zmpp6sHq16pPVq1WfrF6t+mT1atUnq1erPlm9WvXJ6tWqT/F4/Lder/80gMHBwR/Vb1e/W/129dtVq/q96verfS+O4y4A/X7/DoA7ANwB4A4Ggy4A+z8B2F39afWnVWfVldX71furv616+88B/gI2Qy6hS3w3EwAAAABJRU5ErkJggg==";

// --- GALAXY COMPONENT ---
function Galaxy() {
    // 1. STARS (Crisp points)
    const starsRef = useRef<THREE.Points>(null!);
    // 2. NEBULA (Soft clouds)
    const nebulaRef = useRef<THREE.Points>(null!);

    const texture = useMemo(() => new THREE.TextureLoader().load(STAR_TEXTURE_URL), []);

    // --- STARS DATA ---
    const starsData = useMemo(() => {
        const count = 15000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorCore = new THREE.Color('#fff0a6'); // Warm Core
        const colorInner = new THREE.Color('#ffddc9'); // Soft Inner
        const colorOuter = new THREE.Color('#94c5f0'); // Blue Outer

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const radius = Math.random() * 8;
            const spinAngle = radius * 0.8;
            const branchAngle = ((i % 3) * 2 * Math.PI) / 3;

            // Random scatter
            const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (radius * 0.5);
            const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (radius * 0.1);
            const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (radius * 0.5);

            const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
            const y = randomY;
            const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            positions[i3] = x;
            positions[i3 + 1] = y * 0.5; // Flatten
            positions[i3 + 2] = z;

            // Color grad
            const mixedColor = colorCore.clone();
            mixedColor.lerp(colorOuter, radius / 8);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }
        return { positions, colors };
    }, []);

    // --- NEBULA DATA ---
    const nebulaData = useMemo(() => {
        const count = 4000; // Fewer but bigger
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorPurple = new THREE.Color('#a400b8');
        const colorPink = new THREE.Color('#ff006e');
        const colorBlue = new THREE.Color('#00ccff');

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Larger spread for nebulas
            const radius = 2 + Math.random() * 7;
            const spinAngle = radius * 0.8;
            const branchAngle = ((i % 3) * 2 * Math.PI) / 3;

            const randomX = (Math.random() - 0.5) * 1.5;
            const randomY = (Math.random() - 0.5) * 0.6;
            const randomZ = (Math.random() - 0.5) * 1.5;

            const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
            const y = randomY;
            const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            // Nebula colors
            const c = new THREE.Color();
            if (Math.random() > 0.6) c.copy(colorPurple);
            else if (Math.random() > 0.3) c.copy(colorPink);
            else c.copy(colorBlue);

            colors[i3] = c.r;
            colors[i3 + 1] = c.g;
            colors[i3 + 2] = c.b;
        }
        return { positions, colors };
    }, []);

    useFrame((state, delta) => {
        if (starsRef.current) starsRef.current.rotation.y += delta * 0.04;
        if (nebulaRef.current) nebulaRef.current.rotation.y += delta * 0.03; // Parallax effect
    });

    return (
        <group>
            {/* STARS */}
            <points ref={starsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={starsData.positions.length / 3}
                        array={starsData.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={starsData.colors.length / 3}
                        array={starsData.colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    map={texture}
                    vertexColors
                    transparent
                    opacity={0.9}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* NEBULA CLOUDS */}
            <points ref={nebulaRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={nebulaData.positions.length / 3}
                        array={nebulaData.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={nebulaData.colors.length / 3}
                        array={nebulaData.colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.35} // Big soft particles
                    map={texture}
                    vertexColors
                    transparent
                    opacity={0.25} // Faint clouds
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
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
                    "aspect-[3/1] sm:aspect-[4/1]", // Cinematic wide
                    "bg-black",
                )}
            >
                {/* 1. 3D Galaxy Canvas */}
                <div className="absolute inset-0 z-0">
                    <Canvas
                        camera={{ position: [0, 8, 6], fov: 45 }}
                        gl={{
                            antialias: false,
                            powerPreference: "high-performance",
                            alpha: false,
                        }}
                        dpr={[1, 2]}
                    >
                        <color attach="background" args={["#000000"]} />
                        <Galaxy />

                        {/* Bloom is BACK for that glowing look */}
                        <EffectComposer enableNormalPass={false}>
                            <Bloom
                                luminanceThreshold={0.2}
                                mipmapBlur
                                intensity={1.2}
                                radius={0.5}
                            />
                        </EffectComposer>
                    </Canvas>
                </div>

                {/* 2. Text Content */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 select-none pointer-events-none">
                    <div className="flex items-center gap-2 mb-1 opacity-80 mix-blend-screen">
                        <div className="h-[1px] w-6 bg-white" />
                        <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-cyan-100 uppercase">
                            FizikHub Originals
                        </span>
                    </div>

                    <div className="flex flex-col mix-blend-screen">
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                            BİLİMİ
                        </h2>
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white/90 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                            Tİ'YE ALIYORUZ
                        </h2>
                    </div>

                    <div className="mt-3 flex items-center gap-2 mix-blend-screen">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_cyan] animate-pulse" />
                        <span className="text-[10px] sm:text-xs font-bold text-cyan-200 tracking-widest uppercase">
                            Ama Ciddili Şekilde
                        </span>
                    </div>
                </div>

                {/* Star Vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

            </motion.div>
        </div>
    );
}
