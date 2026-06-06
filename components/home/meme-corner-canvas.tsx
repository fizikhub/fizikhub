"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Pure deterministic PRNG for React Compiler compliance
function createPureRandom(seed = 1) {
    let s = seed;
    return function() {
        const x = Math.sin(s++) * 10000;
        return x - Math.floor(x);
    };
}

// --- TEXTURES ---

// 1. STAR TEXTURE: Hard center for visibility
function getStarTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const center = 16;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 15);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.15, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}

// 2. NEBULA TEXTURE: Pure soft cloud
function getNebulaTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const center = 32;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 32);
    // Soft puffy cloud
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}

// --- GALAXY DUST ( The Haze ) ---
function GalaxyDust({ count = 30000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []); // Use same texture, just smaller

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const c_Inner = new THREE.Color('#66aaff'); // Dusty Blue
        const c_Outer = new THREE.Color('#3355aa'); // Deep Dust
        const tempColor = new THREE.Color();
        const random = createPureRandom(42);

        const arms = 2;
        const spin = 3.5;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Dust is mostly in the arms
            const rRandom = Math.pow(random(), 1.5);
            const radius = 1.0 + rRandom * 10;

            const branchAngle = ((i % arms) / arms) * Math.PI * 2;
            const spinAngle = radius * 0.6 * spin;

            // More scatter for dust = "Cloud/Haze" effect
            const scatterBase = 0.4 + (radius * 0.15);
            const randomX = (random() - 0.5) * scatterBase * 2;
            const randomY = (random() - 0.5) * (0.1 + radius * 0.02); // Flat
            const randomZ = (random() - 0.5) * scatterBase * 2;

            const finalAngle = branchAngle + spinAngle;
            const x = Math.cos(finalAngle) * radius + randomX;
            const z = Math.sin(finalAngle) * radius + randomZ;

            positions[i3] = x;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = z;

            tempColor.copy(c_Inner).lerp(c_Outer, radius / 10).multiplyScalar(0.6); // Dimmer than stars

            colors[i3] = tempColor.r;
            colors[i3 + 1] = tempColor.g;
            colors[i3 + 2] = tempColor.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);

    useFrame((state, delta) => {
        if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={0.12} // Very small points
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={0.6}
            />
        </points>
    );
}

