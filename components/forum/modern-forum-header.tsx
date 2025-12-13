"use client";

import { useState, useEffect, useRef } from "react";
import { HeaderSpaceBackground } from "./header-space-background";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles, Atom, Zap, MessageSquare, Plus, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateQuestionDialog } from "./create-question-dialog";
import { motion, AnimatePresence } from "framer-motion";
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

    // Mouse tracking for 3D tilt effect
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
    };

    return (
        <div className="flex flex-col gap-8 mb-8">
            {/* Forum Header - Premium Enhanced */}
            <div className="relative border-2 border-border bg-card p-8 md:p-12 mb-4 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">

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
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Enhanced Icon with Multiple Effects */}
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

                            <div className="relative w-16 h-16 bg-primary border-2 border-black dark:border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
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
                                <Atom className="w-8 h-8 text-primary-foreground relative z-10" />
                            </div>
                        </motion.div>

                        <div className="flex-1 space-y-5 w-full text-center md:text-left">
                            {/* Enhanced Title with Multiple Effects */}
                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight relative">
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
                                    className="text-base md:text-lg text-muted-foreground font-medium"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    Her sorunun cevabı yıldızların arasında gizli. <span className="text-foreground font-bold">Sor, keşfet, öğren.</span>
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
                                            <div className="relative border-2 border-border bg-background p-4 md:p-5 flex items-center gap-4 transition-all duration-300 hover:border-primary hover:shadow-[6px_6px_0px_0px] hover:shadow-primary/50 hover:scale-[1.02] hover:-translate-y-1">
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
                                                    className="p-2.5 bg-primary border-2 border-black dark:border-white relative z-10"
                                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                                                </motion.div>

                                                {/* Input Text with typing effect hint */}
                                                <div className="flex-1 flex items-center relative z-10">
                                                    <span className="text-muted-foreground font-semibold text-base md:text-lg group-hover/input:text-foreground transition-colors">
                                                        Sorunu sor...
                                                    </span>
                                                    <motion.span
                                                        className="ml-1 inline-block w-0.5 h-5 bg-primary"
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
                                                    <div className="relative px-5 py-2 bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-sm border-2 border-black dark:border-white group-hover/input:bg-primary group-hover/input:text-primary-foreground group-hover/input:border-primary transition-all flex items-center gap-2 overflow-hidden">
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
                                                        <ArrowRight className="w-4 h-4 group-hover/input:translate-x-1 transition-transform relative z-10" />
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

            {/* Categories & Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[70px] z-30 py-4 bg-background/95 backdrop-blur-sm border-b-2 border-border">
                {/* Categories - Horizontal Scroll */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 min-w-max px-1">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={cn(
                                    "px-4 py-2 text-sm font-bold uppercase border-2 transition-all duration-200",
                                    currentCategory === category
                                        ? "bg-primary text-primary-foreground border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -translate-y-1"
                                        : "bg-background border-border hover:border-black dark:hover:border-white hover:-translate-y-0.5"
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex border-2 border-border bg-background">
                        <button
                            onClick={() => handleSortChange("newest")}
                            className={cn(
                                "px-4 py-2 text-sm font-bold uppercase transition-colors",
                                currentSort === "newest" ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-muted"
                            )}
                        >
                            YENİ
                        </button>
                        <div className="w-0.5 bg-border" />
                        <button
                            onClick={() => handleSortChange("popular")}
                            className={cn(
                                "px-4 py-2 text-sm font-bold uppercase transition-colors",
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
                            className="rounded-none border-2 border-black dark:border-white"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
}
