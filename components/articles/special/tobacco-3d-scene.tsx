"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Text, Float, Sparkles, Scroll } from "@react-three/drei";
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
        <div className="h-screen w-screen bg-[#1c1917] flex flex-col items-center justify-center text-white p-8">
            <h1 className="text-6xl font-black mb-4">TÜTÜN</h1>
            <p className="text-xl text-amber-500 mb-8 text-center max-w-xl">
                Tanrıların dumanından, sanayi devriminin bacalarına...
            </p>
            <p className="text-sm text-stone-500 mb-8 max-w-md text-center">
                (3D deneyim şu an yüklenemiyor. Ancak makaleyi okumaya devam edebilirsiniz.)
            </p>
            <Link
                href="/blog"
                className="bg-amber-600 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
            >
                Makaleye Dön
            </Link>
        </div>
    );
}

// --- CUSTOM SHADERS & MATERIALS ---

const OceanMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#0c4a6e") }, // Deep Blue
        uColorB: { value: new THREE.Color("#1e293b") }, // Dark Slate
    },
    vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Gentle long waves
      float elevation = sin(pos.x * 1.5 + uTime * 0.5) * 0.2;
      elevation += sin(pos.y * 1.0 + uTime * 0.3) * 0.2;
      
      pos.z += elevation;
      vElevation = elevation;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    fragmentShader: `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying float vElevation;
    void main() {
      float mixStrength = (vElevation + 0.2) * 2.0;
      vec3 color = mix(uColorA, uColorB, mixStrength);
      gl_FragColor = vec4(color, 0.9);
    }
  `
};

// --- SCENE COMPONENTS ---

// 1. ASH PARTICLES (Replaces Stars)
function AshParticles() {
    const count = 400;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = (Math.random() - 0.5) * 30;
            const y = (Math.random() - 0.5) * 30;
            const z = (Math.random() - 0.5) * 15;
            temp.push({ t, factor, speed, x, y, z });
        }
        return temp;
    }, []);

    useFrame((state) => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            let { t, speed, x, y, z } = particle;

            // Particles gently rise and drift
            particle.t += speed;
            particle.y += 0.008;

            if (particle.y > 15) particle.y = -15; // Reset position

            // Wobbly movement mimicking air currents
            const wobbleX = Math.sin(particle.t * 0.5) * 0.5;
            const wobbleZ = Math.cos(particle.t * 0.3) * 0.5;

            dummy.position.set(x + wobbleX, y, z + wobbleZ);

            // Random rotations
            const s = Math.cos(particle.t);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.scale.setScalar(0.05 + Math.random() * 0.05); // Random small sizes

            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#a8a29e" transparent opacity={0.4} />
        </instancedMesh>
    );
}

// 2. SCENE: INTRO
function IntroScene() {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            const opacity = 1 - scroll.range(0.25, 0.1);
            // Move up and fade out
            groupRef.current.position.y = THREE.MathUtils.lerp(0, 5, scroll.range(0, 0.33));
            groupRef.current.visible = opacity > 0.01;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Dynamic Light source representing fire/sun */}
            <pointLight position={[0, 2, -2]} intensity={2} color="#fbbf24" distance={10} />

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Abstract "Smoke" or "Lead" shapes - stylized */}
                <mesh position={[-2.5, 1, -5]} rotation={[0.5, 0.5, 0]}>
                    <coneGeometry args={[1, 3, 5]} />
                    <meshStandardMaterial color="#4d7c0f" roughness={0.8} />
                </mesh>
                <mesh position={[2.5, -1.5, -6]} rotation={[-0.5, -0.5, 0]}>
                    <coneGeometry args={[0.8, 2.5, 4]} />
                    <meshStandardMaterial color="#3f6212" roughness={0.9} />
                </mesh>
                {/* Floating Ash Cluster */}
                <Sparkles count={50} scale={6} size={4} speed={0.4} opacity={0.5} color="#fbbf24" position={[0, 0, -4]} />
            </Float>
        </group>
    );
}

