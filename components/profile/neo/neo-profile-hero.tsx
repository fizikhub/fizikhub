"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";
import { Mail, Copy, Check, ShieldCheck, PenTool } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// --- TEXTURES (Unchanged) ---
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
        // MATTE PREMIUM COLORS: Deep Blue/White instead of Neon
        const c_Inner = new THREE.Color('#4466aa');
        const c_Outer = new THREE.Color('#223355');
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
    useFrame((state, delta) => { if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.02; });
    return <points ref={pointsRef}><primitive object={geometry} /><pointsMaterial map={texture} size={0.12} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} vertexColors transparent opacity={0.6} /></points>;
}

// --- MAIN STARS ---
function MainStars({ count = 10000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const c_Core = new THREE.Color('#ffffff'); // Pure white core
        const c_Inner = new THREE.Color('#e0e0e0');
        const c_Outer = new THREE.Color('#a0a0ff');
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
                if (Math.random() > 0.7) color.multiplyScalar(1.2);
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
                if (rand > 0.95) color.set('#ffffff').multiplyScalar(1.5);
                else if (rand > 0.90) color.set('#ffffff');
            }
            colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);
    useFrame((state, delta) => { if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.03; });
    return <points ref={pointsRef}><primitive object={geometry} /><pointsMaterial map={texture} size={0.3} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} vertexColors transparent opacity={0.8} /></points>;
}

// --- NEBULA CLOUDS ---
function NebulaClouds({ count = 8000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getNebulaTexture(), []);
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        // MATTE COLORS: Subtle Blue/Purple
        const c_Pink = new THREE.Color('#333366');
        const c_Purple = new THREE.Color('#222244');
        const c_Blue = new THREE.Color('#111133');
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
            color.multiplyScalar(1.0);
            colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);
    useFrame((state, delta) => { if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.01; });
    return <points ref={pointsRef}><primitive object={geometry} /><pointsMaterial map={texture} size={3.0} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} vertexColors transparent opacity={0.3} /></points>;
}

