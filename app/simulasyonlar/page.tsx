"use client";

import { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Search, Trophy, Zap, ChevronRight } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { cn } from "@/lib/utils";
import { simulations } from "@/components/simulations/data";
import { TutorialOverlay, TutorialStep } from "@/components/ui/tutorial-overlay";
import { Badge } from "@/components/ui/badge";

export default function SimulasyonlarPage() {
    const [filter, setFilter] = useState("Tümü");
    const [search, setSearch] = useState("");
    const [showTutorial, setShowTutorial] = useState(false);

    // Filter simulations
    const filteredSims = simulations.filter(sim => {
        const matchesFilter = filter === "Tümü" || sim.difficulty === filter || sim.tags.includes(filter);
        const matchesSearch = sim.title.toLowerCase().includes(search.toLowerCase()) ||
            sim.description.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Tutorial Steps
    const tutorialSteps: TutorialStep[] = [
        {
            targetId: "sims-header",
            title: "Hoş Geldin Fizikçi! 👋",
            description: "Burası senin özel laboratuvarın. Fizik kurallarını yeniden yazacağın yer.",
        },
        {
            targetId: "sims-stats",
            title: "Gelişimini İzle 🏆",
            description: "Yaptığın deneylerle geliş, XP kazan. Usta bir teorik fizikçi ol!",
        },
        {
            targetId: "sims-filters",
            title: "Laboratuvarı Filtrele 🔍",
            description: "Optik, mekanik veya kuantum... Neyi keşfetmek istersen anında bul.",
        },
        {
            targetId: "sims-grid",
            title: "Deneylere Başla 🚀",
            description: "Bir deney seç ve simülasyonu başlat. Gerçeklik bükülmeye hazır!",
        }
    ];

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem("fizikhub-sims-tutorial");
        if (!hasSeenTutorial) {
            setTimeout(() => setShowTutorial(true), 800);
        }
    }, []);

    const handleTutorialComplete = () => {
        setShowTutorial(false);
        localStorage.setItem("fizikhub-sims-tutorial", "true");
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-24 font-sans selection:bg-foreground selection:text-background relative">
            
            <TutorialOverlay
                steps={tutorialSteps}
                isActive={showTutorial}
                onComplete={handleTutorialComplete}
                onSkip={handleTutorialComplete}
            />

            {/* Neo-brutalist Header */}
            <div id="sims-header" className="sticky top-0 z-40 bg-background border-b-2 border-foreground/10 transition-all">
                <div className="max-w-[1400px] mx-auto px-4 py-4 md:py-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 md:gap-6">
                        <ViewTransitionLink href="/">
                            <div className="flex items-center justify-center w-11 h-11 bg-card border-2 border-foreground/10 hover:-translate-y-0.5 active:translate-y-0 transition-all rounded-lg group cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.15)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.15)]">
                                <ArrowLeft className="w-5 h-5 text-foreground group-hover:text-foreground/70 transition-colors" />
                            </div>
                        </ViewTransitionLink>
                        <div className="flex flex-col">
                            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
                                Simülasyon Merkezi
                                <SparkleIcon />
                            </h1>
                            <p className="text-muted-foreground text-[11px] md:text-xs font-bold uppercase tracking-widest mt-1">
                                v2.0 • Yüksek Kalibre Deney Alanı
                            </p>
                        </div>
                    </div>

                    {/* Stats Widget */}
                    <div id="sims-stats" className="hidden md:flex items-center gap-4 bg-card px-5 py-2.5 rounded-lg border-2 border-foreground/10 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="relative w-8 h-8 bg-amber-400 border-2 border-foreground/20 rounded-full flex items-center justify-center shadow-inner">
                            <Trophy className="w-4 h-4 text-amber-900 font-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Seviye 3</span>
                            <span className="text-foreground font-black text-sm tracking-tight flex items-baseline gap-1 mt-1 leading-none">
                                1,250 <span className="text-amber-500 text-xs">XP</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 py-8 md:py-12 relative z-10">
                {/* Search & Filters */}
                <div id="sims-filters" className="flex flex-col lg:flex-row gap-6 mb-12">
                    <div className="relative flex-1 group">
                        <div className="relative flex items-center bg-card border-2 border-foreground/10 rounded-lg transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] focus-within:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.15)] dark:focus-within:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 focus-within:-translate-y-0.5">
                            <Search className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors font-bold" />
                            {/* FIX: pl-12 instead of invalid pl-13 to fix overlapping icon */}
                            <input
                                type="text"
                                placeholder="Simülasyonlarda arama yapın..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent text-foreground pl-12 pr-6 py-4 outline-none font-bold placeholder:text-muted-foreground text-[15px] rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar items-center">
                        {["Tümü", "Kolay", "Orta", "Zor", "Mekanik", "Optik"].map(tab => {
                            const isActive = filter === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={cn(
                                        "px-6 py-3.5 rounded-lg text-xs md:text-[13px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 relative border-2",
                                        isActive
                                            ? "bg-foreground text-background border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
                                            : "bg-card text-foreground border-foreground/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 hover:border-foreground/20"
                                    )}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Neo-brutalist Grid exactly replicating ProfileArticleCard */}
                <div id="sims-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    <AnimatePresence mode="popLayout">
                        {filteredSims.map((sim, index) => (
                            <motion.div
                                key={sim.id}
                                layout
                                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                                transition={{ delay: index * 0.04, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                className="group h-full flex flex-col"
                            >
                                <Link prefetch={false} href={`/simulasyonlar/${sim.slug}`} className="block h-full outline-none">
                                    <div className="h-full bg-card border-2 border-foreground/10 rounded-lg overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.15)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col">
                                        
                                        {/* Header visual block mimicking article cover image */}
                                        <div 
                                            className="relative h-40 w-full flex items-center justify-center border-b-2 border-foreground/10 overflow-hidden"
                                            style={{ backgroundColor: `${sim.color}15` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                            {/* Neo-brutalist Icon Container */}
                                            <div 
                                                className="w-20 h-20 bg-card rounded-lg border-2 border-foreground/10 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                                            >
                                                <sim.icon className="w-10 h-10" style={{ color: sim.color, strokeWidth: 2 }} />
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            {/* Difficulty Badge */}
                                            <div className="flex justify-between items-start mb-3">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "w-fit border-2 font-bold text-[10px] uppercase tracking-wider",
                                                        sim.difficulty === "Zor" 
                                                            ? "border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10" 
                                                            : "border-foreground/20 text-foreground bg-foreground/5"
                                                    )}
                                                >
                                                    {sim.difficulty === "Zor" ? "HARDCORE" : sim.difficulty}
                                                </Badge>

                                                {/* Formula pill moved to top right */}
                                                <div className="bg-foreground/5 border-2 border-foreground/10 px-2 py-1 rounded bg-card flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="font-mono text-[10px] text-foreground font-black tracking-tight">
                                                        {sim.formula}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg md:text-xl font-black mb-2.5 text-foreground group-hover:text-foreground/70 transition-colors duration-200 line-clamp-2 leading-tight">
                                                {sim.title}
                                            </h3>

                                            {/* Excerpt/Description */}
                                            <p className="text-muted-foreground text-xs md:text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                                                {sim.description}
                                            </p>

                                            {/* Footer Meta */}
                                            <div className="flex items-center justify-between pt-3 border-t-2 border-foreground/10 mt-auto">
                                                <div className="flex gap-2 font-black">
                                                    {sim.tags.slice(0, 2).map((tag, i) => (
                                                        <span key={tag} className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-foreground font-black uppercase tracking-wider">
                                                    <span>BAŞLAT</span>
                                                    <ChevronRight className="w-3.5 h-3.5 stroke-[3px]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* Coming Soon Card replicating generic neo-brutalist empty state */}
                        <motion.div
                            key="coming-soon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="group h-full"
                        >
                            <div className="h-full bg-card border-2 border-dashed border-foreground/20 rounded-lg overflow-hidden flex flex-col items-center justify-center p-8 text-center opacity-70 hover:opacity-100 hover:border-foreground/40 transition-all cursor-default">
                                <div className="w-16 h-16 rounded-lg bg-card border-2 border-foreground/10 flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                    <Zap className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors stroke-[2.5px]" />
                                </div>
                                <h3 className="text-lg md:text-xl font-black mb-2.5 text-foreground leading-tight">
                                    Yeni Deneyler Yolda
                                </h3>
                                <p className="text-muted-foreground text-xs md:text-sm max-w-[220px] leading-relaxed">
                                    Kuantum ve modern optik simülasyonları laboratuvara ekleniyor.
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function SparkleIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500 mt-0.5 transform -rotate-12">
            <path d="M10 1L12.5 7.5L19 10L12.5 12.5L10 19L7.5 12.5L1 10L7.5 7.5L10 1Z" fill="currentColor" />
            <path d="M19 16L20.25 19.25L23.5 20.5L20.25 21.75L19 25L17.75 21.75L14.5 20.5L17.75 19.25L19 16Z" fill="currentColor" opacity="0.5" />
        </svg>
    )
}
