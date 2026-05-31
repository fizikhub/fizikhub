"use client";

import { Star } from "lucide-react";
import { OptimizedAvatar } from "@/components/ui/optimized-image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface SuggestedUser {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    is_writer: boolean;
    is_verified: boolean;
    bio: string;
}

interface SuggestedUsersCardProps {
    users: SuggestedUser[];
}

export function SuggestedUsersCard({ users }: SuggestedUsersCardProps) {
    const [following, setFollowing] = useState<string[]>([]);

    const handleFollow = (id: string) => {
        if (following.includes(id)) {
            setFollowing(following.filter(f => f !== id));
            toast.info("Takip bırakıldı.");
        } else {
            setFollowing([...following, id]);
            toast.success("Takip edildi!");
        }
    };

    if (!users || users.length === 0) return null;

    return (
        <div className="my-0">
            <div className="flex items-center gap-2 mb-4 px-1">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-black text-base sm:text-lg text-foreground tracking-normal uppercase">Takip Önerileri</h3>
            </div>

            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 px-1 scrollbar-hide snap-x snap-mandatory">
                {users.map((user, i) => (
                    <div
                        key={user.id}
                        className="flex-shrink-0 w-[168px] sm:w-48 snap-start animate-in fade-in duration-500 fill-mode-both"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="flex flex-col items-center p-4 sm:p-5 bg-card border-2 border-black/10 dark:border-white/10 rounded-[8px] text-center hover:border-amber-500/40 hover:shadow-[2px_2px_0px_0px_#000] transition-all duration-300 group">
                            <div className="relative mb-3">
                                <OptimizedAvatar
                                    src={user.avatar_url}
                                    alt={user.username || "User"}
                                    size={64}
                                    className="ring-2 ring-transparent group-hover:ring-amber-500/20 transition-all font-bold text-lg"
                                />
                                {user.is_verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-card">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <Link prefetch={false} href={`/kullanici/${user.username}`} className="font-black text-sm text-foreground hover:text-primary truncate w-full mb-0.5 rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]">
                                {user.full_name || user.username}
                            </Link>
                            <div className="text-xs text-muted-foreground mb-4 truncate w-full">
                                {user.is_writer ? "Bilim Yazarı" : `@${user.username}`}
                            </div>

                            <Button
                                size="sm"
                                variant={following.includes(user.id) ? "secondary" : "default"}
                                className={`w-full rounded-[8px] min-h-11 text-xs font-black ${following.includes(user.id) ? "" : "bg-foreground text-background hover:bg-foreground/90"}`}
                                onClick={() => handleFollow(user.id)}
                            >
                                {following.includes(user.id) ? "Takip Ediliyor" : "Takip Et"}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