// 3. SCENE: 1492 VOYAGE (Improved Boat)
function VoyageScene() {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);
    const shipRef = useRef<THREE.Group>(null);

    const oceanMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color("#0f172a") },
            uColorB: { value: new THREE.Color("#1e293b") }
        },
        vertexShader: OceanMaterial.vertexShader,
        fragmentShader: OceanMaterial.fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
    }), []);

    useFrame((state) => {
        if (!groupRef.current || !shipRef.current) return;

        const relativeProgress = (scroll.offset - 0.33) * 3;
        const opacity = scroll.curve(1 / 3, 1 / 3);
        groupRef.current.visible = opacity > 0.01;

        if (groupRef.current.visible) {
            // Ship moves forward into view
            groupRef.current.position.z = THREE.MathUtils.lerp(-15, 2, relativeProgress);

            // Ocean Bobbing (Sine wave motion)
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1 - 2;

            // Ship tipping (Rolling)
            shipRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.0) * 0.03;
            shipRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;

            oceanMaterial.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <group ref={groupRef} visible={false}>
            {/* Ocean Surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                <planeGeometry args={[40, 40, 64, 64]} />
                <primitive object={oceanMaterial} attach="material" />
            </mesh>

            {/* DETAILED CARAVEL SHIP */}
            <group ref={shipRef} position={[0, 0.2, 0]}>
                {/* Hull */}
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[1.4, 0.8, 3.5]} />
                    <meshStandardMaterial color="#451a03" roughness={0.9} />
                </mesh>
                {/* Bow (Front) */}
                <mesh position={[0, 0.7, 1.8]} rotation={[0.2, 0, 0]}>
                    <boxGeometry args={[1.2, 0.8, 1.2]} />
                    <meshStandardMaterial color="#503010" />
                </mesh>
                {/* Stern (Back) */}
                <mesh position={[0, 1.1, -1.4]}>
                    <boxGeometry args={[1.4, 1.0, 1.2]} />
                    <meshStandardMaterial color="#503010" />
                </mesh>

                {/* Main Mast */}
                <mesh position={[0, 2.5, 0.2]}>
                    <cylinderGeometry args={[0.08, 0.08, 4.5]} />
                    <meshStandardMaterial color="#2d2215" />
                </mesh>
                {/* Main Sail */}
                <mesh position={[0, 3.2, 0.35]} rotation={[0.1, 0, 0]}>
                    <boxGeometry args={[2.5, 1.8, 0.05]} />
                    <meshStandardMaterial color="#e7e5e4" side={THREE.DoubleSide} />
                </mesh>

                {/* Front Mast */}
                <mesh position={[0, 2, 1.4]} rotation={[0.15, 0, 0]}>
                    <cylinderGeometry args={[0.06, 0.06, 3.5]} />
                    <meshStandardMaterial color="#2d2215" />
                </mesh>
                {/* Front Sail */}
                <mesh position={[0, 2.4, 1.5]} rotation={[0.25, 0, 0]}>
                    <boxGeometry args={[1.8, 1.2, 0.05]} />
                    <meshStandardMaterial color="#e7e5e4" side={THREE.DoubleSide} />
                </mesh>

                {/* Flag */}
                <mesh position={[0, 4.8, 0.2]} rotation={[0, -1.5, 0]}>
                    <planeGeometry args={[0.6, 0.3]} />
                    <meshStandardMaterial color="#ef4444" side={THREE.DoubleSide} />
                </mesh>
            </group>
        </group>
    );
}

// 4. SCENE: NICOTINE MOLECULE (Scientific Glass Look)
function ChemistryScene() {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);

    // Glass Material
    const atomMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#a5f3fc", // Cyan-ish white
        transmission: 0.9, // Glass-like transparency
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5, // Index of refraction for glass
        thickness: 0.5,
        clearcoat: 1,
        attenuationColor: new THREE.Color("#06b6d4"),
        attenuationDistance: 0.5,
    }), []);

    const bondMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#94a3b8",
        roughness: 0.4,
        metalness: 0.8
    }), []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const opacity = scroll.range(2 / 3, 1 / 3);
        groupRef.current.visible = opacity > 0.01;

        if (groupRef.current.visible) {
            groupRef.current.rotation.y += delta * 0.3;
            // Gentle floating rotation
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            groupRef.current.position.z = THREE.MathUtils.lerp(-5, 0, scroll.range(2 / 3, 1 / 3));
        }
    });

    return (
        <group ref={groupRef} visible={false}>
            {/* Center structure (simplified nicotine ring) */}
            <mesh position={[0, 0, 0]} material={atomMaterial}>
                <sphereGeometry args={[0.7, 32, 32]} />
            </mesh>
            {/* Glowing Core */}
            <pointLight position={[0, 0, 0]} color="#22d3ee" intensity={1.5} distance={4} />

            {/* Orbiting atoms */}
            <mesh position={[1.2, 0.6, 0]} material={atomMaterial}>
                <sphereGeometry args={[0.5, 32, 32]} />
            </mesh>
            <mesh position={[-1.2, -0.7, 0.2]} material={atomMaterial}>
                <sphereGeometry args={[0.5, 32, 32]} />
            </mesh>
            <mesh position={[0.4, 1.2, -0.4]} material={atomMaterial}>
                <sphereGeometry args={[0.4, 32, 32]} />
            </mesh>

            {/* Bonds */}
            <mesh position={[0.6, 0.3, 0]} rotation={[0, 0, -1.1]}>
                <cylinderGeometry args={[0.15, 0.15, 1.4]} />
                <primitive object={bondMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.6, -0.35, 0.1]} rotation={[0, 0, 1]}>
                <cylinderGeometry args={[0.15, 0.15, 1.4]} />
                <primitive object={bondMaterial} attach="material" />
            </mesh>
            <mesh position={[0.2, 0.6, -0.2]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.12, 0.12, 1.2]} />
                <primitive object={bondMaterial} attach="material" />
            </mesh>
        </group>
    );
}

