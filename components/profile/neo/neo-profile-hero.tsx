"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";

// --- TEXTURES (Reused from MemeCorner for consistency) ---
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

function getNebulaTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();
    const center = 32;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}

// --- GALAXY DUST ---
function GalaxyDust({ count = 30000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const c_Inner = new THREE.Color('#66aaff');
        const c_Outer = new THREE.Color('#3355aa');
        const arms = 2;
        const spin = 3.5;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const rRandom = Math.pow(Math.random(), 1.5);
            const radius = 1.0 + rRandom * 10;
            const branchAngle = ((i % arms) / arms) * Math.PI * 2;
            const spinAngle = radius * 0.6 * spin;
            const scatterBase = 0.4 + (radius * 0.15);
            const randomX = (Math.random() - 0.5) * scatterBase * 2;
            const randomY = (Math.random() - 0.5) * (0.1 + radius * 0.02);
            const randomZ = (Math.random() - 0.5) * scatterBase * 2;
            const finalAngle = branchAngle + spinAngle;
            const x = Math.cos(finalAngle) * radius + randomX;
            const z = Math.sin(finalAngle) * radius + randomZ;
            positions[i3] = x;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = z;
            const color = new THREE.Color();
            color.copy(c_Inner).lerp(c_Outer, radius / 10);
            color.multiplyScalar(0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);
    useFrame((state, delta) => { if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.05; });
    return <points ref={pointsRef}><primitive object={geometry} /><pointsMaterial map={texture} size={0.12} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} vertexColors transparent opacity={0.6} /></points>;
}

// --- MAIN STARS ---
function MainStars({ count = 10000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const c_Core = new THREE.Color('#fff5c2');
        const c_Inner = new THREE.Color('#d4f1ff');
        const c_Outer = new THREE.Color('#5599ff');
        const arms = 2;
        const spin = 3.5;
        const bulgeCount = 4000;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const color = new THREE.Color();
            if (i < bulgeCount) {
                const r = Math.pow(Math.random(), 3) * 3.0;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = (r * Math.sin(phi) * Math.sin(theta)) * 0.7;
                const z = r * Math.cos(phi);
                positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
                color.copy(c_Core);
                if (Math.random() > 0.7) color.multiplyScalar(1.5);
            } else {
                const rRandom = Math.pow(Math.random(), 1.5);
                const radius = 2.5 + rRandom * 8;
                const branchAngle = ((i % arms) / arms) * Math.PI * 2;
                const spinAngle = radius * 0.6 * spin;
                const scatterBase = 0.15 + (radius * 0.05);
                const randomX = (Math.random() - 0.5) * scatterBase * 2;
                const randomY = (Math.random() - 0.5) * (0.2 + radius * 0.05);
                const randomZ = (Math.random() - 0.5) * scatterBase * 2;
                const finalAngle = branchAngle + spinAngle;
                const x = Math.cos(finalAngle) * radius + randomX;
                const z = Math.sin(finalAngle) * radius + randomZ;
                positions[i3] = x; positions[i3 + 1] = randomY; positions[i3 + 2] = z;
                color.copy(c_Inner).lerp(c_Outer, (radius - 2.5) / 6);
                const rand = Math.random();
                if (rand > 0.95) color.set('#ffffff').multiplyScalar(2.0);
                else if (rand > 0.90) color.set('#ffccaa');
            }
            colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);
    useFrame((state, delta) => { if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.05; });
    return <points ref={pointsRef}><primitive object={geometry} /><pointsMaterial map={texture} size={0.35} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} vertexColors transparent opacity={1.0} /></points>;
}

// --- NEBULA CLOUDS ---
function NebulaClouds({ count = 8000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getNebulaTexture(), []);
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const c_Pink = new THREE.Color('#aa00ff');
        const c_Purple = new THREE.Color('#4400ff');
        const c_Blue = new THREE.Color('#001155');
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const radius = 1 + Math.random() * 10;
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 3.0;
            positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
            const color = new THREE.Color();
            const mix = Math.random();
            if (mix < 0.33) color.copy(c_Pink); else if (mix < 0.66) color.copy(c_Purple); else color.copy(c_Blue);
            color.multiplyScalar(1.2);
            colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);
    useFrame((state, delta) => { if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.02; });
    return <points ref={pointsRef}><primitive object={geometry} /><pointsMaterial map={texture} size={3.0} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} vertexColors transparent opacity={0.5} /></points>;
}

// --- BACKGROUND STARS ---
function BackgroundStars({ count = 2000 }) {
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
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
            const color = new THREE.Color();
            color.copy(Math.random() > 0.5 ? c_White : c_Blue);
            colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);
    useFrame((state, delta) => { if (pointsRef.current) pointsRef.current.rotation.y -= delta * 0.005; });
    return <points ref={pointsRef}><primitive object={geometry} /><pointsMaterial map={texture} size={0.15} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} vertexColors transparent opacity={0.6} /></points>;
}

