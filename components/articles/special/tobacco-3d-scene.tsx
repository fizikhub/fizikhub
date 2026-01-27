"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Text, Float, Stars, Sparkles, Cloud, Scroll } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Skull, Wind, FlaskConical } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";

// --- SHADERS & MATERIALS ---

// Simplified Water Shader Material (Mocking complex water for performance)
const WaterMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#1e3a8a") }, // Deep Blue
    },
    vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      // Simple sine wave displacement
      pos.z += sin(pos.x * 2.0 + uTime) * 0.2;
      pos.z += cos(pos.y * 2.0 + uTime * 0.8) * 0.2;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    fragmentShader: `
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      // Simple color gradient based on UV
      float strength = (vUv.y + 0.5) * 0.8;
      gl_FragColor = vec4(uColor * strength, 0.8); // 0.8 alpha for slight transparency
    }
  `
};

// --- SCENE COMPONENTS ---

function AztecScene() {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        // Fade in/out based on scroll range 0 - 0.33
        const r1 = scroll.range(0 / 3, 1 / 3);
        const visibleRaw = scroll.visible(0, 1 / 3); // This helps culling if needed, but opacity is better for transition

        if (groupRef.current) {
            // Opacity transition logic
            // We want it visible at start, fade out by 0.3
            const opacity = 1 - scroll.range(0.25, 0.1);
            groupRef.current.position.z = THREE.MathUtils.lerp(0, -10, scroll.range(0, 0.33));
            groupRef.current.visible = opacity > 0.01;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Volumetric Fog / Clouds */}
            <Cloud opacity={0.5} speed={0.4} bounds={[10, 2, 10]} position={[0, -2, -5]} color="#064e3b" />
            <Cloud opacity={0.3} speed={0.2} bounds={[10, 2, 10]} position={[0, 2, -8]} color="#10b981" />

            {/* Fireflies */}
            <Sparkles count={100} scale={12} size={4} speed={0.4} opacity={0.8} color="#fef08a" />

            {/* 3D Text */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <Text
                    position={[0, 0.5, -2]}
                    fontSize={1.5}
                    color="#ecfccb"
                    anchorX="center"
                    anchorY="middle"
                // font="/fonts/Inter-Bold.ttf" // Removed: File missing, causing crash
                >
                    TÜTÜN
                    <meshStandardMaterial color="#ecfccb" emissive="#3f6212" emissiveIntensity={2} toneMapped={false} />
                </Text>
            </Float>
        </group>
    );
}

function VoyageScene() {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);
    const waterRef = useRef<THREE.Mesh>(null);

    // Custom Shader Material Instance
    const waterShaderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color("#0c4a6e") }
        },
        vertexShader: WaterMaterial.vertexShader,
        fragmentShader: WaterMaterial.fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
    }), []);

    useFrame((state) => {
        if (!groupRef.current || !waterRef.current) return;

        // Active range: 0.33 - 0.66
        const r2 = scroll.range(1 / 3, 1 / 3);
        // Move into view
        // Start at z: -20, move to 0 at 0.5, move to 20 at 0.66

        const relativeProgress = (scroll.offset - 0.33) * 3; // 0 to 1 roughly within range

        // Visibility
        const opacity = scroll.curve(1 / 3, 1 / 3); // Peak at center of range
        groupRef.current.visible = opacity > 0.01;

        // Ship Movement (Bobbing + Forward)
        if (groupRef.current.visible) {
            groupRef.current.position.z = THREE.MathUtils.lerp(-10, 5, relativeProgress);
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 1; // Sea level

            // Update Water Shader
            waterShaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <group ref={groupRef} visible={false}>
            {/* Water Plane */}
            <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
                <planeGeometry args={[20, 20, 32, 32]} />
                <primitive object={waterShaderMaterial} attach="material" />
            </mesh>

            {/* Stylized Ship (Composite of primitives) */}
            <group position={[0, -1.2, 0]}>
                <Float speed={4} rotationIntensity={0.2} floatIntensity={0.5}>
                    {/* Hull */}
                    <mesh position={[0, 0.2, 0]}>
                        <boxGeometry args={[1, 0.5, 2]} />
                        <meshStandardMaterial color="#78350f" roughness={0.8} />
                    </mesh>
                    {/* Mast */}
                    <mesh position={[0, 1, 0]}>
                        <cylinderGeometry args={[0.05, 0.05, 2]} />
                        <meshStandardMaterial color="#451a03" />
                    </mesh>
                    {/* Sails */}
                    <mesh position={[0, 1.2, 0.2]} rotation={[0, -Math.PI / 2, 0]}>
                        <planeGeometry args={[1.5, 1.2]} />
                        <meshStandardMaterial color="#fef3c7" side={THREE.DoubleSide} />
                    </mesh>
                </Float>
            </group>

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
}

function ChemistryScene() {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Active Range: 0.66 - 1.0
        const opacity = scroll.range(2 / 3, 1 / 3);
        groupRef.current.visible = opacity > 0.01;

        if (groupRef.current.visible) {
            // Rotate visuals
            groupRef.current.rotation.y += delta * 0.5;
            groupRef.current.rotation.x += delta * 0.2;

            // Move closer
            groupRef.current.position.z = THREE.MathUtils.lerp(-5, 0, scroll.range(2 / 3, 1 / 3));
        }
    });

    const atomMaterial = new THREE.MeshPhysicalMaterial({
        color: "#22d3ee",
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        thickness: 0.5,
    }); // Glass-like

    return (
        <group ref={groupRef} visible={false}>
            {/* Nicotine Molecule Structure (Approximation) */}
            {/* Central Ring */}
            <mesh position={[0, 0, 0]} material={atomMaterial}>
                <sphereGeometry args={[0.5, 32, 32]} />
            </mesh>
            <mesh position={[1, 0.5, 0]} material={atomMaterial}>
                <sphereGeometry args={[0.4, 32, 32]} />
            </mesh>
            <mesh position={[-0.8, -0.6, 0.2]} material={atomMaterial}>
                <sphereGeometry args={[0.4, 32, 32]} />
            </mesh>
            {/* Bonds */}
            <mesh position={[0.5, 0.25, 0]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.1, 0.1, 1]} />
                <meshStandardMaterial color="#fff" />
            </mesh>
            <mesh position={[-0.4, -0.3, 0.1]} rotation={[0, 0, 0.8]}>
                <cylinderGeometry args={[0.1, 0.1, 1]} />
                <meshStandardMaterial color="#fff" />
            </mesh>

            <Sparkles count={50} color="#06b6d4" size={5} scale={8} />
        </group>
    );
}

