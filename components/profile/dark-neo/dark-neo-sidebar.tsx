"use client";

import { m as motion } from "framer-motion";
import { BookOpen, HelpCircle, MessageCircle, User, Award, Gauge, Sparkles } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface DarkNeoSidebarProps {
    profile: any;
    user: any;
    stats: any;
    userBadges: any[];
}

export function DarkNeoSidebar({ profile, stats }: DarkNeoSidebarProps) {
    const progressValue = profile?.xp_current !== undefined
        ? Math.min(100, Math.round((profile.xp_current / (profile.xp_next || 100)) * 100))
        : Math.min(100, Math.max(8, Math.round((stats.reputation || 0) / 20)));

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 lg:sticky lg:top-24"
        >
            <div className="relative overflow-hidden rounded-[18px] border-[3px] border-black bg-[#27272a] p-4 text-white shadow-[5px_5px_0px_0px_#000] sm:rounded-[22px] sm:p-5">
                {/* Yellow Accent Bar */}
                <div className="absolute left-0 top-0 h-2 w-full bg-[#FFC800]" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#23A9FA]/20 blur-2xl" />

                <h3 className="relative z-10 mb-4 flex items-center gap-2 border-b-2 border-dashed border-white/10 pb-3 text-xs font-black uppercase tracking-wider text-zinc-300">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[9px] border-2 border-black bg-[#FFC800] text-black shadow-[2px_2px_0px_0px_#000]">
                        <User className="w-4 h-4 stroke-[3px]" />
                    </span>
                    Hakkında
                </h3>

                <div className="relative z-10 mb-4 rounded-[14px] border-2 border-black bg-zinc-950 p-4 shadow-[3px_3px_0px_0px_#000]">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">Profil Enerjisi</p>
                            <p className="mt-1 text-sm font-bold text-zinc-200">
                                {profile?.is_writer ? "Yazar modu aktif" : "Topluluk kaşifi"}
                            </p>
                        </div>
                        <Award className="h-9 w-9 shrink-0 text-[#FFC800]" />
                    </div>
                    <div className="h-3 overflow-hidden rounded-full border-2 border-black bg-black">
                        <div
                            className="h-full bg-gradient-to-r from-[#FFC800] via-[#23A9FA] to-[#33EAA1]"
                            style={{ width: `${progressValue}%` }}
                        />
                    </div>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-2 font-bold">
                    <StatRow icon={BookOpen} label="Yayınlar" value={stats.articlesCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                    <StatRow icon={HelpCircle} label="Sorular" value={stats.questionsCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                    <StatRow icon={MessageCircle} label="Cevaplar" value={stats.answersCount} color="text-zinc-400 group-hover:text-white transition-colors" />
                </div>

                <div className="relative z-10 mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                    <MiniInfo icon={Gauge} label="Seviye" value={profile?.level !== undefined ? `LVL ${profile.level}` : "Aktif"} />
                    <MiniInfo icon={Sparkles} label="Katkı" value={stats.reputation > 0 ? `${formatNumber(stats.reputation)} puan` : "Yeni başlıyor"} />
                </div>
            </div>
        </motion.div >
    );
}

function StatRow({ icon: Icon, label, value, color }: any) {
    return (
        <div className="group/row flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-black bg-zinc-950/70 px-2 py-3 text-center text-xs shadow-[2px_2px_0px_0px_#000] transition-transform hover:-translate-y-0.5">
            <span className="flex flex-col items-center gap-1 text-[10px] text-zinc-500 font-bold group-hover/row:text-zinc-300 transition-colors">
                <Icon className={cn("w-4 h-4 stroke-[2.5px]", color)} />
                <span>{label}</span>
            </span>
            <span className="text-xl font-black text-white transition-colors group-hover/row:text-[#FFC800]">
                {formatNumber(value)}
            </span>
        </div>
    );
}

function MiniInfo({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-[14px] border-2 border-black bg-[#1f1f22] px-4 py-3 shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-white text-black">
                    <Icon className="h-4 w-4 stroke-[3px]" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">{label}</span>
            </div>
            <span className="text-sm font-black text-zinc-100">{value}</span>
        </div>
    );
}
