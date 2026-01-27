"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Sparkles, Stars, Torus, MeshDistortMaterial, Environment, ContactShadows } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

function Heart(props: any) {
    const mesh = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.x = 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            mesh.current.rotation.y += 0.01;
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
            mesh.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group {...props}>
            {/* Simple heart shape approximation using Torus or Sphere for now, or just a glowing Orb of health */}
            <mesh ref={mesh}>
                <icosahedronGeometry args={[1, 1]} />
                <MeshDistortMaterial
                    color="#ff4444"
                    speed={2}
                    distort={0.6}
                    roughness={0}
                    metalness={0.8}
                />
            </mesh>
        </group>
    );
}

function FloatingText() {
    return (
        <group>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Text
                    // font="/fonts/Inter-Bold.ttf" // REMOVED: Font not found, using default
                    fontSize={1.5}
                    color="#fbbf24" // Amber-400
                    position={[0, 1.5, 0]}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={8}
                    textAlign="center"
                >
                    GEÇMİŞ OLSUN
                    <meshStandardMaterial attach="material" emissive="#fbbf24" emissiveIntensity={0.5} toneMapped={false} />
                </Text>
            </Float>

            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
                <Text
                    fontSize={0.6}
                    color="#ffffff"
                    position={[0, -0.5, 0]}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={6}
                    textAlign="center"
                    lineHeight={1.5}
                >
                    @silginim  &  @baranbozkurt
                </Text>
                <Text
                    fontSize={0.4}
                    color="#9ca3af" // Gray-400
                    position={[0, -1.5, 0]}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={5}
                    textAlign="center"
                >
                    Bence bu ameliyat sizi daha da güzelleştirecek.
                    Moralinizi yüksek tutun!
                </Text>
            </Float>
        </group>
    );
}

function Particles() {
    const count = 200;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
        }
        return pos;
    }, []);

    return (
        <Sparkles
            count={300}
            scale={12}
            size={4}
            speed={0.4}
            opacity={0.6}
            color="#F59E0B" // Amber
        />
    )
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <group position={[0, 0, 0]}>
                <FloatingText />
                <group position={[0, 0, -2]}>
                    <Heart position={[0, 0.5, 0]} />
                </group>
                <Particles />
            </group>

            <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.25} far={10} color="#000000" />

            {/* Post Processing for Glow */}
            {/* Note: EffectComposer can be heavy, but requested "High Quality" */}
            {/* Disabled for now to ensure compatibility, can re-enable if performance allows in testing */}
            {/* <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
                <Vignette eskil={false} offset={0.1} darkness={0.5} />
            </EffectComposer> */}
        </>
    );
}

export function GetWellCard() {
    return (
        <div className="w-full h-full min-h-[100dvh] bg-neutral-950 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-neutral-900 pointer-events-none z-0" />

            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
                <Scene />
            </Canvas>

            {/* Overlay UI */}
            <div className="absolute bottom-10 left-0 w-full text-center z-10 pointer-events-none">
                <div className="inline-block px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/80 text-sm tracking-widest uppercase shadow-2xl">
                    Special Card
                </div>
            </div>
        </div>
    );
}
