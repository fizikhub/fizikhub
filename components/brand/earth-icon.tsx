"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import Image from "next/image";

function Earth() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const atmosphereRef = useRef<THREE.Mesh>(null!);

    // Using Day Map for clearer landmasses and high contrast
    const texture = useTexture("/img/earth-day.jpg");

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.8;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += delta * 0.8;
        }
    });

    return (
        <group>
            {/* Main Earth Sphere - OPTIMIZED: 32 segments instead of 64 */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    map={texture}
                    roughness={0.3}
                    metalness={0.1}
                    emissive="#112244"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Atmosphere Glow - OPTIMIZED: 24 segments */}
            <mesh ref={atmosphereRef} scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[1, 24, 24]} />
                <meshBasicMaterial
                    color="#00ffff"
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
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="#3B82F6" wireframe opacity={0.3} transparent />
        </mesh>
    );
}

export function EarthIcon({ className }: { className?: string }) {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!mounted) {
        return <div className={className} />;
    }

    // MOBILE: Use static image instead of 3D Canvas
    if (isMobile) {
        return (
            <div className={className}>
                <Image
                    src="/img/earth-static.png"
                    alt="Earth"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                    priority
                />
            </div>
        );
    }

    // DESKTOP: Keep the 3D experience but with reduced dpr
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 2.8], fov: 45 }}
                gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
                dpr={[1, 1.5]}
            >
                <ambientLight intensity={3.5} />
                <directionalLight position={[5, 3, 5]} intensity={4.0} />
                <pointLight position={[-2, -2, 2]} intensity={2.0} color="#00ffff" />

                <Suspense fallback={<Loader />}>
                    <Earth />
                </Suspense>
            </Canvas>
        </div>
    );
}
