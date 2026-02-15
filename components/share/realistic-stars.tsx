"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

// --- SHADERS ---

const starVertexShader = `
  uniform float uTime;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vColor = aColor;
    float twinkle = 0.5 + 0.5 * sin(uTime * 3.0 + aPhase); // Faster twinkle
    vOpacity = twinkle;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (500.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    float strength = pow(1.0 - r * 2.0, 2.0); 
    gl_FragColor = vec4(vColor, strength * vOpacity);
  }
`;

const shootingStarVertexShader = `
  uniform float uTime;
  attribute float aSpeed;
  attribute float aDelay;
  attribute vec3 aDirection;
  varying float vLife;

  void main() {
    float localTime = mod(uTime + aDelay, 4.0); // 4s loop
    float progress = localTime * aSpeed;
    vec3 pos = position + aDirection * progress;
    vLife = smoothstep(0.0, 0.2, localTime) * smoothstep(1.5, 0.2, localTime);
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 3.0 * (1000.0 / -mvPosition.z) * vLife;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const shootingStarFragmentShader = `
  varying float vLife;
  uniform vec3 uColor;
  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    gl_FragColor = vec4(uColor, vLife * (1.0 - r * 2.0));
  }
`;

function Stars({ count = 1500, isDark }: { count?: number, isDark: boolean }) {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);

    const { positions, sizes, colors, phases } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const sz = new Float32Array(count);
        const col = new Float32Array(count * 3);
        const pha = new Float32Array(count);

        // Color Palette based on Theme
        const darkPalette = [new THREE.Color("#ffffff"), new THREE.Color("#A5F3FC"), new THREE.Color("#FDE68A")]; // White, Cyan, Amber
        const lightPalette = [new THREE.Color("#333333"), new THREE.Color("#4B5563"), new THREE.Color("#000000")]; // Dark Grey, Grey, Black

        const palette = isDark ? darkPalette : lightPalette;

        for (let i = 0; i < count; i++) {
            const r = 400 + Math.random() * 600;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            sz[i] = Math.random() * 3.0 + 1.0;
            pha[i] = Math.random() * Math.PI * 2;

            const randomColor = palette[Math.floor(Math.random() * palette.length)];
            col[i * 3] = randomColor.r;
            col[i * 3 + 1] = randomColor.g;
            col[i * 3 + 2] = randomColor.b;
        }
        return { positions: pos, sizes: sz, colors: col, phases: pha };
    }, [count, isDark]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
                <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
                <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={starVertexShader}
                fragmentShader={starFragmentShader}
                uniforms={{ uTime: { value: 0 } }}
                transparent
                depthWrite={false}
                blending={THREE.NormalBlending} // Use Normal for dark stars on light bg
            />
        </points>
    );
}

function ShootingStars({ count = 10, isDark }: { count?: number, isDark: boolean }) {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);

    const { positions, speeds, delays, directions } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const spd = new Float32Array(count);
        const del = new Float32Array(count);
        const dir = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Spawn in a wide band above and to the left of the screen
            // x: -100 to 800 (mostly left/center)
            // y: 0 to 600 (mostly top)
            // z: -100 to 100 (depth variance)
            pos[i * 3] = (Math.random() - 0.5) * 1200;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 1200;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 200;

            spd[i] = 300 + Math.random() * 400; // Faster speed
            del[i] = Math.random() * 4.0;

            // Direction: Top-Left to Bottom-Right
            // X: Positive (Right)
            // Y: Negative (Down)
            const d = new THREE.Vector3(
                0.8 + Math.random() * 0.4, // Mostly Right
                -0.6 - Math.random() * 0.4, // Mostly Down
                0
            ).normalize();

            dir[i * 3] = d.x;
            dir[i * 3 + 1] = d.y;
            dir[i * 3 + 2] = d.z;
        }
        return { positions: pos, speeds: spd, delays: del, directions: dir };
    }, [count]);

    // Stable uniforms
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color() }
    }), []);

    // Update color when theme changes
    useEffect(() => {
        uniforms.uColor.value.set(isDark ? "#ffffff" : "#000000");
    }, [isDark, uniforms]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
                <bufferAttribute attach="attributes-aDelay" args={[delays, 1]} />
                <bufferAttribute attach="attributes-aDirection" args={[directions, 3]} />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={shootingStarVertexShader}
                fragmentShader={shootingStarFragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.NormalBlending}
            />
        </points>
    );
}

export function RealisticStars() {
    const { resolvedTheme } = useTheme();
    // Default to strict check, but handle hydration
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // If not mounted, assume dark (ssr safe default for this page style) or check system
    const isDark = mounted ? resolvedTheme === "dark" : true;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1], fov: 75 }} gl={{ alpha: true }}>
                <Stars count={1200} isDark={isDark} />
                <ShootingStars count={25} isDark={isDark} />
            </Canvas>
        </div>
    );
}
