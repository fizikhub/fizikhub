"use client";

import { motion } from "framer-motion";
import { Award, Shield, BookOpen, HelpCircle, MessageCircle, AlertCircle, GraduationCap, User, Zap } from "lucide-react";
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
            <div className="neo-box p-5 relative overflow-hidden">
                <h3 className="font-black text-sm mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <User className="w-4 h-4" />
                    İstatistikler
                </h3>

                <div className="space-y-3 text-xs font-bold">
                    <StatRow icon={BookOpen} label="Makale" value={stats.articlesCount} />
                    <StatRow icon={HelpCircle} label="Soru" value={stats.questionsCount} />
                    <StatRow icon={MessageCircle} label="Cevap" value={stats.answersCount} />
                </div>

                {profile?.level !== undefined && profile?.xp_current !== undefined && (
                    <div className="mt-6 pt-4 border-t-2 border-black/10 dark:border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Seviye</p>
                            <p className="text-lg font-black">{profile.level}</p>
                        </div>
                        <div className="w-full h-3 bg-black/5 dark:bg-white/10 border-2 border-black dark:border-white relative">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${Math.min(100, (profile.xp_current / (profile.xp_next || 100)) * 100)}%` }}
                            />
                        </div>
                        <div className="mt-1 flex justify-between text-[10px] font-bold text-muted-foreground/70">
                            <span>{profile.xp_current} XP</span>
                            <span>{profile.xp_next} XP</span>
                        </div>
                    </div>
                )}
            </div>

            {/* BADGES CARD */}
            <div className="neo-box p-5 relative">
                <h3 className="font-black text-sm mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <Award className="w-4 h-4" />
                    Rozetler
                </h3>

                {userBadges && userBadges.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                        {userBadges.map((badgeObj: any, index: number) => {
                            const badge = badgeObj.badges;
                            return (
                                <div
                                    key={index}
                                    className="aspect-square bg-white dark:bg-zinc-800 border-2 border-black dark:border-white flex items-center justify-center relative group cursor-pointer hover:bg-yellow-100 dark:hover:bg-zinc-700 transition-colors shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#FFF]"
                                    title={badge.name}
                                >
                                    {badge.icon ? (
                                        <div className="text-xl">{badge.icon}</div>
                                    ) : (
                                        <Shield className="w-5 h-5" />
                                    )}
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 4 - userBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-transparent border-2 border-dashed border-black/20 dark:border-white/20 flex items-center justify-center">
                                <span className="text-black/20 dark:text-white/20 text-xs font-black">?</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-black/10 dark:border-white/10">
                        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Henüz rozet yok</p>
                    </div>
                )}
            </div>

            {/* COMMUNITY LINK */}
            <div className="neo-button-secondary w-full justify-between group cursor-pointer bg-yellow-400 dark:bg-yellow-500 text-black border-black shadow-[4px_4px_0_0_#000]">
                <div>
                    <p className="text-[9px] font-bold uppercase opacity-60">Topluluk</p>
                    <h3 className="text-sm font-black">Katkı Kuralları</h3>
                </div>
                <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </div>
        </motion.div>
    );
}

function StatRow({ icon: Icon, label, value }: any) {
    return (
        <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
            <span className="flex items-center gap-2 text-muted-foreground">
                <Icon className="w-4 h-4" />
                {label}
            </span>
            <span className="text-foreground font-black">
                {value}
            </span>
        </div>
    );
}
