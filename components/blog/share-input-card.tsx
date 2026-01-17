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
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300",
                "bg-card border-2 border-border",
                "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]",
                "w-full max-w-2xl mx-auto mb-6 sm:mb-10"
            )}
        >
            {/* Top Bar - Compact on Mobile */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2 sm:py-3 border-b-2 border-border/50 bg-muted/30">
                <div className="flex items-center gap-2">
                    {/* Green dot removed as requested */}
                    <span className="text-[10px] sm:text-xs font-black tracking-widest text-foreground/80 uppercase">
                        YENİ PAYLAŞIM
                    </span>
                </div>
                <div className="flex gap-1 opacity-50">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-foreground/40" />
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-foreground/40" />
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-foreground/40" />
                </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                <motion.div whileHover={{ scale: 1.05, rotate: 3 }} className="shrink-0">
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-border shadow-sm">
                        <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                        <AvatarFallback className="text-[10px] sm:text-xs bg-muted text-muted-foreground font-black border-2 border-transparent">
                            {displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </motion.div>

                <Link href="/makale/yeni" className="flex-1 block group/input">
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-muted/40 hover:bg-muted/60 transition-colors rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 cursor-text flex items-center justify-between border-2 border-transparent hover:border-emerald-500/30 group-hover/input:shadow-inner"
                    >
                        <span className="text-muted-foreground/70 text-xs sm:text-sm font-bold truncate flex items-center gap-2">
                            Aklında ne var, {firstName}?
                        </span>
                        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 opacity-50 sm:opacity-0 sm:-translate-x-4 sm:rotate-45 sm:group-hover/input:opacity-100 sm:group-hover/input:translate-x-0 sm:group-hover/input:rotate-0 transition-all duration-300" />
                    </motion.div>
                </Link>
            </div>

            {/* Action Bar */}
            <div className="px-2 sm:px-5 py-2 sm:py-3 border-t-2 border-border/50 flex items-center justify-around bg-muted/10">
                <Link href="/makale/yeni" className="flex-1">
                    <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-muted-foreground hover:text-rose-500 transition-colors py-2 px-1 sm:px-3 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                    >
                        <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Makale</span>
                    </motion.div>
                </Link>

                <div className="w-px h-6 bg-border/20 mx-1" />

                <Link href="/makale/yeni" className="flex-1">
                    <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-muted-foreground hover:text-blue-500 transition-colors py-2 px-1 sm:px-3 rounded-lg hover:bg-blue-500/10 cursor-pointer"
                    >
                        <Plus className="w-4 h-4 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Ekle</span>
                    </motion.div>
                </Link>

                <div className="w-px h-6 bg-border/20 mx-1" />

                <Link href="/forum" className="flex-1">
                    <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-muted-foreground hover:text-emerald-500 transition-colors py-2 px-1 sm:px-3 rounded-lg hover:bg-emerald-500/10 cursor-pointer"
                    >
                        <HelpCircle className="w-4 h-4 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Soru</span>
                    </motion.div>
                </Link>
            </div>
        </motion.div>
    );
}
