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
    const [results, setResults] = useState<{ id: number; title: string; slug: string; category: string }[]>([]);
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
            {/* NEOBRUTALIST HERO SECTION - REFINED */}
            <div className={cn(
                "relative rounded-3xl overflow-hidden min-h-[140px] sm:min-h-[220px] flex items-center justify-center p-3 sm:p-10",
                "bg-card border-none shadow-none", // Removed heavy borders for cleaner look
                isCybernetic && "cyber-card border-cyan-500/20 shadow-none !rounded-none min-h-[160px] bg-black",
                isPink && "bg-pink-50 border-pink-200 shadow-[4px_4px_0px_0px_rgba(255,192,203,1)] sm:shadow-[8px_8px_0px_0px_rgba(255,192,203,1)]",
                isDarkPink && "bg-zinc-950 border-pink-900/50"
            )}>

                {/* Background Decor - SPACE RESTORED */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-3xl">
                    {!isCute && !isCybernetic && (
                        <div className="opacity-90 dark:opacity-80">
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
                <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-6">

                    {/* Title */}
                    <div className="space-y-1 sm:space-y-2 bg-background/60 backdrop-blur-md p-3 sm:p-6 rounded-2xl border border-white/10 shadow-lg inline-block">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground",
                                isPink && "text-pink-600",
                                isCybernetic && "cyber-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
                            )}
                        >
                            Aklında Ne Var?
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className={cn(
                                "text-muted-foreground font-bold text-[10px] sm:text-sm uppercase tracking-widest",
                                isPink && "text-pink-900/60"
                            )}
                        >
                            Bilim topluluğu seni bekliyor.
                        </motion.p>
                    </div>

                    {/* Interactive Search/Ask Bar - CLEANER & REFINED */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full relative group max-w-lg"
                    >
                        <CreateQuestionDialog
                            trigger={
                                <div className={cn(
                                    "w-full cursor-pointer overflow-hidden relative",
                                    "bg-background/80 backdrop-blur-md sm:bg-background border border-white/20 sm:border-transparent",
                                    "rounded-full transition-all duration-300",
                                    "shadow-lg hover:shadow-xl hover:bg-background",
                                    "hover:scale-[1.01]",
                                    "flex items-center p-1.5 pr-2 pl-1.5 sm:pr-2 sm:pl-2 h-12 sm:h-14 gap-2 sm:gap-3",
                                    isPink && "border-pink-500 shadow-[4px_4px_0px_0px_rgba(255,20,147,0.5)]",
                                    isCybernetic && "bg-black/90 border-cyan-500/50 !rounded-none shadow-none hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:border-cyan-400"
                                )}>

                                    {/* Icon */}
                                    <div className={cn(
                                        "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0",
                                        "bg-primary/10 text-primary",
                                        isPink && "bg-pink-100 text-pink-600",
                                        isCybernetic && "bg-cyan-950 text-cyan-400 border border-cyan-500 rounded-none"
                                    )}>
                                        <PenLine className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                                    </div>

                                    {/* Placeholder Text */}
                                    <div className="flex-1 text-left flex flex-col justify-center">
                                        <span className={cn(
                                            "text-sm sm:text-base font-semibold text-muted-foreground hover:text-foreground transition-colors",
                                            isPink && "text-pink-900/70"
                                        )}>
                                            Bir soru sor veya tartışma başlat...
                                        </span>
                                    </div>

                                    {/* Action Button */}
                                    <div className={cn(
                                        "hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground",
                                        isPink && "bg-pink-600 text-white",
                                        isCybernetic && "bg-cyan-900/50 text-cyan-400 border border-cyan-500 rounded-none"
                                    )}>
                                        <ArrowRight className="w-4 h-4 stroke-[3px]" />
                                    </div>

                                </div>
                            }
                        />
                    </motion.div>
                </div>
            </div>

            {/* FILTERS BAR - REFINED & CLEAN */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between sticky top-[60px] z-30 py-2 sm:py-4 bg-background/95 backdrop-blur-md border-b border-border/40 data-[pinned=true]:border-b-border transition-all">
                {/* Categories */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 sm:gap-2.5 min-w-max px-1">
                        {categories.map((category) => {
                            const isActive = currentCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={cn(
                                        "px-3 py-1.5 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-bold capitalize tracking-wide border transition-all duration-200 rounded-full",
                                        isActive
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground",
                                        isPink && isActive && "bg-pink-500 border-pink-500",
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
                <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/40 w-full md:w-auto">
                    <button
                        onClick={() => handleSortChange("newest")}
                        className={cn(
                            "flex-1 md:flex-none px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase transition-all rounded-full",
                            currentSort === 'newest'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                            isCybernetic && "rounded-none"
                        )}
                    >
                        En Yeniler
                    </button>
                    <button
                        onClick={() => handleSortChange("popular")}
                        className={cn(
                            "flex-1 md:flex-none px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase transition-all rounded-full",
                            currentSort === 'popular'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
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
