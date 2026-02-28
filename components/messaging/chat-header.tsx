"use client";

import Link from "next/link";
import { ArrowLeft, Search, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface ChatHeaderProps {
    otherUser: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string;
    } | null;
    onSearch?: () => void;
}

export function ChatHeader({ otherUser, onSearch }: ChatHeaderProps) {
    const displayName = otherUser?.full_name || otherUser?.username || "Kullanıcı";
    const initials = displayName.substring(0, 2).toUpperCase();

    return (
        <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
                {/* Back Button */}
                <Link href="/mesajlar" className="md:hidden">
                    <button className="h-9 w-9 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-xl hover:bg-zinc-800 active:scale-95 transition-all text-zinc-300">
                        <ArrowLeft className="h-4.5 w-4.5 stroke-[2.5px]" />
                    </button>
                </Link>

                {/* Desktop back */}
                <Link href="/mesajlar" className="hidden md:block">
                    <button className="h-9 w-9 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-xl hover:bg-zinc-800 hover:border-[#FACC15]/30 active:scale-95 transition-all text-zinc-300 hover:text-[#FACC15]">
                        <ArrowLeft className="h-4.5 w-4.5 stroke-[2.5px]" />
                    </button>
                </Link>

                {/* Avatar */}
                <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-zinc-800 rounded-full">
                        <AvatarImage src={otherUser?.avatar_url || ""} className="object-cover" />
                        <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-xs">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    {/* Online dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
                </div>

                {/* User info */}
                <div className="min-w-0">
                    <h2 className="font-bold text-white text-[15px] leading-tight truncate max-w-[180px] sm:max-w-none font-[family-name:var(--font-outfit)]">
                        {displayName}
                    </h2>
                    <p className="text-[11px] text-emerald-400/80 font-medium">Çevrimiçi</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
                {onSearch && (
                    <button
                        onClick={onSearch}
                        className="h-9 w-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                    >
                        <Search className="h-4.5 w-4.5" />
                    </button>
                )}
            </div>
        </div>
    );
}
