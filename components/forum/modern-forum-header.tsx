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
            <div className="relative border border-gray-300/40 dark:border-gray-700/40 rounded-3xl shadow-[5px_5px_0px_0px_rgba(0,0,0,0.08)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.08)] p-8 md:p-10 mb-4 overflow-hidden group min-h-[320px] flex items-center bg-gradient-to-br from-background via-background to-primary/5">

                {/* Dynamic Space Background (No UFOs) */}
                <HeaderSpaceBackground />

                <div className="max-w-4xl mx-auto relative z-10 w-full">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* User Avatar - Softened */}
                        <div className="hidden md:flex flex-col items-center gap-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 border border-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-105 transition-transform duration-500">
                                <Atom className="w-10 h-10 text-white animate-pulse" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-6 w-full text-center md:text-left">
                            {/* Greeting & Prompt - More Elegant */}
                            <div className="space-y-4">
                                <div className="inline-block">
                                    <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        Aklında Ne Var?
                                    </h1>
                                    <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-full mt-2 animate-in slide-in-from-left duration-1000" />
                                </div>
                                <p className="text-gray-200/90 font-medium text-lg md:text-xl max-w-2xl drop-shadow-sm">
                                    Bilim topluluğu sorularını bekliyor. <span className="text-primary font-semibold">Cevaplar yıldızların arasında.</span>
                                </p>
                            </div>

                            {/* Enhanced Input Trigger - Modern & Elegant */}
                            <CreateQuestionDialog
                                trigger={
                                    <div className="w-full group/input cursor-pointer">
                                        <div className="relative bg-gradient-to-r from-black/40 via-black/30 to-black/40 backdrop-blur-xl border border-white/30 rounded-2xl p-1 hover:border-primary/60 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
                                            <div className="bg-gradient-to-br from-black/60 to-black/40 rounded-xl p-5 md:p-6 flex items-center gap-4">
                                                {/* Icon */}
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl group-hover/input:blur-2xl transition-all" />
                                                    <div className="relative p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl group-hover/input:scale-110 group-hover/input:rotate-6 transition-all duration-500 shadow-lg">
                                                        <Sparkles className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>

                                                {/* Input Area */}
                                                <div className="flex-1 flex items-center gap-3">
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <span className="text-primary font-bold text-lg">›</span>
                                                        <span className="text-white/90 font-semibold text-lg tracking-wide flex-1 text-left group-hover/input:text-white transition-colors">
                                                            Sorunu sor, keşfet...
                                                        </span>
                                                    </div>
                                                    <div className="w-0.5 h-6 bg-primary/60 animate-pulse hidden md:block" />
                                                </div>

                                                {/* CTA Button */}
                                                <div className="hidden sm:flex items-center gap-2">
                                                    <div className="relative group/cta">
                                                        <div className="absolute inset-0 bg-primary/50 rounded-lg blur group-hover/input:blur-md transition-all" />
                                                        <div className="relative px-6 py-2.5 bg-gradient-to-r from-white to-gray-100 text-black rounded-lg text-sm font-bold uppercase tracking-wider shadow-md group-hover/input:shadow-lg group-hover/input:scale-105 transition-all flex items-center gap-2">
                                                            Yaz
                                                            <ArrowRight className="w-4 h-4 group-hover/input:translate-x-1 transition-transform" />
                                                        </div>
                                                    </div>
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
