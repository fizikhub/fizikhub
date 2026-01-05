"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Settings, Shield, Award, Activity, Cpu, MessageSquare, Zap, Terminal } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CyberProfileHeroProps {
    profile: any;
    isOwnProfile: boolean;
    onEdit?: () => void;
}

export function CyberProfileHero({ profile, isOwnProfile, onEdit }: CyberProfileHeroProps) {
    const [matrixChars, setMatrixChars] = useState<string[]>([]);
    const [bootSequence, setBootSequence] = useState(0);

    // Matrix character generation
    useEffect(() => {
        const chars = '01アイウエオカキクケコサシスセソタチツテト'.split('');
        setMatrixChars(Array(30).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]));
    }, []);

    // Boot sequence animation
    useEffect(() => {
        const interval = setInterval(() => {
            setBootSequence(prev => (prev + 1) % 100);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full mb-8 relative overflow-hidden">
            {/* MATRIX BACKGROUND */}
            <div className="absolute inset-0 bg-black border-x border-cyan-900/30 h-[450px]">
                {/* Animated grid */}
                <motion.div
                    className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[length:30px_30px]"
                    animate={{
                        backgroundPosition: ['0px 0px', '30px 30px'],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                {/* Top glow line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(0,240,255,0.8)]" />

                {/* Floating matrix characters */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    {matrixChars.map((char, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-cyan-400 font-mono text-xs"
                            style={{
                                left: `${(i * 3.33) % 100}%`,
                                top: `-10%`,
                            }}
                            animate={{
                                y: ['0vh', '120vh'],
                                opacity: [0, 1, 0.5, 0],
                            }}
                            transition={{
                                duration: 10 + (i % 5),
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "linear",
                            }}
                        >
                            {char}
                        </motion.div>
                    ))}
                </div>

                {/* Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
            </div>

            <div className="relative z-10 container mx-auto pt-16 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">

                {/* COL 1: IDENTITY CORE */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Terminal frame */}
                    <div className="bg-black/90 border-2 border-cyan-500/40 relative shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                        {/* Corner decorations */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

                        {/* Terminal header */}
                        <div className="bg-cyan-950/50 border-b-2 border-cyan-500/30 px-3 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-3 h-3 text-cyan-400" />
                                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">USER.SYS</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-red-500 shadow-[0_0_5px_rgba(255,0,0,0.8)]" />
                                <div className="w-2 h-2 bg-yellow-500 shadow-[0_0_5px_rgba(255,255,0,0.8)]" />
                                <div className="w-2 h-2 bg-green-500 shadow-[0_0_5px_rgba(0,255,0,0.8)]" />
                            </div>
                        </div>

                        {/* Avatar with hologram effect */}
                        <div className="relative w-full aspect-square border-b-2 border-cyan-900/50 overflow-hidden group">
                            <Image
                                src={profile?.avatar_url || '/images/default-avatar.png'}
                                alt={profile?.username}
                                fill
                                className="object-cover transition-all duration-700"
                            />
                            {/* Holographic scan effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-cyan-400/30 via-transparent to-cyan-400/30"
                                animate={{ y: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                            {/* Grid overlay on avatar */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-50" />

                            <div className="absolute bottom-2 left-2 text-[9px] font-mono text-cyan-300 bg-black/70 px-2 py-0.5 border border-cyan-500/50">
                                IMG_LOADED
                            </div>
                        </div>

                        {/* User info panel */}
                        <div className="p-4">
                            <h1 className="font-mono text-2xl text-cyan-300 font-bold uppercase tracking-widest mb-1 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
                                {profile?.username}
                            </h1>
                            <div className="text-[10px] font-mono text-cyan-600 mb-4 space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-cyan-700/70">ROLE:</span>
                                    <span className="text-cyan-400">{profile?.role?.toUpperCase() || "USER"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-cyan-700/70">STATUS:</span>
                                    <div className="flex items-center gap-1">
                                        <motion.div
                                            className="w-1.5 h-1.5 bg-green-400 rounded-full"
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <span className="text-green-400">ONLINE</span>
                                    </div>
                                </div>
                            </div>

                            {isOwnProfile && (
                                <Link
                                    href="/ayarlar"
                                    className="flex items-center justify-center gap-2 w-full py-2 border-2 border-cyan-500/50 text-cyan-400 font-mono text-xs hover:bg-cyan-500/20 hover:border-cyan-400 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                                >
                                    <Settings className="w-3 h-3" />
                                    CONFIG
                                </Link>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* COL 2-3: MAIN HUD PANELS */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="lg:col-span-2 flex flex-col gap-4"
                >
                    {/* Main Info Panel */}
                    <div className="bg-black/80 border-2 border-cyan-500/30 p-6 relative min-h-[200px] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                        {/* Terminal decorations */}
                        <div className="absolute top-2 right-2 flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-1 h-4 bg-cyan-900/50 border-l border-cyan-500/30" />
                            ))}
                        </div>

                        {/* System boot text */}
                        <div className="text-[9px] font-mono text-cyan-600/50 mb-3">
                            <span className="text-cyan-500">&gt;</span> INITIALIZING_USER_PROFILE...
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >_</motion.span>
                        </div>

                        <h2 className="text-4xl font-mono text-white mb-2 uppercase tracking-tight drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                            {profile?.full_name}
                        </h2>

                        <div className="font-mono text-cyan-400/70 text-sm leading-relaxed max-w-2xl mb-6 border-l-2 border-cyan-500/30 pl-4">
                            <span className="text-cyan-500">&gt;</span> {profile?.bio || "NO_BIO_DATA. USER_PROFILE_INCOMPLETE."}
                            <motion.span
                                className="inline-block ml-1"
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                █
                            </motion.span>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-3 flex-wrap">
                            {profile?.is_verified && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-900/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                                    <Shield className="w-3 h-3" />
                                    VERIFIED
                                </div>
                            )}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/20 border border-purple-500/40 text-purple-400 font-mono text-xs shadow-[0_0_10px_rgba(147,51,234,0.2)]">
                                <Cpu className="w-3 h-3" />
                                LVL_OMEGA
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid HUD */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: "XP", val: profile?.xp || 0, icon: Zap, color: "cyan" },
                            { label: "ARTICLES", val: profile?.article_count || 0, icon: Award, color: "purple" },
                            { label: "QUESTIONS", val: profile?.question_count || 0, icon: MessageSquare, color: "green" },
                            { label: "SOLUTIONS", val: profile?.solution_count || 0, icon: Shield, color: "amber" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="bg-black/60 border-2 border-cyan-500/20 p-4 hover:border-cyan-500/50 transition-all group relative overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)]"
                            >
                                {/* Animated background */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100"
                                    transition={{ duration: 0.3 }}
                                />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-3">
                                        <stat.icon className="w-5 h-5 text-cyan-700 group-hover:text-cyan-400 transition-colors" />
                                        <span className="text-[8px] font-mono text-cyan-800">[{String(i + 1).padStart(2, '0')}]</span>
                                    </div>
                                    <div className="text-3xl font-mono text-white font-bold group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                                        {stat.val}
                                    </div>
                                    <div className="text-[10px] font-mono text-cyan-600 uppercase tracking-wider mt-1">
                                        {stat.label}
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <motion.div
                                    className="absolute bottom-0 left-0 h-0.5 bg-cyan-400"
                                    initial={{ width: 0 }}
                                    whileHover={{ width: "100%" }}
                                    transition={{ duration: 0.4 }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
