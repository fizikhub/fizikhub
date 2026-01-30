"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

function Earth() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const atmosphereRef = useRef<THREE.Mesh>(null!);

    // Using Day Map for clearer landmasses and high contrast
    const texture = useTexture("/img/earth-day.jpg");

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.8; // Faster rotation
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += delta * 0.8;
        }
    });

    return (
        <group>
            {/* Main Earth Sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={texture}
                    roughness={0.3} // Shinier ocean for vibrancy
                    metalness={0.1}
                    emissive="#112244"
                    emissiveIntensity={0.5} // Increased self-glow
                />
            </mesh>

            {/* Atmosphere Glow */}
            <mesh ref={atmosphereRef} scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial
                    color="#00ffff" // Cyan glow for high energy
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
}

function Loader() {
    return (
        <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#3B82F6" wireframe opacity={0.3} transparent />
        </mesh>
    );
}

export function EarthIcon({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 2.8], fov: 45 }}
                gl={{ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={3.5} /> {/* High Ambient Light for brightness */}
                <directionalLight position={[5, 3, 5]} intensity={4.0} />
                <pointLight position={[-2, -2, 2]} intensity={2.0} color="#00ffff" />

                <Suspense fallback={<Loader />}>
                    <Earth />
                </Suspense>
            </Canvas>
        </div>
    );
}
