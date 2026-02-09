"use client";

import { motion } from "framer-motion";
import { Award, Shield, BookOpen, HelpCircle, MessageCircle, Zap, AlertCircle, GraduationCap } from "lucide-react";
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
            className="space-y-4 sticky top-24"
        >
            {/* COMPACT ABOUT CARD */}
            <div className="bg-[#0a0a0a] border-2 border-white/10 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#4169E1]" />

                <h3 className="font-black text-sm mb-3 flex items-center gap-2 uppercase tracking-tight text-white">
                    <span className="w-6 h-6 bg-[#4169E1] text-white rounded flex items-center justify-center">
                        <UserIcon className="w-3 h-3" />
                    </span>
                    Hakkında
                </h3>

                <div className="space-y-2 text-xs font-bold">
                    <StatRow icon={BookOpen} label="Makale" value={stats.articlesCount} color="blue" />
                    <StatRow icon={HelpCircle} label="Soru" value={stats.questionsCount} color="cyan" />
                    <StatRow icon={MessageCircle} label="Cevap" value={stats.answersCount} color="pink" />
                </div>

                {profile?.level && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center mb-1.5">
                            <p className="text-[10px] font-black text-zinc-500 uppercase">Seviye</p>
                            <p className="text-lg font-black text-[#4169E1]">LVL {profile.level}</p>
                        </div>
                        <div className="w-full h-2 bg-black rounded-full border border-white/10 overflow-hidden">
                            <div
                                className="h-full bg-[#4169E1]"
                                style={{ width: `${(profile.xp_current / profile.xp_next) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* COMPACT BADGES CARD - Royal Blue */}
            <div className="bg-[#4169E1]/10 border-2 border-[#4169E1]/30 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Award className="w-24 h-24 rotate-12 text-[#4169E1]" />
                </div>

                <h3 className="font-black text-sm mb-3 flex items-center gap-2 uppercase tracking-tight text-white relative z-10">
                    <span className="w-6 h-6 bg-[#4169E1] text-white rounded flex items-center justify-center">
                        <Award className="w-3 h-3" />
                    </span>
                    Rozetler
                </h3>

                {userBadges && userBadges.length > 0 ? (
                    <div className="grid grid-cols-4 gap-1.5 relative z-10">
                        {userBadges.map((badgeObj: any, index: number) => {
                            const badge = badgeObj.badges;
                            return (
                                <div
                                    key={index}
                                    className="aspect-square bg-[#4169E1]/30 rounded-lg border border-[#4169E1]/50 flex items-center justify-center relative group cursor-pointer hover:bg-[#4169E1]/50 transition-colors"
                                    title={badge.name}
                                >
                                    {badge.icon ? (
                                        <div className="text-lg">{badge.icon}</div>
                                    ) : (
                                        <Shield className="w-4 h-4 text-white/70" />
                                    )}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        {badge.name}
                                    </div>
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 8 - userBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-[#4169E1]/10 rounded-lg border border-[#4169E1]/20 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#4169E1]/30" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 relative z-10">
                        <div className="w-10 h-10 bg-[#4169E1]/30 rounded-full flex items-center justify-center mx-auto mb-2 border border-[#4169E1]/50">
                            <AlertCircle className="w-5 h-5 text-[#4169E1]" />
                        </div>
                        <p className="text-[10px] font-bold text-white/60">Henüz rozet kazanılmadı.</p>
                    </div>
                )}
            </div>

            {/* COMPACT COMMUNITY LINK - Cyan */}
            <div className="bg-cyan-600 border-2 border-white/20 rounded-xl p-3 shadow-[3px_3px_0_#000] flex items-center justify-between hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000] transition-all cursor-pointer">
                <div>
                    <p className="text-[10px] font-bold uppercase text-white/70">Topluluk</p>
                    <h3 className="text-sm font-black text-white">Katkı Kuralları</h3>
                </div>
                <div className="bg-black/20 p-1.5 rounded-lg">
                    <GraduationCap className="w-4 h-4 text-white" />
                </div>
            </div>
        </motion.div>
    );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function StatRow({ icon: Icon, label, value, color }: any) {
    const colorClasses = {
        blue: "text-[#4169E1]",
        cyan: "text-cyan-400",
        pink: "text-pink-400",
        yellow: "text-yellow-400"
    };

    return (
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-2 text-zinc-400">
                <Icon className={cn("w-4 h-4", colorClasses[color as keyof typeof colorClasses])} />
                {label}
            </span>
            <span className="text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                {value}
            </span>
        </div>
    );
}
