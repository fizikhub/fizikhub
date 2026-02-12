"use client";

import { motion } from "framer-motion";
import { Award, Shield, BookOpen, HelpCircle, MessageCircle, Zap, AlertCircle, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface DarkNeoSidebarProps {
    profile: any;
    user: any;
    stats: any;
    userBadges: any[];
}

export function DarkNeoSidebar({ profile, user, stats, userBadges }: DarkNeoSidebarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 sticky top-24"
        >
            {/* ABOUT CARD */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/10 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.1)] relative overflow-hidden">
                <h3 className="font-black text-base mb-4 flex items-center gap-2 uppercase tracking-wide text-black dark:text-white">
                    <span className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center border-2 border-black dark:border-white">
                        <User className="w-4 h-4" />
                    </span>
                    İstatistikler
                </h3>

                <div className="space-y-3">
                    <StatRow icon={BookOpen} label="Makale" value={stats.articlesCount} color="zinc" />
                    <StatRow icon={HelpCircle} label="Soru" value={stats.questionsCount} color="zinc" />
                    <StatRow icon={MessageCircle} label="Cevap" value={stats.answersCount} color="zinc" />
                </div>

                {profile?.level && (
                    <div className="mt-5 pt-4 border-t-2 border-black/5 dark:border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Seviye</p>
                            <p className="text-xl font-black text-black dark:text-white">LVL {profile.level}</p>
                        </div>
                        <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                            <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${(profile.xp_current / profile.xp_next) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* BADGES CARD */}
            <div className="bg-zinc-100 dark:bg-zinc-950 border-2 border-black/10 dark:border-white/10 rounded-2xl p-5 relative overflow-hidden group">

                <h3 className="font-black text-base mb-4 flex items-center gap-2 uppercase tracking-wide text-black dark:text-white relative z-10">
                    <span className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center border-2 border-black dark:border-white">
                        <Award className="w-4 h-4" />
                    </span>
                    Rozetler
                </h3>

                {userBadges && userBadges.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 relative z-10">
                        {userBadges.map((badgeObj: any, index: number) => {
                            const badge = badgeObj.badges;
                            return (
                                <div
                                    key={index}
                                    className="aspect-square bg-white dark:bg-zinc-900 rounded-xl border-2 border-black/5 dark:border-white/5 flex items-center justify-center relative group/badge cursor-pointer hover:border-black dark:hover:border-white transition-all shadow-sm hover:shadow-md"
                                    title={badge.name}
                                >
                                    {badge.icon ? (
                                        <div className="text-xl">{badge.icon}</div>
                                    ) : (
                                        <Shield className="w-5 h-5 text-zinc-400" />
                                    )}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                        {badge.name}
                                    </div>
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 8 - userBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-black/5 dark:bg-white/5 rounded-xl border border-transparent flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-black/10 dark:bg-white/10" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 relative z-10 bg-white dark:bg-zinc-900 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-2">
                            <AlertCircle className="w-5 h-5 text-zinc-400" />
                        </div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Henüz rozet yok</p>
                    </div>
                )}
            </div>

            {/* COMMUNITY LINK */}
            <div className="bg-[#FACC15] border-2 border-black dark:border-white/20 rounded-2xl p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-black/60 mb-1">Topluluk</p>
                        <h3 className="text-lg font-black text-black leading-tight">Katkı Kuralları &<br />Rozet Sistemi</h3>
                    </div>
                    <div className="bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function StatRow({ icon: Icon, label, value, color }: any) {
    return (
        <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2 last:border-0 last:pb-0">
            <span className="flex items-center gap-2.5 text-zinc-500 dark:text-zinc-400 text-xs font-bold">
                <div className="p-1 rounded bg-zinc-100 dark:bg-zinc-800">
                    <Icon className="w-3.5 h-3.5 text-black dark:text-white" />
                </div>
                {label}
            </span>
            <span className="text-black dark:text-white bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-md border border-transparent font-black text-xs min-w-[30px] text-center">
                {value}
            </span>
        </div>
    );
}
