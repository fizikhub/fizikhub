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
            {/* UNIFIED HERO CARD - POP STYLE */}
            <div className={cn(
                "relative rounded-xl overflow-hidden min-h-[140px] sm:min-h-[200px] flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 gap-6 sm:gap-10",
                "bg-neo-yellow border-[3px] border-black shadow-[4px_4px_0px_0px_#000]",
                "transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]"
            )}>
                {/* Background Decor - Halftone / Grid Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}
                />

                {/* LEFT: Branding & Text */}
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-2 shrink-0 md:max-w-lg">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-black leading-[0.9] drop-shadow-sm"
                    >
                        AKLINDA <span className="text-white text-stroke-black">NE VAR?</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="hidden sm:block text-black/80 font-bold text-sm sm:text-base max-w-sm leading-relaxed"
                    >
                        Topluluk seninle beyin fırtınası yapmaya hazır.
                    </motion.p>
                </div>

                {/* RIGHT: Action Input */}
                <div className="relative z-10 w-full md:max-w-xl">
                    <CreateQuestionDialog
                        trigger={
                            <div className={cn(
                                "w-full cursor-pointer group relative overflow-hidden",
                                "bg-white border-[3px] border-black hover:bg-neo-blue transition-all duration-200",
                                "rounded-xl h-14 sm:h-16 flex items-center px-4 sm:px-6 gap-4",
                                "shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
                            )}>
                                <div className={cn(
                                    "w-10 h-10 rounded-lg bg-neo-pink text-black flex items-center justify-center shrink-0 border-2 border-black",
                                    "group-hover:scale-110 transition-transform duration-200 group-hover:rotate-12"
                                )}>
                                    <PenLine className="w-5 h-5 stroke-[2.5px]" />
                                </div>

                                <span className="text-lg font-black text-black group-hover:text-black transition-colors truncate">
                                    Bugün neyi merak ediyorsun?
                                </span>

                                <div className="ml-auto">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-white group-hover:text-black border-2 border-black transition-colors"
                                    )}>
                                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300 stroke-[3px]" />
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </div>
            </div>

            {/* FILTERS BAR - REFINED & CLEAN */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between sticky top-[60px] z-30 py-2 sm:py-4 bg-background/95 backdrop-blur-md border-b-2 border-black/10 transition-all">
                {/* Categories */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide py-2">
                    <div className="flex gap-2 sm:gap-3 min-w-max px-1">
                        {categories.map((category) => {
                            const isActive = currentCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={cn(
                                        "px-4 py-2 text-xs font-black capitalize tracking-wide border-2 transition-all duration-200 rounded-full",
                                        isActive
                                            ? "bg-neo-pink text-white border-black shadow-[2px_2px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                                            : "bg-white text-black border-black hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                                    )}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border-2 border-black w-full md:w-auto shadow-[2px_2px_0px_0px_#000]">
                    <button
                        onClick={() => handleSortChange("newest")}
                        className={cn(
                            "flex-1 md:flex-none px-4 py-1.5 text-[10px] sm:text-xs font-black uppercase transition-all rounded-lg border-2 border-transparent",
                            currentSort === 'newest'
                                ? "bg-neo-blue text-black border-black"
                                : "text-gray-500 hover:text-black hover:bg-gray-100"
                        )}
                    >
                        En Yeniler
                    </button>
                    <button
                        onClick={() => handleSortChange("popular")}
                        className={cn(
                            "flex-1 md:flex-none px-4 py-1.5 text-[10px] sm:text-xs font-black uppercase transition-all rounded-lg border-2 border-transparent",
                            currentSort === 'popular'
                                ? "bg-neo-blue text-black border-black"
                                : "text-gray-500 hover:text-black hover:bg-gray-100"
                        )}
                    >
                        Popüler
                    </button>
                </div>
            </div>
        </div>
    );
}
