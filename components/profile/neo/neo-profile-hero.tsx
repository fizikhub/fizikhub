"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";
import { Mail, MoreHorizontal, Copy, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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
    const [isCopied, setIsCopied] = useState(false);

    const formatNumber = (num: number) =>
        new Intl.NumberFormat('tr-TR', { notation: "compact", maximumFractionDigits: 1 }).format(num);

    const handleCopyUsername = () => {
        if (!profile?.username) return;
        navigator.clipboard.writeText(`@${profile.username}`);
        setIsCopied(true);
        toast.success("Kullanıcı adı kopyalandı!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="w-full relative group mb-8 sm:mb-0">
            {/* GLOBAL STYLES */}
            <style jsx global>{`
                @keyframes gradient-flow { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                @keyframes shimmer { 0% { transform: translateX(-100%) rotate(25deg); } 100% { transform: translateX(200%) rotate(25deg); } }
                @keyframes pulse-glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
                .glitch-text:hover {
                    animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
                }
            `}</style>

            {/* HERO BACKGROUND */}
            <div className={cn(
                "relative overflow-hidden bg-[radial-gradient(120%_120%_at_50%_50%,_#2a0a45_0%,_#050514_50%,_#000000_100%)]",
                // Mobile: Full width breakout, taller for deeper cover feel
                "-mx-2 -mt-4 w-[calc(100%+1rem)] h-[220px]",
                "border-b-[4px] border-b-cyan-500/30 rounded-b-[24px]",
                // Desktop: Standard box
                "sm:mx-0 sm:mt-0 sm:w-full sm:h-[240px] sm:rounded-b-none sm:border-b-0",
                "sm:rounded-[8px] sm:border-[3px] sm:border-black sm:shadow-[4px_4px_0px_#000]"
            )}>
                {/* 3D CANVAS */}
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

                {/* OVERLAYS */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
                <div className="absolute inset-0 z-[2] pointer-events-none opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)` }} />

                {/* HUD CORNERS (Desktop Only) */}
                <div className="hidden sm:block">
                    <svg className="absolute top-2 right-2 w-6 h-6 text-cyan-400/40 z-20 animate-[pulse-glow_3s_ease-in-out_infinite]"><path d="M23 9V1H15" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                    <svg className="absolute bottom-2 left-2 w-6 h-6 text-cyan-400/40 z-20 animate-[pulse-glow_3s_ease-in-out_infinite_0.5s]"><path d="M1 15V23H9" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                </div>

                {/* DESKTOP CONTENT */}
                <div className="absolute inset-0 z-20 hidden sm:flex flex-col sm:flex-row items-center sm:items-end p-6 gap-6">
                    {/* ... (Desktop Layout implementation remains same as reference for desktop) ... */}
                    <div className="relative shrink-0 group/avatar">
                        <div className="w-32 h-32 bg-black border-[3px] border-white/20 shadow-[4px_4px_0px_#000] overflow-hidden rounded-[4px] relative z-10 transition-transform duration-500 group-hover/avatar:scale-105">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-3xl font-black text-neutral-600">
                                    {profile?.full_name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 text-left mb-2">
                        <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-md font-[family-name:var(--font-outfit)] glitch-text cursor-default">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <div className="flex items-center justify-start gap-3 mt-1">
                            <button
                                onClick={handleCopyUsername}
                                className="flex items-center gap-1.5 text-cyan-400 font-mono text-sm tracking-widest uppercase hover:text-cyan-300 transition-colors group/copy"
                            >
                                @{profile?.username}
                                {isCopied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity" />}
                            </button>
                            {profile?.is_verified && <span className="bg-[#FFC800] text-black text-[10px] font-bold px-1.5 py-0.5 border border-black">VERIFIED</span>}
                        </div>
                        {profile?.bio && <p className="mt-3 text-neutral-300/80 text-sm max-w-lg leading-relaxed line-clamp-2 font-mono">{profile.bio}</p>}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0 mb-2">
                        {/* Desktop Actions */}
                        {isOwnProfile ? (
                            <>
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
                                <Link href="/mesajlar" className="w-full px-6 py-2.5 bg-neutral-900 text-white font-black uppercase tracking-wider text-xs border-[2px] border-neutral-700 hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
                                    <Mail className="w-3.5 h-3.5" /> MESAJLARIM
                                </Link>
                            </>
                        ) : (
                            <>
                                <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="modern" />
                                <Link href="/mesajlar" className="w-full px-6 py-2.5 bg-white text-black font-black uppercase tracking-wider text-xs border-[2px] border-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2">
                                    <Mail className="w-3.5 h-3.5" /> MESAJ GÖNDER
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* MOBILE LAYOUT & HUD (New design) */}
            {/* ------------------------------------------------------------------ */}
            <div className="relative px-2 sm:hidden -mt-[60px] z-30">
                <div className="flex items-end justify-between">
                    {/* Avatar - Merged into cover visually */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-28 h-28 rounded-[12px] border-[4px] border-black bg-black overflow-hidden shadow-[0px_4px_10px_rgba(0,0,0,0.5)]">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-3xl font-black text-neutral-600">
                                    ?
                                </div>
                            )}
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -bottom-2 -right-2 bg-[#FFC800] text-black p-1 rounded-full border-[2px] border-white shadow-sm z-20">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Stats - Glassmorphic Container for clearer reading */}
                    <div className="flex gap-2 pb-1 pl-2 flex-1 justify-end">
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/10 shadow-sm">
                            <div className="text-center px-1">
                                <span className="block font-black text-lg text-white drop-shadow-md leading-none">{formatNumber(stats?.followersCount || 0)}</span>
                                <span className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Takipçi</span>
                            </div>
                            <div className="w-px h-6 bg-white/20"></div>
                            <div className="text-center px-1">
                                <span className="block font-black text-lg text-white drop-shadow-md leading-none">{formatNumber(stats?.followingCount || 0)}</span>
                                <span className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Takip</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Name & Bio & Actions Block */}
                <div className="mt-4 space-y-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground font-[family-name:var(--font-outfit)] leading-none tracking-tight glitch-text w-fit">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <button
                            onClick={handleCopyUsername}
                            className="text-sm font-bold text-neutral-500 font-mono tracking-wide mt-1 flex items-center gap-1.5 active:text-foreground transition-colors"
                        >
                            @{profile?.username}
                            {isCopied && <Check className="w-3 h-3 text-green-500" />}
                        </button>
                    </div>

                    {profile?.bio && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
                            {profile.bio}
                        </p>
                    )}

                    {/* NEW: Reputation & Actions Row */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                        {/* Reputation Badge */}
                        <div className="flex items-center gap-2 pl-3 pr-4 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-full shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-[#FFC800] animate-pulse" />
                            <span className="text-xs font-black text-foreground">{formatNumber(stats?.reputation || 0)} <span className="text-neutral-400 font-normal">Puan</span></span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {isOwnProfile ? (
                                <>
                                    <Link href="/mesajlar" className="w-9 h-9 flex items-center justify-center bg-white border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-all shadow-sm">
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
                                            <button className="h-9 px-4 bg-[#000] text-white font-bold text-xs rounded-lg border border-transparent shadow-[2px_2px_0px_#333] active:translate-y-[1px] active:shadow-none hover:bg-neutral-800 transition-all uppercase tracking-wide">
                                                DÜZENLE
                                            </button>
                                        }
                                    />
                                </>
                            ) : (
                                <>
                                    <Link href="/mesajlar" className="w-9 h-9 flex items-center justify-center bg-white border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-all shadow-sm">
                                        <Mail className="w-4 h-4" />
                                    </Link>
                                    <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="default" />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
