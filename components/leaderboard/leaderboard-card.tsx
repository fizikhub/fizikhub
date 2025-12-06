"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Trophy, Medal, User, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
    const isTop3 = user.rank <= 3;
    const isCurrentUser = user.id === currentUserId;

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-8 w-8 text-black fill-black drop-shadow-sm" />;
            case 2:
                return <Trophy className="h-7 w-7 text-black fill-black" />;
            case 3:
                return <Trophy className="h-6 w-6 text-white fill-white" />;
            default:
                return <span className="text-xl font-black text-muted-foreground w-8 text-center tabular-nums">#{rank}</span>;
        }
    };

    const getCardStyle = (rank: number) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/20";
            case 2:
                return "bg-gradient-to-r from-gray-400/10 to-transparent border-gray-400/20";
            case 3:
                return "bg-gradient-to-r from-amber-700/10 to-transparent border-amber-700/20";
            default:
                return "hover:bg-muted/50";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: user.rank * 0.05 }}
        >
            <Link href={`/kullanici/${user.username}`}>
                <div className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden",
                    // Base Brutalist properties
                    "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]",
                    // Rank 1
                    user.rank === 1 ? "bg-yellow-400 border-black text-black" :
                        // Rank 2
                        user.rank === 2 ? "bg-slate-300 border-black text-black" :
                            // Rank 3
                            user.rank === 3 ? "bg-amber-700 border-black text-white" :
                                // Others
                                "bg-card border-black dark:border-white hover:bg-accent"
                )}>
                    {/* Rank Indicator */}
                    <div className="flex-shrink-0 w-12 flex justify-center items-center">
                        {getRankIcon(user.rank)}
                    </div>

                    {/* Avatar */}
                    <Avatar className={cn(
                        "h-12 w-12 border-2 border-black",
                        // Adjusting avatar border for consistent look
                        "shadow-sm"
                    )}>
                        <AvatarImage src={user.avatar_url} className="object-cover" />
                        <AvatarFallback className="bg-black text-white font-bold">
                            {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className={cn(
                                "font-bold truncate text-lg",
                                // Text color adjustments based on BG
                                user.rank <= 2 ? "text-black" :
                                    user.rank === 3 ? "text-white" :
                                        "text-foreground"
                            )}>
                                {user.full_name || user.username}
                            </h3>
                            {isTop3 && (
                                <div className={cn(
                                    "text-[10px] font-black px-2 py-0.5 border-2 hidden sm:flex uppercase tracking-wider",
                                    "border-black bg-white text-black"
                                )}>
                                    Top {user.rank}
                                </div>
                            )}
                        </div>
                        <p className={cn(
                            "text-sm font-medium truncate opacity-80",
                            user.rank <= 2 ? "text-black" :
                                user.rank === 3 ? "text-white/80" :
                                    "text-muted-foreground"
                        )}>@{user.username}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-right mr-2">
                        <div className="hidden sm:block">
                            <div className={cn("text-xs font-bold uppercase tracking-wide opacity-70", user.rank <= 2 ? "text-black" : user.rank === 3 ? "text-white" : "text-muted-foreground")}>Rozetler</div>
                            <div className="font-medium flex items-center justify-end gap-1">
                                <div className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 border-2 rounded-full text-xs font-bold",
                                    user.rank <= 2 ? "border-black bg-black/10 text-black" :
                                        user.rank === 3 ? "border-white bg-white/20 text-white" :
                                            "border-border bg-muted text-foreground"
                                )}>
                                    <Star className="h-3 w-3 fill-current" />
                                    {user.badgeCount}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={cn("text-xs font-bold uppercase tracking-wide opacity-70", user.rank <= 2 ? "text-black" : user.rank === 3 ? "text-white" : "text-muted-foreground")}>Puan</div>
                            <div className={cn("text-xl font-black", user.rank <= 2 ? "text-black" : user.rank === 3 ? "text-white" : "text-primary")}>
                                {user.reputation}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
