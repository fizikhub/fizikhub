"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Trophy, Medal, User, Star, Crown, Cat, Sparkles, Heart } from "lucide-react";
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
    const isSilginim = user.username === 'silginim' && user.rank === 1;

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className={cn("h-8 w-8 drop-shadow-sm", isSilginim ? "text-pink-600 fill-pink-600" : "text-black fill-black")} />;
            case 2:
                return <Trophy className="h-7 w-7 text-black fill-black" />;
            case 3:
                return <Trophy className="h-6 w-6 text-white fill-white" />;
            default:
                return <span className="text-xl font-black text-muted-foreground w-8 text-center tabular-nums">#{rank}</span>;
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
                    // Silginim Special Styling
                    isSilginim ? "bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 border-pink-500 text-pink-950 shadow-[0_0_15px_rgba(236,72,153,0.6)] animate-gradient-xy" :
                        // Rank 1
                        user.rank === 1 ? "bg-yellow-400 border-black text-black" :
                            // Rank 2
                            user.rank === 2 ? "bg-slate-300 border-black text-black" :
                                // Rank 3
                                user.rank === 3 ? "bg-amber-700 border-black text-white" :
                                    // Others
                                    "bg-card border-black dark:border-white hover:bg-accent"
                )}>
                    {/* Silginim Special Decorations */}
                    {isSilginim && (
                        <>
                            {/* Animated Background Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer" />

                            {/* Decorative Stars & Hearts & Sparkles */}
                            <Sparkles className="absolute top-2 right-12 h-6 w-6 text-yellow-400 fill-yellow-200 animate-spin-slow" />
                            <Heart className="absolute bottom-4 left-1/4 h-4 w-4 text-pink-500 fill-pink-500 animate-bounce delay-100" />
                            <Star className="absolute bottom-8 left-10 h-3 w-3 text-pink-400 fill-pink-100 animate-pulse delay-700" />
                            <Sparkles className="absolute top-10 left-4 h-5 w-5 text-white/80 animate-pulse" />

                            {/* Floating Cats */}
                            <div className="absolute -right-2 -bottom-2 opacity-80 animate-bounce-slow">
                                <Cat className="h-10 w-10 text-pink-700" />
                            </div>
                            <div className="absolute top-1/2 right-4 opacity-20 -rotate-12">
                                <Cat className="h-16 w-16 text-pink-900" />
                            </div>

                            <div className="absolute -top-1 -right-1 text-pink-500/30 rotate-12 transform">
                                <Crown className="h-24 w-24 fill-current" />
                            </div>
                        </>
                    )}

                    {/* Rank Indicator */}
                    <div className="flex-shrink-0 w-12 flex justify-center items-center z-10 relative">
                        {isSilginim && (
                            <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 h-8 w-8 text-yellow-500 fill-yellow-300 animate-bounce drop-shadow-md" />
                        )}
                        {getRankIcon(user.rank)}
                    </div>

                    {/* Avatar */}
                    <div className="relative z-10">
                        <Avatar className={cn(
                            "h-12 w-12 border-2 transition-transform hover:scale-110 duration-300",
                            isSilginim ? "border-pink-600 ring-2 ring-pink-400 ring-offset-2 ring-offset-pink-200" : "border-black shadow-sm"
                        )}>
                            <AvatarImage src={user.avatar_url} className="object-cover" />
                            <AvatarFallback className={cn("font-bold", isSilginim ? "bg-pink-100 text-pink-700" : "bg-black text-white")}>
                                {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {isSilginim && (
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border-2 border-pink-400 shadow-lg transform rotate-6">
                                <Cat className="h-5 w-5 text-pink-600" />
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0 z-10">
                        <div className="flex items-center gap-2">
                            <h3 className={cn(
                                "font-bold truncate text-lg flex items-center gap-1",
                                // Text color adjustments based on BG
                                isSilginim ? "text-pink-950 drop-shadow-sm font-black tracking-tight" :
                                    user.rank <= 2 ? "text-black" :
                                        user.rank === 3 ? "text-white" :
                                            "text-foreground"
                            )}>
                                {user.full_name || user.username}
                                {isSilginim && (
                                    <div className="flex">
                                        <Heart className="h-4 w-4 text-pink-600 fill-pink-600 animate-pulse ml-1" />
                                        <Heart className="h-3 w-3 text-pink-400 fill-pink-400 animate-pulse delay-75 ml-0.5" />
                                    </div>
                                )}
                            </h3>
                            {isTop3 && (
                                <div className={cn(
                                    "text-[10px] font-black px-2 py-0.5 border-2 hidden sm:flex uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]",
                                    isSilginim ? "border-pink-500 bg-white text-pink-700 rotate-2" : "border-black bg-white text-black"
                                )}>
                                    Top {user.rank}
                                </div>
                            )}
                        </div>
                        <p className={cn(
                            "text-sm font-medium truncate opacity-80",
                            isSilginim ? "text-pink-900 font-bold" :
                                user.rank <= 2 ? "text-black" :
                                    user.rank === 3 ? "text-white/80" :
                                        "text-muted-foreground"
                        )}>@{user.username}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-right mr-2 z-10">
                        <div className="hidden sm:block">
                            <div className={cn("text-xs font-bold uppercase tracking-wide opacity-70",
                                isSilginim ? "text-pink-900" :
                                    user.rank <= 2 ? "text-black" : user.rank === 3 ? "text-white" : "text-muted-foreground"
                            )}>Rozetler</div>
                            <div className="font-medium flex items-center justify-end gap-1">
                                <div className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 border-2 rounded-full text-xs font-bold",
                                    isSilginim ? "border-pink-600 bg-white/60 text-pink-900 shadow-sm" :
                                        user.rank <= 2 ? "border-black bg-black/10 text-black" :
                                            user.rank === 3 ? "border-white bg-white/20 text-white" :
                                                "border-border bg-muted text-foreground"
                                )}>
                                    <Star className={cn("h-3 w-3 fill-current", isSilginim ? "text-pink-600" : "")} />
                                    {user.badgeCount}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={cn("text-xs font-bold uppercase tracking-wide opacity-70",
                                isSilginim ? "text-pink-900" :
                                    user.rank <= 2 ? "text-black" : user.rank === 3 ? "text-white" : "text-muted-foreground"
                            )}>Puan</div>
                            <div className={cn("text-xl font-black",
                                isSilginim ? "text-pink-950 drop-shadow-sm" :
                                    user.rank <= 2 ? "text-black" : user.rank === 3 ? "text-white" : "text-primary"
                            )}>
                                {user.reputation}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
