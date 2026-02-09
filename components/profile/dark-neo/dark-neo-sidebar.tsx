"use client";

import { motion } from "framer-motion";
import { Award, Shield, BookOpen, HelpCircle, MessageCircle, Zap, AlertCircle, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

// True Royal Blue
const ROYAL_BLUE = "#1E3A5F";

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
            {/* ABOUT CARD */}
            <div className="bg-card border border-border/20 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#1E3A5F]" />

                <h3 className="font-black text-sm mb-3 flex items-center gap-2 uppercase tracking-tight text-foreground">
                    <span className="w-6 h-6 bg-[#1E3A5F] text-white rounded flex items-center justify-center">
                        <User className="w-3 h-3" />
                    </span>
                    Hakkında
                </h3>

                <div className="space-y-2 text-xs font-bold">
                    <StatRow icon={BookOpen} label="Makale" value={stats.articlesCount} color="blue" />
                    <StatRow icon={HelpCircle} label="Soru" value={stats.questionsCount} color="cyan" />
                    <StatRow icon={MessageCircle} label="Cevap" value={stats.answersCount} color="yellow" />
                </div>

                {profile?.level && (
                    <div className="mt-4 pt-3 border-t border-border/20">
                        <div className="flex justify-between items-center mb-1.5">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Seviye</p>
                            <p className="text-lg font-black text-[#1E3A5F]">LVL {profile.level}</p>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#1E3A5F]"
                                style={{ width: `${(profile.xp_current / profile.xp_next) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* BADGES CARD */}
            <div className="bg-[#1E3A5F]/10 border border-[#1E3A5F]/30 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Award className="w-24 h-24 rotate-12 text-[#1E3A5F]" />
                </div>

                <h3 className="font-black text-sm mb-3 flex items-center gap-2 uppercase tracking-tight text-foreground relative z-10">
                    <span className="w-6 h-6 bg-[#1E3A5F] text-white rounded flex items-center justify-center">
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
                                    className="aspect-square bg-[#1E3A5F]/30 rounded-lg border border-[#1E3A5F]/50 flex items-center justify-center relative group cursor-pointer hover:bg-[#1E3A5F]/50 transition-colors"
                                    title={badge.name}
                                >
                                    {badge.icon ? (
                                        <div className="text-lg">{badge.icon}</div>
                                    ) : (
                                        <Shield className="w-4 h-4 text-foreground/70" />
                                    )}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        {badge.name}
                                    </div>
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 8 - userBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-[#1E3A5F]/10 rounded-lg border border-[#1E3A5F]/20 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1E3A5F]/30" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 relative z-10">
                        <div className="w-10 h-10 bg-[#1E3A5F]/30 rounded-full flex items-center justify-center mx-auto mb-2 border border-[#1E3A5F]/50">
                            <AlertCircle className="w-5 h-5 text-[#1E3A5F]" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground">Henüz rozet kazanılmadı.</p>
                    </div>
                )}
            </div>

            {/* COMMUNITY LINK */}
            <div className="bg-yellow-500 border border-black/10 rounded-xl p-3 shadow-[2px_2px_0_#1E3A5F] flex items-center justify-between hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#1E3A5F] transition-all cursor-pointer">
                <div>
                    <p className="text-[10px] font-bold uppercase text-black/60">Topluluk</p>
                    <h3 className="text-sm font-black text-black">Katkı Kuralları</h3>
                </div>
                <div className="bg-black/10 p-1.5 rounded-lg">
                    <GraduationCap className="w-4 h-4 text-black" />
                </div>
            </div>
        </motion.div>
    );
}

function StatRow({ icon: Icon, label, value, color }: any) {
    const colorClasses = {
        blue: "text-[#1E3A5F]",
        cyan: "text-cyan-500",
        yellow: "text-yellow-500",
        pink: "text-pink-500"
    };

    return (
        <div className="flex justify-between items-center border-b border-border/20 pb-2">
            <span className="flex items-center gap-2 text-muted-foreground">
                <Icon className={cn("w-4 h-4", colorClasses[color as keyof typeof colorClasses])} />
                {label}
            </span>
            <span className="text-foreground bg-muted px-2 py-0.5 rounded border border-border/20 font-bold">
                {value}
            </span>
        </div>
    );
}
