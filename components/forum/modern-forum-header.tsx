"use client";

import { useState, useEffect, useRef } from "react";
import { HeaderSpaceBackground } from "./header-space-background";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
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
            {/* CHALKBOARD HERO CARD */}
            <div className={cn(
                "relative rounded-xl overflow-hidden w-full",
                "bg-[#15201b] border-[4px] border-[#d4b483] shadow-[4px_4px_0_0_#1a1a1a]", // Dark Green Chalkboard + Wood Frame Border
                "min-h-[140px] flex flex-col items-center justify-center p-6 sm:p-8 gap-6 transition-all",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#1a1a1a]"
            )}>
                {/* Chalkboard Texture */}
                <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]" />
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-noise" />

                {/* Eraser Smudges (Static) */}
                <div className="absolute top-10 left-20 w-40 h-20 bg-white/5 blur-3xl rounded-full rotate-12 pointer-events-none" />
                <div className="absolute bottom-10 right-20 w-32 h-16 bg-white/5 blur-2xl rounded-full -rotate-6 pointer-events-none" />

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-between gap-6">

                    {/* Animated Chalk Text */}
                    <div className="text-center relative">
                        {/* Define SVG Filter for Chalk Distortion */}
                        <svg className="absolute w-0 h-0">
                            <filter id="chalk-distortion">
                                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                            </filter>
                        </svg>

                        <motion.h1
                            className="text-4xl sm:text-6xl font-black tracking-tighter text-white/90 uppercase leading-none font-mono relative"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <span className="relative inline-block">
                                {"AKLINDA".split("").map((char, i) => (
                                    <motion.span
                                        key={`l1-${i}`}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: i * 0.15,
                                            duration: 0.1,
                                            ease: "easeOut"
                                        }}
                                        className="inline-block relative"
                                        style={{ filter: "url(#chalk-distortion)" }}
                                    >
                                        {char}
                                        {/* Realistic Chalk Dust - Bursting Effect */}
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{
                                                opacity: [0, 0.8, 0],
                                                scale: [0.5, 1.5],
                                                y: [0, 20],
                                                x: [0, (Math.random() - 0.5) * 20]
                                            }}
                                            transition={{ delay: i * 0.15, duration: 1.2, ease: "easeOut" }}
                                            className="absolute bottom-1 left-1/2 w-8 h-8 bg-white/30 rounded-full blur-[8px] pointer-events-none"
                                        />
                                    </motion.span>
                                ))}
                            </span>
                            <br className="sm:hidden" />
                            <span className="relative inline-block sm:ml-4">
                                {"NE VAR?".split("").map((char, i) => (
                                    <motion.span
                                        key={`l2-${i}`}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 1.2 + (i * 0.15),
                                            duration: 0.1,
                                            ease: "easeOut"
                                        }}
                                        className={cn(
                                            "inline-block relative",
                                            char === " " ? "min-w-[1ch]" : ""
                                        )}
                                        style={{ filter: "url(#chalk-distortion)" }}
                                    >
                                        {char}
                                        {char !== " " && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{
                                                    opacity: [0, 0.8, 0],
                                                    scale: [0.5, 1.5],
                                                    y: [0, 20],
                                                    x: [0, (Math.random() - 0.5) * 20]
                                                }}
                                                transition={{ delay: 1.2 + (i * 0.15), duration: 1.2, ease: "easeOut" }}
                                                className="absolute bottom-1 left-1/2 w-8 h-8 bg-white/30 rounded-full blur-[8px] pointer-events-none"
                                            />
                                        )}
                                    </motion.span>
                                ))}

                                {/* Moving Chalk Cursor */}
                                <motion.div
                                    className="absolute -right-6 top-1/2 w-3 h-8 bg-white rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20"
                                    initial={{ opacity: 0, x: -200, y: -20, rotate: 15 }}
                                    animate={{
                                        opacity: [0, 1, 1, 0],
                                        x: [-200, 0],
                                        y: [0, -5, 5, 0],
                                        rotate: [15, 10, 20, 15]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        times: [0, 0.1, 0.9, 1],
                                        ease: "linear"
                                    }}
                                />

                                {/* Underline Animation */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 2.6, duration: 0.4, type: "spring" }}
                                    className="absolute -bottom-2 left-0 right-0 h-1.5 bg-white/80 rounded-full origin-left opacity-80"
                                    style={{
                                        filter: "url(#chalk-distortion)",
                                        boxShadow: "0 0 4px rgba(255,255,255,0.5)"
                                    }}
                                />
                            </span>
                        </motion.h1>
                    </div>

                    {/* Input Trigger (Chalk Panel Style) */}
                    <div className="w-full md:max-w-xl">
                        <CreateQuestionDialog
                            trigger={
                                <div className={cn(
                                    "group relative w-full cursor-pointer h-14 sm:h-16 rounded-lg",
                                    "bg-white/5 border-[2px] border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-200",
                                    "flex items-center px-4 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                                )}>
                                    {/* Icon Box */}
                                    <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20 mr-4 group-hover:rotate-12 transition-transform">
                                        <Sparkles className="w-5 h-5 opacity-80" />
                                    </div>

                                    {/* Placeholder */}
                                    <span className="text-lg font-medium text-white/70 group-hover:text-white transition-colors font-mono">
                                        Bugün neyi merak ediyorsun?
                                    </span>

                                    {/* Arrow Action */}
                                    <div className="ml-auto text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                                        <ArrowRight className="w-5 h-5" />
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
