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
            {/* ABOUT CARD - Lighter Dark & Refined */}
            <div className="bg-[#121212] border border-zinc-800 p-5 relative shadow-sm rounded-xl overflow-hidden group hover:border-zinc-700 transition-colors">
                {/* Subtle Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <h3 className="font-bold text-xs mb-4 flex items-center gap-2 uppercase tracking-tight text-zinc-400 border-b border-zinc-800 pb-2 relative z-10">
                    <span className="w-5 h-5 bg-zinc-900 text-zinc-500 flex items-center justify-center border border-zinc-800 rounded shadow-inner">
                        <User className="w-3 h-3" />
                    </span>
                    Hakkında
                </h3>

                <div className="space-y-3 font-medium relative z-10">
                    <StatRow icon={BookOpen} label="Makale" value={stats.articlesCount} color="text-zinc-400" />
                    <StatRow icon={HelpCircle} label="Soru" value={stats.questionsCount} color="text-zinc-400" />
                    <StatRow icon={MessageCircle} label="Cevap" value={stats.answersCount} color="text-zinc-400" />
                </div>

                {profile?.level !== undefined && profile?.xp_current !== undefined && (
                    <div className="mt-5 pt-3 border-t border-zinc-800 relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Seviye</p>
                            <p className="text-lg font-black text-white drop-shadow-sm">LVL {profile.level}</p>
                        </div>
                        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                            <div
                                className="h-full bg-gradient-to-r from-orange-600 to-amber-500 shadow-[0_0_10px_rgba(255,107,0,0.3)]"
                                style={{ width: `${(profile.xp_current / (profile.xp_next || 100)) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* BADGES CARD - Neo Grid */}
            <div className="bg-[#121212] border border-zinc-800 p-5 relative shadow-sm rounded-xl group hover:border-zinc-700 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <h3 className="font-bold text-xs mb-4 flex items-center gap-2 uppercase tracking-tight text-zinc-400 border-b border-zinc-800 pb-2 relative z-10">
                    <span className="w-5 h-5 bg-zinc-900 text-zinc-500 flex items-center justify-center border border-zinc-800 rounded shadow-inner">
                        <Award className="w-3 h-3" />
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
                                    className="aspect-square bg-zinc-900/40 border border-zinc-800/60 rounded-lg flex items-center justify-center relative group/badge cursor-pointer hover:bg-zinc-800 hover:border-zinc-600 transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                    title={badge.name}
                                >
                                    {badge.icon ? (
                                        <div className="text-lg grayscale group-hover/badge:grayscale-0 transition-all opacity-70 group-hover/badge:opacity-100 group-hover/badge:scale-110 duration-300">{badge.icon}</div>
                                    ) : (
                                        <Shield className="w-4 h-4 text-zinc-600 group-hover/badge:text-zinc-300" />
                                    )}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] font-bold uppercase px-2 py-1 rounded border border-zinc-700 opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl translate-y-2 group-hover/badge:translate-y-0">
                                        {badge.name}
                                    </div>
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 8 - userBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-zinc-950/30 border border-zinc-900/30 rounded-lg flex items-center justify-center">
                                <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border border-dashed border-zinc-900 rounded-lg relative z-10">
                        <div className="w-8 h-8 bg-zinc-900/50 flex items-center justify-center mx-auto mb-2 rounded-full border border-zinc-800/50">
                            <AlertCircle className="w-4 h-4 text-zinc-700" />
                        </div>
                        <p className="text-[10px] font-medium text-zinc-600 uppercase">Henüz rozet yok.</p>
                    </div>
                )}
            </div>

            {/* COMMUNITY LINK - Elegant Pop */}
            <div className="bg-gradient-to-br from-orange-600 to-red-600 border border-transparent p-1 shadow-lg rounded-xl relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="bg-[#121212] rounded-[10px] p-3 flex items-center justify-between relative z-10 h-full border border-white/5 group-hover:border-white/10 transition-colors">
                    <div>
                        <p className="text-[9px] font-bold uppercase text-orange-500 mb-0.5 tracking-wider">Topluluk</p>
                        <h3 className="text-sm font-black text-white group-hover:text-orange-100 transition-colors">Katkı Kuralları</h3>
                    </div>
                    <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                        <GraduationCap className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function StatRow({ icon: Icon, label, value, color }: any) {
    return (
        <div className="flex justify-between items-center text-xs group/row">
            <span className="flex items-center gap-2 text-zinc-500 font-medium group-hover/row:text-zinc-400 transition-colors">
                <Icon className={cn("w-3.5 h-3.5", color)} />
                {label}
            </span>
            <span className="text-zinc-300 font-bold group-hover/row:text-white transition-colors">
                {formatNumber(value)}
            </span>
        </div>
    );
}
