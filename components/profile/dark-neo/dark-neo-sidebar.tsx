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
            className="space-y-6 sticky top-24"
        >
            {/* ABOUT CARD */}
            <div className="bg-zinc-900 border-2 border-zinc-800 rounded-xl p-6 shadow-[5px_5px_0_rgba(250,204,21,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500" />

                <h3 className="font-black text-lg mb-4 flex items-center gap-2 uppercase tracking-tight text-white">
                    <span className="w-8 h-8 bg-yellow-400 text-black rounded-lg flex items-center justify-center">
                        <UserIcon className="w-4 h-4" />
                    </span>
                    Hakkında
                </h3>

                <div className="space-y-3 text-sm font-bold">
                    <StatRow icon={BookOpen} label="Makale" value={stats.articlesCount} color="purple" />
                    <StatRow icon={HelpCircle} label="Soru" value={stats.questionsCount} color="cyan" />
                    <StatRow icon={MessageCircle} label="Cevap" value={stats.answersCount} color="pink" />
                </div>

                {profile?.level && (
                    <div className="mt-6 pt-4 border-t border-zinc-700 border-dashed">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-xs font-black text-zinc-500 uppercase">Seviye</p>
                                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                    LVL {profile.level}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-zinc-800 text-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-500/50">
                                <Zap className="w-5 h-5 fill-current" />
                            </div>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-3 bg-zinc-800 rounded-full border border-zinc-700 overflow-hidden relative">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                                style={{ width: `${(profile.xp_current / profile.xp_next) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* BADGES CARD */}
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-2 border-purple-500/30 rounded-xl p-6 shadow-[5px_5px_0_rgba(168,85,247,0.2)] relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-10">
                    <Award className="w-32 h-32 rotate-12 text-purple-400" />
                </div>

                <h3 className="font-black text-lg mb-4 flex items-center gap-2 uppercase tracking-tight text-white relative z-10">
                    <span className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center">
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
                                    className="aspect-square bg-purple-800/50 rounded-lg border border-purple-600/50 flex items-center justify-center relative group cursor-pointer hover:bg-purple-700/50 transition-colors"
                                    title={badge.name}
                                >
                                    {badge.icon ? (
                                        <div className="text-2xl">{badge.icon}</div>
                                    ) : (
                                        <Shield className="w-6 h-6 text-purple-300" />
                                    )}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-2 py-1 rounded border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                        {badge.name}
                                    </div>
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 8 - userBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-purple-900/30 rounded-lg border border-purple-800/30 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-purple-700/50" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 relative z-10">
                        <div className="w-12 h-12 bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-2 border border-purple-600/50">
                            <AlertCircle className="w-6 h-6 text-purple-400" />
                        </div>
                        <p className="text-xs font-bold text-purple-300">Henüz rozet kazanılmadı.</p>
                    </div>
                )}
            </div>

            {/* COMMUNITY LINK */}
            <div className="bg-gradient-to-br from-pink-600 to-pink-800 border-2 border-pink-500 rounded-xl p-5 shadow-[5px_5px_0_rgba(0,0,0,0.3)] flex items-center justify-between hover:translate-x-1 transition-transform cursor-pointer group">
                <div>
                    <p className="text-xs font-bold uppercase text-pink-200 mb-1">Topluluk</p>
                    <h3 className="text-lg font-black text-white leading-tight">Katkı Kuralları</h3>
                </div>
                <div className="bg-black/20 p-2 rounded-lg border border-pink-400/30">
                    <GraduationCap className="w-6 h-6 text-pink-100" />
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
        purple: "text-purple-400",
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
