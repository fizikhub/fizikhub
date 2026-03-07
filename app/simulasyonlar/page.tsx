"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Search, Trophy, Zap } from "lucide-react";
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
            title: "Hoş Geldin Fizikçi! 👋",
            description: "Burası senin laboratuvarın. Fizik kurallarını bükebileceğin simülasyonlar burada.",
        },
        {
            targetId: "sims-stats",
            title: "Gelişimini Takip Et 🏆",
            description: "Tamamladığın her görev sana XP kazandırır. Usta bir fizikçi olma yolunda ilerle!",
        },
        {
            targetId: "sims-filters",
            title: "Konuları Filtrele 🔍",
            description: "Aradığın deneyi bulmak için zorluk seviyesi veya konuya göre filtreleme yapabilirsin.",
        },
        {
            targetId: "sims-grid",
            title: "Deneylere Başla 🚀",
            description: "Bir simülasyon seç ve fiziğin büyüleyici dünyasına dalış yap. İyi eğlenceler!",
        }
    ];

    useEffect(() => {
        // Check local storage for first visit
        const hasSeenTutorial = localStorage.getItem("fizikhub-sims-tutorial");
        if (!hasSeenTutorial) {
            // Small delay to ensure layout is stable
            setTimeout(() => setShowTutorial(true), 1000);
        }
    }, []);

    const handleTutorialComplete = () => {
        setShowTutorial(false);
        localStorage.setItem("fizikhub-sims-tutorial", "true");
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 font-sans selection:bg-[#FFC800] selection:text-black">
            <TutorialOverlay
                steps={tutorialSteps}
                isActive={showTutorial}
                onComplete={handleTutorialComplete}
                onSkip={handleTutorialComplete}
            />

            {/* Header */}
            <div id="sims-header" className="bg-[#4169E1] border-b-[3px] border-foreground sticky top-0 z-40 shadow-[0px_4px_0px_rgba(0,0,0,0.3)] dark:shadow-[0px_4px_0px_rgba(255,255,255,0.1)]">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <ViewTransitionLink href="/">
                                <div className="flex items-center justify-center w-10 h-10 bg-[#FFC800] border-[2px] border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-lg group">
                                    <ArrowLeft className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
                                </div>
                            </ViewTransitionLink>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter italic drop-shadow-md">
                                    <span className="text-black">Simülasyon</span> <span className="text-[#FFC800] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Merkezi</span>
                                </h1>
                                <p className="text-white/90 text-[10px] sm:text-xs font-black uppercase tracking-widest mt-0.5 drop-shadow-sm">
                                    v2.0 • İnteraktif Fizik Laboratuvarı
                                </p>
                            </div>
                        </div>

                        {/* User Stats / XP (Fake for now) */}
                        <div id="sims-stats" className="hidden sm:flex items-center gap-3 bg-white/10 p-2 pr-4 rounded-xl border-2 border-white/20 backdrop-blur-md shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#FFC800] to-[#FF90E8] rounded-lg border-2 border-black flex items-center justify-center shadow-inner">
                                <Trophy className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <div className="text-[10px] text-white font-black uppercase tracking-wider drop-shadow-md">Seviye 3 Fizikçi</div>
                                <div className="text-white font-black text-sm flex items-center gap-1 drop-shadow-md">
                                    1,250 XP <span className="text-[#FFC800] text-[10px]">✨</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 mt-4">
                {/* Filters & Search */}
                <div id="sims-filters" className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Simülasyon ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-card border-2 border-foreground/20 text-foreground pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-foreground focus:shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:border-foreground/50 transition-all font-bold placeholder:text-muted-foreground placeholder:uppercase placeholder:text-xs placeholder:tracking-wider"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar items-center">
                        {["Tümü", "Kolay", "Orta", "Zor", "Mekanik", "Optik"].map(tab => {
                            const isActive = filter === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap border-2 transition-all duration-200 outline-none",
                                        isActive
                                            ? "bg-foreground text-background border-foreground shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.2)] -translate-y-1 -translate-x-1"
                                            : "bg-card text-muted-foreground border-foreground/20 hover:text-foreground hover:border-foreground hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-none"
                                    )}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bento Grid */}
                <div id="sims-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[minmax(300px,auto)]">
                    <AnimatePresence>
                        {filteredSims.map((sim, index) => (
                            <motion.div
                                key={sim.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                className={cn(
                                    "group h-full",
                                    index === 0 ? "lg:col-span-2 lg:row-span-1" : ""
                                )}
                            >
                                <Link href={`/simulasyonlar/${sim.slug}`} className="block h-full">
                                    <div
                                        className={cn(
                                            "relative h-full flex flex-col bg-card border-2 border-foreground/10 rounded-xl overflow-hidden transition-all duration-300",
                                            "hover:-translate-y-1 hover:-translate-x-1 hover:border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-0 active:translate-x-0 active:shadow-none"
                                        )}
                                    >
                                        {/* Top Accent Line */}
                                        <div
                                            className="absolute top-0 left-0 w-full h-[4px] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-20"
                                            style={{ backgroundColor: sim.color }}
                                        />

                                        {/* Decorative Background */}
                                        <div
                                            className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-500 grayscale-[50%] group-hover:grayscale-0"
                                            style={{
                                                backgroundColor: sim.color,
                                                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
                                            }}
                                        />

                                        {/* Header */}
                                        <div className="p-6 pb-0 relative z-10 flex justify-between items-start">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-foreground shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.2)] group-hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[4px_4px_0px_rgba(255,255,255,0.4)] transition-all duration-300 grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110"
                                                style={{ backgroundColor: sim.color }}
                                            >
                                                <sim.icon className="w-6 h-6 text-black" />
                                            </div>
                                            <div className="flex gap-2">
                                                {sim.difficulty === "Zor" && (
                                                    <span className="bg-background text-[#FF5757] text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-wider border-2 border-foreground shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                                                        HARDCORE
                                                    </span>
                                                )}
                                                <span className="bg-background text-foreground text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-wider border-2 border-foreground shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                                                    {sim.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col relative z-10">
                                            <h3 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight mb-3 group-hover:text-foreground/80 transition-colors leading-tight">
                                                {sim.title}
                                            </h3>
                                            <p className="text-muted-foreground text-xs sm:text-sm font-bold line-clamp-3 mb-4 leading-relaxed">
                                                {sim.description}
                                            </p>

                                            {/* Formula Pill */}
                                            <div className="mt-auto inline-flex self-start bg-card px-3 py-1.5 rounded-sm border-2 border-foreground shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                                                <span className="font-mono text-[10px] text-foreground font-bold">{sim.formula}</span>
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="p-4 bg-muted border-t-2 border-foreground/10 flex items-center justify-between group-hover:bg-accent/50 transition-colors duration-300">
                                            <div className="flex gap-2">
                                                {sim.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="w-8 h-8 rounded-none bg-foreground text-background flex items-center justify-center border-2 border-foreground opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 group-hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                                                <Play className="w-4 h-4 fill-current stroke-[3px]" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Coming Soon Card */}
                    <div className="h-full min-h-[300px] border-4 border-dashed border-foreground/10 rounded-xl flex flex-col items-center justify-center p-6 text-center opacity-70 hover:opacity-100 hover:border-foreground/30 transition-all cursor-crosshair group bg-muted/50">
                        <div className="w-16 h-16 rounded-none bg-card border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7 text-muted-foreground group-hover:text-[#FFC800] transition-colors stroke-[3px]" />
                        </div>
                        <h3 className="text-lg font-black text-foreground uppercase tracking-tighter mb-2">
                            Yeni Deneyler Yolda
                        </h3>
                        <p className="text-xs text-muted-foreground font-bold max-w-[200px]">
                            Optik ve Kuantum simülasyonları üzerinde çalışıyoruz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
