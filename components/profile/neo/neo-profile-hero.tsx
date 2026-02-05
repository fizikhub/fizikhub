"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";
import { Mail, Copy, Check, ShieldCheck, PenTool, Share2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { NumberTicker } from "@/components/ui/number-ticker";

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

    const handleShareProfile = () => {
        const url = `${window.location.origin}/p/${profile?.username || profile?.id}`;
        if (navigator.share) {
            navigator.share({
                title: `${profile?.full_name} - FizikHub Profili`,
                url: url,
            }).catch(() => {
                navigator.clipboard.writeText(url);
                toast.success("Profil linki kopyalandı!");
            });
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Profil linki kopyalandı!");
        }
    };

    return (
        <div className="w-full relative group mb-8 sm:mb-0">
            {/* HERO BACKGROUND - MATTE BLACK */}
            <div className={cn(
                "relative overflow-hidden bg-[#050505]", // Matte Deep Black
                "-mx-2 -mt-4 w-[calc(100%+1rem)] h-[220px]",
                "border-b-4 border-black rounded-b-[32px] sm:rounded-b-none sm:border-b-0", // Mobile: Rounded + Thick Border
                // Desktop
                "sm:mx-0 sm:mt-0 sm:w-full sm:h-[280px]",
                "sm:rounded-xl sm:border-2 sm:border-black sm:shadow-[8px_8px_0px_#000]"
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
                            <Bloom luminanceThreshold={0.6} mipmapBlur intensity={0.8} radius={0.4} />
                        </EffectComposer>
                    </Canvas>
                </div>

                {/* VIGNETTE & GRAIN OVERLAY */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]" />
                <div className="absolute inset-0 z-10 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }}></div>

                {/* DESKTOP CONTENT */}
                <div className="absolute inset-0 z-20 hidden sm:flex flex-col sm:flex-row items-center sm:items-end p-8 gap-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="relative shrink-0 group/avatar"
                    >
                        <div className="w-36 h-36 bg-black border-[3px] border-white shadow-[8px_8px_0px_#FACC15] overflow-hidden rounded-xl relative z-10 transition-transform duration-300 group-hover/avatar:-translate-y-2 group-hover/avatar:shadow-[12px_12px_0px_#FACC15]">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-500" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-3xl font-black text-white">
                                    {profile?.full_name?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -top-3 -right-3 bg-[#FACC15] text-black w-8 h-8 flex items-center justify-center rounded-full border-2 border-black z-20 shadow-[2px_2px_0px_#000]">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        )}
                    </motion.div>

                    <div className="flex-1 text-left mb-2">
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-black tracking-tighter text-white drop-shadow-md font-[family-name:var(--font-outfit)] italic uppercase"
                        >
                            {profile?.full_name || "İsimsiz"}
                        </motion.h1>
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-start gap-4 mt-2"
                        >
                            <button
                                onClick={handleCopyUsername}
                                className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded border border-white/10 text-zinc-300 font-mono text-sm tracking-wide transition-colors hover:bg-white hover:text-black hover:font-bold"
                            >
                                @{profile?.username}
                                {isCopied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <div className="h-4 w-[1px] bg-white/20"></div>
                            {/* Reputation Tag */}
                            <div className="flex items-center gap-1.5 text-[#FACC15] font-black tracking-wide text-sm">
                                <div className="w-2 h-2 bg-[#FACC15] rounded-full animate-pulse shadow-[0px_0px_10px_#FACC15]"></div>
                                <NumberTicker value={stats?.reputation || 0} className="text-[#FACC15]" /> REP
                            </div>
                        </motion.div>
                        {profile?.bio && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-4 text-zinc-300 text-sm max-w-lg leading-relaxed line-clamp-2 border-l-2 border-[#FACC15] pl-3"
                            >
                                {profile.bio}
                            </motion.p>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col gap-3 shrink-0 mb-2 min-w-[180px]"
                    >
                        {/* Desktop Actions - Neo Brutalist Buttons */}
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
                                        <button className="w-full px-6 py-3 bg-[#FACC15] text-black font-black uppercase tracking-wider text-xs border-2 border-black rounded-lg hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none">
                                            PROFİLİ DÜZENLE
                                        </button>
                                    }
                                />
                                <Link href="/mesajlar">
                                    <button className="w-full px-6 py-3 bg-zinc-900 text-white font-black uppercase tracking-wider text-xs border-2 border-zinc-700 rounded-lg hover:border-white hover:bg-black transition-all flex items-center justify-center gap-2">
                                        <Mail className="w-3.5 h-3.5" /> MESAJLARIM
                                    </button>
                                </Link>
                                {(profile?.role === 'author' || profile?.role === 'admin') && (
                                    <Link href="/yazar/yeni">
                                        <button className="w-full px-6 py-3 bg-[#00E6CC] text-black font-black uppercase tracking-wider text-xs border-2 border-black rounded-lg hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all flex items-center justify-center gap-2">
                                            <PenTool className="w-3.5 h-3.5" /> YAZAR PANELİ
                                        </button>
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <FollowButton targetUserId={profile?.id} initialIsFollowing={isFollowing} targetUsername={profile?.username} variant="modern" />
                                <Link href="/mesajlar">
                                    <button className="w-full px-6 py-3 bg-white text-black font-black uppercase tracking-wider text-xs border-2 border-black rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000]">
                                        <Mail className="w-3.5 h-3.5" /> MESAJ AT
                                    </button>
                                </Link>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* MOBILE LAYOUT & HUD (Premium Redesign) */}
            {/* ------------------------------------------------------------------ */}
            <div className="relative px-4 sm:hidden -mt-[70px] z-30 font-[family-name:var(--font-outfit)]">
                <div className="flex items-end justify-between">
                    {/* Avatar - Mobile - Premium Border */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="relative"
                    >
                        <div className="w-28 h-28 rounded-2xl border-[4px] border-[#050505] bg-[#09090b] overflow-hidden shadow-2xl ring-1 ring-white/20">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-3xl font-black text-zinc-700">
                                    ?
                                </div>
                            )}
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -bottom-2 -right-2 bg-[#FACC15] text-black p-1 rounded-full border-[3px] border-[#050505] z-20 shadow-sm">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Stats - Mobile Glass Cards */}
                    <div className="flex gap-2 pb-2 flex-1 justify-end">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-2xl text-center min-w-[75px] shadow-2xl ring-1 ring-white/5 active:scale-95 transition-transform">
                            <span className="block font-black text-2xl text-white leading-none tracking-tight">
                                <NumberTicker value={stats?.followersCount || 0} className="text-white" />
                            </span>
                            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1 block">Takipçi</span>
                        </div>
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-2xl text-center min-w-[75px] shadow-2xl ring-1 ring-white/5 active:scale-95 transition-transform">
                            <span className="block font-black text-2xl text-white leading-none tracking-tight">
                                <NumberTicker value={stats?.followingCount || 0} className="text-white" />
                            </span>
                            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1 block">Takip</span>
                        </div>
                    </div>
                </div>

                {/* Name & Bio & Actions Block */}
                <div className="mt-4 space-y-5">
                    <div>
                        <h1 className="text-[32px] leading-none font-black text-white italic tracking-tighter mix-blend-screen drop-shadow-sm">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <button
                            onClick={handleCopyUsername}
                            className="text-sm font-medium text-zinc-400 mt-1.5 flex items-center gap-1.5 active:text-white transition-colors font-mono"
                        >
                            @{profile?.username}
                            {isCopied && <Check className="w-3 h-3 text-green-500" />}
                        </button>
                    </div>

                    {profile?.bio && (
                        <p className="text-[13px] text-zinc-300 leading-relaxed font-normal border-l-2 border-[#FACC15] pl-3 py-0.5">
                            {profile.bio}
                        </p>
                    )}

                    {/* Reputation & Actions */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                        {/* Clean Rep Badge */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FACC15] shadow-[0_0_8px_#FACC15]" />
                            <span className="text-[11px] font-black text-white tracking-wider">
                                <NumberTicker value={stats?.reputation || 0} className="text-white" /> <span className="text-zinc-600">REP</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* ADMIN BUTTON */}
                            {(profile?.username === 'baranbozkurt' || user?.email === 'baran@fizikhub.com') && (
                                <Link href="/admin" className="h-9 px-3 flex items-center justify-center bg-red-950/20 text-red-500 border border-red-900/40 rounded-lg font-bold text-[10px] active:scale-95 transition-all">
                                    ADMIN
                                </Link>
                            )}

                            {isOwnProfile ? (
                                <>
                                    <Link href="/mesajlar" className="w-9 h-9 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all">
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
                                            <button className="h-9 px-4 bg-[#FACC15] text-black font-bold text-[10px] rounded-lg border border-yellow-600/20 hover:bg-yellow-400 active:scale-95 transition-all uppercase tracking-wide">
                                                DÜZENLE
                                            </button>
                                        }
                                    />
                                    {(profile?.role === 'author' || profile?.role === 'admin') && (
                                        <Link href="/yazar/yeni" className="h-9 px-3 flex items-center justify-center bg-zinc-900 text-emerald-400 border border-emerald-900/30 font-bold text-[10px] rounded-lg hover:border-emerald-500/50 active:scale-95 transition-all">
                                            <PenTool className="w-4 h-4" />
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleShareProfile}
                                        className="w-9 h-9 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
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
