"use client";

import { Star } from "lucide-react";
import { OptimizedAvatar } from "@/components/ui/optimized-image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface SuggestedUser {
    id: string;
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    is_writer?: boolean | null;
    is_verified?: boolean | null;
    bio?: string | null;
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
        <section className="rounded-[8px] border-2 border-black bg-[#222226] p-4 shadow-[3px_3px_0_0_#000] sm:p-5">
            <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-black text-lg text-zinc-50">Takip Önerileri</h3>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x scroll-px-1">
                {users.map((user, i) => (
                    <div
                        key={user.id}
                        className="flex-shrink-0 w-44 sm:w-48 snap-start animate-in fade-in duration-500 fill-mode-both"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="flex flex-col items-center p-4 bg-[#18181b] border-2 border-black rounded-[8px] text-center hover:border-amber-500 hover:shadow-[2px_2px_0_0_#000] transition-all duration-200 group">
                            <div className="relative mb-3">
                                <OptimizedAvatar
                                    src={user.avatar_url}
                                    alt={user.username || "User"}
                                    size={64}
                                    className="ring-2 ring-transparent group-hover:ring-amber-500/20 transition-all font-bold text-lg"
                                />
                                {user.is_verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-[#18181b]">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <Link prefetch={false} href={`/kullanici/${user.username || user.id}`} className="font-black text-zinc-50 hover:text-[#EAB308] truncate w-full mb-0.5">
                                {user.full_name || user.username || "Fizikhub üyesi"}
                            </Link>
                            <div className="text-xs text-zinc-500 mb-4 truncate w-full">
                                {user.is_writer ? "Bilim Yazarı" : `@${user.username}`}
                            </div>

                            <Button
                                size="sm"
                                variant={following.includes(user.id) ? "secondary" : "default"}
                                className={`w-full rounded-[8px] h-9 text-xs font-black border-2 border-black shadow-[2px_2px_0_0_#000] ${following.includes(user.id) ? "bg-zinc-700 text-white hover:bg-zinc-600" : "bg-[#EAB308] text-black hover:bg-white"}`}
                                onClick={() => handleFollow(user.id)}
                            >
                                {following.includes(user.id) ? "Takip Ediliyor" : "Takip Et"}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
