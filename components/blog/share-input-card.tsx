"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, Send, Terminal, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-full max-w-3xl mx-auto mb-16 relative z-20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Brutalist Shadow Box */}
            <div className="absolute top-2 left-2 w-full h-full bg-emerald-500 rounded-none -z-10 border-2 border-black dark:border-white transition-transform duration-200 group-hover:translate-x-3 group-hover:translate-y-3" />

            <div className="bg-white dark:bg-[#111] border-2 border-black dark:border-white p-6 md:p-8 relative overflow-hidden">

                {/* Decorative Mechanics */}
                <div className="absolute top-0 right-0 p-2 opacity-50">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse delay-75" />
                        <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse delay-150" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* User Module */}
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-none translate-x-1 translate-y-1 border-2 border-black dark:border-white z-0" />
                        <Avatar className="w-16 h-16 border-2 border-black dark:border-white relative z-10 bg-white">
                            <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                            <AvatarFallback className="bg-yellow-400 text-black font-black text-xl">
                                {displayName.substring(0, 1).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-0.5 border border-black dark:border-transparent">
                            ONLINE
                        </div>
                    </div>

                    {/* Input Module */}
                    <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-2">
                            <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-mono font-bold tracking-wider text-muted-foreground uppercase">
                                STATUS: READY_TO_PUBLISH
                            </span>
                        </div>

                        <Link href="/makale/yeni" className="block group/input">
                            <div className="relative">
                                <div className="absolute top-1 left-1 w-full h-full bg-black dark:bg-white/20 -z-10 transition-all duration-200 group-hover/input:top-2 group-hover/input:left-2" />
                                <div className="w-full bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-white p-4 flex items-center justify-between transition-transform duration-200 group-hover/input:-translate-y-1 group-active/input:translate-y-0">
                                    <span className="text-zinc-500 dark:text-zinc-400 font-bold text-lg md:text-xl truncate">
                                        Fikrini ateşle, {displayName.split(' ')[0]}...
                                    </span>
                                    <div className="bg-emerald-500 p-2 border-2 border-black dark:border-white flex items-center justify-center transition-transform group-hover/input:rotate-12">
                                        <Send className="w-5 h-5 text-black" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Control Grid */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t-2 border-black/10 dark:border-white/10 border-dashed">
                    <Link href="/makale/yeni" className="group/btn">
                        <div className="flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="w-10 h-10 bg-rose-500/20 border-2 border-black dark:border-rose-500/50 flex items-center justify-center group-hover/btn:bg-rose-500 group-hover/btn:text-white transition-colors">
                                <PenTool className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-xs font-bold uppercase tracking-widest">Makale</span>
                        </div>
                    </Link>

                    <Link href="/makale/yeni" className="group/btn">
                        <div className="flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="w-10 h-10 bg-blue-500/20 border-2 border-black dark:border-blue-500/50 flex items-center justify-center group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-colors">
                                <Plus className="w-6 h-6 group-hover/btn:rotate-90 transition-transform" />
                            </div>
                            <span className="font-mono text-xs font-bold uppercase tracking-widest">Ekle</span>
                        </div>
                    </Link>

                    <Link href="/forum" className="group/btn">
                        <div className="flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="w-10 h-10 bg-yellow-500/20 border-2 border-black dark:border-yellow-500/50 flex items-center justify-center group-hover/btn:bg-yellow-500 group-hover/btn:text-black transition-colors">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-xs font-bold uppercase tracking-widest">Soru</span>
                        </div>
                    </Link>
                </div>

                {/* Corner Accent */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-black dark:bg-white clip-path-triangle" />
            </div>
        </motion.div>
    );
}

// Add this to globals.css or use an inline style for clip-path if needed, 
// using simple css styled component for now in the JSX is cleaner if we had styled-components, 
// but here we just rely on standard tailwind or custom classes. 
// Ideally user has `clip-path` utility or we just leave it as a square for now if complex.