// --- MAIN STARS ( Bright & Distinct ) ---
function MainStars({ count = 10000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const c_Core = new THREE.Color('#fff5c2');    // Golden Core
        const c_Inner = new THREE.Color('#d4f1ff');   // White-Blue
        const c_Outer = new THREE.Color('#5599ff');   // Electric Blue
        const tempColor = new THREE.Color();
        const random = createPureRandom(77);

        const arms = 2;
        const spin = 3.5;
        const bulgeCount = 4000;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            if (i < bulgeCount) {
                // Bulge
                const r = Math.pow(random(), 3) * 3.0;
                const theta = random() * Math.PI * 2;
                const phi = Math.acos(2 * random() - 1);

                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = (r * Math.sin(phi) * Math.sin(theta)) * 0.7;
                const z = r * Math.cos(phi);

                positions[i3] = x;
                positions[i3 + 1] = y;
                positions[i3 + 2] = z;

                tempColor.copy(c_Core);
                // Core brilliance
                if (random() > 0.7) tempColor.multiplyScalar(1.5);

            } else {
                // Arms
                const rRandom = Math.pow(random(), 1.5);
                const radius = 2.5 + rRandom * 8;

                const branchAngle = ((i % arms) / arms) * Math.PI * 2;
                const spinAngle = radius * 0.6 * spin;

                // Tighter scatter for main stars = "Structure"
                const scatterBase = 0.15 + (radius * 0.05);
                const randomX = (random() - 0.5) * scatterBase * 2;
                const randomY = (random() - 0.5) * (0.2 + radius * 0.05);
                const randomZ = (random() - 0.5) * scatterBase * 2;

                const finalAngle = branchAngle + spinAngle;
                const x = Math.cos(finalAngle) * radius + randomX;
                const z = Math.sin(finalAngle) * radius + randomZ;

                positions[i3] = x;
                positions[i3 + 1] = randomY;
                positions[i3 + 2] = z;

                tempColor.copy(c_Inner).lerp(c_Outer, (radius - 2.5) / 6);

                // Occasional Red Giants / Bright Stars
                const rand = random();
                if (rand > 0.95) tempColor.set('#ffffff').multiplyScalar(2.0); // Super bright
                else if (rand > 0.90) tempColor.set('#ffccaa'); // Red/Orange giant
            }

            colors[i3] = tempColor.r;
            colors[i3 + 1] = tempColor.g;
            colors[i3 + 2] = tempColor.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);

    useFrame((state, delta) => {
        if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={0.35} // Larger, distinct stars
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={1.0}
            />
        </points>
    );
}

// --- VOLUMETRIC NEBULA (MAX VISIBILITY) ---
function NebulaClouds({ count = 8000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getNebulaTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        // Deep Navy & Purple Theme
        const c_Pink = new THREE.Color('#aa00ff');   // Violet highlights
        const c_Purple = new THREE.Color('#4400ff'); // Deep Indigo
        const c_Blue = new THREE.Color('#001155');   // Very Dark Navy
        const tempColor = new THREE.Color();
        const random = createPureRandom(999);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const radius = 1 + random() * 10;
            const angle = random() * Math.PI * 2;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (random() - 0.5) * 3.0; // Volume

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            const mix = random();
            if (mix < 0.33) tempColor.copy(c_Pink);
            else if (mix < 0.66) tempColor.copy(c_Purple);
            else tempColor.copy(c_Blue);

            // Boost brightness
            tempColor.multiplyScalar(1.2);

            colors[i3] = tempColor.r;
            colors[i3 + 1] = tempColor.g;
            colors[i3 + 2] = tempColor.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);

    useFrame((state, delta) => {
        if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.02;
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={3.0} // Large volumetric look
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={0.5}
            />
        </points>
    );
}

// --- DISTANT BACKGROUND STARS ---
function BackgroundStars({ count = 2000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const c_White = new THREE.Color('#ffffff');
        const c_Blue = new THREE.Color('#aaaaff');
        const tempColor = new THREE.Color();
        const random = createPureRandom(888);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Distant Sphere
            const r = 20 + random() * 20;
            const theta = random() * Math.PI * 2;
            const phi = Math.acos(2 * random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            tempColor.copy(random() > 0.5 ? c_White : c_Blue);

            colors[i3] = tempColor.r;
            colors[i3 + 1] = tempColor.g;
            colors[i3 + 2] = tempColor.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);

    useFrame((state, delta) => {
        if (pointsRef.current) pointsRef.current.rotation.y -= delta * 0.005; // Very slow counter-rotation
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={0.15} // Tiny distant dots
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={0.6} // Faint
            />
        </points>
    );
}

export default function MemeCornerCanvas() {
    const [shouldRender, setShouldRender] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;

        setShouldRender(!prefersReducedMotion && !isTouchDevice && deviceMemory >= 4 && cores >= 4);
    }, []);

    if (!mounted || !shouldRender) {
        // Return a lightweight empty div maintaining dimensions if necessary, or null.
        return null; 
    }

    return (
        <Canvas
            camera={{ position: [0, 5, 7], fov: 50 }}
            gl={{
                antialias: false,
                powerPreference: "low-power",
                alpha: true
            }}
            dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
        >
            <group>
                <BackgroundStars />
                <GalaxyDust count={9000} />
                <MainStars count={3500} />
                <NebulaClouds count={2200} />
            </group>

            <EffectComposer enableNormalPass={false} multisampling={0}>
                <Bloom
                    luminanceThreshold={0.6} // Higher threshold = Only brightest stars glow
                    intensity={1.0}
                    radius={0.2} // Sharper glow
                />
            </EffectComposer>
        </Canvas>
    );
}
