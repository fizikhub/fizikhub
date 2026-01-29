"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import {
    Calendar,
    Link as LinkIcon,
    Edit3,
    CheckCircle2,
    MoreHorizontal,
    Share2,
    Mail
} from "lucide-react";
import { ProfileSettingsDialog } from "@/components/profile/profile-settings-dialog";
import { FollowButton } from "@/components/profile/follow-button";

// --- REUSED GALAXY COMPONENTS (From MemeCorner) ---
// Simplified slightly for header performance (fewer stars)

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
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}

function MainStars({ count = 2000 }) { // Fewer than MemeCorner
    const pointsRef = useRef<THREE.Points>(null!);
    const texture = useMemo(() => getStarTexture(), []);
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3); // White/Blue theme
        for (let i = 0; i < count; i++) {
            const r = 4 + Math.pow(Math.random(), 1.5) * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = (r * Math.sin(phi) * Math.sin(theta)) * 0.2; // Flattened
            const z = r * Math.cos(phi);
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1; // All white/bright
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [count]);
    useFrame((state, delta) => { if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.02; });
    return (
        <points ref={pointsRef}>
            <primitive object={geometry} />
            <pointsMaterial map={texture} size={0.15} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} vertexColors transparent opacity={0.8} />
        </points>
    );
}

interface NeoProfileHeaderProps {
    profile: any;
    user: any;
    isOwnProfile: boolean;
    isFollowing?: boolean;
    stats: {
        reputation: number;
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
        answersCount: number;
    };
    userBadges?: any[];
    unreadCount?: number;
}

export function NeoProfileHeader({
    profile,
    user,
    isOwnProfile,
    isFollowing = false,
    stats,
    userBadges = [],
    unreadCount = 0
}: NeoProfileHeaderProps) {

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            notation: "compact",
            maximumFractionDigits: 1
        }).format(num);
    };

    return (
        <div className="w-full flex flex-col bg-background text-foreground animate-in fade-in duration-700 relative overflow-hidden">

            {/* === 1. CAPTAIN'S LOG BACKGROUND (Galaxy Header) === */}
            <div className="relative w-full h-[280px] sm:h-[320px] bg-black border-b-[3px] border-black overflow-hidden group">

                {/* 3D Galaxy Canvas */}
                <div className="absolute inset-0 z-0 opacity-80">
                    <Canvas camera={{ position: [0, 5, 5], fov: 60 }} gl={{ antialias: false, alpha: true }}>
                        <MainStars />
                        <EffectComposer enableNormalPass={false}>
                            <Bloom luminanceThreshold={0.5} intensity={1.5} radius={0.5} mipmapBlur />
                        </EffectComposer>
                    </Canvas>
                </div>

                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 z-10" />

                {/* Scanlines */}
                <div className="absolute inset-0 z-[2] pointer-events-none opacity-[0.05]"
                    style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)` }} />

                {/* Top Actions */}
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                    <button
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="p-2 bg-black border border-white/20 hover:bg-white/10 text-white transition-all rounded-none transform skew-x-[-10deg]"
                    >
                        <Share2 className="w-4 h-4 transform skew-x-[10deg]" />
                    </button>
                    {isOwnProfile && (
                        <Link href="/mesajlar" className="relative p-2 bg-black border border-white/20 hover:bg-white/10 text-white transition-all rounded-none transform skew-x-[-10deg]">
                            <Mail className="w-4 h-4 transform skew-x-[10deg]" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#FF0000] border border-black transform skew-x-[10deg]" />
                            )}
                        </Link>
                    )}
                </div>
            </div>

            {/* === 2. IDENTITY HUD === */}
            <div className="container max-w-4xl mx-auto px-4 relative z-20 -mt-[100px] sm:-mt-[120px]">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-6">

                    {/* AVATAR: Hard Border, Square-ish */}
                    <div className="relative group">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-black border-[4px] border-white/10 shadow-[8px_8px_0px_#000] overflow-hidden relative">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            ) : (
                                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-4xl font-mono text-neutral-500">
                                    {profile?.full_name?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>
                        {profile?.is_verified && (
                            <div className="absolute -top-2 -right-2 bg-cyan-500 text-black p-1 border-[2px] border-black shadow-[2px_2px_0px_#000]">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    {/* NAME & BIO */}
                    <div className="flex-1 text-center sm:text-left text-white drop-shadow-md">
                        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-[family-name:var(--font-outfit)]">
                            {profile?.full_name || "İsimsiz"}
                        </h1>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                            <span className="bg-[#FFC800] text-black px-2 py-0.5 text-xs font-bold uppercase border border-black transform -skew-x-12">
                                @{profile?.username}
                            </span>
                            <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
                                CMD_ID: {profile?.id?.slice(0, 8)}
                            </span>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3">
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
                                    <button className="px-6 py-2 bg-white text-black font-bold uppercase border-[2px] border-transparent hover:border-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                                        EDIT SYSTEM
                                    </button>
                                }
                            />
                        ) : (
                            <FollowButton
                                targetUserId={profile?.id}
                                initialIsFollowing={isFollowing}
                                targetUsername={profile?.username}
                                variant="modern" // Need to check if we can style this brutalist
                            />
                        )}
                    </div>
                </div>

                {/* === 3. STATS GRID (HUD STYLE) === */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8 font-mono text-xs sm:text-sm">
                    {/* Stat Item Helper */}
                    {[
                        { label: "TAKİPÇİ", value: stats.followersCount, color: "border-cyan-500/50" },
                        { label: "TAKİP", value: stats.followingCount, color: "border-purple-500/50" },
                        { label: "PUAN", value: stats.reputation, color: "border-yellow-500/50" },
                        { label: "MAKALELER", value: stats.articlesCount, color: "border-white/20" },
                        { label: "SORULAR", value: stats.questionsCount, color: "border-white/20" },
                        { label: "CEVAPLAR", value: stats.answersCount, color: "border-white/20" },
                    ].map((stat, i) => (
                        <div key={i} className={`flex flex-col items-center justify-center p-2 bg-black/40 border ${stat.color} backdrop-blur-sm group hover:bg-white/5 transition-colors cursor-default`}>
                            <span className="font-bold text-lg sm:text-xl text-white">{formatNumber(stat.value)}</span>
                            <span className="text-[10px] text-white/50 uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* BIO TEXT */}
                {profile?.bio && (
                    <div className="bg-neutral-900/50 border-l-[4px] border-[#FFC800] p-4 text-sm text-neutral-300 font-mono leading-relaxed mb-6">
                        {profile.bio}

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-neutral-500 font-bold uppercase">
                            {profile?.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                                    <LinkIcon className="w-3 h-3" />
                                    <span>LINK_UPLINK</span>
                                </a>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>INIT: {format(new Date(user?.created_at || Date.now()), 'yyyy.MM')}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
