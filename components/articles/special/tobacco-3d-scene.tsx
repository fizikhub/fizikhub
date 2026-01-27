"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Text, Float, Sparkles, Scroll, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef, Component, ReactNode, Suspense } from "react";
import * as THREE from "three";
import { Skull, Wind, FlaskConical } from "lucide-react";
import Link from "next/link";

// --- ERROR BOUNDARY ---
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("3D Scene Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

// --- FALLBACK UI ---
function FallbackUI() {
    return (
        <div className="h-screen w-screen bg-[#0f172a] flex flex-col items-center justify-center text-white p-8">
            <h1 className="text-6xl font-black mb-4 tracking-tighter">TÜTÜN</h1>
            <p className="text-xl text-amber-500/80 mb-8 text-center max-w-xl font-serif italic">
                "Tanrıların dumanı..."
            </p>
            <Link
                href="/blog"
                className="border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-full font-medium transition-all"
            >
                Makaleye Dön
            </Link>
        </div>
    );
}

// --- ABSTRACT SHADERS & GEOMETRY ---

// 1. ABSTRACT SHIP (Silhouette Style)
// Instead of building a complex model from primitives (which looks like Lego),
// we use a single stylized shape with a custom glowing material.
function AbstractShip() {
    const scroll = useScroll();
    const mesh = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!mesh.current) return;
        const t = state.clock.elapsedTime;

        const relativeProgress = (scroll.offset - 0.33) * 3;
        const visible = scroll.range(0.25, 0.2) > 0.1;

        mesh.current.visible = visible;

        if (visible) {
            // Smooth cinematic movement
            mesh.current.position.z = THREE.MathUtils.lerp(-20, 0, relativeProgress);
            mesh.current.rotation.z = Math.sin(t * 0.5) * 0.05; // Gentle roll
            mesh.current.rotation.y = Math.sin(t * 0.3) * 0.05; // Gentle yaw
        }
    });

    return (
        <group ref={mesh} visible={false}>
            {/* The Hull - Stylized elongated shape */}
            <mesh position={[0, -1, 0]}>
                <capsuleGeometry args={[0.8, 4, 4, 16]} />
                <meshStandardMaterial
                    color="#000"
                    roughness={0.2}
                    metalness={0.8}
                    emissive="#451a03"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* The Sales - Glowing Energy Sheets */}
            <mesh position={[0, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[0.1, 5, 4, 4]} />
                <meshStandardMaterial
                    color="#fbbf24"
                    emissive="#fbbf24"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                />
            </mesh>

            <mesh position={[0, 3, 1.5]} rotation={[0.2, Math.PI / 2, 0]}>
                <planeGeometry args={[0.05, 3]} />
                <meshStandardMaterial
                    color="#f59e0b"
                    emissive="#f59e0b"
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.6}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}


// 2. MOLECULE (Cyberpunk/Neon Style)
// Highly emissive points connected by thin lines
function NeonMolecule() {
    const scroll = useScroll();
    const group = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!group.current) return;
        const visible = scroll.range(0.6, 0.2) > 0.1;
        group.current.visible = visible;

        if (visible) {
            const progress = scroll.range(0.6, 0.2);
            group.current.rotation.y += delta * 0.2;
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;

            // Zoom effect
            group.current.position.z = THREE.MathUtils.lerp(-10, 0, progress);
        }
    });

    return (
        <group ref={group} visible={false}>
            {/* Core Atoms - High Bloom */}
            <Points count={6} radius={1.5} color="#06b6d4" />

            {/* Connecting Bonds - Thin glowing lines */}
            <mesh rotation={[0, 0, Math.PI / 4]}>
                <torusGeometry args={[1.5, 0.02, 16, 100]} />
                <meshBasicMaterial color="#22d3ee" toneMapped={false} />
            </mesh>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[1.2, 0.02, 16, 100]} />
                <meshBasicMaterial color="#22d3ee" toneMapped={false} />
            </mesh>
        </group>
    )
}

function Points({ count, radius, color }: { count: number, radius: number, color: string }) {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            p[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            p[i * 3 + 2] = radius * Math.cos(phi);
        }
        return p;
    }, [count, radius]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[points, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.3} color={color} sizeAttenuation transparent opacity={0.8} />
        </points>
    )
}

