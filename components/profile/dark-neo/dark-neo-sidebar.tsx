"use client";

import { m as motion } from "framer-motion";
import { Award, Shield, BookOpen, HelpCircle, MessageCircle, Zap, AlertCircle, GraduationCap, User } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { CustomBadgeIcon } from "../custom-badge-icon";
import Link from "next/link";
import { useUiSounds } from "@/hooks/use-ui-sounds";

interface DarkNeoSidebarProps {
    profile: any;
    user: any;
    stats: any;
    userBadges: any[];
}

export function DarkNeoSidebar({ profile, user, stats, userBadges }: DarkNeoSidebarProps) {
    const { playInteractSound } = useUiSounds();

    const handleInteract = () => {
        playInteractSound();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 lg:sticky lg:top-24"
        >
            {/* ABOUT CARD - Vivid & Soft */}
            <div className="bg-background border-[1.5px] sm:border-2 border-black dark:border-zinc-800 p-4 sm:p-5 relative shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] dark:sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden group hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                {/* Yellow Accent Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FFC800] transform scale-x-100 transition-transform" />

                <h3 className="font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-tight text-white/50 border-b-2 border-dashed border-black/20 pb-2 relative z-10">
                    <span className="w-6 h-6 bg-[#FFC800] text-black flex items-center justify-center border-2 border-black rounded shadow-[2px_2px_0px_0px_#000]">
                        <User className="w-3.5 h-3.5 stroke-[3px]" />
                    </span>
                    Hakkında
                </h3>

                <div className="space-y-3 font-bold relative z-10">
                    <StatRow icon={BookOpen} label="Yayınlar" value={stats.articlesCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                    <StatRow icon={HelpCircle} label="Sorular" value={stats.questionsCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                    <StatRow icon={MessageCircle} label="Cevaplar" value={stats.answersCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                </div>

                {profile?.level !== undefined && profile?.xp_current !== undefined && (
                    <div className="mt-5 pt-3 border-t-2 border-black/20 relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Deneyim Seviyesi</p>
                            <p className="text-xl font-black text-white drop-shadow-md">LVL {profile.level}</p>
                        </div>
                        <div className="w-full h-3 bg-black rounded-lg overflow-hidden border-2 border-black shadow-inner">
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
        <div className="flex justify-between items-center text-xs group/row">
            <span className="flex items-center gap-2 text-zinc-500 font-bold group-hover/row:text-zinc-300 transition-colors">
                <Icon className={cn("w-4 h-4 stroke-[2.5px]", color)} />
                {label}
            </span>
            <span className="text-zinc-300 font-black group-hover/row:text-white transition-colors text-sm">
                {formatNumber(value)}
            </span>
        </div>
    );
}
