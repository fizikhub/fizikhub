"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";
import { Mail, Copy, Check, Terminal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// --- TEXTURES (Unchanged for compatibility) ---
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
        toast.success("ID kopyalandı!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="w-full relative group mb-8 sm:mb-0">
            {/* HERO BACKGROUND - STRICT BRUTALIST WINDOW */}
            <div className={cn(
                "relative overflow-hidden bg-black",
                "-mx-2 -mt-4 w-[calc(100%+1rem)] h-[220px]",
                "border-b-2 border-white rounded-none",
                // Desktop
                "sm:mx-0 sm:mt-0 sm:w-full sm:h-[260px] sm:rounded-none sm:border-2 sm:border-white"
            )}>
                {/* 3D CANVAS */}
                <div className="absolute inset-0 z-0 opacity-80">
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

                {/* TECHNICAL GRID OVERLAY */}
                <div className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* RULER MARKINGS */}
                <div className="absolute top-0 left-0 w-full h-4 border-b border-white/20 flex justify-between px-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-px h-2 bg-white/40 self-end" />
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-4 border-t border-white/20 flex justify-between px-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-px h-2 bg-white/40 self-start" />
                    ))}
                </div>

                <div className="absolute inset-0 z-10 bg-black/40" /> {/* Darken slightly for text readability */}

                {/* DESKTOP CONTENT */}
                <div className="absolute inset-0 z-20 hidden sm:flex flex-col sm:flex-row items-end p-6 gap-6">
                    {/* AVATAR BOX - NO ROUNDING */}
                    <div className="relative shrink-0 group/avatar">
                        <div className="w-36 h-36 bg-black border-2 border-white overflow-hidden rounded-none relative z-10">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover grayscale transition-all duration-500 group-hover/avatar:grayscale-0" />
                            ) : (
                                <div className="w-full h-full bg-black flex items-center justify-center text-4xl font-mono text-white">
                                    {profile?.full_name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                        {/* Verified Badge - Square */}
                        {profile?.is_verified && (
                            <div className="absolute -top-3 -right-3 bg-[#FACC15] text-black text-[10px] font-black px-2 py-1 border border-black z-20 font-mono">
                                VERIFIED
                            </div>
                        )}
                    </div>

                    {/* INFO BLOCK */}
                    <div className="flex-1 text-left mb-1">
                        <div className="flex items-center gap-2 mb-1 opacity-60">
                            <Terminal className="w-4 h-4 text-[#FACC15]" />
                            <span className="font-mono text-xs text-[#FACC15] tracking-widest">USER_PROFILE_DETECTED</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase font-mono bg-black/50 w-fit px-2 -ml-2">
                            {profile?.full_name || "UNKNOWN_USER"}
                        </h1>
                        <div className="flex items-center justify-start gap-4 mt-2">
                            <button
                                onClick={handleCopyUsername}
                                className="flex items-center gap-2 text-zinc-400 font-mono text-sm tracking-widest uppercase hover:text-white hover:bg-white/10 px-2 py-1 -ml-2 transition-colors group/copy"
                            >
                                <span className="text-[#FACC15]">UID::</span>{profile?.username}
                                {isCopied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity" />}
                            </button>
                        </div>
                        {profile?.bio && <p className="mt-3 text-zinc-300 text-sm max-w-lg leading-relaxed font-mono border-l-2 border-[#FACC15] pl-3 py-1 bg-black/40 backdrop-blur-sm">{profile.bio}</p>}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-2 shrink-0 mb-1 w-48">
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
                                        <button className="w-full px-4 py-3 bg-[#FACC15] text-black font-mono font-bold uppercase text-xs border border-[#FACC15] hover:bg-black hover:text-[#FACC15] transition-colors flex items-center justify-between group">
                                            <span>EDIT_CONFIG</span>
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">_</span>
                                        </button>
                                    }
                                />
                                <Link href="/mesajlar" className="w-full px-4 py-3 bg-black text-white font-mono font-bold uppercase text-xs border border-white hover:bg-white hover:text-black transition-colors flex items-center justify-between group">
                                    <span>INBOX_LOGS</span>
                                    <Mail className="w-3.5 h-3.5" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="default" />
                                <Link href="/mesajlar" className="w-full px-4 py-3 bg-white text-black font-mono font-bold uppercase text-xs border border-white hover:bg-black hover:text-white transition-colors flex items-center justify-between group">
                                    <span>SEND_MSG</span>
                                    <Mail className="w-3.5 h-3.5" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* MOBILE LAYOUT & HUD */}
            {/* ------------------------------------------------------------------ */}
            <div className="relative px-2 sm:hidden -mt-[60px] z-30">
                <div className="flex items-end gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 bg-black border-2 border-white rounded-none shadow-[4px_4px_0px_#000]">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover grayscale" />
                            ) : (
                                <div className="w-full h-full bg-black flex items-center justify-center text-2xl font-mono text-white">
                                    ?
                                </div>
                            )}
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -bottom-2 -right-2 bg-[#FACC15] text-black px-1 py-0.5 border border-black font-mono text-[9px] font-bold">
                                V.RFY
                            </div>
                        )}
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-px bg-white border border-white">
                        <div className="bg-black p-2 flex flex-col items-center justify-center">
                            <span className="text-white font-mono font-bold text-lg leading-none">{formatNumber(stats?.followersCount || 0)}</span>
                            <span className="text-[9px] text-zinc-500 font-mono uppercase mt-1">FOLLOWERS</span>
                        </div>
                        <div className="bg-black p-2 flex flex-col items-center justify-center">
                            <span className="text-white font-mono font-bold text-lg leading-none">{formatNumber(stats?.followingCount || 0)}</span>
                            <span className="text-[9px] text-zinc-500 font-mono uppercase mt-1">FOLLOWING</span>
                        </div>
                    </div>
                </div>

                {/* Name & Bio & Actions Block */}
                <div className="mt-4 space-y-4">
                    <div className="border-l-2 border-white pl-4 py-1">
                        <h1 className="text-2xl font-black text-foreground font-mono uppercase tracking-tight leading-none">
                            {profile?.full_name || "UNKNOWN_USER"}
                        </h1>
                        <button
                            onClick={handleCopyUsername}
                            className="text-xs font-bold text-zinc-500 font-mono tracking-widest mt-1 flex items-center gap-1.5 active:text-foreground transition-colors uppercase"
                        >
                            UID::{profile?.username}
                            {isCopied && <Check className="w-3 h-3 text-green-500" />}
                        </button>
                    </div>

                    {profile?.bio && (
                        <p className="text-xs text-zinc-400 leading-relaxed font-mono bg-zinc-900/50 p-3 border border-zinc-800">
                            {">"} {profile.bio}
                        </p>
                    )}

                    {/* NEW: Reputation & Actions Row */}
                    <div className="flex flex-col gap-3 pt-2">
                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
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
                                            <button className="h-10 px-4 bg-[#FACC15] text-black font-mono font-bold text-xs border border-transparent active:invert transition-all uppercase tracking-wide flex items-center justify-center gap-2">
                                                <Terminal className="w-3 h-3" /> EDIT
                                            </button>
                                        }
                                    />
                                    <Link href="/mesajlar" className="h-10 px-4 bg-black text-white font-mono font-bold text-xs border border-white active:bg-white active:text-black transition-all uppercase tracking-wide flex items-center justify-center gap-2">
                                        <Mail className="w-3 h-3" /> LOGS
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="default" />
                                    <Link href="/mesajlar" className="h-10 px-4 bg-white text-black font-mono font-bold text-xs border border-black active:bg-black active:text-white transition-all uppercase tracking-wide flex items-center justify-center gap-2">
                                        <Mail className="w-3 h-3" /> MSG
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
