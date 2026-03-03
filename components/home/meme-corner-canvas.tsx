"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
    Texture, CanvasTexture, Points, Color,
    BufferGeometry, BufferAttribute, AdditiveBlending
} from "three";
import type { Points as PointsType } from "three";

// --- TEXTURES ---

// 1. STAR TEXTURE: Hard center for visibility
function getStarTexture() {
    if (typeof document === 'undefined') return new Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new Texture();

    const center = 16;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 15);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.15, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}

// 2. NEBULA TEXTURE: Pure soft cloud
function getNebulaTexture() {
    if (typeof document === 'undefined') return new Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new Texture();

    const center = 32;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 32);
    // Soft puffy cloud
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}


// --- MAIN STARS ( Bright & Distinct ) ---
function MainStars({ count = 7000 }) {
    const pointsRef = useRef<PointsType>(null!);
    const texture = useMemo(() => getStarTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const c_Core = new Color('#fff5c2');    // Golden Core
        const c_Inner = new Color('#d4f1ff');   // White-Blue
        const c_Outer = new Color('#5599ff');   // Electric Blue

        const arms = 2;
        const spin = 3.5;
        const bulgeCount = 2800;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const color = new Color();

            if (i < bulgeCount) {
                // Bulge
                const r = Math.pow(Math.random(), 3) * 3.0;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = (r * Math.sin(phi) * Math.sin(theta)) * 0.7;
                const z = r * Math.cos(phi);

                positions[i3] = x;
                positions[i3 + 1] = y;
                positions[i3 + 2] = z;

                color.copy(c_Core);
                // Core brilliance
                if (Math.random() > 0.7) color.multiplyScalar(1.5);

            } else {
                // Arms
                const rRandom = Math.pow(Math.random(), 1.5);
                const radius = 2.5 + rRandom * 8;

                const branchAngle = ((i % arms) / arms) * Math.PI * 2;
                const spinAngle = radius * 0.6 * spin;

                // Tighter scatter for main stars = "Structure"
                const scatterBase = 0.15 + (radius * 0.05);
                const randomX = (Math.random() - 0.5) * scatterBase * 2;
                const randomY = (Math.random() - 0.5) * (0.2 + radius * 0.05);
                const randomZ = (Math.random() - 0.5) * scatterBase * 2;

                const finalAngle = branchAngle + spinAngle;
                const x = Math.cos(finalAngle) * radius + randomX;
                const z = Math.sin(finalAngle) * radius + randomZ;

                positions[i3] = x;
                positions[i3 + 1] = randomY;
                positions[i3 + 2] = z;

                color.copy(c_Inner).lerp(c_Outer, (radius - 2.5) / 6);

                // Occasional Red Giants / Bright Stars
                const rand = Math.random();
                if (rand > 0.95) color.set('#ffffff').multiplyScalar(2.0); // Super bright
                else if (rand > 0.90) color.set('#ffccaa'); // Red/Orange giant
            }

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        const geo = new BufferGeometry();
        geo.setAttribute('position', new BufferAttribute(positions, 3));
        geo.setAttribute('color', new BufferAttribute(colors, 3));
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
                blending={AdditiveBlending}
                vertexColors
                transparent
                opacity={1.0}
            />
        </points>
    );
}

// --- VOLUMETRIC NEBULA (MAX VISIBILITY) ---
function NebulaClouds({ count = 8000 }) {
    const pointsRef = useRef<PointsType>(null!);
    const texture = useMemo(() => getNebulaTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        // Deep Navy & Purple Theme
        const c_Pink = new Color('#aa00ff');   // Violet highlights
        const c_Purple = new Color('#4400ff'); // Deep Indigo
        const c_Blue = new Color('#001155');   // Very Dark Navy

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const radius = 1 + Math.random() * 10;
            const angle = Math.random() * Math.PI * 2;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 3.0; // Volume

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            const color = new Color();
            const mix = Math.random();
            if (mix < 0.33) color.copy(c_Pink);
            else if (mix < 0.66) color.copy(c_Purple);
            else color.copy(c_Blue);

            // Boost brightness
            color.multiplyScalar(1.2);

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        const geo = new BufferGeometry();
        geo.setAttribute('position', new BufferAttribute(positions, 3));
        geo.setAttribute('color', new BufferAttribute(colors, 3));
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
                blending={AdditiveBlending}
                vertexColors
                transparent
                opacity={0.5}
            />
        </points>
    );
}

// --- DISTANT BACKGROUND STARS ---
function BackgroundStars({ count = 2000 }) {
    const pointsRef = useRef<PointsType>(null!);
    const texture = useMemo(() => getStarTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const c_White = new Color('#ffffff');
        const c_Blue = new Color('#aaaaff');

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Distant Sphere
            const r = 20 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            const color = new Color();
            color.copy(Math.random() > 0.5 ? c_White : c_Blue);

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        const geo = new BufferGeometry();
        geo.setAttribute('position', new BufferAttribute(positions, 3));
        geo.setAttribute('color', new BufferAttribute(colors, 3));
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
                blending={AdditiveBlending}
                vertexColors
                transparent
                opacity={0.6} // Faint
            />
        </points>
    );
}

export default function MemeCornerCanvas() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    return (
        <Canvas
            camera={{ position: [0, 5, 7], fov: 50 }}
            gl={{
                antialias: false,
                powerPreference: "high-performance",
                alpha: true
            }}
            dpr={[1, 1.5]}
            frameloop="always"
        >
            <group>
                <BackgroundStars count={isMobile ? 1000 : 2000} />
                <MainStars count={isMobile ? 3500 : 7000} />
                <NebulaClouds count={isMobile ? 4000 : 8000} />
            </group>

            {!isMobile && (
                <EffectComposer enableNormalPass={false} multisampling={0}>
                    <Bloom
                        luminanceThreshold={0.5}
                        intensity={1.0}
                        radius={0.15}
                    />
                </EffectComposer>
            )}
        </Canvas>
    );
}
