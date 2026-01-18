"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, Book } from "lucide-react";
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
                "group relative flex flex-col overflow-visible rounded-none transition-all duration-300",
                "bg-card border-2 border-foreground",
                "shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]",
                "w-full max-w-2xl mx-auto mb-6 sm:mb-10 z-50"
            )}
        >
            {/* Top Bar - Compact on Mobile */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2 sm:py-3 border-b-2 border-foreground bg-muted/30 rounded-t-none">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-black tracking-widest text-foreground uppercase">
                        YENİ PAYLAŞIM
                    </span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-foreground" />
                    <div className="w-1.5 h-1.5 bg-foreground" />
                    <div className="w-1.5 h-1.5 bg-foreground" />
                </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4 relative bg-card">
                <motion.div whileHover={{ scale: 1.05, rotate: 3 }} className="shrink-0">
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] rounded-none">
                        <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                        <AvatarFallback className="text-[10px] sm:text-xs bg-red-600 text-white font-black border-2 border-transparent rounded-none">
                            {displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </motion.div>

                <div className="flex-1 block group/input relative">
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full bg-background hover:bg-muted/10 transition-colors rounded-none px-3 sm:px-4 py-3 sm:py-4 cursor-pointer flex items-center justify-between border-2 border-muted-foreground/30 hover:border-red-600 group-hover/input:shadow-[4px_4px_0px_0px_rgba(220,38,38,0.2)]"
                    >
                        <span className="text-muted-foreground font-bold text-xs sm:text-sm truncate flex items-center gap-2 uppercase tracking-tight">
                            Aklında ne var, {firstName}?
                        </span>
                        <div className="flex items-center gap-2">
                            <Plus className={cn("w-5 h-5 text-red-600 transition-transform duration-300", isOpen && "rotate-45")} />
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
                                className="absolute top-full right-0 mt-2 w-full sm:w-72 bg-card border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[100] overflow-hidden rounded-none"
                            >
                                <div className="p-0">
                                    <div className="px-4 py-3 border-b-2 border-foreground bg-red-600 text-white">
                                        <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase">Ne Paylaşmak İstersin?</span>
                                    </div>

                                    <button
                                        onClick={() => handleNavigation("/kitap-inceleme/yeni")}
                                        className="w-full flex items-center gap-4 p-4 hover:bg-muted/10 transition-all group text-left relative overflow-hidden border-b-2 border-border/50 last:border-none"
                                    >
                                        <div className="relative w-10 h-10 bg-red-100 dark:bg-red-900/20 text-red-600 border-2 border-red-600 group-hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] flex items-center justify-center">
                                            <Book className="w-5 h-5" />
                                        </div>
                                        <div className="relative flex-1">
                                            <h4 className="font-black text-sm text-foreground uppercase tracking-wide group-hover:text-red-600 transition-colors">Kitap İncelemesi</h4>
                                            <p className="text-[10px] text-muted-foreground leading-tight font-medium mt-0.5">Okuduğun kitabı puanla ve incele.</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all text-red-600">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Action Bar */}
            <div className="px-2 sm:px-5 py-2 sm:py-3 border-t-2 border-foreground flex items-center justify-around bg-muted/20 rounded-b-none">
                <button onClick={() => handleNavigation("/makale/yeni")} className="flex-1 group">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 cursor-pointer">
                        <PenTool className="w-4 h-4 text-muted-foreground group-hover:text-red-600 transition-colors" />
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">Blog</span>
                    </div>
                </button>

                <div className="w-0.5 h-6 bg-foreground/20 mx-1" />

                <button onClick={() => setIsOpen(!isOpen)} className="flex-1 group">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 cursor-pointer">
                        <Plus className="w-4 h-4 text-muted-foreground group-hover:text-red-600 transition-colors" />
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">Ekle</span>
                    </div>
                </button>

                <div className="w-0.5 h-6 bg-foreground/20 mx-1" />

                <Link href="/forum" className="flex-1 group">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 cursor-pointer">
                        <HelpCircle className="w-4 h-4 text-muted-foreground group-hover:text-red-600 transition-colors" />
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">Soru</span>
                    </div>
                </Link>
            </div>
        </motion.div>
    );
}
