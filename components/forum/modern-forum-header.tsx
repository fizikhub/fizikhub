"use client";

import { useState, useEffect, useRef } from "react";
import { HeaderSpaceBackground } from "./header-space-background";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { CreateQuestionDialog } from "./create-question-dialog";
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
            {/* DARK SCIENCE BRUTALIST HERO CARD */}
            <div className={cn(
                "relative rounded-xl overflow-hidden w-full",
                "bg-[#18181b] border-[3px] border-white shadow-[4px_4px_0_0_#3B82F6]", // Dark Base + White Border + Blue Shadow
                "min-h-[120px] sm:min-h-[160px] flex flex-col items-center justify-center p-6 sm:p-8 gap-6 transition-all",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#3B82F6]"
            )}>
                {/* Background Decor: Technical Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                />

                {/* Diagonal Stripes Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(45deg,#fff,#fff_10px,transparent_10px,transparent_20px)]" />

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-between gap-6 md:gap-10">

                    {/* Header Text */}
                    <div className="text-center md:text-left shrink-0">
                        <h1 className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white uppercase leading-none transform -rotate-1 drop-shadow-[2px_2px_0_#3B82F6]">
                            AKLINDA <br className="sm:hidden" />
                            <span className="bg-[#3B82F6] text-white px-2 inline-block transform rotate-2 mt-1 border-2 border-white shadow-[2px_2px_0_0_#fff]">NE VAR?</span>
                        </h1>
                    </div>

                    {/* Input Trigger (Dark Science Style) */}
                    <div className="w-full md:max-w-xl">
                        <CreateQuestionDialog
                            trigger={
                                <div className={cn(
                                    "group relative w-full cursor-pointer h-14 sm:h-16 rounded-lg",
                                    "bg-[#09090b] border-[3px] border-white hover:border-[#3B82F6] transition-all duration-200",
                                    "flex items-center px-4 shadow-[4px_4px_0_0_#fff] hover:shadow-[2px_2px_0_0_#3B82F6] hover:translate-x-[2px] hover:translate-y-[2px]"
                                )}>
                                    {/* Icon Box */}
                                    <div className="w-10 h-10 rounded bg-[#3B82F6] text-white flex items-center justify-center border-2 border-white mr-4 group-hover:rotate-6 transition-transform">
                                        <Sparkles className="w-5 h-5 stroke-[2.5px]" />
                                    </div>

                                    {/* Placeholder */}
                                    <span className="text-lg font-bold text-white group-hover:text-[#3B82F6] transition-colors">
                                        Bugün neyi merak ediyorsun?
                                    </span>

                                    {/* Arrow Action */}
                                    <div className="ml-auto bg-white text-black p-1 rounded border-2 border-black group-hover:bg-[#3B82F6] group-hover:text-white group-hover:border-white transition-all duration-300">
                                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                    </div>
                                </div>
                            }
                        />
                    </div>

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
