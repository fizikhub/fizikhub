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
        <div className="flex flex-col gap-6 mb-8">
            {/* HER HERO SECTION */}
            <div className={cn(
                "relative rounded-3xl overflow-hidden min-h-[220px] flex items-center justify-center p-6 sm:p-10",
                "bg-gradient-to-br from-neutral-900 to-black border border-white/5",
                isCybernetic && "cyber-card border-cyan-500/20 shadow-none !rounded-none min-h-[200px] from-black to-slate-950",
                isPink && "bg-pink-50 border-pink-200",
                isDarkPink && "bg-zinc-950 border-pink-900/30"
            )}>

                {/* Background Decor */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {!isCute && !isCybernetic && (
                        <>
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent_50%)]" />
                            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full translate-y-1/2 translate-x-1/2" />
                        </>
                    )}
                    {isCybernetic && <HeaderSpaceBackground />}
                    {isCute && (
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(#FF1493 2px, transparent 2px)',
                                backgroundSize: '24px 24px'
                            }} />
                    )}
                </div>

                <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-6">

                    {/* Title */}
                    <div className="space-y-2">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white",
                                isPink && "text-pink-950",
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
                                "text-muted-foreground font-medium text-lg",
                                isPink && "text-pink-900/60"
                            )}
                        >
                            Bilim topluluğu sorularını bekliyor.
                        </motion.p>
                    </div>

                    {/* Interactive Search/Ask Bar */}
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
                                    "bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20",
                                    "rounded-2xl transition-all duration-300 shadow-2xl shadow-black/20",
                                    "flex items-center p-2 pr-4 pl-4 h-14 sm:h-16 gap-4 group-hover:scale-[1.01]",
                                    isPink && "bg-white border-pink-200 shadow-xl shadow-pink-500/5 hover:border-pink-300",
                                    isCybernetic && "bg-black/80 border-cyan-500/30 !rounded-none hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                                )}>

                                    {/* Icon */}
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                        "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                                        isPink && "bg-pink-500 text-white shadow-pink-500/30",
                                        isCybernetic && "bg-cyan-950 text-cyan-400 border border-cyan-500/50 rounded-none shadow-none"
                                    )}>
                                        <PenLine className="w-5 h-5 stroke-[2.5px]" />
                                    </div>

                                    {/* Placeholder Text */}
                                    <div className="flex-1 text-left flex flex-col justify-center">
                                        <span className={cn(
                                            "text-sm sm:text-base font-semibold text-white/90 group-hover:text-white transition-colors",
                                            isPink && "text-gray-700 group-hover:text-gray-900"
                                        )}>
                                            Yeni bir tartışma başlat...
                                        </span>
                                    </div>

                                    {/* Action Hint */}
                                    <div className={cn(
                                        "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider",
                                        "bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white transition-all",
                                        isPink && "bg-pink-50 text-pink-600 group-hover:bg-pink-100",
                                        isCybernetic && "bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 rounded-none"
                                    )}>
                                        <span>Sor</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>

                                </div>
                            }
                        />
                    </motion.div>
                </div>
            </div>

            {/* FILTERS BAR */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[60px] z-30 py-3 bg-background/80 backdrop-blur-md border-b border-white/5 data-[pinned=true]:border-b-white/10 transition-all">
                {/* Categories */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 min-w-max px-1">
                        {categories.map((category) => {
                            const isActive = currentCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={cn(
                                        "px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-300",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                                        isPink && isActive && "bg-pink-500 shadow-pink-500/30",
                                        isCybernetic && "rounded-none border border-transparent",
                                        isCybernetic && isActive && "bg-cyan-950/50 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                                    )}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-white/5 w-full md:w-auto justify-between md:justify-start">
                    <button
                        onClick={() => handleSortChange("newest")}
                        className={cn(
                            "flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                            currentSort === 'newest'
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
                            isCybernetic && "rounded-none"
                        )}
                    >
                        En Yeniler
                    </button>
                    <button
                        onClick={() => handleSortChange("popular")}
                        className={cn(
                            "flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                            currentSort === 'popular'
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
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
