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
            {/* ABOUT CARD - Sharp & Clean */}
            <div className="bg-[#0a0a0a] border-2 border-black p-5 relative shadow-[4px_4px_0px_0px_#000]">

                <h3 className="font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-tight text-white/50 border-b-2 border-zinc-900 pb-2">
                    <span className="w-5 h-5 bg-zinc-800 text-white flex items-center justify-center border border-black">
                        <User className="w-3 h-3" />
                    </span>
                    Hakkında
                </h3>

                <div className="space-y-3 font-bold">
                    <StatRow icon={BookOpen} label="Makale" value={stats.articlesCount} color="text-white" />
                    <StatRow icon={HelpCircle} label="Soru" value={stats.questionsCount} color="text-white" />
                    <StatRow icon={MessageCircle} label="Cevap" value={stats.answersCount} color="text-white" />
                </div>

                {profile?.level !== undefined && profile?.xp_current !== undefined && (
                    <div className="mt-5 pt-3 border-t-2 border-zinc-900">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase">Seviye</p>
                            <p className="text-xl font-black text-white italic">LVL {profile.level}</p>
                        </div>
                        <div className="w-full h-3 bg-zinc-900 border border-zinc-700">
                            <div
                                className="h-full bg-[#FF6B00]"
                                style={{ width: `${(profile.xp_current / (profile.xp_next || 100)) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* BADGES CARD - Sharp Grid */}
            <div className="bg-[#0a0a0a] border-2 border-black p-5 relative shadow-[4px_4px_0px_0px_#000]">
                <h3 className="font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-tight text-white/50 border-b-2 border-zinc-900 pb-2">
                    <span className="w-5 h-5 bg-zinc-800 text-white flex items-center justify-center border border-black">
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
                                    className="aspect-square bg-zinc-900 border border-zinc-800 flex items-center justify-center relative group cursor-pointer hover:bg-zinc-800 hover:border-white transition-colors"
                                    title={badge.name}
                                >
                                    {badge.icon ? (
                                        <div className="text-lg grayscale group-hover:grayscale-0 transition-all">{badge.icon}</div>
                                    ) : (
                                        <Shield className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                                    )}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black uppercase px-2 py-1 border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                        {badge.name}
                                    </div>
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 8 - userBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-zinc-950 border border-zinc-900 flex items-center justify-center opacity-50">
                                <div className="w-1 h-1 bg-zinc-800" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-zinc-900">
                        <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center mx-auto mb-2 border border-zinc-800">
                            <AlertCircle className="w-4 h-4 text-zinc-600" />
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase">Henüz rozet yok.</p>
                    </div>
                )}
            </div>

            {/* COMMUNITY LINK - Brutal Pop */}
            <div className="bg-[#FF6B00] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer group">
                <div>
                    <p className="text-[9px] font-black uppercase text-black/60 mb-0.5">Topluluk</p>
                    <h3 className="text-base font-black text-black group-hover:underline decoration-2 underline-offset-2">Katkı Kuralları</h3>
                </div>
                <div className="bg-black text-white p-2 border-2 border-transparent group-hover:border-black transition-colors">
                    <GraduationCap className="w-5 h-5" />
                </div>
            </div>
        </motion.div>
    );
}

function StatRow({ icon: Icon, label, value, color }: any) {
    return (
        <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-2 text-zinc-400 font-medium">
                <Icon className={cn("w-3.5 h-3.5", color)} />
                {label}
            </span>
            <span className="text-white font-black">
                {formatNumber(value)}
            </span>
        </div>
    );
}
