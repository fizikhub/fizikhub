"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

// --- STATIC STARS (Twinkling) ---
const starVertexShader = `
  uniform float uTime;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vColor = aColor;
    float twinkle = 0.5 + 0.5 * sin(uTime * 2.0 + aPhase);
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
    // Soft glow
    float strength = pow(1.0 - r * 2.0, 2.0); 
    gl_FragColor = vec4(vColor, strength * vOpacity);
  }
`;

// --- METEOR SYSTEM (Instanced Mesh) ---
// Each instance is a long thin plane.
// We move the entire instance along a path.

const meteorVertexShader = `
  attribute float aDelay;
  attribute float aSpeed;
  attribute vec3 aStart; // Start position
  attribute vec3 aEnd;   // End position
  
  uniform float uTime;
  
  varying float vAlpha;
  varying vec2 vUv;

  // Rotation matrix around Z axis
  mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
  }

  void main() {
    vUv = uv;
    
    // Time loop: 0 -> 6 seconds
    float loopDuration = 4.0; 
    float time = mod(uTime + aDelay, loopDuration);
    
    // Progress: 0.0 -> 1.0
    float progress = time / 1.5; // Move quickly (1.5s traverse)
    
    // If finished, hide it massive scaling to 0? Or discard?
    // We'll just clamp position or fade out.
    
    if (progress > 1.0) {
        vAlpha = 0.0;
        gl_Position = vec4(2.0, 2.0, 2.0, 1.0); // Clip
        return;
    }

    // Current Center Position of the Meteor
    vec3 currentCenter = mix(aStart, aEnd, progress);
    
    // Direction Vector
    vec3 dir = normalize(aEnd - aStart);
    
    // Angle for rotation (Assuming default plane is horizontal or vertical?)
    // Default Plane is XY. aligned with Y? 
    // Let's assume plane is horizontal (X axis).
    // Angle = atan2(dir.y, dir.x);
    float angle = atan(dir.y, dir.x);
    
    // Apply Rotation to the vertex position (local space)
    vec4 localPosition = rotationMatrix(vec3(0.0, 0.0, 1.0), angle) * vec4(position, 1.0);
    
    // Move to global position
    vec4 worldPosition = vec4(currentCenter + localPosition.xyz, 1.0);
    
    // Trail Fade Logic
    // Fade IN (0.0 -> 0.1)
    // Fade OUT (0.8 -> 1.0)
    float fade = smoothstep(0.0, 0.1, progress) * smoothstep(1.0, 0.8, progress);
    vAlpha = fade;

    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
  }
`;

const meteorFragmentShader = `
  varying float vAlpha;
  varying vec2 vUv;
  uniform vec3 uColor;

  void main() {
    // Gradient along UV.x (Head to Tail)
    // Assuming UV.x 0 is tail, 1 is head? Or vice versa.
    // Let's make a nice glow.
    
    // Horizontal Gradient (Tail fade)
    float gradient = smoothstep(0.0, 1.0, vUv.x); 
    
    // Vertical Glow (Core)
    float core = 1.0 - abs(vUv.y - 0.5) * 2.0;
    core = pow(core, 2.0); // Sharpen core
    
    float alpha = gradient * core * vAlpha;
    
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

function Meteors({ count = 15, isDark }: { count?: number, isDark: boolean }) {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const materialRef = useRef<THREE.ShaderMaterial>(null!);

    // Uniforms
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color() }
    }), []);

    // Theme Color Update
    useEffect(() => {
        // High visibility colors
        uniforms.uColor.value.set(isDark ? "#ffffff" : "#000000");
    }, [isDark]);

    // Instance Data
    const { delays, speeds, starts, ends } = useMemo(() => {
        const d = new Float32Array(count);
        const s = new Float32Array(count);
        const start = new Float32Array(count * 3);
        const end = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            d[i] = Math.random() * 5.0; // Random delay up to 5s
            s[i] = 1.0 + Math.random(); // Speed multiplier

            // STRICT GEOMETRY: TOP-LEFT to BOTTOM-RIGHT
            // Left of screen (-600 to -200) || Top of screen (300 to 600)
            const fromLeft = Math.random() > 0.5;
            let sx, sy;

            if (fromLeft) {
                sx = -500 - Math.random() * 300;
                sy = (Math.random() - 0.5) * 600;
            } else {
                sx = (Math.random() - 0.5) * 600;
                sy = 500 + Math.random() * 300;
            }

            // End Point: Add robust diagonal vector
            // Vector: (+1000, -800)
            const ex = sx + 1200 + Math.random() * 400;
            const ey = sy - 1000 - Math.random() * 400;

            start[i * 3] = sx;
            start[i * 3 + 1] = sy;
            start[i * 3 + 2] = -50; // In front of stars

            end[i * 3] = ex;
            end[i * 3 + 1] = ey;
            end[i * 3 + 2] = -50;
        }

        return { delays: d, speeds: s, starts: start, ends: end };
    }, [count]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <planeGeometry args={[150, 4]} /> {/* 300 unit long, 3 unit thick trail */}
            <shaderMaterial
                ref={materialRef}
                vertexShader={meteorVertexShader}
                fragmentShader={meteorFragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                side={THREE.DoubleSide}
                blending={THREE.NormalBlending}
            />

            {/* Attributes */}
            <instancedBufferAttribute attach="instanceAttributes-aDelay" args={[delays, 1]} />
            <instancedBufferAttribute attach="instanceAttributes-aSpeed" args={[speeds, 1]} />
            <instancedBufferAttribute attach="instanceAttributes-aStart" args={[starts, 3]} />
            <instancedBufferAttribute attach="instanceAttributes-aEnd" args={[ends, 3]} />
        </instancedMesh>
    );
}

function Stars({ count = 2000, isDark }: { count?: number, isDark: boolean }) {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);

    const { positions, sizes, colors, phases } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const sz = new Float32Array(count);
        const col = new Float32Array(count * 3);
        const pha = new Float32Array(count);

        const darkPalette = [new THREE.Color("#ffffff"), new THREE.Color("#A5F3FC"), new THREE.Color("#FDE68A")];
        const lightPalette = [new THREE.Color("#333333"), new THREE.Color("#4B5563"), new THREE.Color("#000000")];
        const palette = isDark ? darkPalette : lightPalette;

        for (let i = 0; i < count; i++) {
            const r = 400 + Math.random() * 800; // Wider field
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
        // Rotate Slowly
        // No ref to points here, can add rotation logic if needed or static.
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
                blending={THREE.NormalBlending}
            />
        </points>
    );
}

export function RealisticStars() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted ? resolvedTheme === "dark" : true;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1], fov: 75 }} gl={{ alpha: true }}>
                <Stars count={1200} isDark={isDark} />
                <Meteors count={20} isDark={isDark} />
            </Canvas>
        </div>
    );
}
