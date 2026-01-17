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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl mx-auto mb-10 group"
        >
            <div className="relative">
                {/* Background Decor Layer - Neo Brutalist Shadow */}
                <div className="absolute top-2 left-2 w-full h-full bg-emerald-500/20 rounded-xl -z-10 bg-grid-white/[0.05] border border-white/5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />

                <div className="bg-[#0a0a0a] rounded-xl border-2 border-white/10 p-5 shadow-2xl relative overflow-hidden">
                    {/* Abstract Noise Texture */}
                    <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

                    {/* Top Section: Avatar & Input Trigger */}
                    <div className="flex gap-4 mb-6 relative z-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                            <Avatar className="w-12 h-12 ring-2 ring-white/10">
                                <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                                <AvatarFallback className="bg-zinc-900 text-emerald-500 font-bold border border-white/10">
                                    {displayName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <Link href="/makale/yeni" className="flex-1">
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full bg-[#111] hover:bg-[#151515] transition-colors rounded-lg p-3 px-5 border-2 border-white/5 hover:border-emerald-500/30 cursor-text flex items-center h-12 group/input"
                            >
                                <span className="text-muted-foreground/50 text-sm font-medium group-hover/input:text-muted-foreground transition-colors flex-1">
                                    Bugün aklında ne var, {displayName.split(' ')[0]}?
                                </span>
                                <Send className="w-4 h-4 text-emerald-500 opacity-0 group-hover/input:opacity-100 -translate-x-2 group-hover/input:translate-x-0 transition-all" />
                            </motion.div>
                        </Link>
                    </div>

                    {/* Bottom Section: Action Buttons - Neo Brutalist Buttons */}
                    <div className="grid grid-cols-3 gap-3 relative z-10">
                        <Link href="/makale/yeni">
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-rose-500/50 cursor-pointer transition-colors group/btn relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <PenTool className="w-5 h-5 text-rose-400 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-muted-foreground group-hover/btn:text-rose-400 uppercase tracking-wide">Yaz</span>
                            </motion.div>
                        </Link>

                        <Link href="/makale/yeni">
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-blue-500/50 cursor-pointer transition-colors group/btn relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <Plus className="w-6 h-6 text-blue-400 group-hover/btn:rotate-90 transition-transform duration-300" />
                                <span className="text-xs font-bold text-muted-foreground group-hover/btn:text-blue-400 uppercase tracking-wide">Ekle</span>
                            </motion.div>
                        </Link>

                        <Link href="/forum">
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-emerald-500/50 cursor-pointer transition-colors group/btn relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <HelpCircle className="w-5 h-5 text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-muted-foreground group-hover/btn:text-emerald-400 uppercase tracking-wide">Soru Sor</span>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
