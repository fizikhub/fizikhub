"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, Book, FlaskConical, MessageCircleQuestion } from "lucide-react";
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
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={cn(
                "group relative flex flex-col overflow-visible rounded-[2rem] transition-all duration-300",
                "bg-card border-2 border-foreground",
                "shadow-[3px_3px_0px_0px_rgba(245,158,11,1)] dark:shadow-[3px_3px_0px_0px_rgba(245,158,11,1)]", // Softer Primary Amber shadow
                "w-full max-w-2xl mx-auto mb-6 sm:mb-10 z-[50]"
            )}
        >
            {/* Top Bar (Browser-like with rounded top) */}
            <div className="h-9 border-b-2 border-foreground bg-muted/50 flex items-center px-4 justify-between select-none rounded-t-[2rem]">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/40" />
                </div>
                <div className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Paylaş</div>
                <div className="w-6" />
            </div>

            <div className="p-2">
                <div className="flex gap-1">
                    {/* Avatar Area */}
                    <div className="p-2 pl-3 block">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="bg-primary text-primary-foreground font-black rounded-2xl">
                                {displayName?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Input Trigger */}
                    <div className="flex-1 p-2 relative min-w-0">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={cn(
                                "w-full h-12 text-left px-5 flex items-center justify-between transition-all duration-200 group/input relative",
                                "bg-background hover:bg-muted/20",
                                "border-2 border-muted-foreground/20 hover:border-primary",
                                "rounded-2xl",
                                isOpen && "border-primary shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)]",
                                !isOpen && "group-hover/input:shadow-[3px_3px_0px_0px_rgba(245,158,11,0.2)]"
                            )}
                        >
                            <span className="text-muted-foreground font-bold text-sm sm:text-base group-hover/input:text-primary transition-colors truncate mr-2 min-w-0 flex-1 block normal-case">
                                {isOpen ? "Kapat" : <span className="flex items-center gap-1"><span>Ne paylaşmak istersin,</span> <span className="text-foreground">{firstName}?</span></span>}
                            </span>
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                                isOpen ? "bg-primary text-primary-foreground rotate-45" : "bg-muted text-muted-foreground group-hover/input:bg-primary group-hover/input:text-primary-foreground"
                            )}>
                                <Plus className="w-4 h-4" />
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    ref={dropdownRef}
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full right-0 mt-3 w-full sm:w-72 bg-card border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-[100] overflow-hidden rounded-2xl"
                                >
                                    <div className="p-0">
                                        <div className="px-4 py-3 border-b-2 border-foreground bg-primary/10 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[10px] font-black tracking-widest uppercase text-primary">Seçenekler</span>
                                        </div>

                                        {/* Kitap İncelemesi */}
                                        <Link
                                            href="/kitap-inceleme/yeni"
                                            className="w-full flex items-center gap-4 p-4 hover:bg-muted/10 transition-all group text-left relative border-b-2 border-border/50"
                                        >
                                            <div className="relative w-10 h-10 bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 border-2 border-amber-600 shadow-[2px_2px_0px_0px_rgba(217,119,6,1)] rounded-xl group-hover:scale-105 transition-transform">
                                                <Book className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-sm uppercase tracking-wide text-foreground group-hover:text-amber-600 transition-colors truncate">Kitap İncelemesi</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 font-bold truncate">Puanla ve İncele</p>
                                            </div>
                                        </Link>

                                        {/* Soru Sor */}
                                        <Link
                                            href="/forum"
                                            className="w-full flex items-center gap-4 p-4 hover:bg-muted/10 transition-all group text-left relative border-b-2 border-border/50"
                                        >
                                            <div className="relative w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 border-2 border-blue-600 shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] rounded-xl group-hover:scale-105 transition-transform">
                                                <MessageCircleQuestion className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-sm uppercase tracking-wide text-foreground group-hover:text-blue-600 transition-colors truncate">Soru Sor</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 font-bold truncate">Topluluğa Danış</p>
                                            </div>
                                        </Link>

                                        {/* Deney Paylaş */}
                                        <Link
                                            href="/makale/yeni?type=experiment"
                                            className="w-full flex items-center gap-4 p-4 hover:bg-muted/10 transition-all group text-left relative last:border-none"
                                        >
                                            <div className="relative w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 border-2 border-emerald-600 shadow-[2px_2px_0px_0px_rgba(5,150,105,1)] rounded-xl group-hover:scale-105 transition-transform">
                                                <FlaskConical className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-sm uppercase tracking-wide text-foreground group-hover:text-emerald-600 transition-colors truncate">Deney Paylaş</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 font-bold truncate">Bilimsel Çalışman</p>
                                            </div>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="px-5 py-2.5 bg-muted/20 border-t-2 border-foreground flex items-center gap-2 text-[10px] font-bold text-muted-foreground overflow-x-auto rounded-b-[2rem]">
                <Link href="/makale/yeni" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-background hover:text-primary hover:shadow-sm border border-transparent hover:border-border transition-all cursor-pointer group shrink-0">
                    <PenTool className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Blog</span>
                </Link>

                <div className="w-1 h-1 rounded-full bg-foreground/10 mx-1 shrink-0" />

                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-background hover:text-primary hover:shadow-sm border border-transparent hover:border-border transition-all cursor-pointer group shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Ekle</span>
                </button>

                <div className="w-1 h-1 rounded-full bg-foreground/10 mx-1 shrink-0" />

                <Link href="/forum" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-background hover:text-primary hover:shadow-sm border border-transparent hover:border-border transition-all cursor-pointer group shrink-0">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Soru</span>
                </Link>

                <div className="flex-1" />
                <div className="text-[9px] text-muted-foreground/50 font-mono hidden sm:block">
                    v2.0
                </div>
            </div>
        </motion.div>
    );
}
