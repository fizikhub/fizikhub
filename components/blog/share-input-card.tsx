"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ShareInputCardProps {
    user?: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

export function ShareInputCard({ user }: ShareInputCardProps) {
    const avatarUrl = user?.avatar_url || "https://github.com/shadcn.png";
    const displayName = user?.full_name || user?.username || "Misafir";

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl border border-white/5 p-4 shadow-xl">
                {/* Top Section: Avatar & Input Trigger */}
                <div className="flex gap-4 mb-6">
                    <Avatar className="w-10 h-10 ring-2 ring-emerald-500/20">
                        <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                        <AvatarFallback className="bg-emerald-950 text-emerald-500">
                            {displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <Link href="/makale/yeni" className="flex-1">
                        <div className="w-full bg-[#111111] hover:bg-[#151515] transition-colors rounded-xl p-3 px-4 border border-white/5 cursor-text text-muted-foreground/60 text-sm flex items-center h-10">
                            Bugün ne paylaşmak istersin?
                        </div>
                    </Link>
                </div>

                {/* Bottom Section: Action Buttons */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3 px-2">
                    <Link href="/makale/yeni" className="flex-1">
                        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                            <PenTool className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-rose-400 transition-colors">Yaz</span>
                        </div>
                    </Link>
                    
                    <div className="w-px h-6 bg-white/5 mx-2" />

                    <Link href="/makale/yeni" className="flex-1">
                         <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                            <Plus className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-blue-400 transition-colors">Ekle</span>
                        </div>
                    </Link>

                    <div className="w-px h-6 bg-white/5 mx-2" />

                    <Link href="/forum" className="flex-1">
                         <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                            <HelpCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-emerald-400 transition-colors">Soru Sor</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