// 3. ATMOSPHERIC PARTICLES (Ash/Ember)
function Embers() {
    const mesh = useRef<THREE.InstancedMesh>(null)
    const count = 500
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100
            const factor = 20 + Math.random() * 100
            const speed = 0.01 + Math.random() / 200
            const x = (Math.random() - 0.5) * 20
            const y = (Math.random() - 0.5) * 20
            const z = (Math.random() - 0.5) * 20
            temp.push({ t, factor, speed, x, y, z })
        }
        return temp
    }, [])

    useFrame((state) => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle
            t = particle.t += speed / 2
            const a = Math.cos(t) + Math.sin(t * 1) / 10
            const b = Math.sin(t) + Math.cos(t * 2) / 10
            const s = Math.cos(t)

            dummy.position.set(
                particle.x + Math.cos(t) + Math.sin(t * 1) / 10,
                particle.y + Math.sin(t) + Math.cos(t * 2) / 10,
                particle.z + Math.cos(t) + Math.sin(t * 3) / 10
            )
            // Breathing scale
            dummy.scale.setScalar(s * 0.05 + 0.05)
            dummy.rotation.set(s * 5, s * 5, s * 5)
            dummy.updateMatrix()
            mesh.current!.setMatrixAt(i, dummy.matrix)
        })
        mesh.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            {/* Emissive orange for Ember look */}
            <meshStandardMaterial color="#ea580c" emissive="#ea580c" emissiveIntensity={4} toneMapped={false} />
        </instancedMesh>
    )
}


// --- MAIN SCENE ---

function Scene3D() {
    return (
        <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: "high-performance", alpha: false }} // Disable default AA for PostProcessing
            camera={{ position: [0, 0, 5], fov: 50 }}
        >
            <color attach="background" args={['#020617']} />
            <fog attach="fog" args={['#020617', 5, 20]} />

            {/* LIGHTING */}
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={10} color="#fbbf24" distance={20} />
            <pointLight position={[-10, -10, -5]} intensity={5} color="#0ea5e9" distance={20} />

            <ScrollControls pages={4} damping={0.2}>
                <Suspense fallback={null}>
                    <AbstractShip />
                    <NeonMolecule />
                    <Embers />
                </Suspense>

                {/* POST PROCESSING - The "Cinema" Look */}
                {/* @ts-ignore */}
                <EffectComposer disableNormalPass>
                    {/* @ts-ignore */}
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
                    {/* @ts-ignore */}
                    <Noise opacity={0.05} />
                    {/* @ts-ignore */}
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>

                {/* HTML CONTENT OVERLAY */}
                <Scroll html style={{ width: '100vw', height: '100vh' }}>
                    {/* 1. HERO */}
                    <section className="h-screen flex items-center justify-center relative pointer-events-none">
                        <div className="text-center px-4 mix-blend-difference">
                            <h1 className="text-8xl md:text-[10rem] font-black mb-0 tracking-tighter text-white opacity-90 leading-none blur-[1px]">
                                TÜTÜN
                            </h1>
                            <p className="text-xl md:text-2xl text-amber-500 font-serif italic tracking-widest mt-4">
                                DUMANLI TARİH
                            </p>
                        </div>
                    </section>

                    {/* 2. CONTACT */}
                    <section className="h-screen flex items-center relative pointer-events-none" style={{ top: '100vh', position: 'absolute' }}>
                        <div className="container mx-auto px-6 grid md:grid-cols-2">
                            <div className="p-10 border-l-4 border-amber-500 bg-black/40 backdrop-blur-sm">
                                <h2 className="text-6xl font-black text-white mb-6">1492</h2>
                                <p className="text-2xl text-stone-300 font-serif leading-relaxed">
                                    Yerliler "kuru yapraklar" sundu. <br />
                                    <span className="text-amber-500">Avrupa nefesini tuttu.</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. ADDICTION */}
                    <section className="h-screen flex items-center justify-end relative pointer-events-none px-6" style={{ top: '200vh', position: 'absolute', width: '100%' }}>
                        <div className="text-right p-10 border-r-4 border-cyan-500 bg-black/40 backdrop-blur-sm">
                            <h2 className="text-6xl font-black text-white mb-6">C₁₀H₁₄N₂</h2>
                            <p className="text-2xl text-stone-300 font-serif leading-relaxed">
                                7 saniye.<br />
                                <span className="text-cyan-400">Beyniniz ele geçirildi.</span>
                            </p>
                        </div>
                    </section>

                    {/* 4. FOOTER */}
                    <section className="h-screen flex flex-col items-center justify-center relative pointer-events-auto" style={{ top: '300vh', position: 'absolute', width: '100%' }}>
                        <div className="text-center">
                            <Link
                                href="/blog"
                                className="group relative inline-flex h-16 w-64 items-center justify-center overflow-hidden rounded-full bg-white font-medium text-black transition-all duration-300 hover:w-80 hover:bg-amber-400"
                            >
                                <span className="absolute inset-0 flex h-full w-full -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                                <span className="relative text-lg font-bold tracking-tight">MAKALEYE DÖN</span>
                                <Wind className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </section>
                </Scroll>
            </ScrollControls>
        </Canvas>
    );
}

export function Tobacco3DScene() {
    return (
        <div className="w-full h-full absolute inset-0">
            <ErrorBoundary fallback={<FallbackUI />}>
                <Scene3D />
            </ErrorBoundary>
        </div>
    );
}
