"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, Send } from "lucide-react";
import Link from "next/link";

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
    const firstName = displayName.split(" ")[0];

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />

                <div className="relative bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-2 transition-all duration-300 hover:bg-card/60 hover:border-white/10 hover:shadow-lg">
                    <div className="flex items-center gap-3 p-2">
                        <Avatar className="w-10 h-10 border border-white/10 shadow-sm shrink-0">
                            <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs font-medium">
                                {displayName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <Link href="/makale/yeni" className="flex-1 block">
                            <div className="w-full bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors rounded-xl px-4 py-2.5 cursor-text group/input flex items-center justify-between border border-transparent hover:border-white/5">
                                <span className="text-muted-foreground/60 text-sm font-medium truncate">
                                    Bugün aklında ne var, {firstName}?
                                </span>
                                <Send className="w-4 h-4 text-emerald-500 opacity-0 -translate-x-2 group-hover/input:opacity-100 group-hover/input:translate-x-0 transition-all duration-300" />
                            </div>
                        </Link>
                    </div>

                    {/* Integrated Actions Bar */}
                    <div className="flex items-center justify-between px-2 pt-1 pb-1 mt-1 border-t border-white/5">
                        <Link href="/makale/yeni" className="flex-1">
                            <div className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 transition-all group/btn cursor-pointer">
                                <PenTool className="w-3.5 h-3.5 text-muted-foreground/40 group-hover/btn:text-rose-400 transition-colors" />
                                <span className="text-xs font-medium text-muted-foreground/50 group-hover/btn:text-foreground transition-colors">Makale Yaz</span>
                            </div>
                        </Link>

                        <div className="w-px h-3 bg-white/5 mx-1" />

                        <Link href="/makale/yeni" className="flex-1">
                            <div className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 transition-all group/btn cursor-pointer">
                                <Plus className="w-4 h-4 text-muted-foreground/40 group-hover/btn:text-blue-400 transition-colors" />
                                <span className="text-xs font-medium text-muted-foreground/50 group-hover/btn:text-foreground transition-colors">İçerik Ekle</span>
                            </div>
                        </Link>

                        <div className="w-px h-3 bg-white/5 mx-1" />

                        <Link href="/forum" className="flex-1">
                            <div className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 transition-all group/btn cursor-pointer">
                                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/40 group-hover/btn:text-emerald-400 transition-colors" />
                                <span className="text-xs font-medium text-muted-foreground/50 group-hover/btn:text-foreground transition-colors">Soru Sor</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
