"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Settings, Shield, Award, Activity, Cpu, MessageSquare } from "lucide-react";
import Link from "next/link";

interface CyberProfileHeroProps {
    profile: any;
    isOwnProfile: boolean;
    onEdit?: () => void;
}

export function CyberProfileHero({ profile, isOwnProfile, onEdit }: CyberProfileHeroProps) {
    return (
        <div className="w-full mb-8 relative">
            {/* BACKGROUND MATRIX */}
            <div className="absolute inset-0 bg-black border-x border-cyan-900/30 overflow-hidden h-[400px]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px]" />
                <div className="absolute top-0 left-0 w-full h-px bg-cyan-500/50 shadow-[0_0_10px_#00F0FF]" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-cyan-500/50" />
            </div>

            <div className="relative z-10 container pt-20 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COL 1: IDENTITY CORE */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-black/80 border border-cyan-500/30 p-1 relative"
                >
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400" />

                    <div className="relative w-full aspect-square border-b border-cyan-900/50 mb-4 overflow-hidden group">
                        <Image
                            src={profile?.avatar_url || '/images/default-avatar.png'}
                            alt={profile?.username}
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        />
                        {/* Avatar Grid Overlay */}
                        <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-20 pointer-events-none" />
                        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/60 px-1">
                            IMG_SRC_OK
                        </div>
                    </div>

                    <div className="p-4 pt-0">
                        <h1 className="font-mono text-2xl text-cyan-400 font-bold uppercase tracking-widest mb-1">
                            {profile?.username}
                        </h1>
                        <div className="text-[10px] font-mono text-cyan-600 mb-4 flex justify-between">
                            <span>ROLE: {profile?.role || "USER"}</span>
                            <span>STATUS: ONLINE</span>
                        </div>

                        {isOwnProfile && (
                            <Link href="/ayarlar" className="flex items-center justify-center gap-2 w-full py-2 border border-cyan-500/40 text-cyan-400 font-mono text-xs hover:bg-cyan-500/10 transition-colors uppercase">
                                <Settings className="w-3 h-3" />
                                CONFIG_PROFILE
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* COL 2: MAIN METRICS (Central HUD) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 flex flex-col gap-4"
                >
                    {/* Top Bar: Name & Bio */}
                    <div className="bg-black/60 border border-cyan-500/20 p-6 relative min-h-[160px]">
                        {/* Decoration */}
                        <div className="absolute top-2 right-2 flex gap-1">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-3 bg-cyan-900/50" />)}
                        </div>

                        <h2 className="text-3xl font-mono text-white mb-2 uppercase">{profile?.full_name}</h2>
                        <p className="font-mono text-cyan-400/60 text-sm leading-relaxed max-w-xl">
                            &gt; {profile?.bio || "NO_BIO_DATA_AVAILABLE. USER_HAS_NOT_INITIALIZED_BIO_SEQUENCE."}
                            <span className="animate-pulse">_</span>
                        </p>

                        <div className="mt-6 flex gap-3">
                            {profile?.is_verified && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
                                    <Shield className="w-3 h-3" /> VERIFIED_ENTITY
                                </div>
                            )}
                            <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/10 border border-purple-500/30 text-purple-400 font-mono text-xs">
                                <Cpu className="w-3 h-3" /> NET_LEVEL_1
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "XP POINTS", val: profile?.xp || 0, icon: Activity },
                            { label: "ARTICLES", val: profile?.article_count || 0, icon: Award },
                            { label: "QUESTIONS", val: profile?.question_count || 0, icon: MessageSquare },
                            { label: "SOLUTIONS", val: profile?.solution_count || 0, icon: Shield },
                        ].map((stat, i) => (
                            <div key={i} className="bg-black/40 border border-cyan-500/10 p-4 hover:border-cyan-500/40 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <stat.icon className="w-4 h-4 text-cyan-700 group-hover:text-cyan-400" />
                                    <span className="text-[9px] font-mono text-cyan-800">0{i + 1}</span>
                                </div>
                                <div className="text-2xl font-mono text-white font-bold group-hover:text-cyan-300">
                                    {stat.val}
                                </div>
                                <div className="text-[10px] font-mono text-cyan-600 uppercase">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

