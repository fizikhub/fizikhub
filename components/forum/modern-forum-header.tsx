"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, Search, X, CheckCircle2, MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";
import { m as motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const CreateQuestionDialog = dynamic(
    () => import("./create-question-dialog").then((mod) => mod.CreateQuestionDialog),
    {
        ssr: false,
        loading: () => (
            <div
                className={cn(
                    "group relative w-full cursor-pointer h-14 sm:h-16 rounded-lg",
                    "bg-white/5 border-[2px] border-white/30 transition-all duration-200",
                    "flex items-center px-4 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                )}
            >
                <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20 mr-4">
                    <Sparkles className="w-5 h-5 opacity-80" />
                </div>
                <span className="text-lg font-medium text-white/70 transition-colors font-mono">
                    Bugün neyi merak ediyorsun?
                </span>
                <div className="ml-auto text-white/50 transition-all duration-300">
                    <ArrowRight className="w-5 h-5" />
                </div>
            </div>
        ),
    }
);

export function ModernForumHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [results, setResults] = useState<{ id: number; title: string; slug: string; category: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const currentCategory = searchParams.get("category") || "Tümü";
    const currentSort = searchParams.get("sort") || "newest";
    const currentFilter = searchParams.get("filter");
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
    }, [searchQuery, supabase]);

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
        "Fizik",
        "Kuantum",
        "Astrofizik",
        "Mekanik",
        "Termodinamik",
        "Biyoloji",
        "Kimya",
        "Matematik",
        "Edebiyat",
        "Felsefe",
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(false);
        const params = new URLSearchParams(searchParams.toString());

        params.delete("page");

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
        params.delete("page");
        router.push(`/forum?${params.toString()}`);
    };

    const handleSortChange = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", sort);
        params.delete("page");
        router.push(`/forum?${params.toString()}`);
    };

    const handleFilterChange = (filter: "solved" | "unanswered" | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (filter) {
            params.set("filter", filter);
        } else {
            params.delete("filter");
        }
        params.delete("page");
        router.push(`/forum?${params.toString()}`);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setShowResults(false);
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        params.delete("page");
        router.push(`/forum?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* CHALKBOARD HERO CARD */}
            <div className={cn(
                "relative rounded-xl overflow-hidden w-full",
                "bg-[#15201b] border-[3px] sm:border-[4px] border-[#d4b483] shadow-[3px_3px_0_0_#1a1a1a] sm:shadow-[4px_4px_0_0_#1a1a1a]", // Dark Green Chalkboard + Wood Frame Border
                "min-h-[118px] sm:min-h-[150px] flex flex-col items-center justify-center p-4 sm:p-7 gap-4 transition-all",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#1a1a1a]"
            )}>
                {/* Custom SVG Chalkboard Background */}
                <div className="absolute inset-0 bg-[#2A3335] pointer-events-none" />

                {/* Chalk Dust Texture */}
                <div className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%), 
                                           url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
                    }}
                />

                {/* Handwritten Formulas SVG - Updated for Mobile Density & "Fainter" Look */}
                <div className="absolute inset-0 opacity-40 md:opacity-20 pointer-events-none select-none overflow-hidden">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <filter id="chalk-stroke">
                                <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                            </filter>
                        </defs>
                        <g stroke="white" strokeWidth="2.5" fill="none" style={{ filter: "url(#chalk-stroke)" }} opacity="0.8">
                            {/* Schrödinger Equation (Center / Prominent) */}
                            <text x="50%" y="30%" fill="white" fontSize="24" fontFamily="serif" stroke="none" textAnchor="middle">iℏ∂Ψ/∂t = ĤΨ</text>

                            {/* E = mc^2 (Top Left) */}
                            <text x="15%" y="25%" fill="white" fontSize="20" fontFamily="monospace" stroke="none">E = mc²</text>

                            {/* Maxwell: Gauss Law (Top Right) */}
                            <text x="80%" y="25%" fill="white" fontSize="18" fontFamily="monospace" stroke="none">∇⋅E = ρ/ε₀</text>

                            {/* Integral (Left) */}
                            <path d="M120,150 Q110,150 110,160 V190 Q110,200 120,200" />
                            <text x="130" y="185" fill="white" fontSize="20" fontFamily="monospace" stroke="none">∫ f(x)dx</text>

                            {/* F = dp/dt (Bottom Left) */}
                            <text x="20%" y="80%" fill="white" fontSize="24" fontFamily="monospace" stroke="none">F = dp/dt</text>

                            {/* Heisenberg Uncertainty (Right Mid) */}
                            <text x="75%" y="65%" fill="white" fontSize="18" fontFamily="monospace" stroke="none">ΔxΔp ≥ ℏ/2</text>

                            {/* Circuit Symbol (Bottom Right) */}
                            <path d="M600,220 L620,220 L625,210 L635,230 L645,210 L655,230 L660,220 L680,220" />

                            {/* Wave Function Psi Symbol Large (Background - Very Faint) */}
                            <text x="15%" y="90%" fill="white" fontSize="120" fontFamily="serif" stroke="none" opacity="0.1">Ψ</text>

                            {/* Standard Model Lagrangian Term (Middle Right - Complex looking) */}
                            <text x="65%" y="85%" fill="white" fontSize="14" fontFamily="monospace" stroke="none">-¼F_μνF^μν</text>

                            {/* Thermodynamics (Middle Left) */}
                            <text x="25%" y="65%" fill="white" fontSize="18" fontFamily="monospace" stroke="none">dS ≥ 0</text>

                            {/* Additional Formulas for Mobile Density */}
                            <text x="45%" y="15%" fill="white" fontSize="16" fontFamily="monospace" stroke="none">F = G(m1m2/r²)</text>
                            <text x="15%" y="55%" fill="white" fontSize="16" fontFamily="monospace" stroke="none">v = λf</text>
                            <text x="75%" y="45%" fill="white" fontSize="20" fontFamily="monospace" stroke="none">PV = nRT</text>
                            <text x="40%" y="85%" fill="white" fontSize="22" fontFamily="monospace" stroke="none">E = hν</text>
                            <text x="80%" y="90%" fill="white" fontSize="18" fontFamily="monospace" stroke="none">q = mcΔT</text>

                            {/* Random Strokes / Eraser marks */}
                            <path d="M300,250 Q400,230 500,260" opacity="0.3" strokeWidth="8" stroke="rgba(255,255,255,0.2)" />
                            <path d="M500,50 Q600,70 700,40" opacity="0.3" strokeWidth="15" stroke="rgba(255,255,255,0.1)" />
                        </g>

                        {/* Scattered Numbers & Constants */}
                        <g fill="white" opacity="0.2" fontSize="14" fontFamily="monospace" style={{ filter: "url(#chalk-stroke)" }}>
                            <text x="22%" y="15%">π</text>
                            <text x="82%" y="80%">c</text>
                            <text x="45%" y="90%">h</text>
                            <text x="65%" y="15%">G</text>
                            <text x="40%" y="45%">∂</text>
                            <text x="60%" y="60%">∑</text>
                        </g>
                    </svg>
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-between gap-4 sm:gap-5">

                    {/* Animated Chalk Text */}
                    <div className="text-center relative">
                        {/* Define SVG Filter for Chalk Distortion */}
                        <svg className="absolute w-0 h-0">
                            <filter id="chalk-distortion">
                                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                            </filter>
                        </svg>

                        <motion.div
                            className="text-[2rem] min-[390px]:text-4xl sm:text-6xl font-black tracking-tighter text-white/90 uppercase leading-none font-mono relative"
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
                                        // Removed expensive filter during animation for mobile performance
                                        style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.5)" }}
                                    >
                                        {char}
                                        {/* Realistic Chalk Dust - Bursting Effect */}
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{
                                                opacity: [0, 0.8, 0],
                                                scale: [0.5, 1.5],
                                                y: [0, 20],
                                                x: [0, ((i * 17) % 21) - 10]
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
                                        // Removed expensive filter here too
                                        style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.5)" }}
                                    >
                                        {char}
                                        {char !== " " && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{
                                                    opacity: [0, 0.8, 0],
                                                    scale: [0.5, 1.5],
                                                    y: [0, 20],
                                                    x: [0, ((i * 23) % 21) - 10]
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
                        </motion.div>
                    </div>

                    {/* Input Trigger (Chalk Panel Style) */}
                    <div className="w-full md:max-w-xl">
                        <CreateQuestionDialog
                            defaultOpen={searchParams.get("create") === "true"}
                            trigger={
                                <div className={cn(
                                    "group relative w-full cursor-pointer min-h-12 sm:h-15 rounded-lg",
                                    "bg-white/5 border-[2px] border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-200",
                                    "flex items-center px-3 sm:px-4 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                                )}>
                                    {/* Icon Box */}
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20 mr-3 sm:mr-4 group-hover:rotate-12 transition-transform shrink-0">
                                        <Sparkles className="w-5 h-5 opacity-80" />
                                    </div>

                                    {/* Placeholder */}
                                    <span className="text-sm min-[390px]:text-base sm:text-lg font-medium text-white/70 group-hover:text-white transition-colors font-mono truncate">
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
            <div className="flex flex-col gap-3 sticky top-[58px] z-30 py-3 sm:py-4 bg-background/95 backdrop-blur-md transition-all border-y border-black/5 dark:border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-start">
                    <div ref={searchRef} className="relative w-full">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                onFocus={() => searchQuery.trim().length > 2 && setShowResults(true)}
                                type="search"
                                enterKeyHint="search"
                                placeholder="Forumda soru ara..."
                                className={cn(
                                    "h-12 w-full rounded-[10px] border-[2.5px] border-black dark:border-zinc-600 bg-card pl-11 pr-24",
                                    "text-base font-semibold text-foreground placeholder:text-muted-foreground",
                                    "shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.16)]",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                )}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    aria-label="Aramayı temizle"
                                    className="absolute right-[4.9rem] top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[8px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    <X className="h-4.5 w-4.5" />
                                </button>
                            )}
                            <button
                                type="submit"
                                className="absolute right-1 top-1/2 min-h-10 -translate-y-1/2 rounded-[8px] border-2 border-black bg-[#EAB308] px-3 text-[11px] font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_0px_#000] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                            >
                                Ara
                            </button>
                        </form>

                        {showResults && (
                            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-[10px] border-[2.5px] border-black bg-card shadow-[4px_4px_0px_0px_#000] dark:border-zinc-600 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.18)]">
                                {isSearching ? (
                                    <div className="px-4 py-3 text-sm font-bold text-muted-foreground">Aranıyor...</div>
                                ) : results.length > 0 ? (
                                    results.map((result) => (
                                        <Link
                                            key={result.id}
                                            prefetch={false}
                                            href={`/forum/${result.id}`}
                                            className="flex min-h-12 items-center justify-between gap-3 border-b border-black/10 px-4 py-3 text-sm font-black transition-colors last:border-b-0 hover:bg-[#EAB308]/15 dark:border-white/10"
                                        >
                                            <span className="line-clamp-1">{result.title}</span>
                                            <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">{result.category}</span>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm font-bold text-muted-foreground">Sonuç yok. Enter ile geniş arama yap.</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 lg:flex">
                        <button
                            onClick={() => handleFilterChange(currentFilter === "solved" ? null : "solved")}
                            className={cn(
                                "flex min-h-12 items-center justify-center gap-2 rounded-[10px] border-[2.5px] px-3 text-[11px] font-black uppercase tracking-wider transition-all",
                                currentFilter === "solved"
                                    ? "border-black bg-[#EAB308] text-black shadow-[2px_2px_0px_0px_#000]"
                                    : "border-black bg-card text-muted-foreground hover:bg-muted dark:border-zinc-600"
                            )}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Çözülen
                        </button>
                        <button
                            onClick={() => handleFilterChange(currentFilter === "unanswered" ? null : "unanswered")}
                            className={cn(
                                "flex min-h-12 items-center justify-center gap-2 rounded-[10px] border-[2.5px] px-3 text-[11px] font-black uppercase tracking-wider transition-all",
                                currentFilter === "unanswered"
                                    ? "border-black bg-[#EAB308] text-black shadow-[2px_2px_0px_0px_#000]"
                                    : "border-black bg-card text-muted-foreground hover:bg-muted dark:border-zinc-600"
                            )}
                        >
                            <MessageSquare className="h-4 w-4" />
                            Cevapsız
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between">
                {/* Categories */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide py-1">
                    <div className="flex gap-2 sm:gap-2.5 min-w-max px-1">
                        {categories.map((category) => {
                            const isActive = currentCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={cn(
                                        "min-h-11 px-4 py-2 text-[11px] sm:text-xs font-black uppercase tracking-wider border-[2.5px] transition-all duration-200 rounded-full relative",
                                        isActive
                                            ? "bg-[#EAB308] text-black border-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                                            : "bg-card text-foreground border-black dark:border-zinc-600 hover:border-black hover:bg-[#EAB308]/10 hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                                    )}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-1 bg-card p-1 rounded-xl border-[2.5px] border-black dark:border-zinc-600 w-full md:w-auto shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                    <button
                        onClick={() => handleSortChange("newest")}
                        className={cn(
                            "flex-1 md:flex-none min-h-10 px-4 py-1.5 text-[10px] sm:text-xs font-black uppercase transition-all rounded-lg border-2",
                            currentSort === 'newest'
                                ? "bg-[#EAB308] text-black border-black shadow-[1px_1px_0px_0px_#000]"
                                : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted"
                        )}
                    >
                        En Yeniler
                    </button>
                    <button
                        onClick={() => handleSortChange("popular")}
                        className={cn(
                            "flex-1 md:flex-none min-h-10 px-4 py-1.5 text-[10px] sm:text-xs font-black uppercase transition-all rounded-lg border-2",
                            currentSort === 'popular'
                                ? "bg-[#EAB308] text-black border-black shadow-[1px_1px_0px_0px_#000]"
                                : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted"
                        )}
                    >
                        Popüler
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}
