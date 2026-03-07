"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Search, Trophy, Zap, ChevronRight } from "lucide-react";
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
        <div className="min-h-screen bg-[#020202] text-white pb-24 font-sans selection:bg-white selection:text-black font-medium relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

            <TutorialOverlay
                steps={tutorialSteps}
                isActive={showTutorial}
                onComplete={handleTutorialComplete}
                onSkip={handleTutorialComplete}
            />

            {/* Premium Header */}
            <div id="sims-header" className="sticky top-0 z-40 bg-[#020202]/70 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
                <div className="max-w-[1400px] mx-auto px-4 py-4 md:py-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 md:gap-6">
                        <ViewTransitionLink href="/">
                            <div className="flex items-center justify-center w-11 h-11 bg-white/[0.03] border border-white/10 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all rounded-full group cursor-pointer shadow-sm">
                                <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                            </div>
                        </ViewTransitionLink>
                        <div className="flex flex-col">
                            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                                Simülasyon Merkezi
                                <SparkleIcon />
                            </h1>
                            <p className="text-white/50 text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] mt-1">
                                v2.0 • Yüksek Kalibre Deney Alanı
                            </p>
                        </div>
                    </div>

                    {/* Stats Widget - Apple Quality */}
                    <div id="sims-stats" className="hidden md:flex items-center gap-4 bg-white/[0.03] px-5 py-2.5 rounded-full border border-white/10 shadow-sm backdrop-blur-md">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 blur-sm opacity-50 rounded-full" />
                            <div className="relative w-8 h-8 bg-gradient-to-br from-[#FFC800] to-[#FF90E8] rounded-full flex items-center justify-center shadow-inner">
                                <Trophy className="w-4 h-4 text-black" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">Seviye 3</span>
                            <span className="text-white font-bold text-sm tracking-tight flex items-baseline gap-1 mt-1 leading-none">
                                1,250 <span className="text-[#FFC800] text-xs">XP</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 py-8 md:py-12 relative z-10">
                {/* Refined Search & Filters */}
                <div id="sims-filters" className="flex flex-col lg:flex-row gap-6 mb-12">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center bg-white/[0.02] border border-white/10 rounded-2xl focus-within:bg-white/[0.04] focus-within:border-white/30 transition-all duration-300 backdrop-blur-sm shadow-sm">
                            <Search className="absolute left-5 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                            <input
                                type="text"
                                placeholder="Simülasyonlarda arama yapın..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent text-white pl-13 pr-6 py-4 outline-none font-medium placeholder:text-white/30 text-[15px] rounded-2xl"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar items-center mask-fade-edges">
                        {["Tümü", "Kolay", "Orta", "Zor", "Mekanik", "Optik"].map(tab => {
                            const isActive = filter === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={cn(
                                        "px-6 py-3 rounded-full text-[13px] font-bold tracking-wide whitespace-nowrap transition-all duration-300 relative",
                                        isActive
                                            ? "text-black shadow-md scale-105"
                                            : "text-white/60 hover:text-white hover:bg-white/10 bg-white/[0.03] border border-white/5 hover:border-white/10"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabBackground"
                                            className="absolute inset-0 bg-white rounded-full z-[-1]"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{tab}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Apple-style Bento Grid */}
                <div id="sims-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]">
                    <AnimatePresence mode="popLayout">
                        {filteredSims.map((sim, index) => (
                            <motion.div
                                key={sim.id}
                                layout
                                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                                transition={{ delay: index * 0.04, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                className={cn(
                                    "group",
                                    index === 0 ? "lg:col-span-2 lg:row-span-1" : ""
                                )}
                            >
                                <Link href={`/simulasyonlar/${sim.slug}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-[32px]">
                                    <div
                                        className={cn(
                                            "relative h-full flex flex-col bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-[32px] overflow-hidden transition-all duration-500",
                                            "hover:bg-white/[0.04] hover:-translate-y-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                                        )}
                                    >
                                        {/* Dynamic Glow Behind Icon */}
                                        <div
                                            className="absolute top-0 right-0 w-[200px] h-[200px] blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none rounded-full"
                                            style={{ backgroundColor: sim.color }}
                                        />

                                        {/* Header */}
                                        <div className="p-8 pb-4 relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                            <div
                                                className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner overflow-hidden relative"
                                            >
                                                <div className="absolute inset-0 opacity-20" style={{ backgroundColor: sim.color }} />
                                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                                                <sim.icon className="w-7 h-7 text-white drop-shadow-md relative z-10 transition-transform duration-500 group-hover:scale-110" />
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {sim.difficulty === "Zor" && (
                                                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">
                                                        HARDCORE
                                                    </span>
                                                )}
                                                <span className="bg-white/5 text-white/70 border border-white/10 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm group-hover:bg-white/10 group-hover:text-white transition-colors">
                                                    {sim.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="px-8 flex-1 flex flex-col relative z-10">
                                            <h3 className="text-2xl font-bold text-white tracking-tight mb-3 group-hover:text-white transition-colors leading-tight">
                                                {sim.title}
                                            </h3>
                                            <p className="text-white/50 text-[15px] font-medium line-clamp-3 mb-6 leading-relaxed group-hover:text-white/70 transition-colors">
                                                {sim.description}
                                            </p>

                                            {/* Formula Pill - Tech Vibe */}
                                            <div className="mt-auto mb-6 inline-flex self-start">
                                                <div className="bg-[#0A0A0A] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3 backdrop-blur-sm shadow-inner group-hover:border-white/20 transition-colors">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="font-mono text-[11px] text-green-400 font-medium tracking-tight">
                                                        {sim.formula}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Action Bar */}
                                        <div className="px-8 py-5 border-t border-white/[0.05] flex items-center justify-between bg-black/20 group-hover:bg-black/40 transition-colors duration-500 backdrop-blur-md">
                                            <div className="flex gap-3">
                                                {sim.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[11px] font-semibold text-white/40 group-hover:text-white/60 transition-colors">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors font-semibold text-sm">
                                                <span>Başlat</span>
                                                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transform translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                                    <ChevronRight className="w-4 h-4 stroke-[3px]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Coming Soon Card */}
                    <div className="h-full min-h-[320px] border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center p-8 text-center opacity-70 hover:opacity-100 hover:border-white/20 hover:bg-white/[0.02] transition-all cursor-default group backdrop-blur-sm">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                            <Zap className="w-7 h-7 text-white/40 group-hover:text-yellow-400 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                            Yeni Deneyler Yolda
                        </h3>
                        <p className="text-sm text-white/40 font-medium max-w-[220px] leading-relaxed">
                            Kuantum ve modern optik simülasyonları laboratuvara ekleniyor.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SparkleIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-400 mt-0.5">
            <path d="M10 1L12.5 7.5L19 10L12.5 12.5L10 19L7.5 12.5L1 10L7.5 7.5L10 1Z" fill="currentColor" />
            <path d="M19 16L20.25 19.25L23.5 20.5L20.25 21.75L19 25L17.75 21.75L14.5 20.5L17.75 19.25L19 16Z" fill="currentColor" opacity="0.5" />
        </svg>
    )
}