// --- MAIN COMPONENT ---

function Scene3D() {
    return (
        <Canvas
            shadows
            dpr={[1, 1.5]}
            gl={{
                preserveDrawingBuffer: true,
                antialias: true
            }}
            camera={{ position: [0, 0, 5], fov: 75 }}
        >
            {/* ATMOSPHERE: Warm, Dark, Smoky */}
            <color attach="background" args={['#1c1917']} /> {/* Stone 900 - Warm Black */}
            <fog attach="fog" args={['#1c1917', 5, 25]} />

            <ambientLight intensity={0.6} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow color="#fbbf24" />
            <pointLight position={[-10, -5, -5]} intensity={0.5} color="#ea580c" /> {/* Ember glow */}

            <AshParticles />

            <ScrollControls pages={4} damping={0.2}>
                <Suspense fallback={null}>
                    <IntroScene />
                    <VoyageScene />
                    <ChemistryScene />
                </Suspense>

                <Scroll html style={{ width: '100vw', height: '100vh' }}>
                    {/* SCENE 1: TITLE */}
                    <section className="h-screen flex items-center justify-center relative pointer-events-none">
                        <div className="text-center px-4">
                            <span className="block mb-4 text-amber-500 tracking-[0.5em] text-sm font-bold uppercase drop-shadow-md">Fizikhub 3D Experience</span>
                            <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter drop-shadow-2xl text-white">
                                TÜTÜN
                            </h1>
                            <p className="text-xl md:text-2xl text-stone-300 font-serif italic max-w-2xl mx-auto drop-shadow-lg">
                                "Tanrıların dumanından, sanayi devriminin bacalarına..."
                            </p>
                        </div>
                    </section>

                    {/* SCENE 2: VOYAGE */}
                    <section className="h-screen flex items-center relative pointer-events-none" style={{ top: '100vh', position: 'absolute' }}>
                        <div className="container mx-auto px-6 grid md:grid-cols-2">
                            <div className="bg-stone-900/60 backdrop-blur-md border border-stone-700 p-8 rounded-2xl shadow-2xl">
                                <div className="flex items-center gap-3 mb-4 text-amber-500">
                                    <Wind className="animate-pulse" />
                                    <h2 className="text-3xl font-bold">1492: Temas</h2>
                                </div>
                                <p className="text-lg text-stone-200 leading-relaxed">
                                    Kristof Kolomb, Bahamalar'a ayak bastığında, yerliler ona "kuru yapraklar" hediye etti.
                                    Bu yapraklar yorgunluğu alıyor, açlığı bastırıyordu.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SCENE 3: CHEMISTRY */}
                    <section className="h-screen flex items-center justify-center relative pointer-events-none" style={{ top: '200vh', position: 'absolute' }}>
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-800/50 p-10 rounded-3xl max-w-4xl mx-auto shadow-2xl">
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

                    {/* SCENE 4: CONCLUSION */}
                    <section className="h-screen flex flex-col items-center justify-center relative pointer-events-auto" style={{ top: '300vh', position: 'absolute', width: '100%' }}>
                        <div className="text-center max-w-3xl bg-black/80 p-12 rounded-3xl backdrop-blur-md border border-red-900/50">
                            <Skull className="w-24 h-24 text-red-600 mx-auto mb-8 animate-pulse" />
                            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">SONUÇ.</h2>
                            <p className="text-xl text-zinc-300 mb-12">
                                Fizikhub'da bilimi keşfetmeye devam et.
                            </p>
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform"
                            >
                                Diğer Makalelere Dön
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
