"use client";

import { m as motion } from "framer-motion";
import { BookOpen, HelpCircle, MessageCircle, User } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface DarkNeoSidebarProps {
    profile: any;
    user: any;
    stats: any;
    userBadges: any[];
}

export function DarkNeoSidebar({ profile, stats }: DarkNeoSidebarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 lg:sticky lg:top-24"
        >
            {/* ABOUT CARD - Vivid & Soft */}
            <div className="relative overflow-hidden rounded-xl border-2 border-black bg-background p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-zinc-800 dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] sm:p-5 sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                {/* Yellow Accent Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FFC800] transform scale-x-100 transition-transform" />

                <h3 className="relative z-10 mb-3 flex items-center gap-2 border-b-2 border-dashed border-black/20 pb-2 text-[11px] font-black uppercase tracking-tight text-white/55 sm:mb-4 sm:text-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded border-2 border-black bg-[#FFC800] text-black shadow-[2px_2px_0px_0px_#000]">
                        <User className="w-3.5 h-3.5 stroke-[3px]" />
                    </span>
                    Hakkında
                </h3>

                <div className="relative z-10 grid grid-cols-3 gap-2 font-bold sm:block sm:space-y-3">
                    <StatRow icon={BookOpen} label="Yayınlar" value={stats.articlesCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                    <StatRow icon={HelpCircle} label="Sorular" value={stats.questionsCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                    <StatRow icon={MessageCircle} label="Cevaplar" value={stats.answersCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                </div>

                {profile?.level !== undefined && profile?.xp_current !== undefined && (
                    <div className="relative z-10 mt-4 border-t-2 border-black/20 pt-3 sm:mt-5">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Deneyim Seviyesi</p>
                            <p className="text-xl font-black text-white drop-shadow-md">LVL {profile.level}</p>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-lg border-2 border-black bg-black shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-[#FFC800] to-orange-500 striped-pattern"
                                style={{ width: `${(profile.xp_current / (profile.xp_next || 100)) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div >
    );
}

function StatRow({ icon: Icon, label, value, color }: any) {
    return (
        <div className="group/row flex min-h-[66px] flex-col items-center justify-center gap-1 rounded-lg border-2 border-black/40 bg-zinc-950/35 px-2 py-2 text-center text-xs sm:min-h-0 sm:flex-row sm:justify-between sm:border-0 sm:bg-transparent sm:p-0 sm:text-left">
            <span className="flex flex-col items-center gap-1 text-[10px] text-zinc-500 font-bold group-hover/row:text-zinc-300 transition-colors sm:flex-row sm:gap-2 sm:text-xs">
                <Icon className={cn("w-4 h-4 stroke-[2.5px]", color)} />
                <span>{label}</span>
            </span>
            <span className="text-zinc-300 font-black group-hover/row:text-white transition-colors text-base sm:text-sm">
                {formatNumber(value)}
            </span>
        </div>
    );
}
