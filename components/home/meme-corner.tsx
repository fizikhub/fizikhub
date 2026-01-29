"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- ROBUST TEXTURE (Base64) ---
// Simple soft glow transparent PNG (32x32) to avoid canvas generation issues on some mobiles
const STAR_TEXTURE_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACvElEQVR4nO2Wy24TQRCG/6537NiO7yQOISSEiBBIvAB1b70Cl+E1eA0uEw9A4gEIV4SEkDi243g3jh/z1U55s7vj2Injzq52pZVWU/Vf/1Vd1T0z+F/L+K/L+K/L+K/L+M8X31/9svqz+tXq16qD1YtVq/qj6rerfS+O4y4A1+sN/tTr9R0ANwC4g8GgC8Du9XpdAPb16k+rP606q66s3q/eX/1t1Vv9fl/d3t7+bYAwDM1gMDCj0ciMxyMznU7MdDox0+nUTKdTMxqNzGAwMMPh0MzNzV2v1+s3AHh6ejrz+XzH5/Md3+fzHb/f7/h8vuPz+Y4fDodmZ2fn2nQ6/Q7A7e1tM5lM7HA4tO12a9vttm2327bdbtt2u7XtdmuHw8FsbW2Zg4ODq/V6/RaATqdjZrMZOxwObbvd2u12a7fbrd1ut3a73drtdmu3263tdju7vb01BwcHV6r1ev0SgM7Ojjk8PLTtduuw263DbrcOu9067HbrsNutw263Dtvt1g6HQzMyMnKlXq//DEA3Nzd2fHxs2+32Ybfbh93uHna7fdjt9mG324fd7h52u3vY7e5hu93a8fGxGR8fv1Sv138EoF6vm/Pzc9tutw+73T/sdv+w2/3DbvcPu90/7Hb/sNv9w273D9vtnR0fH5uJiYlLAPx+v5mamtr1+XyH7/f7Dt/v9x2+3+87fL/fd/h+v+/w/X7f8bu7uzM1NXXJ5/Mdv9/vO3y/33f4fr/v8P1+3+H7/b7D9/t9x+/3+44/NTV1yefzHb/f7zt8v993+H6/7/D9ft/h+/2+w/f7fcfv7u7O1NTUJQD6/b6Zmpp6sHq16pPVq1WfrF6t+mT1atUnq1erPlm9WvXJ6tWqT/F4/Lder/80gMHBwR/Vb1e/W/129dtVq/q96verfS+O4y4A/X7/DoA7ANwB4A4Ggy4A+z8B2F39afWnVWfVldX71furv616+88B/gI2Qy6hS3w3EwAAAABJRU5ErkJggg==";

// --- HIGH DENSITY GALAXY ---
function Galaxy({ count = 35000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const { viewport } = useThree();

    // Texture Loading
    const texture = useMemo(() => new THREE.TextureLoader().load(STAR_TEXTURE_URL), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const colorCore = new THREE.Color('#ffffff');      // Pure White Core
        const colorInner = new THREE.Color('#fff7bf');     // Warm White
        const colorArmStart = new THREE.Color('#aeeeff');  // Bright Cyan
        const colorArmEnd = new THREE.Color('#00bbff');    // Electric Blue

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // More particles in core for density
            const isCore = Math.random() < 0.35;

            let x, y, z;
            let color = new THREE.Color();
            let size = 1;

            if (isCore) {
                // CORE - Dense Sphere
                const radius = Math.pow(Math.random(), 3) * 1.8;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                x = radius * Math.sin(phi) * Math.cos(theta);
                y = (radius * Math.sin(phi) * Math.sin(theta)) * 0.45; // Flattened y
                z = radius * Math.cos(phi) * 0.7;

                color.copy(colorCore);
                if (radius > 1) color.lerp(colorInner, 0.5);

                // Varied core sizes
                size = 1.0 + Math.random() * 2.0;

            } else {
                // ARMS - Classic Spiral
                const branchAngle = ((i % 2) / 2) * Math.PI * 2;
                const radius = 2 + Math.random() * 8.5;
                const spinAngle = radius * 0.6; // Tighter spin

                // Random spread - less spread = tighter arms
                const spread = 0.5;
                const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * spread * (radius * 0.2);
                const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * spread * (radius * 0.2);
                const randomY = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.3;

                x = Math.cos(branchAngle + spinAngle) * radius + randomX;
                z = Math.sin(branchAngle + spinAngle) * radius + randomZ;
                y = randomY;

                color.copy(colorArmStart);
                color.lerp(colorArmEnd, radius / 10);

                // Occasional bright stars
                if (Math.random() < 0.05) {
                    size = 3.0; // Big bright star
                    color.set('#ffffff');
                } else {
                    size = 1.0 + Math.random() * 1.8;
                }
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
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        return geo;
    }, [count]);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        pointsRef.current.rotation.y += delta * 0.06;
    });

    // CUSTOM SHADER MATERIAL FOR BEST CONTROL
    // Using a shader to handle 'size' attribute and soft circle drawing efficiently
    const shaderArgs = useMemo(() => ({
        uniforms: {
            uTime: { value: 0 },
            uTexture: { value: texture },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },  // Important for Mobile!
            uSizeScale: { value: 30.0 } // Global scalar
        },
        vertexShader: `
              uniform float uPixelRatio;
              uniform float uSizeScale;
              attribute float size;
              attribute vec3 color;
              varying vec3 vColor;
              void main() {
                  vColor = color;
                  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                  gl_Position = projectionMatrix * mvPosition;
                  // Size attenuation: larger when closer
                  gl_PointSize = size * uSizeScale * uPixelRatio * (1.0 / -mvPosition.z);
              }
          `,
        fragmentShader: `
              uniform sampler2D uTexture;
              varying vec3 vColor;
              void main() {
                  vec4 texColor = texture2D(uTexture, gl_PointCoord);
                  if (texColor.a < 0.1) discard; // Optimization
                  gl_FragColor = vec4(vColor, 1.0) * texColor;
              }
          `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    }), [texture]);

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <shaderMaterial args={[shaderArgs]} />
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
                <div className="absolute inset-0 z-0">
                    <Canvas
                        camera={{ position: [0, 6, 5], fov: 60 }} // Closer camera, wider FOV for impact
                        gl={{
                            antialias: false,
                            powerPreference: "high-performance",
                            alpha: false,
                            depth: false // Perf hack
                        }}
                        dpr={[1, 2]} // Clamp DPR for performance
                    >
                        <color attach="background" args={["#030712"]} /> {/* Very dark blue/black */}
                        <Galaxy />
                        <EffectComposer enableNormalPass={false}>
                            <Bloom
                                luminanceThreshold={0.25}
                                mipmapBlur
                                intensity={1.5} // High bloom for 'Wow'
                                radius={0.5}
                            />
                        </EffectComposer>
                    </Canvas>
                </div>

                {/* 2. Text Content (Ensuring High Contrast) */}
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

                {/* Vignette for cinematic focus */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

            </motion.div>
        </div>
    );
}
