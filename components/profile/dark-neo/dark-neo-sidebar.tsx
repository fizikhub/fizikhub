"use client";

import { motion } from "framer-motion";
import { Award, Shield, BookOpen, HelpCircle, MessageCircle, Zap, AlertCircle, GraduationCap, User } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

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

                <h3 className="font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-tight text-white/50 border-b-2 border-dashed border-black/20 pb-2 relative z-10">
                    <span className="w-6 h-6 bg-[#23A9FA] text-white flex items-center justify-center border-2 border-black rounded shadow-[2px_2px_0px_0px_#000]">
                        <Award className="w-3.5 h-3.5 stroke-[3px]" />
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
                                    className="aspect-square bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-lg flex items-center justify-center relative group/badge cursor-pointer hover:bg-[#23A9FA] dark:hover:bg-[#23A9FA] transition-all shadow-sm hover:shadow-[2px_2px_0px_0px_#000]"
                                    title={badge.name}
                                >
                                    {badge.icon ? (
                                        <div className="text-xl grayscale group-hover/badge:grayscale-0 transition-all opacity-80 group-hover/badge:opacity-100 group-hover/badge:scale-110 duration-200">{badge.icon}</div>
                                    ) : (
                                        <Shield className="w-5 h-5 text-zinc-600 group-hover/badge:text-white stroke-[2.5px]" />
                                    )}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black uppercase px-2 py-1 rounded border-2 border-white opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] translate-y-2 group-hover/badge:translate-y-0">
                                        {badge.name}
                                    </div>
                                </div>
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
                )}
            </div>

            <div className="bg-[#00F050] border-2 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl relative overflow-hidden group cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                <div className="bg-zinc-900 rounded-[10px] p-4 flex items-center justify-between relative z-10 h-full border-2 border-black group-hover:bg-[#00F050] transition-colors duration-300">
                    <div>
                        <p className="text-[9px] font-black uppercase text-[#00F050] mb-0.5 tracking-wider group-hover:text-black transition-colors">Topluluk</p>
                        <h3 className="text-base font-black text-white group-hover:text-black transition-colors">Katkı Kuralları</h3>
                    </div>
                    <div className="bg-black/20 p-2.5 rounded-lg text-[#00F050] group-hover:bg-black group-hover:text-[#00F050] transition-all border-2 border-transparent group-hover:border-black shadow-inner">
                        <GraduationCap className="w-5 h-5 stroke-[2.5px]" />
                    </div>
                </div>
            </div>
        </motion.div>
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
