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
                return <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500 animate-pulse" />;
            case 2:
                return <Trophy className="h-6 w-6 text-gray-400 fill-gray-400" />;
            case 3:
                return <Trophy className="h-6 w-6 text-amber-700 fill-amber-700" />;
            default:
                return <span className="text-lg font-bold text-muted-foreground w-6 text-center">{rank}</span>;
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
                    "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                    getCardStyle(user.rank),
                    isCurrentUser && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}>
                    {/* Rank Indicator */}
                    <div className="flex-shrink-0 w-12 flex justify-center items-center">
                        {getRankIcon(user.rank)}
                    </div>

                    {/* Avatar */}
                    <Avatar className={cn(
                        "h-12 w-12 border-2",
                        user.rank === 1 ? "border-yellow-500" :
                            user.rank === 2 ? "border-gray-400" :
                                user.rank === 3 ? "border-amber-700" : "border-transparent"
                    )}>
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className={cn(
                                "font-semibold truncate",
                                isCurrentUser && "text-primary"
                            )}>
                                {user.full_name || user.username}
                            </h3>
                            {isTop3 && (
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 hidden sm:flex">
                                    Top {user.rank}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-right">
                        <div className="hidden sm:block">
                            <div className="text-xs text-muted-foreground">Rozetler</div>
                            <div className="font-medium flex items-center justify-end gap-1">
                                <Badge variant="outline" className="h-5 gap-1">
                                    <Star className="h-3 w-3" />
                                    {user.badgeCount}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Puan</div>
                            <div className="text-lg font-bold text-primary">{user.reputation}</div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
