"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Search, Target, Zap } from "lucide-react";
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

    const tutorialSteps: TutorialStep[] = [
        {
            targetId: "sims-header",
            title: "DENEY LABORATUVARI 👋",
            description: "Fiziğin kurallarını test et.",
        },
        {
            targetId: "sims-filters",
            title: "DOSYALARI FİLTRELE 🔍",
            description: "Hangi konuyu incelemek istersin?",
        },
        {
            targetId: "sims-grid",
            title: "SİMÜLASYONU BAŞLAT 🚀",
            description: "Bir deney dosyası seç ve laboratuvara gir.",
        }
    ];

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem("fizikhub-sims-brutal");
        if (!hasSeenTutorial) {
            setTimeout(() => setShowTutorial(true), 1000);
        }
    }, []);

    const handleTutorialComplete = () => {
        setShowTutorial(false);
        localStorage.setItem("fizikhub-sims-brutal", "true");
    };

    return (
        <div className="min-h-screen bg-[#FFFDF0] pb-32 font-sans selection:bg-[#4ADE80] selection:text-black">
            <TutorialOverlay
                steps={tutorialSteps}
                isActive={showTutorial}
                onComplete={handleTutorialComplete}
                onSkip={handleTutorialComplete}
            />

            {/* HEADER - Brutalist Industrial */}
            <div id="sims-header" className="bg-[#FF90E8] border-b-[6px] border-black sticky top-0 z-40">
                {/* Checkered pattern background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply"
                    style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}
                />

                <div className="max-w-[1200px] mx-auto px-4 py-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Link href="/">
                                <div className="w-14 h-14 bg-white border-[4px] border-black flex items-center justify-center shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all cursor-pointer group">
                                    <ArrowLeft className="w-8 h-8 text-black group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </Link>
                            <div className="bg-white border-[4px] border-black px-4 py-2 shadow-[6px_6px_0px_#000] rotate-1">
                                <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none">
                                    SİMÜLASYON<br />MERKEZİ
                                </h1>
                            </div>
                        </div>

                        {/* Top Secret Badge */}
                        <div className="hidden md:flex bg-black text-white px-6 py-3 border-[4px] border-white shadow-[6px_6px_0px_#000] -rotate-2">
                            <div className="flex items-center gap-3">
                                <Target className="w-8 h-8 text-[#FFC800] animate-pulse" />
                                <div className="leading-none">
                                    <div className="text-[10px] text-white font-black uppercase tracking-widest border-b-2 border-white/30 pb-1 mb-1">GİZLİLİK SEVİYESİ</div>
                                    <div className="text-xl font-black text-[#FFC800]">ÇOK GİZLİ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 py-12">
                {/* SEARCH & FILTERS - Filing Cabinet Style */}
                <div id="sims-filters" className="mb-16 md:mb-24 flex flex-col xl:flex-row gap-8 items-start">
                    {/* Search Bar */}
                    <div className="relative w-full xl:w-1/3">
                        <div className="absolute -inset-2 bg-black rotate-1 z-0"></div>
                        <div className="relative z-10 bg-white border-[4px] border-black flex items-center shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-shadow">
                            <div className="p-4 bg-black">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                            <input
                                type="text"
                                placeholder="DOSYA ARA..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent text-black text-xl md:text-2xl font-black uppercase placeholder:text-black/30 placeholder:uppercase focus:outline-none px-4 py-4"
                            />
                        </div>
                    </div>

                    {/* Filter Tabs - Folders */}
                    <div className="flex flex-wrap gap-x-2 gap-y-4 pt-2">
                        {["Tümü", "Kolay", "Orta", "Zor", "Mekanik", "Optik"].map(tab => {
                            const isActive = filter === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={cn(
                                        "px-6 py-3 text-lg font-black uppercase tracking-tighter border-[4px] border-black border-b-[0px] rounded-t-2xl transition-all relative overflow-hidden",
                                        isActive
                                            ? "bg-[#FACC15] text-black h-16 shadow-[0px_-4px_0px_#000] z-20"
                                            : "bg-zinc-200 text-black/50 h-14 hover:h-16 hover:bg-zinc-300 z-10 mt-2"
                                    )}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="w-full h-[6px] bg-black -mt-[46px] relative z-30 hidden xl:block mb-16"></div>

                {/* THE FOLDER GRID */}
                <div id="sims-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 auto-rows-[minmax(400px,auto)]">
                    <AnimatePresence>
                        {filteredSims.map((sim, index) => (
                            <motion.div
                                key={sim.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: index % 2 === 0 ? 2 : -2 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="group relative z-10 hover:z-50"
                            >
                                <Link href={`/simulasyonlar/${sim.slug}`} className="block h-full">
                                    <div
                                        className="h-full bg-white border-[4px] border-black flex flex-col transition-all duration-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-4"
                                    >
                                        {/* Folder Tab */}
                                        <div className="absolute -top-10 left-0 border-[4px] border-black border-b-0 px-4 py-2 font-black uppercase tracking-tighter text-sm bg-white" style={{ borderBottom: 'none' }}>
                                            DATA // {sim.id.substring(0, 4)}
                                        </div>

                                        {/* Header Color Block */}
                                        <div
                                            className="h-48 border-b-[4px] border-black relative flex items-center justify-center p-6 overflow-hidden"
                                            style={{ backgroundColor: sim.color }}
                                        >
                                            {/* Striped overlay */}
                                            <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>

                                            <div className="w-24 h-24 bg-white border-[4px] border-black rounded-full flex items-center justify-center relative z-10 shadow-[8px_8px_0px_#000] group-hover:scale-110 transition-transform duration-300">
                                                <sim.icon className="w-12 h-12 text-black" />
                                            </div>

                                            {/* Difficulty Stamp */}
                                            <div className="absolute top-4 right-4 bg-white border-[3px] border-black px-3 py-1 font-black text-sm uppercase -rotate-6 shadow-[4px_4px_0px_#000]">
                                                {sim.difficulty}
                                            </div>
                                        </div>

                                        {/* Content body */}
                                        <div className="p-6 flex-1 flex flex-col bg-[#FFFDF0]">
                                            <h3 className="text-3xl font-black text-black uppercase tracking-tighter leading-none mb-4 group-hover:text-blue-600 transition-colors">
                                                {sim.title}
                                            </h3>
                                            <p className="text-black/70 text-base font-bold mb-6 leading-tight flex-1">
                                                {sim.description}
                                            </p>

                                            {/* Formula cut-out */}
                                            <div className="w-full bg-black text-[#FACC15] px-4 py-3 font-mono font-black text-sm border-[3px] border-black mb-6 flex justify-between items-center shadow-[4px_4px_0px_#000] rotate-1 group-hover:-rotate-1 transition-transform">
                                                <span>FORMÜL:</span>
                                                <span className="text-white">{sim.formula}</span>
                                            </div>

                                            {/* Footer Button Simulation */}
                                            <div className="mt-auto flex justify-between items-center pt-4 border-t-[4px] border-black border-dashed">
                                                <div className="flex gap-2">
                                                    {sim.tags.slice(0, 2).map(tag => (
                                                        <span key={tag} className="bg-zinc-200 border-[2px] border-black text-[10px] font-black uppercase px-2 py-1 shadow-[2px_2px_0px_#000]">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="bg-[#4ADE80] border-[3px] border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_#000] flex items-center gap-2 group-hover:bg-[#FACC15] transition-colors">
                                                    ÇALIŞTIR <Play className="w-4 h-4 fill-black" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Coming Soon Classified File */}
                    <div className="h-full min-h-[400px] border-[6px] border-black border-dashed bg-zinc-200 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group hover:bg-black transition-colors duration-500">
                        {/* Tape */}
                        <div className="absolute -top-4 -right-10 bg-[#FACC15] text-black font-black text-sm py-2 px-16 rotate-45 border-y-[3px] border-black whitespace-nowrap z-20">
                            YAKINDA <span className="mx-2">•</span> YAKINDA <span className="mx-2">•</span> YAKINDA
                        </div>

                        <div className="w-24 h-24 bg-white border-[4px] border-black flex items-center justify-center mb-6 shadow-[8px_8px_0px_#000] group-hover:-translate-y-4 group-hover:shadow-[16px_16px_0px_#000] transition-all">
                            <Zap className="w-12 h-12 text-black" />
                        </div>
                        <h3 className="text-3xl font-black text-black uppercase tracking-tighter leading-none mb-4 group-hover:text-white transition-colors">
                            GİZLİ DOSYALAR
                        </h3>
                        <p className="text-black font-bold text-lg group-hover:text-[#FACC15] transition-colors">
                            Kuantum ve Termodinamik simülasyonları tasarlanıyor.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
