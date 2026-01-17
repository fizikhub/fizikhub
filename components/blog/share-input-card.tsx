"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, Send, Sparkles } from "lucide-react";
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
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300",
                "bg-card border-2 border-border",
                "shadow-sm hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]",
                "w-full max-w-2xl mx-auto mb-10"
            )}
        >
            {/* Decorative Top-Right Badge */}
            <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded-bl-xl border-l-2 border-b-2 border-border z-10 translate-x-full group-hover:translate-x-0 transition-transform duration-300">
                ONLINE
            </div>

            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b-2 border-border/50 bg-muted/20">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-black tracking-widest text-emerald-600 dark:text-emerald-500 uppercase">
                        YENİ PAYLAŞIM
                    </span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-border/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-border/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-border/40" />
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="shrink-0">
                    <Avatar className="w-12 h-12 border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                        <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground font-black border-2 border-transparent">
                            {displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </motion.div>

                <Link href="/makale/yeni" className="flex-1 block group/input">
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-muted/30 hover:bg-muted/50 transition-colors rounded-xl px-4 py-3 cursor-text flex items-center justify-between border-2 border-transparent hover:border-emerald-500/50 group-hover/input:shadow-inner"
                    >
                        <span className="text-muted-foreground/70 text-sm font-bold truncate flex items-center gap-2">
                            Bugün ne paylaşmak istersin, {firstName}?
                        </span>
                        <Send className="w-4 h-4 text-emerald-500 opacity-0 -translate-x-4 rotate-45 group-hover/input:opacity-100 group-hover/input:translate-x-0 group-hover/input:rotate-0 transition-all duration-300" />
                    </motion.div>
                </Link>
            </div>

            {/* Action Bar */}
            <div className="px-5 py-3 border-t-2 border-border/50 flex items-center justify-around bg-muted/5">
                <Link href="/makale/yeni" className="flex-1">
                    <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                        className="flex items-center justify-center gap-2 text-muted-foreground hover:text-rose-500 transition-colors py-2 px-3 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                    >
                        <PenTool className="w-4 h-4" />
                        <span className="text-xs font-bold hidden sm:inline uppercase tracking-wide">Makale</span>
                    </motion.div>
                </Link>

                <div className="w-0.5 h-6 bg-border/20 mx-1" />

                <Link href="/makale/yeni" className="flex-1">
                    <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                        className="flex items-center justify-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors py-2 px-3 rounded-lg hover:bg-blue-500/10 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-xs font-bold hidden sm:inline uppercase tracking-wide">Ekle</span>
                    </motion.div>
                </Link>

                <div className="w-0.5 h-6 bg-border/20 mx-1" />

                <Link href="/forum" className="flex-1">
                    <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                        className="flex items-center justify-center gap-2 text-muted-foreground hover:text-emerald-500 transition-colors py-2 px-3 rounded-lg hover:bg-emerald-500/10 cursor-pointer"
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-xs font-bold hidden sm:inline uppercase tracking-wide">Soru</span>
                    </motion.div>
                </Link>
            </div>
        </motion.div>
    );
}