// --- MAIN COMPONENT ---

export function Tobacco3DScene() {
    return (
        <div className="w-full h-full absolute inset-0">
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

                <ScrollControls pages={4} damping={0.2}>
                    {/* The Actual 3D Content */}
                    <AztecScene />
                    <VoyageScene />
                    <ChemistryScene />

                    {/* HTML Overlay Content (Moved inside here to prevent SSR crash in parent) */}
                    <Scroll html style={{ width: '100vw', height: '100vh' }}>

                        {/* SCENE 1: TITLE (0% - 33%) */}
                        <section className="h-screen flex items-center justify-center relative pointer-events-none">
                            <div className="text-center px-4">
                                <span className="block mb-4 text-green-400 tracking-[0.5em] text-sm font-bold uppercase drop-shadow-md">Fizikhub 3D Experience</span>
                                <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter drop-shadow-2xl text-white">
                                    TÜTÜN
                                </h1>
                                <p className="text-xl md:text-2xl text-green-100/90 font-serif italic max-w-2xl mx-auto drop-shadow-lg">
                                    "Tanrıların dumanından, sanayi devriminin bacalarına..."
                                </p>
                            </div>
                        </section>

                        {/* SCENE 2: VOYAGE (33% - 66%) */}
                        <section className="h-screen flex items-center relative pointer-events-none" style={{ top: '100vh', position: 'absolute' }}>
                            <div className="container mx-auto px-6 grid md:grid-cols-2">
                                <div className="bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
                                    <div className="flex items-center gap-3 mb-4 text-blue-400">
                                        <Wind className="animate-pulse" />
                                        <h2 className="text-3xl font-bold">1492: Temas</h2>
                                    </div>
                                    <p className="text-lg text-slate-300 leading-relaxed">
                                        Kristof Kolomb, Bahamalar'a ayak bastığında, yerliler ona "kuru yapraklar" hediye etti.
                                        Bu yapraklar yorgunluğu alıyor, açlığı bastırıyordu.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* SCENE 3: CHEMISTRY (66% - 100%) */}
                        <section className="h-screen flex items-center justify-center relative pointer-events-none" style={{ top: '200vh', position: 'absolute' }}>
                            <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 p-10 rounded-3xl max-w-4xl mx-auto shadow-2xl">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="p-6 bg-cyan-950/50 rounded-full">
                                        <FlaskConical size={64} className="text-cyan-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-bold mb-4 text-white">Nikotin: <span className="text-cyan-400">C₁₀H₁₄N₂</span></h2>
                                        <p className="text-lg text-slate-300 leading-relaxed">
                                            Doğada bir böcek ilacı. Beyinde bir ödül mekanizması.
                                            Sadece 7 saniyede beyne ulaşan, dopamin salgılatan kusursuz bir tuzak.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SCENE 4: CONCLUSION (100%+) */}
                        <section className="h-screen flex flex-col items-center justify-center relative pointer-events-auto" style={{ top: '300vh', position: 'absolute', width: '100%' }}>
                            <div className="text-center max-w-3xl bg-black/80 p-12 rounded-3xl backdrop-blur-md border border-red-900/50">
                                <Skull className="w-24 h-24 text-red-600 mx-auto mb-8 animate-pulse" />
                                <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">SONUÇ.</h2>
                                <p className="text-xl text-zinc-300 mb-12">
                                    Fizikhub'da bilimi keşfetmeye devam et.
                                </p>
                                <ViewTransitionLink
                                    href="/blog"
                                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform"
                                >
                                    Diğer Makalelere Dön
                                </ViewTransitionLink>
                            </div>
                        </section>

                    </Scroll>
                </ScrollControls>
            </Canvas>
        </div>
    );
}