// --- BACKGROUND STARS ---
function BackgroundStars({ count = 2000 }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const c_White = new THREE.Color('#ffffff');
        const c_Blue = new THREE.Color('#cccccc');
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
    useFrame((state, delta) => { if (pointsRef.current) pointsRef.current.rotation.y -= delta * 0.002; });
    return <points ref={pointsRef}><primitive object={geometry} /><pointsMaterial map={texture} size={0.15} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} vertexColors transparent opacity={0.4} /></points>;
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
            {/* HERO BACKGROUND - MATTE BLACK */}
            <div className={cn(
                "relative overflow-hidden bg-[#050505]", // Matte Deep Black
                "-mx-2 -mt-4 w-[calc(100%+1rem)] h-[220px]",
                "border-b border-white/10 rounded-b-[24px]", // Subtle border
                // Desktop
                "sm:mx-0 sm:mt-0 sm:w-full sm:h-[240px] sm:rounded-b-none sm:border-b-0",
                "sm:rounded-xl sm:border sm:border-white/10 sm:shadow-2xl sm:shadow-black"
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
                            <Bloom luminanceThreshold={0.6} mipmapBlur intensity={0.5} radius={0.4} />
                        </EffectComposer>
                    </Canvas>
                </div>

                {/* VIGNETTE & GRAIN OVERLAY */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

                {/* DESKTOP CONTENT */}
                <div className="absolute inset-0 z-20 hidden sm:flex flex-col sm:flex-row items-center sm:items-end p-8 gap-6">
                    <div className="relative shrink-0 group/avatar">
                        <div className="w-32 h-32 bg-black border border-white/20 shadow-xl overflow-hidden rounded-xl relative z-10 transition-transform duration-500 group-hover/avatar:scale-105">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-3xl font-black text-zinc-700">
                                    {profile?.full_name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 text-left mb-2">
                        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-sm font-[family-name:var(--font-outfit)]">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <div className="flex items-center justify-start gap-3 mt-1">
                            <button
                                onClick={handleCopyUsername}
                                className="flex items-center gap-1.5 text-zinc-400 font-medium text-sm tracking-wide transition-colors group/copy hover:text-white"
                            >
                                @{profile?.username}
                                {isCopied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity" />}
                            </button>
                            {profile?.is_verified && (
                                <span className="flex items-center gap-1 bg-[#FACC15]/10 text-[#FACC15] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FACC15]/20">
                                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                                </span>
                            )}
                        </div>
                        {profile?.bio && <p className="mt-3 text-zinc-400 text-sm max-w-lg leading-relaxed line-clamp-2">{profile.bio}</p>}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0 mb-2">
                        {/* Desktop Actions - Matte Buttons */}
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
                                        <button className="w-full px-6 py-2.5 bg-[#FACC15] text-black font-bold uppercase tracking-wide text-xs rounded-lg hover:bg-[#FACC15]/90 transition-all">
                                            PROFİLİ DÜZENLE
                                        </button>
                                    }
                                />
                                <Link href="/mesajlar" className="w-full px-6 py-2.5 bg-black/50 text-white font-bold uppercase tracking-wide text-xs border border-white/20 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                                    <Mail className="w-3.5 h-3.5" /> MESAJLARIM
                                </Link>
                                {(profile?.role === 'author' || profile?.role === 'admin') && (
                                    <Link href="/makale/yeni" className="w-full px-6 py-2.5 bg-[#FACC15] text-black font-bold uppercase tracking-wide text-xs border border-yellow-500 rounded-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2">
                                        <PenTool className="w-3.5 h-3.5" /> YAZAR EDİTÖRÜ
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="modern" />
                                <Link href="/mesajlar" className="w-full px-6 py-2.5 bg-white text-black font-bold uppercase tracking-wide text-xs rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                                    <Mail className="w-3.5 h-3.5" /> MESAJ GÖNDER
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
                <div className="flex items-end justify-between">
                    {/* Avatar - Clean & Matte */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-24 h-24 rounded-xl border-4 border-black bg-black overflow-hidden shadow-2xl">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-3xl font-black text-zinc-700">
                                    ?
                                </div>
                            )}
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -bottom-1 -right-1 bg-[#FACC15] text-black p-1 rounded-full border-2 border-black z-20">
                                <ShieldCheck className="w-3 h-3" />
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Stats - Clean Glass */}
                    <div className="flex gap-4 pb-2 px-4 flex-1 justify-end">
                        <div className="text-center">
                            <span className="block font-bold text-lg text-white leading-none">{formatNumber(stats?.followersCount || 0)}</span>
                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Takipçi</span>
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-lg text-white leading-none">{formatNumber(stats?.followingCount || 0)}</span>
                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Takip</span>
                        </div>
                    </div>
                </div>

                {/* Name & Bio & Actions Block */}
                <div className="mt-4 space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-outfit)] leading-tight">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <button
                            onClick={handleCopyUsername}
                            className="text-sm font-medium text-zinc-500 mt-0.5 flex items-center gap-1.5 active:text-foreground transition-colors"
                        >
                            @{profile?.username}
                            {isCopied && <Check className="w-3 h-3 text-green-500" />}
                        </button>
                    </div>

                    {profile?.bio && (
                        <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                            {profile.bio}
                        </p>
                    )}

                    {/* Reputation & Actions */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                        {/* Clean Rep Badge */}
                        <div className="flex items-center gap-2 pl-3 pr-4 py-1.5 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                            <span className="text-xs font-bold text-foreground">{formatNumber(stats?.reputation || 0)} <span className="text-zinc-500 font-normal">Puan</span></span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* ADMIN BUTTON - ONLY FOR BARAN BOZKURT */}
                            {(profile?.username === 'baranbozkurt' || user?.email === 'baran@fizikhub.com') && (
                                <Link href="/admin" className="h-9 px-3 flex items-center justify-center bg-red-600 text-white font-bold text-[10px] rounded-lg border border-red-500 hover:bg-red-700 transition-all uppercase tracking-wide">
                                    ADMIN
                                </Link>
                            )}

                            {isOwnProfile ? (
                                <>
                                    <Link href="/mesajlar" className="w-9 h-9 flex items-center justify-center bg-transparent border border-zinc-700/50 rounded-lg text-zinc-400 hover:text-white hover:border-white transition-all">
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
                                            <button className="h-9 px-4 bg-white text-black font-bold text-xs rounded-lg border border-transparent hover:bg-zinc-200 transition-all uppercase tracking-wide">
                                                DÜZENLE
                                            </button>
                                        }
                                    />
                                    {(profile?.role === 'author' || profile?.role === 'admin') && (
                                        <Link href="/makale/yeni" className="h-9 px-3 flex items-center justify-center bg-[#FACC15] text-black font-bold text-[10px] rounded-lg border border-yellow-500 hover:bg-yellow-400 transition-all uppercase tracking-wide">
                                            <PenTool className="w-4 h-4 mr-1" /> YAZAR
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link href="/mesajlar" className="w-9 h-9 flex items-center justify-center bg-transparent border border-zinc-700/50 rounded-lg text-zinc-400 hover:text-white hover:border-white transition-all">
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
