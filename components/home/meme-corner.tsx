"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- SIMPLE & ROBUST GALAXY ---
function Galaxy({ count = 8000 }) {
    const pointsRef = useRef<THREE.Points>(null!);

    // Generate simple texture on the fly (most robust method)
    const texture = useMemo(() => {
        if (typeof document === 'undefined') return new THREE.Texture();
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
            g.addColorStop(0, 'rgba(255,255,255,1)');
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 32, 32);
        }
        const t = new THREE.CanvasTexture(canvas);
        t.premultiplyAlpha = true;
        return t;
    }, []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const coreColor = new THREE.Color(0xffffaa);
        const armColor = new THREE.Color(0x00ffff);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Classic spiral math
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 8; // Spread out
            const spiralAngle = angle + radius * 0.5;

            // 3 arms
            const armOffset = ((i % 3) / 3) * Math.PI * 2;

            const x = Math.cos(spiralAngle + armOffset) * radius;
            const z = Math.sin(spiralAngle + armOffset) * radius;
            // Flat disc with slight variation
            const y = (Math.random() - 0.5) * 0.5;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            // Colors
            const color = new THREE.Color().copy(coreColor).lerp(armColor, radius / 8);
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
            pointsRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                size={0.15}
                map={texture}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export function MemeCorner() {
    return (
        <div className="w-full relative group">
            <div className={cn(
                "relative w-full overflow-hidden",
                "rounded-xl border border-white/5",
                "aspect-[3/1] sm:aspect-[4/1]",
                "bg-black"
            )}>
                <div className="absolute inset-0 z-0">
                    <Canvas
                        camera={{ position: [0, 10, 0], fov: 45 }} // Top down view to guarantee visibility
                        dpr={[1, 1.5]}
                    >
                        <color attach="background" args={["#000000"]} />
                        <Galaxy />
                        {/* No PostProcessing for safety first */}
                    </Canvas>
                </div>

                {/* Text - Keep simple */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 pointer-events-none">
                    <h2 className="text-4xl font-bold text-white">BİLİMİ Tİ'YE ALIYORUZ</h2>
                    <p className="text-cyan-400 text-sm mt-2">AMA CİDDİLİ ŞEKİLDE</p>
                </div>
            </div>
        </div>
    );
}
