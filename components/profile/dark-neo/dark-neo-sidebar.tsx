"use client";

import { motion } from "framer-motion";
import { Award, Shield, BookOpen, HelpCircle, MessageCircle, AlertCircle, GraduationCap, User, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// True Royal Blue
const ROYAL_BLUE = "#1E3A5F";

interface DarkNeoSidebarProps {
    profile: any;
    user: any;
    stats: any;
    userBadges: any[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
};

export function DarkNeoSidebar({ profile, user, stats, userBadges }: DarkNeoSidebarProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sticky top-24"
        >
            {/* ABOUT CARD */}
            <motion.div
                variants={itemVariants}
                className="bg-card border border-border/30 rounded-xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1E3A5F] to-[#2C5282]" />

                <h3 className="font-black text-sm mb-4 flex items-center gap-2.5 uppercase tracking-wide text-foreground">
                    <span className="w-7 h-7 bg-[#1E3A5F] text-white rounded-lg flex items-center justify-center shadow-sm">
                        <User className="w-3.5 h-3.5" />
                    </span>
                    Hakkında
                </h3>

                <div className="space-y-3">
                    <StatRow icon={BookOpen} label="Makale" value={stats.articlesCount} color="blue" />
                    <StatRow icon={HelpCircle} label="Soru" value={stats.questionsCount} color="cyan" />
                    <StatRow icon={MessageCircle} label="Cevap" value={stats.answersCount} color="yellow" />
                </div>

                {profile?.level && (
                    <div className="mt-5 pt-4 border-t border-border/30">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5 text-[#1E3A5F]" />
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Seviye</p>
                            </div>
                            <p className="text-xl font-black text-[#1E3A5F]">LVL {profile.level}</p>
                        </div>
                        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(profile.xp_current / profile.xp_next) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] rounded-full"
                            />
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-1.5 text-right">
                            {profile.xp_current} / {profile.xp_next} XP
                        </p>
                    </div>
                )}
            </motion.div>

            {/* BADGES CARD */}
            <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-[#1E3A5F]/15 to-[#1E3A5F]/5 border border-[#1E3A5F]/30 rounded-xl p-5 relative overflow-hidden"
            >
                <div className="absolute -right-6 -bottom-6 opacity-[0.07]">
                    <Award className="w-28 h-28 rotate-12 text-[#1E3A5F]" />
                </div>

                <h3 className="font-black text-sm mb-4 flex items-center gap-2.5 uppercase tracking-wide text-foreground relative z-10">
                    <span className="w-7 h-7 bg-[#1E3A5F] text-white rounded-lg flex items-center justify-center shadow-sm">
                        <Award className="w-3.5 h-3.5" />
                    </span>
                    Rozetler
                </h3>

                {userBadges && userBadges.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 relative z-10">
                        {userBadges.map((badgeObj: any, index: number) => {
                            const badge = badgeObj.badges;
                            return (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="aspect-square bg-[#1E3A5F]/30 rounded-xl border border-[#1E3A5F]/50 flex items-center justify-center relative group cursor-pointer hover:bg-[#1E3A5F]/50 transition-colors shadow-sm"
                                    title={badge.name}
                                >
                                    {badge.icon ? (
                                        <div className="text-xl">{badge.icon}</div>
                                    ) : (
                                        <Shield className="w-5 h-5 text-foreground/70" />
                                    )}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold px-3 py-1.5 rounded-lg border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        {badge.name}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
                                    </div>
                                </motion.div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 8 - userBadges.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-[#1E3A5F]/10 rounded-xl border border-dashed border-[#1E3A5F]/20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[#1E3A5F]/20" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 relative z-10">
                        <div className="w-12 h-12 bg-[#1E3A5F]/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-[#1E3A5F]/30">
                            <AlertCircle className="w-6 h-6 text-[#1E3A5F]" />
                        </div>
                        <p className="text-xs font-bold text-muted-foreground">Henüz rozet kazanılmadı.</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">İçerik paylaşarak rozet kazanabilirsin!</p>
                    </div>
                )}
            </motion.div>

            {/* COMMUNITY LINK */}
            <motion.div variants={itemVariants}>
                <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-yellow-500 border-2 border-black/20 rounded-xl p-4 shadow-[3px_3px_0_#1E3A5F] flex items-center justify-between cursor-pointer hover:shadow-[1px_1px_0_#1E3A5F] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    <div>
                        <p className="text-[9px] font-bold uppercase text-black/50 tracking-wide">Topluluk</p>
                        <h3 className="text-sm font-black text-black">Katkı Kuralları</h3>
                    </div>
                    <div className="bg-black/10 p-2 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-black" />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

function StatRow({ icon: Icon, label, value, color }: any) {
    const colorClasses = {
        blue: "text-[#1E3A5F] bg-[#1E3A5F]/10",
        cyan: "text-cyan-500 bg-cyan-500/10",
        yellow: "text-yellow-500 bg-yellow-500/10",
        pink: "text-pink-500 bg-pink-500/10"
    };

    const iconBg = colorClasses[color as keyof typeof colorClasses]?.split(' ')[1] || "bg-muted";
    const iconColor = colorClasses[color as keyof typeof colorClasses]?.split(' ')[0] || "text-muted-foreground";

    return (
        <div className="flex justify-between items-center">
            <span className="flex items-center gap-2.5 text-muted-foreground text-xs font-medium">
                <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center", iconBg)}>
                    <Icon className={cn("w-3.5 h-3.5", iconColor)} />
                </span>
                {label}
            </span>
            <span className="text-foreground bg-muted px-3 py-1 rounded-lg text-xs font-black tabular-nums">
                {value}
            </span>
        </div>
    );
}
