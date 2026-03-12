"use client";

import { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Search, Trophy, Zap, ArrowUpRight } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { cn } from "@/lib/utils";
import { simulations } from "@/components/simulations/data";
import { TutorialOverlay, TutorialStep } from "@/components/ui/tutorial-overlay";

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
            title: "Simülasyon Merkezi",
            description: "Fizik formüllerini görselleştirdiğimiz deney alanı.",
        },
        {
            targetId: "sims-stats",
            title: "Gelişim Seviyesi",
            description: "Deneyleri tamamladıkça kazanacağın tecrübe puanları.",
        },
        {
            targetId: "sims-filters",
            title: "Arama ve Filtre",
            description: "Belirli bir konuyu veya zorluk derecesini anında bul.",
        },
        {
            targetId: "sims-grid",
            title: "Deney Alanı",
            description: "Laboratuvara giriş yap ve parametreleri değiştirmeye başla.",
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

            {/* Clean Neo-brutalist Header */}
            <div id="sims-header" className="sticky top-0 z-40 bg-background border-b-2 border-foreground/10">
                <div className="max-w-[1400px] mx-auto px-4 py-5 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 md:gap-5">
                        <ViewTransitionLink href="/">
                            <button className="flex items-center justify-center w-10 h-10 bg-card border-2 border-foreground hover:bg-foreground hover:text-background transition-colors rounded-sm group cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-y-px active:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground">
                                <ArrowLeft className="w-5 h-5 transition-colors" />
                            </button>
                        </ViewTransitionLink>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                                Simülasyon Merkezi
                            </h1>
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-0.5">
                                V2.0 
                            </p>
                        </div>
                    </div>

                    {/* Minimal Stats Widget */}
                    <div id="sims-stats" className="hidden md:flex items-center gap-3 bg-card px-4 py-2 rounded-sm border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                        <div className="w-7 h-7 bg-amber-400 border-2 border-foreground rounded-sm flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-black font-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">SEVİYE 3</span>
                            <span className="text-foreground font-black text-sm tracking-tight flex items-baseline gap-1 mt-0.5 leading-none">
                                1,250 <span className="text-amber-500 font-bold text-xs">XP</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 py-8 md:py-12 relative z-10">
                {/* Search & Filters (Strict functional design) */}
                <div id="sims-filters" className="flex flex-col lg:flex-row gap-5 mb-10">
                    <div className="relative flex-1">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 w-5 h-5 text-foreground font-black z-10" />
                            <input
                                type="text"
                                placeholder="Simülasyonlarda arama yapın..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-card text-foreground border-2 border-foreground rounded-sm pl-12 pr-6 py-4 font-bold placeholder:text-muted-foreground text-[15px] focus:outline-none focus:ring-offset-background transition-shadow shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] focus:translate-y-0.5"
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
                                        "px-5 py-3.5 rounded-sm text-xs md:text-[13px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2",
                                        isActive
                                            ? "bg-foreground text-background border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                                            : "bg-card text-foreground border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[2px]"
                                    )}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Neo-brutalist Grid (Professional Layout) */}
                <div id="sims-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    <AnimatePresence mode="popLayout">
                        {filteredSims.map((sim) => (
                            <motion.div
                                key={sim.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="group h-full flex flex-col"
                            >
                                <Link prefetch={false} href={`/simulasyonlar/${sim.slug}`} className="block h-full focus:outline-none">
                                    <div className="h-full bg-card border-2 border-foreground rounded-sm p-5 md:p-6 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 transition-all cursor-pointer">
                                        
                                        {/* Card Header Section */}
                                        <div className="flex justify-between items-start mb-5">
                                            {/* Icon Block */}
                                            <div className="w-14 h-14 bg-card border-2 border-foreground rounded-sm flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                                                <sim.icon className="w-7 h-7" style={{ color: sim.color, strokeWidth: 2.5 }} />
                                            </div>

                                            {/* Top Right Difficulty */}
                                            <div className={cn(
                                                "px-2.5 py-1 border-2 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]",
                                                sim.difficulty === "Zor" 
                                                    ? "bg-red-500 text-white border-foreground" 
                                                    : "bg-card text-foreground border-foreground"
                                            )}>
                                                {sim.difficulty === "Zor" ? "HARDCORE" : sim.difficulty}
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="flex-1 flex flex-col">
                                            <h3 className="text-xl md:text-2xl font-black mb-2 text-foreground leading-tight">
                                                {sim.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                                                {sim.description}
                                            </p>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="pt-4 border-t-2 border-foreground/10 flex items-center justify-between mt-auto">
                                            {/* Tags / Formula */}
                                            <div className="flex items-center gap-2">
                                                <div className="bg-muted px-2 py-1 rounded-sm border-2 border-foreground/10 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 border border-black/20" />
                                                    <span className="font-mono text-[10px] text-foreground font-bold tracking-tight">
                                                        {sim.formula}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Call to action */}
                                            <div className="flex items-center gap-1.5 text-foreground font-black text-[11px] uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4">
                                                <span>Aç</span>
                                                <ArrowUpRight className="w-4 h-4 stroke-[3px]" />
                                            </div>
                                        </div>
                                        
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* Practical Coming Soon Block */}
                        <motion.div
                            key="coming-soon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full"
                        >
                            <div className="h-full bg-card/50 border-2 border-dashed border-foreground/30 rounded-sm p-6 flex flex-col items-center justify-center text-center opacity-80 hover:opacity-100 transition-opacity cursor-default min-h-[250px]">
                                <div className="w-12 h-12 bg-muted border-2 border-foreground/20 rounded-sm flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-muted-foreground stroke-[2.5px]" />
                                </div>
                                <h3 className="text-lg font-black text-foreground mb-1">
                                    Yeni Deneyler
                                </h3>
                                <p className="text-muted-foreground text-xs font-bold max-w-[200px]">
                                    Kuantum laboratuvarı çok yakında erişimde.
                                </p>
                            </div>
                        </motion.div>

                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
