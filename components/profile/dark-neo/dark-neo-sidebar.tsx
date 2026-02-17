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
            {/* ABOUT CARD - Refined & Clean */}
            <div className="bg-[#0a0a0a] border border-zinc-800 p-5 relative shadow-sm rounded-xl">

                <h3 className="font-bold text-xs mb-4 flex items-center gap-2 uppercase tracking-tight text-zinc-400 border-b border-zinc-900 pb-2">
                    <span className="w-5 h-5 bg-zinc-900 text-zinc-400 flex items-center justify-center border border-zinc-800 rounded">
                        <User className="w-3 h-3" />
                    </span>
                    Hakkında
                </h3>

                <div className="space-y-3 font-medium">
                    <StatRow icon={BookOpen} label="Makale" value={stats.articlesCount} color="text-zinc-300" />
                    <StatRow icon={HelpCircle} label="Soru" value={stats.questionsCount} color="text-zinc-300" />
                    <StatRow icon={MessageCircle} label="Cevap" value={stats.answersCount} color="text-zinc-300" />
                </div>

                {profile?.level !== undefined && profile?.xp_current !== undefined && (
                    <div className="mt-5 pt-3 border-t border-zinc-900">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase">Seviye</p>
                            <p className="text-lg font-bold text-white">LVL {profile.level}</p>
                        </div>
                        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                                style={{ width: `${(profile.xp_current / (profile.xp_next || 100)) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* BADGES CARD - Minimal Grid */}
            <div className="bg-[#0a0a0a] border border-zinc-800 p-5 relative shadow-sm rounded-xl">
                <h3 className="font-bold text-xs mb-4 flex items-center gap-2 uppercase tracking-tight text-zinc-400 border-b border-zinc-900 pb-2">
                    <span className="w-5 h-5 bg-zinc-900 text-zinc-400 flex items-center justify-center border border-zinc-800 rounded">
                        <Award className="w-3 h-3" />
                    </span>
                    Rozetler
                </h3>

                {userBadges && userBadges.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                        {userBadges.map((badgeObj: any, index: number) => {
                            const badge = badgeObj.badges;
                            return (
                                <div
                                    key={index}
                                    className="aspect-square bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center relative group cursor-pointer hover:bg-zinc-800 hover:border-zinc-600 transition-colors"
                                    title={badge.name}
                                >
                                    {badge.icon ? (
                                        <div className="text-lg grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100">{badge.icon}</div>
                                    ) : (
                                        <Shield className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300" />
                                    )}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] font-bold uppercase px-2 py-1 rounded border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl translate-y-2 group-hover:translate-y-0">
                                        {badge.name}
                                    </div>
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 8 - userBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-zinc-950/50 border border-zinc-900/50 rounded-lg flex items-center justify-center">
                                <div className="w-1 h-1 bg-zinc-900 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border border-dashed border-zinc-900 rounded-lg">
                        <div className="w-8 h-8 bg-zinc-900/50 flex items-center justify-center mx-auto mb-2 rounded-full">
                            <AlertCircle className="w-4 h-4 text-zinc-700" />
                        </div>
                        <p className="text-[10px] font-medium text-zinc-600 uppercase">Henüz rozet yok.</p>
                    </div>
                )}
            </div>

            {/* COMMUNITY LINK - Elegant Pop */}
            <div className="bg-gradient-to-br from-orange-600 to-red-600 border border-transparent p-4 shadow-lg rounded-xl flex items-center justify-between hover:translate-y-[-2px] hover:shadow-orange-500/20 transition-all cursor-pointer group">
                <div>
                    <p className="text-[9px] font-bold uppercase text-white/70 mb-0.5">Topluluk</p>
                    <h3 className="text-sm font-bold text-white group-hover:underline decoration-2 underline-offset-2 decoration-white/30">Katkı Kuralları</h3>
                </div>
                <div className="bg-white/10 p-2 rounded-lg text-white group-hover:bg-white/20 transition-colors">
                    <GraduationCap className="w-4 h-4" />
                </div>
            </div>
        </motion.div>
    );
}

function StatRow({ icon: Icon, label, value, color }: any) {
    return (
        <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-2 text-zinc-500 font-medium">
                <Icon className={cn("w-3.5 h-3.5", color)} />
                {label}
            </span>
            <span className="text-zinc-200 font-bold">
                {formatNumber(value)}
            </span>
        </div>
    );
}