interface NeoProfileHeroProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    isFollowing?: boolean;
}

export function NeoProfileHero({ profile, user, isOwnProfile, isFollowing = false }: NeoProfileHeroProps) {
    return (
        <div className="w-full relative group shadow-[4px_4px_0px_#000] border-[3px] border-black rounded-[8px] overflow-hidden">
            {/* GLOBAL STYLES */}
            <style jsx global>{`
                @keyframes gradient-flow { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                @keyframes shimmer { 0% { transform: translateX(-100%) rotate(25deg); } 100% { transform: translateX(200%) rotate(25deg); } }
                @keyframes pulse-glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
            `}</style>

            {/* CONTAINER HEIGHT - same as MemeCorner on Desktop, larger on mobile for profile info */}
            <div className="relative w-full h-[300px] sm:h-[240px] bg-[radial-gradient(120%_120%_at_50%_50%,_#2a0a45_0%,_#050514_50%,_#000000_100%)]">

                {/* 3D CANVAS BACKGROUND */}
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 5, 7], fov: 50 }} gl={{ antialias: false, powerPreference: "high-performance", alpha: true }} dpr={[1, 2]}>
                        <group>
                            <BackgroundStars />
                            <GalaxyDust />
                            <MainStars />
                            <NebulaClouds />
                        </group>
                        <EffectComposer enableNormalPass={false}>
                            <Bloom luminanceThreshold={0.6} mipmapBlur intensity={1.1} radius={0.4} />
                        </EffectComposer>
                    </Canvas>
                </div>

                {/* VISUAL EFFECTS OVERLAYS */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
                <div className="absolute inset-0 z-[2] pointer-events-none opacity-[0.03]" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)` }} />
                <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_4s_ease-in-out_infinite]" style={{ top: '-50%' }} />
                </div>

                {/* HUD CORNERS */}
                <svg className="absolute top-2 right-2 w-6 h-6 text-cyan-400/40 z-20 animate-[pulse-glow_3s_ease-in-out_infinite]"><path d="M23 9V1H15" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                <svg className="absolute bottom-2 left-2 w-6 h-6 text-cyan-400/40 z-20 animate-[pulse-glow_3s_ease-in-out_infinite_0.5s]"><path d="M1 15V23H9" stroke="currentColor" strokeWidth="2" fill="none" /></svg>

                {/* PROFILE CONTENT */}
                <div className="absolute inset-0 z-20 flex flex-col sm:flex-row items-center sm:items-end p-6 gap-6">
                    {/* Avatar */}
                    <div className="relative shrink-0 group/avatar">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-black border-[3px] border-white/20 shadow-[4px_4px_0px_#000] overflow-hidden rounded-full sm:rounded-[4px] relative z-10">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-3xl font-black text-neutral-600">
                                    {profile?.full_name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                        {/* Orbit Ring for Avatar */}
                        <div className="absolute inset-[-4px] border border-cyan-500/30 rounded-full sm:rounded-[6px] animate-[pulse-glow_2s_infinite]" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left mb-2">
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md font-[family-name:var(--font-outfit)]">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                            <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">
                                @{profile?.username}
                            </span>
                            {profile?.is_verified && (
                                <span className="bg-[#FFC800] text-black text-[10px] font-bold px-1.5 py-0.5 border border-black">
                                    VERIFIED
                                </span>
                            )}
                        </div>
                        {profile?.bio && (
                            <p className="mt-3 text-neutral-300/80 text-sm max-w-lg leading-relaxed line-clamp-2 font-mono">
                                {profile.bio}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0 mb-2">
                        {isOwnProfile ? (
                            <ProfileSettingsDialog
                                currentUsername={profile?.username}
                                currentFullName={profile?.full_name}
                                currentBio={profile?.bio}
                                currentAvatarUrl={profile?.avatar_url}
                                currentCoverUrl={profile?.cover_url}
                                currentWebsite={profile?.website}
                                currentSocialLinks={profile?.social_links}
                                userEmail={user?.email}
                                trigger={
                                    <button className="px-6 py-2 bg-white text-black font-black uppercase tracking-wider text-xs border-[2px] border-transparent hover:bg-[#FFC800] hover:border-black transition-all shadow-lg">
                                        PROFİLİ DÜZENLE
                                    </button>
                                }
                            />
                        ) : (
                            <FollowButton
                                targetUserId={profile?.id}
                                initialIsFollowing={isFollowing}
                                targetUsername={profile?.username}
                                variant="modern"
                            />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
