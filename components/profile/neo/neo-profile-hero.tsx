"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";
import { Mail, MoreHorizontal } from "lucide-react";
import Link from "next/link";

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
    stats?: {
        reputation: number;
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
    };
}

export function NeoProfileHero({ profile, user, isOwnProfile, isFollowing = false, stats }: NeoProfileHeroProps) {

    const formatNumber = (num: number) =>
        new Intl.NumberFormat('tr-TR', { notation: "compact", maximumFractionDigits: 1 }).format(num);

    return (
        <div className="w-full relative group mb-12 sm:mb-0">
            {/* GLOBAL STYLES */}
            <style jsx global>{`
                @keyframes gradient-flow { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                @keyframes shimmer { 0% { transform: translateX(-100%) rotate(25deg); } 100% { transform: translateX(200%) rotate(25deg); } }
                @keyframes pulse-glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
            `}</style>

            {/* HER0 BACKGROUND CONTAINER 
                Mobile: Curved Bottom, No Border, Full Width Breakout
                Desktop: Rounded Rectangle, Border
            */}
            <div className={cn(
                "relative overflow-hidden bg-[radial-gradient(120%_120%_at_50%_50%,_#2a0a45_0%,_#050514_50%,_#000000_100%)]",
                // Mobile Breakout Styles: Counteract parent padding (px-2, pt-4)
                "-mx-2 -mt-4 w-[calc(100%+1rem)]",
                "h-[180px] rounded-b-[15%] border-b-[4px] border-b-cyan-500/30",
                // Desktop Reset & Styles
                "sm:mx-0 sm:mt-0 sm:w-full sm:rounded-b-none sm:border-b-0",
                "sm:h-[240px] sm:rounded-[8px] sm:border-[3px] sm:border-black sm:shadow-[4px_4px_0px_#000]"
            )}>

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

                {/* HUD CORNERS (Desktop Only) */}
                <div className="hidden sm:block">
                    <svg className="absolute top-2 right-2 w-6 h-6 text-cyan-400/40 z-20 animate-[pulse-glow_3s_ease-in-out_infinite]"><path d="M23 9V1H15" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                    <svg className="absolute bottom-2 left-2 w-6 h-6 text-cyan-400/40 z-20 animate-[pulse-glow_3s_ease-in-out_infinite_0.5s]"><path d="M1 15V23H9" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                </div>

                {/* DESKTOP CONTENT LAYOUT */}
                <div className="absolute inset-0 z-20 hidden sm:flex flex-col sm:flex-row items-center sm:items-end p-6 gap-6">
                    {/* Avatar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="relative shrink-0 group/avatar"
                    >
                        <div className="w-32 h-32 bg-black border-[3px] border-white/20 shadow-[4px_4px_0px_#000] overflow-hidden rounded-[4px] relative z-10">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-3xl font-black text-neutral-600">
                                    {profile?.full_name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-[-4px] border border-cyan-500/30 rounded-[6px] animate-[pulse-glow_2s_infinite]" />
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex-1 text-left mb-2"
                    >
                        <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-md font-[family-name:var(--font-outfit)]">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <div className="flex items-center justify-start gap-3 mt-1">
                            <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">
                                @{profile?.username}
                            </span>
                            {profile?.is_verified && (
                                <span className="bg-[#FFC800] text-black text-[10px] font-bold px-1.5 py-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                                    VERIFIED
                                </span>
                            )}
                        </div>
                        {profile?.bio && (
                            <p className="mt-3 text-neutral-300/80 text-sm max-w-lg leading-relaxed line-clamp-2 font-mono">
                                {profile.bio}
                            </p>
                        )}
                    </motion.div>

                    {/* Actions */}
                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="flex flex-col gap-2 shrink-0 mb-2"
                    >
                        {isOwnProfile ? (
                            <div className="flex flex-col gap-2">
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
                                        <button className="w-full px-6 py-2.5 bg-[#FFC800] text-black font-black uppercase tracking-wider text-xs border-[2px] border-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all shadow-[4px_4px_0px_0px_#000]">
                                            PROFİLİ DÜZENLE
                                        </button>
                                    }
                                />
                                <Link href="/mesajlar" className="w-full px-6 py-2.5 bg-neutral-900 text-white font-black uppercase tracking-wider text-xs border-[2px] border-neutral-700 hover:bg-neutral-800 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2">
                                    <Mail className="w-3.5 h-3.5" />
                                    MESAJLARIM
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <FollowButton
                                    targetUserId={profile?.id}
                                    initialIsFollowing={isFollowing}
                                    targetUsername={profile?.username}
                                    variant="modern"
                                />
                                <Link href="/mesajlar" className="w-full px-6 py-2.5 bg-white text-black font-black uppercase tracking-wider text-xs border-[2px] border-black hover:bg-neutral-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2">
                                    <Mail className="w-3.5 h-3.5" />
                                    MESAJ GÖNDER
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>

            </div>

            {/* MOBILE FLOATING AVATAR */}
            <div className="absolute top-[120px] left-4 z-30 sm:hidden">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 rounded-[12px] border-[3px] border-black bg-black overflow-hidden shadow-[4px_4px_0px_#000000]"
                >
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-3xl font-black text-neutral-600">
                            {profile?.full_name?.charAt(0) || "?"}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* MOBILE INFO SECTION */}
            <div className="flex flex-col mt-[70px] sm:hidden px-2 mb-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-foreground font-[family-name:var(--font-outfit)] leading-tight">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 font-bold font-mono mt-1">
                            <span>@{profile?.username}</span>
                            {profile?.is_verified && (
                                <span className="text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1 rounded-md">
                                    <svg className="w-3 h-3 fill-current inline-block" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Mobile Actions (Top Right) */}
                    <div className="flex gap-2">
                        {isOwnProfile ? (
                            <>
                                <Link href="/mesajlar" className="w-8 h-8 flex items-center justify-center bg-neutral-900 border-[2px] border-neutral-700 rounded-md text-white shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                                    <Mail className="w-4 h-4" />
                                </Link>
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
                                        <button className="px-3 py-1.5 bg-[#FFC800] text-black font-bold uppercase text-[10px] border-[2px] border-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all shadow-[2px_2px_0px_0px_#000]">
                                            DÜZENLE
                                        </button>
                                    }
                                />
                            </>
                        ) : (
                            <>
                                <Link href="/mesajlar" className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black rounded-md text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                                    <Mail className="w-4 h-4" />
                                </Link>
                                <FollowButton
                                    targetUserId={profile?.id}
                                    initialIsFollowing={isFollowing}
                                    targetUsername={profile?.username}
                                    variant="modern"
                                />
                            </>
                        )}
                    </div>
                </div>

                {profile?.bio && (
                    <p className="mt-4 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed border-l-[3px] border-[#FFC800] pl-3 py-1">
                        {profile.bio}
                    </p>
                )}

                {/* Mobile Stats Row - Compact */}
                {stats && (
                    <div className="grid grid-cols-3 gap-2 mt-6">
                        <div className="bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 rounded-lg p-2 text-center">
                            <span className="block font-black text-lg text-foreground">{formatNumber(stats.followersCount)}</span>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Takipçi</span>
                        </div>
                        <div className="bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 rounded-lg p-2 text-center">
                            <span className="block font-black text-lg text-foreground">{formatNumber(stats.followingCount)}</span>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Takip</span>
                        </div>
                        <div className="bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 rounded-lg p-2 text-center">
                            <span className="block font-black text-lg text-foreground text-[#FFC800]">{formatNumber(stats.reputation)}</span>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Puan</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

