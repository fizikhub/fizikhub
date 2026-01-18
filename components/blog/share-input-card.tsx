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
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
                "group relative flex flex-col overflow-visible rounded-2xl transition-all duration-300",
                "bg-card border-2 border-foreground",
                "shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] dark:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]", // Blood Red shadow
                "w-full max-w-2xl mx-auto mb-6 sm:mb-10 z-[50]"
            )}
        >
            {/* Top Bar (Browser-like with rounded top) */}
            <div className="h-8 border-b-2 border-foreground bg-muted flex items-center px-3 justify-between select-none rounded-t-2xl">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground border border-foreground/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground border border-foreground/20" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-foreground/50">Paylaş</div>
                <div className="w-6" />
            </div>

            <div className="p-1">
                <div className="flex gap-0">
                    {/* Avatar Area */}
                    <div className="p-3 pr-2 block">
                        <Avatar className="w-10 h-10 sm:w-11 sm:h-11 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="bg-red-600 text-white font-black rounded-xl">
                                {displayName?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Input Trigger */}
                    <div className="flex-1 p-2 sm:p-3 relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={cn(
                                "w-full h-12 text-left px-4 flex items-center justify-between transition-all duration-200 group/input relative",
                                "bg-background hover:bg-muted/10",
                                "border-2 border-muted-foreground/30 hover:border-red-600",
                                "rounded-xl",
                                isOpen && "border-red-600 shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)]",
                                !isOpen && "group-hover/input:shadow-[4px_4px_0px_0px_rgba(220,38,38,0.2)]"
                            )}
                        >
                            <span className="text-muted-foreground font-bold uppercase tracking-tight group-hover/input:text-red-600 transition-colors truncate mr-2 min-w-0 flex-1">
                                {isOpen ? "Kapat" : `Ne paylaşmak istersin, ${firstName}?`}
                            </span>
                            <Plus className={cn(
                                "w-5 h-5 text-red-600 transition-transform duration-300 flex-shrink-0",
                                isOpen ? "rotate-45" : "group-hover/input:rotate-90"
                            )} />
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
                                    className="absolute top-full right-0 mt-2 w-full sm:w-72 bg-card border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[100] overflow-hidden rounded-xl"
                                >
                                    <div className="p-0">
                                        <div className="px-4 py-3 border-b-2 border-foreground bg-red-600 text-white">
                                            <span className="text-[10px] font-black tracking-widest uppercase">Seçenekler</span>
                                        </div>

                                        {/* Kitap İncelemesi */}
                                        <button
                                            onClick={() => handleNavigation("/kitap-inceleme/yeni")}
                                            className="w-full flex items-center gap-4 p-4 hover:bg-muted/10 transition-all group text-left relative border-b-2 border-border/50"
                                        >
                                            <div className="relative w-10 h-10 bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 border-2 border-red-600 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_rgba(220,38,38,1)] transition-all rounded-lg">
                                                <Book className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-sm uppercase tracking-wide text-foreground group-hover:text-red-600 transition-colors">Kitap İncelemesi</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 font-bold">Puanla ve İncele</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-red-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </button>

                                        {/* Soru Sor */}
                                        <button
                                            onClick={() => handleNavigation("/forum")}
                                            className="w-full flex items-center gap-4 p-4 hover:bg-muted/10 transition-all group text-left relative border-b-2 border-border/50"
                                        >
                                            <div className="relative w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 border-2 border-blue-600 shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_rgba(37,99,235,1)] transition-all rounded-lg">
                                                <MessageCircleQuestion className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-sm uppercase tracking-wide text-foreground group-hover:text-blue-600 transition-colors">Soru Sor</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 font-bold">Topluluğa Danış</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </button>

                                        {/* Deney Paylaş */}
                                        <button
                                            onClick={() => handleNavigation("/makale/yeni?type=experiment")}
                                            className="w-full flex items-center gap-4 p-4 hover:bg-muted/10 transition-all group text-left relative last:border-none"
                                        >
                                            <div className="relative w-10 h-10 bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 border-2 border-green-600 shadow-[2px_2px_0px_0px_rgba(22,163,74,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_rgba(22,163,74,1)] transition-all rounded-lg">
                                                <FlaskConical className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-sm uppercase tracking-wide text-foreground group-hover:text-green-600 transition-colors">Deney Paylaş</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 font-bold">Bilimsel Çalışman</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="px-4 py-2 bg-muted/20 border-t-2 border-foreground flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground overflow-x-auto rounded-b-2xl">
                <Link href="/blog" className="flex items-center gap-2 hover:text-red-600 transition-colors cursor-pointer group shrink-0">
                    <PenTool className="w-4 h-4 text-muted-foreground group-hover:text-red-600 transition-colors" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">Blog</span>
                </Link>

                <div className="w-0.5 h-6 bg-foreground/20 mx-1 shrink-0" />

                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 hover:text-red-600 transition-colors cursor-pointer group shrink-0">
                    <Plus className="w-4 h-4 text-muted-foreground group-hover:text-red-600 transition-colors" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">Ekle</span>
                </button>

                <div className="w-0.5 h-6 bg-foreground/20 mx-1 shrink-0" />

                <Link href="/forum" className="flex items-center gap-2 hover:text-red-600 transition-colors cursor-pointer group shrink-0">
                    <HelpCircle className="w-4 h-4 text-muted-foreground group-hover:text-red-600 transition-colors" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">Soru</span>
                </Link>
            </div>
        </motion.div>
    );
}
