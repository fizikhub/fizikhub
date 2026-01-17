"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, Send, Book, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigation = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
                "group relative flex flex-col overflow-visible rounded-xl sm:rounded-2xl transition-all duration-300", // overflow-visible for dropdown
                "bg-card border-2 border-border",
                "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]",
                "w-full max-w-2xl mx-auto mb-6 sm:mb-10 z-20"
            )}
        >
            {/* Top Bar - Compact on Mobile */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2 sm:py-3 border-b-2 border-border/50 bg-muted/30 rounded-t-xl sm:rounded-t-2xl">
                <div className="flex items-center gap-2">
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
            <div className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4 relative">
                <motion.div whileHover={{ scale: 1.05, rotate: 3 }} className="shrink-0">
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-border shadow-sm">
                        <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                        <AvatarFallback className="text-[10px] sm:text-xs bg-muted text-muted-foreground font-black border-2 border-transparent">
                            {displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </motion.div>

                <div className="flex-1 block group/input relative">
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full bg-muted/40 hover:bg-muted/60 transition-colors rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer flex items-center justify-between border-2 border-transparent hover:border-emerald-500/30 group-hover/input:shadow-inner"
                    >
                        <span className="text-muted-foreground/70 text-xs sm:text-sm font-bold truncate flex items-center gap-2">
                            Aklında ne var, {firstName}?
                        </span>
                        <div className="flex items-center gap-2">
                            <Plus className={cn("w-4 h-4 text-muted-foreground transition-transform duration-300", isOpen && "rotate-45")} />
                        </div>
                    </motion.div>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                ref={dropdownRef}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute top-full right-0 mt-3 w-64 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,1)] z-[100] overflow-hidden"
                            >
                                <div className="p-2">
                                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                                        <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Ne Paylaşmak İstersin?</span>
                                    </div>

                                    <button
                                        onClick={() => handleNavigation("/kitap-inceleme/yeni")}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group text-left relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            <Book className="w-5 h-5" />
                                        </div>
                                        <div className="relative flex-1">
                                            <h4 className="font-bold text-sm text-foreground group-hover:text-emerald-400 transition-colors">Kitap İncelemesi</h4>
                                            <p className="text-[10px] text-muted-foreground leading-tight">Okuduğun kitabı puanla ve tüm detaylarıyla incele.</p>
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Action Bar */}
            <div className="px-2 sm:px-5 py-2 sm:py-3 border-t-2 border-border/50 flex items-center justify-around bg-muted/10 rounded-b-xl sm:rounded-b-2xl">
                <button onClick={() => handleNavigation("/makale/yeni")} className="flex-1">
                    <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-muted-foreground hover:text-rose-500 transition-colors py-2 px-1 sm:px-3 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                    >
                        <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Blog</span>
                    </motion.div>
                </button>

                <div className="w-px h-6 bg-border/20 mx-1" />

                <button onClick={() => setIsOpen(!isOpen)} className="flex-1">
                    <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-muted-foreground hover:text-blue-500 transition-colors py-2 px-1 sm:px-3 rounded-lg hover:bg-blue-500/10 cursor-pointer"
                    >
                        <Plus className="w-4 h-4 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Ekle</span>
                    </motion.div>
                </button>

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
