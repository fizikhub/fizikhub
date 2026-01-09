"use client";

import { useState, useEffect, useRef } from "react";
import { HeaderSpaceBackground } from "./header-space-background";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Atom, ArrowRight } from "lucide-react";
import { CosmicQuestionIcon } from "@/components/icons/cosmic-question";
import { Button } from "@/components/ui/button";
import { CreateQuestionDialog } from "./create-question-dialog";
import { motion } from "framer-motion";
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
        <div className="flex flex-col gap-4 mb-4">
            {/* Forum Header - Premium Enhanced */}
            <div className={cn(
                "relative border-2 border-border bg-card p-3 md:p-5 mb-2 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                isCybernetic && "cyber-card border-cyan-500/20 shadow-none !rounded-none",
                isPink && "rounded-[1.5rem] border-[#FF1493] shadow-[4px_4px_0px_0px_rgba(255,20,147,0.5)] bg-pink-50/50",
                isDarkPink && "rounded-[1.5rem] border-[#FF1493] shadow-[4px_4px_0px_0px_rgba(255,20,147,0.5)] bg-card"
            )}>

                {/* Dynamic Space Background */}
                {!isCute && <HeaderSpaceBackground />}

                {/* Cute Background Pattern */}
                {isCute && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(#FF1493 2px, transparent 2px)',
                            backgroundSize: '20px 20px'
                        }} />
                )}

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
                                            <div className={cn(
                                                "relative border-2 border-border bg-background p-3 md:p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary hover:shadow-[4px_4px_0px_0px] hover:shadow-primary/50 hover:scale-[1.01] hover:-translate-y-0.5",
                                                isCybernetic && "cyber-card border-cyan-500/30 shadow-none hover:shadow-[inset_0_0_20px_rgba(0,240,255,0.1)] hover:transform-none hover:translate-y-0 !rounded-none"
                                            )}>
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
                                                    <CosmicQuestionIcon className="w-4 h-4 text-primary-foreground" />
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
                                                    className="block relative z-10"
                                                    whileHover={{ x: 5, scale: 1.05 }}
                                                >
                                                    <div className="relative px-4 py-2 bg-primary text-black font-bold uppercase text-sm border-2 border-black dark:border-white transition-all flex items-center gap-2 overflow-hidden">
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
            <div className={cn(
                "flex flex-col md:flex-row gap-2 items-center justify-between sticky top-[60px] z-30 py-2 bg-background/95 backdrop-blur-sm border-b-2 border-border",
                isCybernetic && "!border-b border-cyan-500/20 !bg-black/80"
            )}>
                {/* Categories - Horizontal Scroll */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide py-1">
                    <div className="flex gap-2 min-w-max px-1">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all duration-200",
                                    isCybernetic && "cyber-button border-cyan-500/30 !rounded-none",
                                    currentCategory === category
                                        ? isCybernetic
                                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                                            : "bg-primary text-primary-foreground border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] -translate-y-0.5"
                                        : isCybernetic
                                            ? "bg-transparent hover:bg-cyan-500/5 hover:text-cyan-400"
                                            : "bg-background border-border hover:border-black dark:hover:border-white hover:-translate-y-0.5"
                                )}>

                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <div className={cn(
                        "flex border-2 border-border bg-background",
                        isCybernetic && "border-cyan-500/20 bg-transparent"
                    )}>
                        <button
                            onClick={() => handleSortChange("newest")}
                            className={cn(
                                "px-3 py-1.5 text-xs font-bold uppercase transition-colors",
                                isCybernetic && "font-mono tracking-wider",
                                currentSort === "newest"
                                    ? isCybernetic
                                        ? "bg-cyan-500/20 text-cyan-400"
                                        : "bg-black text-white dark:bg-white dark:text-black"
                                    : isCybernetic
                                        ? "text-cyan-600/70 hover:text-cyan-400 hover:bg-cyan-500/5"
                                        : "hover:bg-muted"
                            )}
                        >
                            YENİ
                        </button>
                        <div className={cn("w-0.5 bg-border", isCybernetic && "bg-cyan-500/20")} />
                        <button
                            onClick={() => handleSortChange("popular")}
                            className={cn(
                                "px-3 py-1.5 text-xs font-bold uppercase transition-colors",
                                isCybernetic && "font-mono tracking-wider",
                                currentSort === "popular"
                                    ? isCybernetic
                                        ? "bg-cyan-500/20 text-cyan-400"
                                        : "bg-black text-white dark:bg-white dark:text-black"
                                    : isCybernetic
                                        ? "text-cyan-600/70 hover:text-cyan-400 hover:bg-cyan-500/5"
                                        : "hover:bg-muted"
                            )}
                        >
                            POPÜLER
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
