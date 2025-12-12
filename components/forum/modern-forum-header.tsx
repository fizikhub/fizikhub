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

    return (
        <div className="flex flex-col gap-8 mb-8">
            {/* New Conversational Header - Neo-Brutalist Style */}
            <div className="relative border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6 md:p-8 mb-4 overflow-hidden group min-h-[300px] flex items-center bg-transparent">

                {/* Dynamic Space Background (No UFOs) */}
                <HeaderSpaceBackground />

                <div className="max-w-4xl mx-auto relative z-10 w-full">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* User Avatar - Brutalist */}
                        <div className="hidden md:flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-primary border-2 border-black dark:border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                <Atom className="w-8 h-8 text-primary-foreground" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-6 w-full text-center md:text-left">
                            {/* Greeting & Prompt */}
                            <div className="space-y-3">
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.15em] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                                    AKLINDA NE VAR?
                                </h1>
                                <p className="text-gray-100 font-bold md:text-xl max-w-2xl drop-shadow-md">
                                    Bilim topluluğu sorularını bekliyor. Cevaplar yıldızların arasında.
                                </p>
                            </div>

                            {/* Enhanced Input Trigger - More Dynamic */}
                            <CreateQuestionDialog
                                trigger={
                                    <div className="w-full bg-black/60 backdrop-blur-lg border-2 border-white/60 hover:border-primary p-1.5 flex items-center transition-all duration-300 cursor-pointer group/input hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.6)] active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)]">
                                        <div className="w-full bg-gradient-to-r from-black/70 to-black/50 p-4 md:p-5 flex items-center gap-4">
                                            <div className="p-3 bg-primary border-2 border-white group-hover/input:scale-110 group-hover/input:rotate-12 transition-all duration-300">
                                                <Sparkles className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1 flex items-center gap-3">
                                                <span className="text-primary font-black text-xl">{'>'}</span>
                                                <span className="text-white font-black text-xl uppercase tracking-wider flex-1 text-left group-hover/input:text-primary transition-colors">
                                                    Sorunu Sor...
                                                </span>
                                                <div className="w-4 h-7 bg-primary animate-pulse hidden md:block" />
                                            </div>
                                            <div className="hidden sm:flex items-center gap-2">
                                                <div className="px-5 py-2.5 bg-white text-black text-sm font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover/input:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] group-hover/input:-translate-x-0.5 group-hover/input:-translate-y-0.5 transition-all">
                                                    ENTER
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            />
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
