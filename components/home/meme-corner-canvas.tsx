"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- TEXTURES ---
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

// --- COMBINED GALAXY (single geometry, single draw call) ---
function CombinedGalaxy({ isMobile }: { isMobile: boolean }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);

    // Mobile: 5K particles, Desktop: 15K - single pass
    const count = isMobile ? 5000 : 15000;

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const c_Core = new THREE.Color('#fff5c2');
        const c_Inner = new THREE.Color('#d4f1ff');
        const c_Outer = new THREE.Color('#5599ff');

        const arms = 2;
        const spin = 3.5;
        const bulgeCount = Math.floor(count * 0.3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const color = new THREE.Color();

            if (i < bulgeCount) {
                const r = Math.pow(Math.random(), 3) * 3.0;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                positions[i3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = (r * Math.sin(phi) * Math.sin(theta)) * 0.7;
                positions[i3 + 2] = r * Math.cos(phi);
                color.copy(c_Core);
                if (Math.random() > 0.7) color.multiplyScalar(1.5);
            } else {
                const rRandom = Math.pow(Math.random(), 1.5);
                const radius = 2.5 + rRandom * 8;
                const branchAngle = ((i % arms) / arms) * Math.PI * 2;
                const spinAngle = radius * 0.6 * spin;
                const scatterBase = 0.3 + (radius * 0.1);
                const randomX = (Math.random() - 0.5) * scatterBase * 2;
                const randomY = (Math.random() - 0.5) * (0.2 + radius * 0.04);
                const randomZ = (Math.random() - 0.5) * scatterBase * 2;
                const finalAngle = branchAngle + spinAngle;
                positions[i3] = Math.cos(finalAngle) * radius + randomX;
                positions[i3 + 1] = randomY;
                positions[i3 + 2] = Math.sin(finalAngle) * radius + randomZ;
                color.copy(c_Inner).lerp(c_Outer, (radius - 2.5) / 6);
                const rand = Math.random();
                if (rand > 0.95) color.set('#ffffff').multiplyScalar(2.0);
                else if (rand > 0.90) color.set('#ffccaa');
            }

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);

    useFrame((_, delta) => {
        if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.04;
    });

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={isMobile ? 0.4 : 0.35}
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

// --- BACKGROUND STARS (kept separate, minimal count) ---
function BackgroundStars({ count = 800 }: { count?: number }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);

    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const c_White = new THREE.Color('#ffffff');
        const c_Blue = new THREE.Color('#aaaaff');

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const r = 20 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);
            const color = new THREE.Color();
            color.copy(Math.random() > 0.5 ? c_White : c_Blue);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);

    // No useFrame for background stars — they're static. Saves a raf callback.

    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial
                map={texture}
                size={0.15}
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

export default function MemeCornerCanvas() {
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    }, []);

    // Pause canvas when not visible (IntersectionObserver)
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            {isVisible && (
                <Canvas
                    camera={{ position: [0, 5, 7], fov: 50 }}
                    gl={{
                        antialias: false,
                        powerPreference: isMobile ? "low-power" : "high-performance",
                        alpha: true,
                    }}
                    dpr={isMobile ? 1 : [1, 1.5]}
                    frameloop={isVisible ? "always" : "never"}
                >
                    <BackgroundStars count={isMobile ? 400 : 800} />
                    <CombinedGalaxy isMobile={isMobile} />
                    {/* REMOVED: EffectComposer + Bloom — massive GPU overhead on mobile */}
                </Canvas>
            )}
        </div>
    );
}
