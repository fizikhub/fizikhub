"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Trophy, Star, Crown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { ShyModeModal } from "./shy-mode-modal";

interface LeaderboardUser {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    reputation: number;
    rank: number;
    badgeCount: number;
}

interface LeaderboardCardProps {
    user: LeaderboardUser;
    currentUserId?: string;
}

export function LeaderboardCard({ user, currentUserId }: LeaderboardCardProps) {
    const [showShyModal, setShowShyModal] = useState(false);
    const isTop3 = user.rank <= 3;
    const isCurrentUser = user.id === currentUserId;
    const isSilginim = user.username === 'silginim' && user.rank === 1;

    // Deterministic vivid colors based on rank/index for hover
    const hoverColors = [
        "hover:shadow-[#FACC15] hover:border-[#FACC15]", // Yellow
        "hover:shadow-[#4169E1] hover:border-[#4169E1]", // Blue
        "hover:shadow-[#16A34A] hover:border-[#16A34A]", // Green
        "hover:shadow-[#FF0080] hover:border-[#FF0080]", // Pink
    ];
    // Rotate through colors based on rank
    const hoverColorClass = hoverColors[(user.rank - 1) % hoverColors.length];

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className={cn("h-7 w-7 sm:h-8 sm:w-8 drop-shadow-sm transition-transform group-hover:scale-110", isSilginim ? "text-pink-600 fill-pink-600" : "text-black fill-black")} />;
            case 2:
                return <Trophy className="h-6 w-6 sm:h-7 sm:w-7 text-black fill-black transition-transform group-hover:scale-110" />;
            case 3:
                return <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-white transition-transform group-hover:scale-110" />;
            default:
                return <span className="text-lg sm:text-xl font-black text-zinc-500 w-8 text-center tabular-nums">#{rank}</span>;
        }
    };

    const handleRankClick = (e: React.MouseEvent) => {
        if (isSilginim) {
            e.preventDefault();
            e.stopPropagation();
            setShowShyModal(true);
        }
    };

    return (
        <>
            <ShyModeModal isOpen={showShyModal} onClose={() => setShowShyModal(false)} />
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: user.rank * 0.05, type: "spring", stiffness: 100 }}
            >
                <Link href={`/kullanici/${user.username}`}>
                    <div className={cn(
                        "flex items-center gap-3 sm:gap-4 p-4 rounded-xl border-[3px] transition-all duration-300 group relative overflow-hidden",
                        // Base Shadow (Hard Black)
                        "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                        // Active State (Press)
                        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                        // Hover State (Vivid Color Shift)
                        hoverColorClass,
                        "hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",

                        // Backgrounds & Text Colors
                        isSilginim ? "bg-gradient-to-r from-pink-200 via-pink-300 to-rose-200 text-pink-950" :
                            user.rank === 1 ? "bg-[#FFC800] text-black" :
                                user.rank === 2 ? "bg-zinc-200 text-black" :
                                    user.rank === 3 ? "bg-orange-400 text-black" :
                                        "bg-white dark:bg-[#27272a] text-black dark:text-zinc-100" // Lighter dark background
                    )}>
                        {/* NOISE TEXTURE (re-added for texture) */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                        />

                        {/* Rank Indicator */}
                        <div
                            className={cn(
                                "flex-shrink-0 w-8 sm:w-12 flex justify-center items-center z-10 relative cursor-pointer",
                                isSilginim && "hover:scale-110 transition-transform"
                            )}
                            onDoubleClick={handleRankClick}
                        >
                            {isSilginim && (
                                <Crown className="absolute -top-4 left-1/2 -translate-x-1/2 h-6 w-6 text-pink-600 fill-pink-400 animate-bounce" />
                            )}
                            {getRankIcon(user.rank)}
                        </div>

                        {/* Avatar */}
                        <div className="relative z-10">
                            <Avatar className={cn(
                                "h-10 w-10 sm:h-12 sm:w-12 border-[2px]",
                                isSilginim ? "border-pink-600 ring-2 ring-pink-300 ring-offset-1" : "border-black shadow-[2px_2px_0px_0px_#000]"
                            )}>
                                <AvatarImage src={user.avatar_url} className="object-cover" />
                                <AvatarFallback className={cn("font-black", isSilginim ? "bg-pink-100 text-pink-700" : "bg-white text-black")}>
                                    {user.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0 z-10">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
                                <h3 className={cn(
                                    "font-black truncate text-base sm:text-lg flex items-center gap-1 uppercase tracking-tight leading-none group-hover:underline decoration-2 underline-offset-2",
                                    isSilginim ? "text-pink-950" :
                                        user.rank <= 3 ? "text-black" :
                                            "text-black dark:text-zinc-100"
                                )}>
                                    {user.full_name || user.username}
                                    {isSilginim && <Crown className="h-4 w-4 text-pink-600 fill-pink-300 inline-block ml-1" />}
                                </h3>

                                {isTop3 && (
                                    <div className={cn(
                                        "text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 border-[1.5px] w-fit sm:w-auto uppercase tracking-wider shadow-sm transform rotate-[-2deg] mt-1 sm:mt-0",
                                        isSilginim ? "border-pink-500 bg-white/80 text-pink-700" : "border-black bg-white text-black"
                                    )}>
                                        Top {user.rank}
                                    </div>
                                )}
                            </div>
                            <p className={cn(
                                "text-xs sm:text-sm font-bold truncate opacity-80 mt-0.5",
                                isSilginim ? "text-pink-900" :
                                    user.rank <= 3 ? "text-black/70" :
                                        "text-zinc-500 dark:text-zinc-400"
                            )}>@{user.username}</p>
                        </div>

                        {/* Stats - Compact on Mobile */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-6 text-right z-10">
                            {/* Badges - Hidden on very small screens if needed, but kept for now */}
                            <div className="hidden sm:block">
                                <div className={cn("text-[10px] font-black uppercase tracking-wide opacity-60 mb-0.5",
                                    isSilginim ? "text-pink-900" : user.rank <= 3 ? "text-black" : "text-zinc-500"
                                )}>Rozetler</div>
                                <div className={cn(
                                    "flex items-center justify-center gap-1 px-2 py-0.5 border-2 rounded-full text-[10px] font-bold shadow-[1px_1px_0px_0px_#000]",
                                    isSilginim ? "border-pink-500 bg-white text-pink-900" : "border-black bg-white text-black"
                                )}>
                                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                                    {user.badgeCount}
                                </div>
                            </div>

                            <div>
                                <div className={cn("text-[10px] font-black uppercase tracking-wide opacity-60 mb-0.5 sm:block hidden",
                                    isSilginim ? "text-pink-900" : user.rank <= 3 ? "text-black" : "text-zinc-500"
                                )}>Puan</div>
                                <div className={cn("text-lg sm:text-2xl font-black bg-white border-2 border-black px-2 py-1 sm:shadow-[2px_2px_0px_0px_#000] rotate-[2deg] group-hover:rotate-0 transition-transform",
                                    isSilginim ? "text-pink-600 border-pink-500 shadow-pink-900" : "text-black"
                                )}>
                                    {user.reputation}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </>
    );
}
