"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

function Earth() {
    const meshRef = useRef<THREE.Mesh>(null!);

    // Using a high-quality standard earth map
    // Fallback: If texture fails, it will be white/black, but we can set a color
    const texture = useTexture("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg");

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5; // Smooth rotation
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                map={texture}
                roughness={0.7}
                metalness={0.1}
            />
        </mesh>
    );
}

function Loader() {
    return (
        <mesh>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="#3B82F6" wireframe opacity={0.3} transparent />
        </mesh>
    );
}

export function EarthIcon({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 2.5], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={1.5} />
                <directionalLight position={[2, 2, 5]} intensity={1.5} />
                <Suspense fallback={<Loader />}>
                    <Earth />
                </Suspense>
            </Canvas>
        </div>
    );
}
