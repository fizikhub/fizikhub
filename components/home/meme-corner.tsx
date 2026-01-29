"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- BALANCED TEXTURE ---
// Key innovation: A texture with a SOLID center for visibility, 
// but soft edges for realism. 
function getRealisticStarTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const center = 16;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 15);

    // Tiny solid core (provides the "pinpoint" light)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.15, 'rgba(255, 255, 255, 1)');
    // Quick falloff to soft glow
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}

// --- REALISTIC GALAXY SIMULATION ---
function Galaxy({ count = 40000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getRealisticStarTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        // Palette
        const c_Core = new THREE.Color('#fffae0');    // Warm White
        const c_Inner = new THREE.Color('#bae6ff');   // Pale Blue
        const c_Outer = new THREE.Color('#3388ff');   // Deep Blue
        const c_Nebula = new THREE.Color('#d42c7d');  // Magenta
        const c_Dust = new THREE.Color('#5e2c7d');    // Deep Purple

        const arms = 2;
        const spin = 3.5;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Distribution: More weight to center
            const rRandom = Math.pow(Math.random(), 1.5);
            const radius = 0.5 + rRandom * 8; // 0.5 to 8.5

            const branchAngle = ((i % arms) / arms) * Math.PI * 2;
            const spinAngle = radius * 0.6 * spin;

            // Varied Scatter: Tighter at core, looser at arm ends
            const scatterBase = 0.2 + (radius * 0.08);
            const randomX = (Math.random() - 0.5) * scatterBase * 2;
            const randomY = (Math.random() - 0.5) * (0.2 + radius * 0.05); // Flat disc
            const randomZ = (Math.random() - 0.5) * scatterBase * 2;

            const finalAngle = branchAngle + spinAngle;

            const x = Math.cos(finalAngle) * radius + randomX;
            const z = Math.sin(finalAngle) * radius + randomZ;
            const y = randomY;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            // --- COLOR & SIZE LOGIC ---
            const color = new THREE.Color();
            let size = 0.15; // Base Size

            if (radius < 2.5) {
                // CORE AREA
                color.copy(c_Core);
                // Core is dense, needs smaller particles to avoid "blob"
                size = 0.2 + Math.random() * 0.2;
            } else {
                // ARMS AREA
                color.copy(c_Inner).lerp(c_Outer, (radius - 2.5) / 6);

                // Nebula Patches
                const noise = Math.random();
                if (noise > 0.92) {
                    color.lerp(c_Nebula, 0.8);
                    size = 0.4; // Nebulas are larger
                } else if (noise > 0.85) {
                    color.set('#ffffff'); // Bright young stars
                    size = 0.35;
                } else if (noise < 0.1) {
                    color.lerp(c_Dust, 0.8);
                    size = 0.12; // Dust is fine
                }
            }

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            sizes[i] = size;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        // We use size attenuation, so we pass explicit sizes to a custom shader OR 
        // to a standard material if we don't need per-pixel control. 
        // Mobile compat: Standard material implies uniform size usually, 
        // BUT we can use vertex colors for variety. 
        // To get varyings sizes with PointsMaterial, we'd need to modify the shader or use simple random artifacts.
        // Actually, let's stick to standard PointsMaterial for safety and use opacity for "size perception".
        return geo;
    }, [count]);

    // Animate
    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={0.25} // A good middle ground (was 0.12, then 0.7)
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
                {/* 1. 3D Galaxy Canvas */}
                <div className="absolute inset-0 z-0">
                    <Canvas
                        camera={{ position: [0, 5, 7], fov: 50 }} // Cinematic angle
                        gl={{
                            antialias: false,
                            powerPreference: "high-performance",
                            alpha: false
                        }}
                        dpr={[1, 2]}
                    >
                        <color attach="background" args={["#000000"]} />
                        <Galaxy />

                        {/* 2. Tuned Bloom */}
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

                {/* 3. Vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

                {/* 4. Text Overlay */}
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
