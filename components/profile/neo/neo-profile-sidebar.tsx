"use client";

import { motion, Variants } from "framer-motion";
import {
    Award, Shield, GraduationCap, Star, Zap,
    BookOpen, HelpCircle, MessageCircle, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NeoProfileSidebarProps {
    profile: any;
    user: any;
    stats: any;
    userBadges: any[];
}

export function NeoProfileSidebar({
    profile,
    user,
    stats,
    userBadges
}: NeoProfileSidebarProps) {

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const itemVariants: Variants = {
        hidden: { x: 20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6 sticky top-24"
        >
            {/* 1. ABOUT CARD */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-black border-[3px] border-black dark:border-white rounded-xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#FACC15]"></div>

                <h3 className="font-black text-xl mb-4 flex items-center gap-2 uppercase tracking-tight">
                    <UserPlusIcon className="w-5 h-5 text-[#FACC15]" />
                    Hakkında
                </h3>

                <div className="space-y-4 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                    <div className="flex justify-between items-center border-b-2 border-zinc-100 dark:border-zinc-800 pb-2">
                        <span className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-zinc-400" />
                            Makale
                        </span>
                        <span className="text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-black dark:border-zinc-700">{stats.articlesCount}</span>
                    </div>
                    <div className="flex justify-between items-center border-b-2 border-zinc-100 dark:border-zinc-800 pb-2">
                        <span className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-zinc-400" />
                            Soru
                        </span>
                        <span className="text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-black dark:border-zinc-700">{stats.questionsCount}</span>
                    </div>
                    <div className="flex justify-between items-center border-b-2 border-zinc-100 dark:border-zinc-800 pb-2">
                        <span className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-zinc-400" />
                            Cevap
                        </span>
                        <span className="text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-black dark:border-zinc-700">{stats.answersCount}</span>
                    </div>
                </div>

                {profile?.level && (
                    <div className="mt-6 pt-4 border-t-[3px] border-black dark:border-white/20 border-dashed">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs font-black text-zinc-400 uppercase">Seviye</p>
                                <p className="text-2xl font-black text-[#4169E1]">LVL {profile.level}</p>
                            </div>
                            <div className="w-12 h-12 bg-black text-[#FACC15] rounded-full flex items-center justify-center border-[3px] border-[#FACC15] shadow-lg">
                                <Zap className="w-6 h-6 fill-current" />
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 border-2 border-black overflow-hidden relative">
                            <div
                                className="h-full bg-[#FACC15] absolute top-0 left-0 border-r-2 border-black"
                                style={{ width: `${(profile.xp_current / profile.xp_next) * 100}%` }}
                            ></div>
                            {/* Striped pattern overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* 2. BADGES CARD */}
            <motion.div variants={itemVariants} className="bg-[#4169E1] text-white border-[3px] border-black rounded-xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute -right-6 -bottom-6 opacity-20">
                    <Award className="w-32 h-32 rotate-12" />
                </div>

                <h3 className="font-black text-xl mb-4 flex items-center gap-2 uppercase tracking-tight relative z-10">
                    <Award className="w-5 h-5 text-white" />
                    Rozetler
                </h3>

                {userBadges && userBadges.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 relative z-10">
                        {userBadges.map((badgeObj: any, index: number) => {
                            const badge = badgeObj.badges;
                            return (
                                <div
                                    key={index}
                                    className="aspect-square bg-black/20 rounded-lg border-2 border-black/10 flex items-center justify-center relative group cursor-pointer hover:bg-black/40 transition-colors"
                                    title={badge.name}
                                >
                                    {badge.icon ? (
                                        <div className="text-2xl">{badge.icon}</div>
                                    ) : (
                                        <Shield className="w-6 h-6" />
                                    )}

                                    {/* Tooltip */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-2 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                        {badge.name}
                                    </div>
                                </div>
                            )
                        })}
                        {/* Empty slots for visual "completeness" if few badges */}
                        {Array.from({ length: Math.max(0, 8 - userBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-black/10 rounded-lg border-2 border-black/5 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-black/20"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-white/20">
                            <AlertCircle className="w-6 h-6 opacity-50" />
                        </div>
                        <p className="text-xs font-bold opacity-70">Henüz rozet kazanılmadı.</p>
                    </div>
                )}
            </motion.div>

            {/* 3. TRENDING / EXTRA INFO */}
            <motion.div variants={itemVariants} className="bg-[#FF0080] text-white border-[3px] border-black rounded-xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between hover:translate-x-1 transition-transform cursor-pointer group">
                <div>
                    <p className="text-xs font-bold uppercase opacity-90 mb-1">Topluluk</p>
                    <h3 className="text-lg font-black leading-tight border-b-2 border-transparent group-hover:border-white inline-block">Katkı Kuralları</h3>
                </div>
                <div className="bg-black/20 p-2 rounded-lg border-2 border-black/10">
                    <GraduationCap className="w-6 h-6" />
                </div>
            </motion.div>

        </motion.div>
    );
}

// Icon helper
function UserPlusIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
