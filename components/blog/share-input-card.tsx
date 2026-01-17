"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, Send } from "lucide-react";
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
    const firstName = displayName.split(" ")[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300",
                "bg-card border border-border",
                "shadow-sm hover:shadow-md hover:border-border/80",
                "w-full max-w-2xl mx-auto mb-8"
            )}
        >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/20">
                <span className="text-xs font-bold tracking-wide text-emerald-600 dark:text-emerald-500">
                    YENİ PAYLAŞIM
                </span>
                <span className="text-xs text-muted-foreground/60">Aklına ne geldi?</span>
            </div>

            {/* Content Body */}
            <div className="p-5 flex items-center gap-4">
                <Avatar className="w-10 h-10 border border-border shrink-0">
                    <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground font-medium">
                        {displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <Link href="/makale/yeni" className="flex-1 block group/input">
                    <div className="w-full bg-muted/50 hover:bg-muted transition-colors rounded-xl px-4 py-3 cursor-text flex items-center justify-between border border-transparent hover:border-border/50">
                        <span className="text-muted-foreground/70 text-sm font-medium truncate">
                            Bugün ne paylaşmak istersin, {firstName}?
                        </span>
                        <Send className="w-4 h-4 text-emerald-500 opacity-0 -translate-x-2 group-hover/input:opacity-100 group-hover/input:translate-x-0 transition-all duration-300" />
                    </div>
                </Link>
            </div>

            {/* Action Bar */}
            <div className="px-5 py-3 border-t border-border/50 flex items-center justify-around bg-muted/5">
                <Link href="/makale/yeni" className="flex items-center gap-2 text-muted-foreground hover:text-rose-500 transition-colors group/btn py-2 px-3 rounded-lg hover:bg-muted/50">
                    <PenTool className="w-4 h-4" />
                    <span className="text-xs font-semibold hidden sm:inline">Makale Yaz</span>
                </Link>

                <div className="w-px h-5 bg-border/50" />

                <Link href="/makale/yeni" className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors group/btn py-2 px-3 rounded-lg hover:bg-muted/50">
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-semibold hidden sm:inline">İçerik Ekle</span>
                </Link>

                <div className="w-px h-5 bg-border/50" />

                <Link href="/forum" className="flex items-center gap-2 text-muted-foreground hover:text-emerald-500 transition-colors group/btn py-2 px-3 rounded-lg hover:bg-muted/50">
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-xs font-semibold hidden sm:inline">Soru Sor</span>
                </Link>
            </div>
        </motion.div>
    );
}
