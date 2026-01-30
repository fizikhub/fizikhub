"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

function Earth() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const atmosphereRef = useRef<THREE.Mesh>(null!);

    // Using local texture for stability
    const texture = useTexture("/img/earth.jpg");

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.8; // Faster, more lively rotation
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += delta * 0.8;
        }
    });

    return (
        <group>
            {/* Main Earth Sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1, 64, 64]} /> {/* Smoother circle */}
                <meshStandardMaterial
                    map={texture}
                    roughness={0.4}
                    metalness={0.2}
                    emissive="#112244"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Atmosphere Glow */}
            <mesh ref={atmosphereRef} scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial
                    color="#4fa1ff"
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
                <ambientLight intensity={2.5} /> {/* Much brighter */}
                <directionalLight position={[5, 3, 5]} intensity={3.0} />
                <pointLight position={[-2, -2, 2]} intensity={1.0} color="#4fa1ff" />

                <Suspense fallback={<Loader />}>
                    <Earth />
                </Suspense>
            </Canvas>
        </div>
    );
}
