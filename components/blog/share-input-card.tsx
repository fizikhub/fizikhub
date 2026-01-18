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
                "group relative flex flex-col overflow-visible rounded-2xl transition-all duration-300",
                "bg-card border border-border/50",
                "shadow-lg shadow-indigo-500/5 hover:shadow-xl hover:shadow-indigo-500/10",
                "w-full max-w-2xl mx-auto mb-6 sm:mb-10 z-[50]"
            )}
        >
            <div className="p-1">
                <div className="flex gap-2 p-2">
                    {/* Avatar Area */}
                    <div className="hidden sm:block">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-background shadow-sm">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="bg-indigo-600 text-white font-bold">
                                {displayName?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Input Trigger */}
                    <div className="flex-1 relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={cn(
                                "w-full h-10 sm:h-12 text-left px-4 flex items-center justify-between transition-all duration-200 group/input relative",
                                "bg-muted/30 hover:bg-muted/50",
                                "border border-transparent hover:border-indigo-500/30",
                                "rounded-xl",
                                isOpen && "bg-muted/50"
                            )}
                        >
                            <span className="text-muted-foreground font-medium text-sm sm:text-base group-hover/input:text-indigo-500 transition-colors">
                                {isOpen ? "Kapat" : "Ne paylaşmak istersin?"}
                            </span>
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                                isOpen ? "bg-indigo-100 dark:bg-indigo-900/30 rotate-45" : "bg-transparent group-hover/input:bg-indigo-100 dark:group-hover/input:bg-indigo-900/30"
                            )}>
                                <Plus className={cn(
                                    "w-4 h-4 transition-colors",
                                    isOpen ? "text-indigo-600" : "text-muted-foreground group-hover/input:text-indigo-600"
                                )} />
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    ref={dropdownRef}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full right-0 mt-2 w-full sm:w-72 bg-card/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-500/10 z-[100] overflow-hidden rounded-2xl"
                                >
                                    <div className="p-2">
                                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                                            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">Seçenekler</span>
                                        </div>

                                        <button
                                            onClick={() => handleNavigation("/kitap-inceleme/yeni")}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-indigo-500/10 transition-all group text-left rounded-xl"
                                        >
                                            <div className="relative w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-all">
                                                <Book className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm text-foreground group-hover:text-indigo-500 transition-colors">Kitap İncelemesi</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Puanla ve İncele</p>
                                            </div>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="px-5 py-3 border-t border-border/50 flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 overflow-x-auto">
                <div className="flex items-center gap-2 hover:text-indigo-500 transition-colors cursor-pointer group">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full dark:shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-125 transition-transform" />
                    <span>Blog</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-foreground/10" />
                <div className="flex items-center gap-2 hover:text-indigo-500 transition-colors cursor-pointer group">
                    <Book className="w-3.5 h-3.5 group-hover:text-indigo-500 group-hover:-translate-y-0.5 transition-all" />
                    <span>Medya</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-foreground/10" />
                <div className="flex items-center gap-2 hover:text-indigo-500 transition-colors cursor-pointer group">
                    <HelpCircle className="w-3.5 h-3.5 group-hover:text-indigo-500 group-hover:rotate-12 transition-all" />
                    <span>Soru</span>
                </div>
            </div>
        </motion.div>
    );
}
