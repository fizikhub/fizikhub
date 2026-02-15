"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, HelpCircle, MessageCircle, AlertCircle, TrendingUp, Zap, Sparkles } from "lucide-react";

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
            className="space-y-8 sticky top-24"
        >
            {/* 1. LEVEL & STATS WIDGET - "Pink Note" Style */}
            <div className="neo-box-pink p-0 relative overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-black text-[hsl(var(--pop-pink))] p-3 border-b-3 border-black flex justify-between items-center">
                    <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Seviye & XP
                    </h3>
                    <div className="neo-badge bg-[hsl(var(--pop-lime))] text-[10px] transform -rotate-3">
                        LVL {profile?.level || 1}
                    </div>
                </div>

                <div className="p-5 bg-white dark:bg-zinc-900">
                    {/* XP BAR */}
                    <div className="mb-6">
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                            <span>{profile?.xp_current || 0} XP</span>
                            <span className="opacity-50">{profile?.xp_next || 100} XP</span>
                        </div>
                        <div className="w-full h-4 border-3 border-black bg-white relative">
                            <div
                                className="h-full bg-[hsl(var(--pop-purple))] border-r-3 border-black"
                                style={{ width: `${Math.min(100, ((profile?.xp_current || 0) / (profile?.xp_next || 100)) * 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* DETAILED STATS */}
                    <div className="space-y-3">
                        <StatRow icon={BookOpen} label="Makale" value={stats.articlesCount} color="var(--pop-cyan)" />
                        <StatRow icon={HelpCircle} label="Soru" value={stats.questionsCount} color="var(--pop-lime)" />
                        <StatRow icon={MessageCircle} label="Cevap" value={stats.answersCount} color="var(--pop-yellow)" />
                    </div>
                </div>
            </div>

            {/* 2. BADGES WIDGET - "Cyan Grid" */}
            <div className="neo-box-cyan p-0 relative transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="bg-black text-[hsl(var(--pop-cyan))] p-3 border-b-3 border-black">
                    <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Rozet Koleksiyonu
                    </h3>
                </div>

                <div className="p-5 bg-white dark:bg-zinc-900 min-h-[120px]">
                    {userBadges && userBadges.length > 0 ? (
                        <div className="grid grid-cols-4 gap-3">
                            {userBadges.map((badgeObj: any, index: number) => (
                                <div
                                    key={index}
                                    className="aspect-square bg-[hsl(var(--pop-yellow))] border-2 border-black flex items-center justify-center shadow-[3px_3px_0_0_#000] hover:scale-110 transition-transform cursor-pointer"
                                    title={badgeObj.badges.name}
                                >
                                    {badgeObj.badges.icon ? (
                                        <span className="text-xl">{badgeObj.badges.icon}</span>
                                    ) : (
                                        <Zap className="w-5 h-5 text-black" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 border-3 border-dashed border-black/20 bg-gray-50/50">
                            <Sparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-[10px] font-black text-gray-400 uppercase">Henüz rozet yok</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. COMMUNITY LINK - "Yellow Button" */}
            <a href="/topluluk" className="block transform hover:scale-[1.02] transition-transform">
                <div className="neo-box-yellow p-4 flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] font-black uppercase text-black/60 tracking-widest">Topluluğa Katıl</p>
                        <h3 className="text-base font-black text-black">Katkı Kuralları</h3>
                    </div>
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-transparent group-hover:bg-white group-hover:text-black group-hover:border-black transition-colors rounded-full">
                        <Zap className="w-4 h-4 fill-current" />
                    </div>
                </div>
            </a>
        </motion.div>
    );
}

function StatRow({ icon: Icon, label, value, color }: any) {
    return (
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors border-2 border-transparent hover:border-black/5 group">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000]" style={{ backgroundColor: color }}>
                    <Icon className="w-3 h-3 text-black" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wide text-gray-600 group-hover:text-black">
                    {label}
                </span>
            </div>
            <span className="text-sm font-black text-black">
                {value}
            </span>
        </div>
    );
}
