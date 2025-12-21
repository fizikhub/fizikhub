"use client";

import { useState, useEffect, useRef } from "react";
import { HeaderSpaceBackground } from "./header-space-background";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles, Atom, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateQuestionDialog } from "./create-question-dialog";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export function ModernForumHeader() {
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
        <div className="flex flex-col gap-4 mb-4">
            {/* Forum Header - Premium Enhanced */}
            <div className="relative border-2 border-border bg-card p-4 md:p-6 mb-2 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">

                {/* Dynamic Space Background */}
                <HeaderSpaceBackground />

                {/* Animated gradient overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Shimmer Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent pointer-events-none"
                    animate={{
                        x: ['-100%', '200%'],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 2,
                    }}
                />


                <div className="max-w-4xl mx-auto relative z-10 w-full">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                        {/* Enhanced Icon with Multiple Effects - Smaller on mobile */}
                        <motion.div
                            className="hidden md:block relative"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", duration: 0.8 }}
                        >
                            {/* Orbiting ring */}
                            <motion.div
                                className="absolute inset-0 border-2 border-primary/20 rounded-full"
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                }}
                            />

                            <div className="relative w-12 h-12 bg-primary border-2 border-black dark:border-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                                {/* Pulsing glow */}
                                <motion.div
                                    className="absolute inset-0 bg-primary/30 blur-lg"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <Atom className="w-6 h-6 text-primary-foreground relative z-10" />
                            </div>
                        </motion.div>

                        <div className="flex-1 space-y-3 w-full text-center md:text-left">
                            {/* Enhanced Title with Multiple Effects */}
                            <motion.div
                                className="space-y-1 md:space-y-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight relative">
                                    <span className="relative inline-block">
                                        Aklında Ne Var?
                                        {/* Animated underline */}
                                        <motion.div
                                            className="absolute -bottom-1 left-0 h-1 bg-primary"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ delay: 0.3, duration: 0.8 }}
                                        />
                                        {/* Glow effect on text */}
                                        <motion.div
                                            className="absolute inset-0 bg-primary/20 blur-xl"
                                            animate={{
                                                opacity: [0, 0.3, 0],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    </span>
                                </h1>
                                <motion.p
                                    className="text-sm md:text-base text-muted-foreground font-medium"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    Bilim topluluğu sorularını bekliyor.
                                </motion.p>
                            </motion.div>

                            {/* Premium Enhanced Input */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <CreateQuestionDialog
                                    trigger={
                                        <div className="w-full group/input cursor-pointer">
                                            <div className="relative border-2 border-border bg-background p-3 md:p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary hover:shadow-[4px_4px_0px_0px] hover:shadow-primary/50 hover:scale-[1.01] hover:-translate-y-0.5">
                                                {/* Enhanced focus ring */}
                                                <div className="absolute -inset-1 bg-primary/20 rounded-sm opacity-0 group-hover/input:opacity-100 blur-md transition-opacity duration-300" />

                                                {/* Multiple shine effects */}
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/input:opacity-100"
                                                    animate={{
                                                        x: ['-100%', '200%'],
                                                    }}
                                                    transition={{
                                                        duration: 1,
                                                        ease: "linear",
                                                    }}
                                                />

                                                {/* Icon with advanced animation */}
                                                <motion.div
                                                    className="p-2 bg-primary border-2 border-black dark:border-white relative z-10"
                                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                                                </motion.div>

                                                {/* Input Text with typing effect hint */}
                                                <div className="flex-1 flex items-center relative z-10">
                                                    <span className="text-muted-foreground font-semibold text-sm md:text-base group-hover/input:text-foreground transition-colors">
                                                        Sorunu sor...
                                                    </span>
                                                    <motion.span
                                                        className="ml-1 inline-block w-0.5 h-4 bg-primary"
                                                        animate={{
                                                            opacity: [0, 1, 0],
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            ease: "easeInOut",
                                                        }}
                                                    />
                                                </div>

                                                {/* Premium CTA Button */}
                                                <motion.div
                                                    className="hidden sm:block relative z-10"
                                                    whileHover={{ x: 5, scale: 1.05 }}
                                                >
                                                    <div className="relative px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-xs md:text-sm border-2 border-black dark:border-white group-hover/input:bg-primary group-hover/input:text-primary-foreground group-hover/input:border-primary transition-all flex items-center gap-2 overflow-hidden">
                                                        {/* Button shimmer */}
                                                        <motion.div
                                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                            animate={{
                                                                x: ['-100%', '200%'],
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                repeatDelay: 1,
                                                            }}
                                                        />
                                                        <span className="relative z-10">Yaz</span>
                                                        <ArrowRight className="w-3 h-3 group-hover/input:translate-x-1 transition-transform relative z-10" />
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    }
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories & Actions Bar - Compact */}
            <div className="flex flex-col md:flex-row gap-2 items-center justify-between sticky top-[60px] z-30 py-2 bg-background/95 backdrop-blur-sm border-b-2 border-border">
                {/* Categories - Horizontal Scroll */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide py-1">
                    <div className="flex gap-2 min-w-max px-1">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all duration-200",
                                    currentCategory === category
                                        ? "bg-primary text-primary-foreground border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] -translate-y-0.5"
                                        : "bg-background border-border hover:border-black dark:hover:border-white hover:-translate-y-0.5"
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex border-2 border-border bg-background">
                        <button
                            onClick={() => handleSortChange("newest")}
                            className={cn(
                                "px-3 py-1.5 text-xs font-bold uppercase transition-colors",
                                currentSort === "newest" ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-muted"
                            )}
                        >
                            YENİ
                        </button>
                        <div className="w-0.5 bg-border" />
                        <button
                            onClick={() => handleSortChange("popular")}
                            className={cn(
                                "px-3 py-1.5 text-xs font-bold uppercase transition-colors",
                                currentSort === "popular" ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-muted"
                            )}
                        >
                            POPÜLER
                        </button>
                    </div>

                    {/* Filter Icon for Mobile (New) */}
                    <div className="md:hidden relative z-10">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-none border-2 border-black dark:border-white"
                        >
                            <Search className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
}
