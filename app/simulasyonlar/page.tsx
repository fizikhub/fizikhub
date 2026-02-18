"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Search, Filter, Trophy, Star, Zap } from "lucide-react";
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
        <div className="min-h-screen bg-[#09090b] pb-20 font-[family-name:var(--font-outfit)] selection:bg-[#FFC800] selection:text-black">
            <TutorialOverlay
                steps={tutorialSteps}
                isActive={showTutorial}
                onComplete={handleTutorialComplete}
                onSkip={handleTutorialComplete}
            />

            {/* Header */}
            <div id="sims-header" className="bg-[#4169E1] border-b-[3px] border-black sticky top-0 z-40 shadow-[0px_4px_0px_rgba(0,0,0,0.3)]">
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
                                    Simülasyon <span className="text-[#FFC800]">Merkezi</span>
                                </h1>
                                <p className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-0.5">
                                    v2.0 • İnteraktif Fizik Laboratuvarı
                                </p>
                            </div>
                        </div>

                        {/* User Stats / XP (Fake for now) */}
                        <div id="sims-stats" className="hidden sm:flex items-center gap-3 bg-black/20 p-2 pr-4 rounded-xl border border-white/10 backdrop-blur-sm">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#FFC800] to-[#FF90E8] rounded-lg border-2 border-white flex items-center justify-center shadow-lg">
                                <Trophy className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <div className="text-[10px] text-white/60 font-black uppercase tracking-wider">Seviye 3 Fizikçi</div>
                                <div className="text-white font-black text-sm flex items-center gap-1">
                                    1,250 XP <span className="text-[#FFC800] text-[10px]">✨</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filters & Search */}
                <div id="sims-filters" className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Simülasyon ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-zinc-900 border-2 border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#4169E1] focus:shadow-[4px_4px_0px_#4169E1] transition-all font-bold placeholder:text-zinc-600 placeholder:uppercase placeholder:text-xs placeholder:tracking-wider"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {["Tümü", "Kolay", "Orta", "Zor", "Mekanik", "Optik"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap border-2 transition-all shadow-[3px_3px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                                    filter === tab
                                        ? "bg-[#FF90E8] border-black text-black shadow-[3px_3px_0px_#000]"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bento Grid */}
                <div id="sims-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[minmax(300px,auto)]">
                    <AnimatePresence>
                        {filteredSims.map((sim, index) => (
                            <motion.div
                                key={sim.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "group relative hover:z-10",
                                    // Make the first item span 2 cols if on large screen for variety
                                    index === 0 ? "lg:col-span-2 lg:row-span-1" : ""
                                )}
                            >
                                <Link href={`/simulasyonlar/${sim.slug}`} className="block h-full">
                                    <div
                                        className={cn(
                                            "h-full flex flex-col bg-zinc-900 border-2 border-black rounded-3xl overflow-hidden transition-all duration-300",
                                            "hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] shadow-[4px_4px_0px_rgba(0,0,0,0.5)]",
                                            "relative"
                                        )}
                                    >
                                        {/* Decorative Background */}
                                        <div
                                            className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500"
                                            style={{
                                                backgroundColor: sim.color,
                                                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
                                            }}
                                        />

                                        {/* Header */}
                                        <div className="p-6 pb-0 relative z-10 flex justify-between items-start">
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.2)] group-hover:shadow-[3px_3px_0px_rgba(0,0,0,0.5)] transition-shadow"
                                                style={{ backgroundColor: sim.color }}
                                            >
                                                <sim.icon className="w-6 h-6 text-black" />
                                            </div>
                                            <div className="flex gap-2">
                                                {sim.difficulty === "Zor" && (
                                                    <span className="bg-black text-[#FF5757] text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider border border-[#FF5757]/30">
                                                        HARDCORE
                                                    </span>
                                                )}
                                                <span className="bg-zinc-800 text-zinc-300 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider border border-white/5">
                                                    {sim.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col relative z-10">
                                            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter italic mb-2 group-hover:text-[#FFC800] transition-colors">
                                                {sim.title}
                                            </h3>
                                            <p className="text-zinc-400 text-xs sm:text-sm font-medium line-clamp-3 mb-4 leading-relaxed">
                                                {sim.description}
                                            </p>

                                            {/* Formula Pill */}
                                            <div className="mt-auto inline-flex self-start bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md">
                                                <span className="font-mono text-[10px] text-white/50">{sim.formula}</span>
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="p-4 bg-black/20 border-t-2 border-black/10 flex items-center justify-between group-hover:bg-[#FFC800] transition-colors duration-300">
                                            <div className="flex gap-2">
                                                {sim.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-black/70">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center border border-black opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                                <Play className="w-4 h-4 fill-black" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Coming Soon Card */}
                    <div className="h-full min-h-[300px] border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-6 text-center opacity-50 hover:opacity-100 hover:border-zinc-700 transition-all cursor-crosshair group bg-zinc-900/10">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Zap className="w-8 h-8 text-zinc-700 group-hover:text-[#FFC800] transition-colors" />
                        </div>
                        <h3 className="text-lg font-black text-zinc-500 uppercase tracking-tighter italic mb-1">
                            Yeni Deneyler Yolda
                        </h3>
                        <p className="text-xs text-zinc-600 font-medium max-w-[200px]">
                            Optik ve Kuantum simülasyonları üzerinde çalışıyoruz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
