"use client";

import { useState, useEffect, useRef } from "react";
import { HeaderSpaceBackground } from "./header-space-background";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles, ArrowRight, PenLine, ChevronDown } from "lucide-react";
import { CreateQuestionDialog } from "./create-question-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export function ModernForumHeader() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isCybernetic = mounted && theme === 'cybernetic';
    const isPink = mounted && theme === 'pink';
    const isDarkPink = mounted && theme === 'dark-pink';
    const isCute = isPink || isDarkPink;

    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const currentCategory = searchParams.get("category") || "Tümü";
    const currentSort = searchParams.get("sort") || "newest";
    const searchRef = useRef<HTMLDivElement>(null);
    const [supabase] = useState(() => createClient());

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 2) {
                setIsSearching(true);
                setShowResults(true);
                try {
                    const { data } = await supabase
                        .from('questions')
                        .select('id, title, slug, category')
                        .ilike('title', `%${searchQuery}%`)
                        .limit(5);
                    setResults(data || []);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const categories = [
        "Tümü",
        "Kuantum Fiziği",
        "Astrofizik",
        "Termodinamik",
        "Mekanik",
        "Elektromanyetizma",
        "Genel Görelilik",
        "Parçacık Fiziği"
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(false);
        const params = new URLSearchParams(searchParams.toString());

        if (searchQuery.trim()) {
            params.set("q", searchQuery);
        } else {
            params.delete("q");
        }

        router.push(`/forum?${params.toString()}`);
    };

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category === "Tümü") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        router.push(`/forum?${params.toString()}`);
    };

    const handleSortChange = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", sort);
        router.push(`/forum?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-8 mb-6 sm:mb-8">
            {/* NEOBRUTALIST HERO SECTION */}
            <div className={cn(
                "relative rounded-xl overflow-hidden min-h-[180px] sm:min-h-[240px] flex items-center justify-center p-4 sm:p-10",
                "bg-card border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]",
                isCybernetic && "cyber-card border-cyan-500/20 shadow-none !rounded-none min-h-[160px] bg-black",
                isPink && "bg-pink-50 border-pink-200 shadow-[4px_4px_0px_0px_rgba(255,192,203,1)] sm:shadow-[8px_8px_0px_0px_rgba(255,192,203,1)]",
                isDarkPink && "bg-zinc-950 border-pink-900/50"
            )}>

                {/* Background Decor - SPACE RESTORED */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {!isCute && !isCybernetic && (
                        <div className="opacity-80 dark:opacity-60">
                            <HeaderSpaceBackground />
                        </div>
                    )}
                    {isCybernetic && <HeaderSpaceBackground />}
                    {isCute && (
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(#FF1493 2px, transparent 2px)',
                                backgroundSize: '16px 16px'
                            }} />
                    )}
                </div>

                {/* Content Z-Index Layer */}
                <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-8">

                    {/* Title */}
                    <div className="space-y-2 sm:space-y-3 bg-background/80 backdrop-blur-sm p-3 sm:p-6 rounded-xl border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] inline-block">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "text-2xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase",
                                isPink && "text-pink-600",
                                isCybernetic && "cyber-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
                            )}
                        >
                            Aklında Ne Var?
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={cn(
                                "text-muted-foreground font-bold text-xs sm:text-lg uppercase tracking-widest",
                                isPink && "text-pink-900/60"
                            )}
                        >
                            Bilim topluluğu seni bekliyor.
                        </motion.p>
                    </div>

                    {/* Interactive Search/Ask Bar - NEOBRUTALIST */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full relative group"
                    >
                        <CreateQuestionDialog
                            trigger={
                                <div className={cn(
                                    "w-full cursor-pointer overflow-hidden relative",
                                    "bg-background border border-border",
                                    "rounded-xl transition-all duration-200",
                                    "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)]",
                                    "hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.25)]",
                                    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)]",
                                    "flex items-center p-2 pr-3 pl-2 sm:pr-4 sm:pl-4 h-12 sm:h-20 gap-3 sm:gap-4 group-hover:bg-accent/5",
                                    isPink && "border-pink-500 shadow-[4px_4px_0px_0px_rgba(255,20,147,0.5)]",
                                    isCybernetic && "bg-black/90 border-cyan-500/50 !rounded-none shadow-none hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:border-cyan-400"
                                )}>

                                    {/* Icon */}
                                    <div className={cn(
                                        "w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 border border-foreground",
                                        "bg-primary text-primary-foreground",
                                        isPink && "bg-pink-500 text-white border-pink-700",
                                        isCybernetic && "bg-cyan-950 text-cyan-400 border-cyan-500 rounded-none"
                                    )}>
                                        <PenLine className="w-4 h-4 sm:w-6 sm:h-6 stroke-[3px]" />
                                    </div>

                                    {/* Placeholder Text */}
                                    <div className="flex-1 text-left flex flex-col justify-center">
                                        <span className={cn(
                                            "text-sm sm:text-xl font-black text-foreground uppercase tracking-tight",
                                            isPink && "text-pink-900"
                                        )}>
                                            Yeni Bir Soru Sor...
                                        </span>
                                    </div>

                                    {/* Action Hint */}
                                    <div className={cn(
                                        "hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider border-2 border-foreground",
                                        "bg-foreground text-background",
                                        isPink && "bg-pink-600 text-white border-pink-800",
                                        isCybernetic && "bg-cyan-900/50 text-cyan-400 border-cyan-500 rounded-none"
                                    )}>
                                        <span>Başlat</span>
                                        <ArrowRight className="w-4 h-4 stroke-[3px]" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 stroke-[3px] sm:hidden ml-auto" />

                                </div>
                            }
                        />
                    </motion.div>
                </div>
            </div>

            {/* FILTERS BAR - NEOBRUTALIST */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between sticky top-[60px] z-30 py-2 sm:py-4 bg-background/95 backdrop-blur-md border-b-2 border-border/50 data-[pinned=true]:border-b-border transition-all">
                {/* Categories */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 sm:gap-3 min-w-max px-1">
                        {categories.map((category) => {
                            const isActive = currentCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={cn(
                                        "px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-sm font-bold uppercase tracking-wide border-2 transition-all duration-200 rounded-lg",
                                        isActive
                                            ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-[-1px] translate-y-[-1px]"
                                            : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground",
                                        isPink && isActive && "bg-pink-500 border-pink-800 shadow-[2px_2px_0px_0px_rgba(255,20,147,0.5)]",
                                        isCybernetic && "rounded-none",
                                        isCybernetic && isActive && "bg-cyan-950/50 text-cyan-400 border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                                    )}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-0 border-2 border-foreground rounded-lg overflow-hidden bg-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] w-full md:w-auto">
                    <button
                        onClick={() => handleSortChange("newest")}
                        className={cn(
                            "flex-1 md:flex-none px-4 py-2 text-[10px] sm:text-xs font-black uppercase transition-all hover:bg-muted",
                            currentSort === 'newest'
                                ? "bg-primary text-primary-foreground"
                                : "bg-card text-muted-foreground",
                            isCybernetic && "rounded-none"
                        )}
                    >
                        En Yeniler
                    </button>
                    <div className="w-0.5 self-stretch bg-foreground" />
                    <button
                        onClick={() => handleSortChange("popular")}
                        className={cn(
                            "flex-1 md:flex-none px-4 py-2 text-[10px] sm:text-xs font-black uppercase transition-all hover:bg-muted",
                            currentSort === 'popular'
                                ? "bg-primary text-primary-foreground"
                                : "bg-card text-muted-foreground",
                            isCybernetic && "rounded-none"
                        )}
                    >
                        Popüler
                    </button>
                </div>
            </div>
        </div>
    );
}
