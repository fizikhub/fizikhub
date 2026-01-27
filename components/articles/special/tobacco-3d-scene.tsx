"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Text, Float, Stars, Sparkles, Cloud } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

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
                    font="/fonts/Inter-Bold.ttf" // Fallback or assume standard font load if available, else default
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

export function Tobacco3DScene({ children }: { children?: React.ReactNode }) {
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

                    {/* HTML Overlay Content */}
                    {children}
                </ScrollControls>
            </Canvas>
        </div>
    );
}
