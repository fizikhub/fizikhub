"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles, Atom, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateQuestionDialog } from "./create-question-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";

export function ModernForumHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const currentCategory = searchParams.get("category") || "Tümü";
    const currentSort = searchParams.get("sort") || "newest";
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    // Fix: Initialize supabase client once
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

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setMousePosition({ x, y });
    };

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
        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Hero & Search Section */}
            <motion.div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border border-white/10 shadow-xl sm:shadow-2xl shadow-primary/5 p-6 sm:p-8 md:p-12 text-center group"
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

                {/* Floating Orbs */}
                <motion.div
                    className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
                    animate={{
                        x: mousePosition.x * -50,
                        y: mousePosition.y * -50,
                    }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
                    animate={{
                        x: mousePosition.x * 50,
                        y: mousePosition.y * 50,
                    }}
                />

                <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-8">
                    <div className="space-y-1 sm:space-y-2">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4 ring-1 ring-primary/20 backdrop-blur-sm"
                        >
                            <Atom className="w-5 h-5 text-primary mr-2 animate-spin-slow" />
                            <span className="text-xs font-medium text-primary">FizikHub Topluluğu</span>
                        </motion.div>

                        <motion.h1
                            className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Bilim Topluluğu
                        </motion.h1>

                        <motion.p
                            className="text-sm sm:text-base md:text-lg text-muted-foreground"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Merak ettiklerini sor, tartışmalara katıl ve bilimin derinliklerini keşfet.
                        </motion.p>
                    </div>

                    <motion.div
                        ref={searchRef}
                        className="relative group max-w-lg mx-auto w-full"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <form onSubmit={handleSearch}>
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center">
                                <Search className="absolute left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Merak ettiğin konuyu ara..."
                                    className="pl-10 sm:pl-12 pr-20 sm:pr-24 h-11 sm:h-14 rounded-full bg-background/80 backdrop-blur-xl border-white/10 shadow-lg text-sm sm:text-base md:text-lg focus:ring-2 focus:ring-primary/20 transition-all w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => {
                                        if (searchQuery.length > 2 && results.length > 0) setShowResults(true);
                                    }}
                                />
                                <div className="absolute right-1.5 sm:right-2">
                                    <Button size="sm" type="submit" className="rounded-full px-3 sm:px-4 md:px-6 h-8 sm:h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105 text-xs sm:text-sm group-hover:shadow-primary/25">
                                        Ara
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {/* Instant Search Results */}
                        <AnimatePresence>
                            {showResults && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-background/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                                >
                                    {isSearching ? (
                                        <div className="p-4 text-center text-muted-foreground text-sm">
                                            Aranıyor...
                                        </div>
                                    ) : results.length > 0 ? (
                                        <div className="py-2">
                                            {results.map((result) => (
                                                <button
                                                    key={result.id}
                                                    onClick={() => {
                                                        router.push(`/forum/${result.id}`);
                                                        setShowResults(false);
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 group/item"
                                                >
                                                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                                                        <Sparkles className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate text-foreground/90">{result.title}</p>
                                                        <p className="text-xs text-muted-foreground">{result.category}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-muted-foreground text-sm">
                                            Sonuç bulunamadı.
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.div>

            {/* Categories & Actions Bar */}
            <motion.div
                className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between sticky top-[60px] sm:top-[72px] z-30 py-2 -mx-4 px-4 md:mx-0 md:px-0 bg-background/95 backdrop-blur-xl border-b md:border-none border-border/40 md:bg-transparent md:backdrop-blur-none md:static"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                {/* Categories - Horizontal Scroll */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex gap-1.5 sm:gap-2 min-w-max p-0.5 sm:p-1">
                        {categories.map((category, index) => (
                            <motion.button
                                key={category}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.05 }}
                                onClick={() => handleCategoryChange(category)}
                                className={`
                                    px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border whitespace-nowrap relative overflow-hidden
                                    ${currentCategory === category
                                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                                        : "bg-card/50 text-muted-foreground border-border/50 hover:bg-card hover:text-foreground hover:border-primary/20 hover:shadow-md"
                                    }
                                `}
                            >
                                {currentCategory === category && (
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        layoutId="activeCategory"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{category}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-center md:justify-end">
                    <div className="flex bg-card/50 p-0.5 sm:p-1 rounded-full border border-border/50 backdrop-blur-sm shadow-sm">
                        <button
                            onClick={() => handleSortChange("newest")}
                            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${currentSort === "newest" ? "bg-background shadow-sm text-foreground ring-1 ring-black/5" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Yeni
                        </button>
                        <button
                            onClick={() => handleSortChange("popular")}
                            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${currentSort === "popular" ? "bg-background shadow-sm text-foreground ring-1 ring-black/5" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Popüler
                        </button>
                    </div>

                    <div className="h-6 sm:h-8 w-px bg-border/50 mx-0.5 sm:mx-1 hidden md:block" />

                    <div className="relative z-10">
                        <CreateQuestionDialog />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
