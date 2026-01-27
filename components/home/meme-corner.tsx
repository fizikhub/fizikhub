"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// --- SHADERS ---

// Background Tunnel Shader (Vortex / Time Warp)
const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;

void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float a = atan(p.y, p.x);
    
    // Vortex / Tunnel effect
    float tunnel = sin(20.0 * pow(r, 0.5) - uTime * 4.0);
    float beam = sin(10.0 * a + uTime * 2.0);
    
    vec3 color1 = vec3(0.0, 0.05, 0.2); // Deep Blue
    vec3 color2 = vec3(0.5, 0.0, 0.8); // Purple
    vec3 color3 = vec3(1.0, 0.5, 0.0); // BTTF Fire Orange
    
    vec3 finalColor = mix(color1, color2, r + 0.2 * tunnel);
    finalColor += color3 * 0.5 * pow(max(0.0, beam * tunnel), 3.0);
    
    // Vignette
    finalColor *= smoothstep(1.5, 0.5, r);

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

function WarpBackground() {
    const mesh = useRef<THREE.Mesh>(null);
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
    }), []);

    useFrame((state) => {
        if (mesh.current) {
            uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={mesh} position={[0, 0, -5]}>
            <planeGeometry args={[16, 9]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

function DeLorean() {
    const texture = useLoader(TextureLoader, '/assets/delorean-fire.png');
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (mesh.current) {
            // Hover effect
            mesh.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
            mesh.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.02;
        }
    });

    return (
        <mesh ref={mesh} position={[1.5, 0, 0]} scale={[3.5, 3.5, 1]}>
            <planeGeometry args={[1.5, 1]} />
            <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
    );
}

function FireParticles() {
    const count = 50;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Initial random positions
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -5 + Math.random() * 10;
            const yFactor = (Math.random() - 0.5) * 2; // Behind car height
            const zFactor = (Math.random() - 0.5) * 10;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, []);

    useFrame((state) => {
        if (!mesh.current) return;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            // Move backwards (relative to camera/car) to simulate speed
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            // Reset if too far left
            particle.mx -= 0.1;
            if (particle.mx < -6) particle.mx = 2; // Reset position near car

            dummy.position.set(
                particle.mx, // Moving left
                particle.yFactor + Math.sin(t * 10) * 0.1, // Jitter
                0
            );
            dummy.scale.setScalar(Math.max(0, Math.sin(t * 5))); // Flicker
            dummy.rotation.z = t * 2;
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        // Simple squares as fire particles for now
        <instancedMesh ref={mesh} args={[undefined, undefined, count]} position={[0, -0.5, 1]}>
            <planeGeometry args={[0.1, 0.1]} />
            <meshBasicMaterial color="#ff5500" transparent opacity={0.8} />
        </instancedMesh>
    );
}


export function MemeCorner() {
    return (
        <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] md:aspect-[3.5/1] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black group">

            {/* 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
                    <Suspense fallback={null}>
                        <WarpBackground />
                        <DeLorean />
                        {/* <FireParticles /> TODO: Refine particles later if needed */}
                    </Suspense>
                </Canvas>
            </div>

            {/* Overlay UI (HTML) */}
            <div className="absolute inset-0 z-10 flex items-center px-8 md:px-16 pointer-events-none">
                <div className="flex flex-col">
                    <motion.h1
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-black italic tracking-tighter"
                        style={{
                            fontFamily: "'Impact', sans-serif", // Fallback, assume BTTF font loaded or use system heavy
                            textShadow: "4px 4px 0px #000, 0 0 20px rgba(255, 100, 0, 0.4)",
                            transform: "skewX(-10deg)"
                        }}
                    >
                        <span className="block text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-[#FF9900] via-[#FF5500] to-[#CC2200] leading-none mb-1">
                            BİLİMİ
                        </span>
                        <span className="block text-5xl md:text-7xl text-white drop-shadow-[0_0_10px_rgba(0,200,255,0.8)] leading-none text-stroke">
                            Tİ'YE ALIYORUZ
                        </span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 bg-black/60 backdrop-blur-sm px-4 py-2 self-start rounded border-l-4 border-[#00DEFF]"
                    >
                        <span className="text-white/90 font-mono text-sm uppercase tracking-widest">
                            Ama Ciddili Şekilde
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Scanlines Effect */}
            <div className="absolute inset-0 bg-[url('/assets/scanlines.png')] opacity-10 pointer-events-none z-20 mix-blend-overlay" />
        </div>
    );
}
