"use client";

import { motion } from "framer-motion";
import { Award, Shield, BookOpen, HelpCircle, MessageCircle, Zap, AlertCircle, GraduationCap, User } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { CustomBadgeIcon } from "../custom-badge-icon";
import Link from "next/link";

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
            {/* ABOUT CARD - Vivid & Soft */}
            <div className="bg-background border-2 border-black dark:border-zinc-800 p-5 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden group hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                {/* Yellow Accent Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FFC800] transform scale-x-100 transition-transform" />

                <h3 className="font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-tight text-white/50 border-b-2 border-dashed border-black/20 pb-2 relative z-10">
                    <span className="w-6 h-6 bg-[#FFC800] text-black flex items-center justify-center border-2 border-black rounded shadow-[2px_2px_0px_0px_#000]">
                        <User className="w-3.5 h-3.5 stroke-[3px]" />
                    </span>
                    Hakkında
                </h3>

                <div className="space-y-3 font-bold relative z-10">
                    <StatRow icon={BookOpen} label="Makale" value={stats.articlesCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                    <StatRow icon={HelpCircle} label="Soru" value={stats.questionsCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                    <StatRow icon={MessageCircle} label="Cevap" value={stats.answersCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                </div>

                {profile?.level !== undefined && profile?.xp_current !== undefined && (
                    <div className="mt-5 pt-3 border-t-2 border-black/20 relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Seviye</p>
                            <p className="text-xl font-black text-white drop-shadow-md">LVL {profile.level}</p>
                        </div>
                        <div className="w-full h-3 bg-black rounded-lg overflow-hidden border-2 border-black shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-[#FFC800] to-orange-500 striped-pattern"
                                style={{ width: `${(profile.xp_current / (profile.xp_next || 100)) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* BADGES CARD - Vivid Grid */}
            <div className="bg-background border-2 border-black dark:border-zinc-800 p-5 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] rounded-xl group hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#23A9FA] transform scale-x-100 transition-transform" />

                <Link href="/rozetler" className="h-[2px] w-full block absolute bottom-0 left-0 hover:bg-[#23A9FA] transition-colors z-20"></Link>
                <Link href="/rozetler" className="font-black text-xs mb-4 flex items-center justify-between uppercase tracking-tight text-white/50 border-b-2 border-dashed border-black/20 pb-2 relative z-10 hover:text-white transition-colors group">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-[#23A9FA] text-white flex items-center justify-center border-2 border-black rounded shadow-[2px_2px_0px_0px_#000] group-hover:bg-white group-hover:text-[#23A9FA] transition-colors">
                            <Award className="w-3.5 h-3.5 stroke-[3px]" />
                        </span>
                        Rozetler
                    </div>
                    <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 px-2 py-0.5 rounded text-white">Tümünü Gör →</span>
                </Link>

                {userBadges && userBadges.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 relative z-10">
                        {userBadges.map((badgeObj: any, index: number) => {
                            const badge = badgeObj.badges;
                            return (
                                <Link
                                    href="/rozetler"
                                    key={index}
                                    className="aspect-square bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-lg flex items-center justify-center relative group/badge cursor-pointer hover:bg-[#23A9FA] dark:hover:bg-[#23A9FA] transition-all shadow-sm hover:shadow-[2px_2px_0px_0px_#000]"
                                >
                                    {/* Tooltip Hover Area */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-56 bg-zinc-900 border-2 border-zinc-700 text-white p-2 rounded-lg opacity-0 invisible group-hover/badge:opacity-100 group-hover/badge:visible transition-all pointer-events-none z-50 shadow-[4px_4px_0_0_#000] flex flex-col gap-1 bottom-full origin-bottom">
                                        <div className="font-black text-[12px] uppercase text-[#23A9FA] flex items-center gap-1 border-b border-zinc-700/50 pb-1">
                                            <Award className="w-3 h-3" />
                                            {badge.name}
                                        </div>
                                        <div className="text-[10px] leading-snug text-zinc-300 font-medium whitespace-pre-wrap">
                                            {badge.description || "Gizemli rozet... Nasıl kazanılacağını kimse bilmiyor."}
                                        </div>
                                        {/* Tooltip Arrow */}
                                        <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-zinc-900 border-b-2 border-r-2 border-zinc-700 rotate-45" />
                                    </div>
                                    <div className="w-full h-full p-2 opacity-85 group-hover/badge:opacity-100 group-hover/badge:scale-110 duration-200 flex items-center justify-center">
                                        <CustomBadgeIcon name={badge.name} />
                                    </div>
                                </Link>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 8 - userBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-zinc-100/50 dark:bg-zinc-900/50 border-2 border-dashed border-black/20 dark:border-white/20 rounded-lg flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-black/20 dark:bg-white/20 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-black/20 rounded-lg relative z-10 bg-black/5">
                        <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center mx-auto mb-2 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                            <AlertCircle className="w-5 h-5 text-zinc-500 stroke-[2.5px]" />
                        </div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase">Henüz rozet yok.</p>
                    </div>
                )
                }
            </div >
        </motion.div >
    );
}

function StatRow({ icon: Icon, label, value, color }: any) {
    return (
        <div className="flex justify-between items-center text-xs group/row">
            <span className="flex items-center gap-2 text-zinc-500 font-bold group-hover/row:text-zinc-300 transition-colors">
                <Icon className={cn("w-4 h-4 stroke-[2.5px]", color)} />
                {label}
            </span>
            <span className="text-zinc-300 font-black group-hover/row:text-white transition-colors text-sm">
                {formatNumber(value)}
            </span>
        </div>
    );
}
