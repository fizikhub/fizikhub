"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Sphere, OrbitControls } from "@react-three/drei";

// --- SHADERS (The Magic) ---

// Vertex Shader: Standard simulation of vertex positions
const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`;

// Fragment Shader: Black Hole Accretion Disk & Lensing
const fragmentShader = `
uniform float uTime;
uniform vec3 uColor;
uniform float uMobile; // 1.0 for mobile, 0.0 for desktop

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

// Noise function
float hash(float n) { return fract(sin(n) * 43758.5453123); }
float noise(in vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                   mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
               mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                   mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
}

void main() {
    // Basic Accretion Disk Glow
    float dist = length(vPosition);
    float angle = atan(vPosition.z, vPosition.x);
    
    // Rotating noise for the plasma look
    float plasma = noise(vec3(vPosition.x * 2.0 + cos(uTime), vPosition.y * 5.0, vPosition.z * 2.0 + sin(uTime)));
    
    // Doppler beaming simulation (brighter on one side)
    float doppler = 1.0 + 0.5 * sin(angle - uTime * 2.0);
    
    // Horizon fade
    float horizon = smoothstep(1.0, 1.5, dist);
    
    // Color mixing
    vec3 coreColor = vec3(0.0); // Event Horizon (Black)
    vec3 diskColor = mix(vec3(1.0, 0.3, 0.0), vec3(0.2, 0.5, 1.0), plasma); // Orange to Blue plasma
    
    // Intensity faloff
    float intensity = 1.0 / (dist * dist * 0.5);
    
    // Final composite
    if (dist < 1.05) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // The hole itself
    } else {
        gl_FragColor = vec4(diskColor * doppler * intensity * 2.0, 1.0);
    }
    
    // Add "Gravitational Lensing" fake effect (rim glow)
    float fresnel = pow(1.0 - dot(vNormal, normalize(vViewPosition)), 3.0);
    gl_FragColor.rgb += vec3(0.5, 0.8, 1.0) * fresnel * 0.5;
}
`;


export function BlackHoleSimulation() {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // Check if mobile (reduce complexity)
    const isMobile = useMemo(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth < 768;
    }, []);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColor: { value: new THREE.Color("#ffaa00") },
            uMobile: { value: isMobile ? 1.0 : 0.0 },
        }),
        [isMobile]
    );

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
        if (meshRef.current) {
            // Slowly rotate the whole system
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />

            {/* The Accretion Disk Mesh */}
            <mesh ref={meshRef} rotation={[Math.PI / 6, 0, 0]}>
                {/* 
                   We use a TorusGeometry flattened to look like a disk 
                   or a very dense Sphere for the volumetric effect 
                */}
                <sphereGeometry args={[isMobile ? 2 : 2.5, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
                <shaderMaterial
                    ref={materialRef}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    transparent
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Particle Field (Stars being consumed) */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[new Float32Array(
                            Array.from({ length: (isMobile ? 500 : 2000) * 3 }, () => (Math.random() - 0.5) * 10)
                        ), 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.02}
                    color="#ffffff"
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                />
            </points>
        </group>
    );
}
