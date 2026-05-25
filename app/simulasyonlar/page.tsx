"use client";

import { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Search, Zap, Beaker, BookOpen, Clock3, Compass, ListChecks } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { cn } from "@/lib/utils";
import { simulations } from "@/components/simulations/data";
import { TutorialOverlay, TutorialStep } from "@/components/ui/tutorial-overlay";
import { getRecommendedSimulationPath, getSimulationLearningSummary, simulationMatchesQuery } from "@/lib/simulation-learning";
import { useSimulationProgress } from "@/hooks/use-simulation-progress";
import { getSimulationProgressState } from "@/lib/simulation-progress";

export default function SimulasyonlarPage() {
    const [filter, setFilter] = useState("Tümü");
    const [search, setSearch] = useState("");
    const [showTutorial, setShowTutorial] = useState(false);
    const { store } = useSimulationProgress();
    const summary = getSimulationLearningSummary(simulations);
    const recommendedPath = getRecommendedSimulationPath(simulations).slice(0, 4);
    const completedCount = simulations.filter((sim) => getSimulationProgressState(store[sim.slug], sim.learning.checkpoints.length).completed).length;
    const inProgressCount = simulations.filter((sim) => {
        const progress = getSimulationProgressState(store[sim.slug], sim.learning.checkpoints.length);
        return !progress.completed && progress.checkedCount > 0;
    }).length;
    const filterTabs = [
        "Tümü",
        "Kolay",
        "Orta",
        "Zor",
        ...summary.popularTags.filter((tag) => !["Kolay", "Orta", "Zor"].includes(tag)).slice(0, 5),
    ];

    // Filter simulations
    const filteredSims = simulations.filter(sim => {
        const matchesFilter = filter === "Tümü" || sim.difficulty === filter || sim.tags.includes(filter);
        const matchesSearch = simulationMatchesQuery(sim, search);
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
            const timer = window.setTimeout(() => setShowTutorial(true), 800);
            return () => window.clearTimeout(timer);
        }
    }, []);

    const handleTutorialComplete = () => {
        setShowTutorial(false);
        localStorage.setItem("fizikhub-sims-tutorial", "true");
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#18181b] text-black dark:text-zinc-50 pb-24 font-sans selection:bg-[#FFC800] selection:text-black relative">
            
            <TutorialOverlay
                steps={tutorialSteps}
                isActive={showTutorial}
                onComplete={handleTutorialComplete}
                onSkip={handleTutorialComplete}
            />

            {/* Header (Aligned with Forum) */}
            <div id="sims-header" className="sticky top-0 z-40 bg-neutral-50/95 dark:bg-[#18181b]/95 backdrop-blur-md border-b-[3px] border-black">
                <div className="max-w-[1400px] mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <ViewTransitionLink href="/">
                            <span className="flex items-center justify-center w-10 h-10 bg-white dark:bg-[#27272a] border-[3px] border-black hover:bg-[#FFBD2E] dark:hover:bg-[#FFBD2E] hover:text-black transition-colors rounded-lg group cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none focus:outline-none">
                                <ArrowLeft className="w-5 h-5 transition-colors stroke-[2.5px]" />
                            </span>
                        </ViewTransitionLink>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-[family-name:var(--font-outfit)] font-black text-black dark:text-zinc-50 uppercase tracking-tighter leading-none">
                                Simülasyon Merkezi
                            </h1>
                            <p className="text-neutral-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">
                                Deney Laboratuvarı • V2.0 
                            </p>
                        </div>
                    </div>

                    {/* Minimal Stats Widget */}
                    <div id="sims-stats" className="hidden md:flex items-center gap-3 bg-white dark:bg-[#27272a] px-4 py-2 rounded-lg border-[3px] border-black shadow-[3px_3px_0px_0px_#000]">
                        <div className="w-8 h-8 bg-[#FFBD2E] border-2 border-black rounded-md flex items-center justify-center">
                            <Beaker className="w-4 h-4 text-black stroke-[3px]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-neutral-500 dark:text-zinc-400 font-black uppercase tracking-widest leading-none">AKTİF LABORATUVAR</span>
                            <span className="text-black dark:text-white font-black text-sm tracking-tight flex items-baseline gap-1 mt-0.5 leading-none">
                                {simulations.length} <span className="text-[#FFBD2E] font-bold text-xs">DENEY</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 py-8 md:py-12 relative z-10">
                {/* Learning Route */}
                <section className="mb-8 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]" aria-labelledby="learning-route-title">
                    <div className="rounded-[8px] border-[3px] border-black bg-white p-5 shadow-[5px_5px_0px_0px_#000] dark:bg-[#27272a]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-[6px] border-2 border-black bg-[#FFBD2E] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_0px_#000]">
                                    <Compass className="h-3.5 w-3.5" />
                                    FizikHub öğrenme rotası
                                </div>
                                <h2 id="learning-route-title" className="max-w-2xl text-2xl font-black uppercase leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
                                    Önce tahmin et, sonra değişkeni oynat, en sonda cevabı savun.
                                </h2>
                                <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-neutral-600 dark:text-zinc-300">
                                    Simülasyonlar artık sadece görsel deney değil; her deneyin merak sorusu, kontrol listesi, hızlı ölçme sorusu ve devam kaynağı var.
                                </p>
                            </div>

                            <div className="grid min-w-[260px] grid-cols-4 gap-2 text-center">
                                <div className="rounded-[7px] border-2 border-black bg-neutral-50 px-2 py-3 dark:bg-[#18181b]">
                                    <div className="text-xl font-black text-black dark:text-white">{summary.totalSimulations}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Deney</div>
                                </div>
                                <div className="rounded-[7px] border-2 border-black bg-neutral-50 px-2 py-3 dark:bg-[#18181b]">
                                    <div className="text-xl font-black text-black dark:text-white">{summary.totalMinutes}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Dakika</div>
                                </div>
                                <div className="rounded-[7px] border-2 border-black bg-neutral-50 px-2 py-3 dark:bg-[#18181b]">
                                    <div className="text-xl font-black text-black dark:text-white">{summary.difficultyCounts.Kolay}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Başlangıç</div>
                                </div>
                                <div className="rounded-[7px] border-2 border-black bg-neutral-50 px-2 py-3 dark:bg-[#18181b]">
                                    <div className="text-xl font-black text-black dark:text-white">{completedCount || inProgressCount}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                                        {completedCount > 0 ? "Biten" : "Devam"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[8px] border-[3px] border-black bg-[#111] p-5 text-white shadow-[5px_5px_0px_0px_#000]">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bugünkü kısa rota</p>
                                <h2 className="mt-1 text-xl font-black uppercase tracking-tight">4 deneylik ısınma</h2>
                            </div>
                            <BookOpen className="h-6 w-6 text-[#FFBD2E]" />
                        </div>
                        <div className="grid gap-2">
                            {recommendedPath.map((item) => (
                                <ViewTransitionLink
                                    key={item.simulation.id}
                                    href={`/simulasyonlar/${item.simulation.slug}`}
                                    className="group grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-[7px] border-2 border-zinc-700 bg-zinc-950 px-3 py-3 transition-colors hover:border-[#FFBD2E]"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-[6px] border-2 border-black bg-[#FFBD2E] text-xs font-black text-black">
                                        {item.step}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-black uppercase tracking-tight">{item.simulation.title}</span>
                                        <span className="block truncate text-[11px] font-bold text-zinc-500">{item.reason}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                        <Clock3 className="h-3 w-3" />
                                        {item.simulation.learning.estimatedMinutes} dk
                                    </span>
                                </ViewTransitionLink>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Search & Filters */}
                <div id="sims-filters" className="flex flex-col lg:flex-row gap-5 mb-10">
                    <div className="relative flex-1">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 w-5 h-5 text-neutral-500 dark:text-zinc-400 font-bold z-10" />
                            <input
                                type="text"
                                placeholder="Simülasyonlarda arama yapın..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={cn(
                                    "w-full h-14 pl-12 pr-6 py-4 rounded-lg",
                                    "bg-white dark:bg-[#27272a] text-black dark:text-zinc-50 border-[3px] border-black",
                                    "font-[family-name:var(--font-inter)] font-bold text-sm sm:text-base placeholder:text-neutral-400 dark:placeholder:text-zinc-500",
                                    "shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] focus:shadow-[2px_2px_0px_0px_#000]",
                                    "transition-all focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px]"
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar items-center px-1">
                        {filterTabs.map(tab => {
                            const isActive = filter === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-widest transition-all border-[3px] whitespace-nowrap",
                                        isActive
                                            ? "bg-[#FFBD2E] text-black border-black shadow-[2px_2px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                                            : "bg-white dark:bg-[#27272a] text-black dark:text-zinc-300 border-black hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                                    )}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Grid */}
                <div id="sims-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    <AnimatePresence mode="popLayout">
                        {filteredSims.map((sim) => {
                            const progress = getSimulationProgressState(store[sim.slug], sim.learning.checkpoints.length);

                            return (
                            <motion.div
                                key={sim.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="w-full h-full"
                            >
                                <ViewTransitionLink
                                    href={`/simulasyonlar/${sim.slug}`}
                                    className={cn(
                                        "relative flex flex-col w-full h-full overflow-hidden transition-all duration-200 cursor-pointer group rounded-[8px]",
                                        // EXACT MATCH TO QUESTION-CARD & NEO-ARTICLE-CARD
                                        "bg-white dark:bg-[#27272a]",
                                        "border-[3px] border-black",
                                        "shadow-[5px_5px_0px_0px_#000]",
                                        "hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px]"
                                    )}
                                >
                                    {/* Noise Texture */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                                    />

                                    {/* 1. Top Bar (Yellow Theme) */}
                                    <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-black bg-[#FFBD2E] z-10 relative">
                                        <div className="flex items-center gap-2">
                                            <Beaker className="w-4 h-4 text-black stroke-[3px]" />
                                            <span className="font-black text-xs uppercase tracking-widest text-black">
                                                DENEY ALANI
                                            </span>
                                        </div>
                                        <div className={cn(
                                            "px-2 py-0.5 border-2 border-black rounded-[4px] text-[10px] font-bold uppercase tracking-widest shadow-[1px_1px_0px_0px_#000] bg-white text-black",
                                            sim.difficulty === "Zor" && "bg-red-500 text-white border-black shadow-[1px_1px_0px_0px_#000]",
                                            sim.difficulty === "Orta" && "bg-orange-400 text-black border-black shadow-[1px_1px_0px_0px_#000]",
                                            sim.difficulty === "Kolay" && "bg-green-400 text-black border-black shadow-[1px_1px_0px_0px_#000]"
                                        )}>
                                            {progress.completed ? "TAMAMLANDI" : sim.difficulty === "Zor" ? "HARDCORE" : sim.difficulty}
                                        </div>
                                    </div>

                                    {/* 2. Main Body */}
                                    <div className="flex-1 p-5 flex flex-col gap-4 z-10 relative">
                                        
                                        {/* Icon & Title Row */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 shrink-0 bg-white dark:bg-[#18181b] border-[3px] border-black rounded-[8px] flex items-center justify-center shadow-[2px_2px_0px_0px_#000] group-hover:scale-105 transition-transform duration-300">
                                                <sim.icon className="w-6 h-6" style={{ color: sim.color, strokeWidth: 2.5 }} />
                                            </div>
                                            <div>
                                                <h3 className="font-[family-name:var(--font-outfit)] text-xl sm:text-2xl font-black text-black dark:text-zinc-50 leading-[1.1] uppercase tracking-tighter mb-1.5 group-hover:text-[#A26FE3] dark:group-hover:text-[#FFBD2E] transition-colors line-clamp-2">
                                                    {sim.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="font-[family-name:var(--font-inter)] text-sm font-semibold text-neutral-600 dark:text-zinc-300 leading-relaxed font-mono-accent line-clamp-3">
                                            {sim.description}
                                        </p>

                                        <div className="rounded-[7px] border-2 border-black/10 bg-neutral-50 p-3 dark:border-white/10 dark:bg-black/30">
                                            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-zinc-500">
                                                <BookOpen className="h-3.5 w-3.5" />
                                                Merak sorusu
                                            </div>
                                            <p className="line-clamp-2 text-xs font-black leading-5 text-black dark:text-zinc-100">
                                                {sim.learning.bigQuestion}
                                            </p>
                                        </div>

                                        {progress.checkedCount > 0 || progress.completed ? (
                                            <div className="rounded-[7px] border-2 border-black/10 bg-neutral-50 p-3 dark:border-white/10 dark:bg-black/30">
                                                <div className="mb-2 flex items-center justify-between gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-zinc-500">
                                                        İlerleme
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-zinc-100">
                                                        {progress.percent}%
                                                    </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full border border-black/20 bg-white dark:border-white/10 dark:bg-zinc-950">
                                                    <div className="h-full rounded-full bg-[#FFBD2E]" style={{ width: `${progress.percent}%` }} />
                                                </div>
                                            </div>
                                        ) : null}

                                        {/* Spacer to push footer down */}
                                        <div className="mt-auto"></div>

                                        {/* Separator */}
                                        <div className="w-full h-px border-t-[2px] border-dashed border-black/10 dark:border-white/20 mt-2 mb-1" />

                                        {/* 3. Footer */}
                                        <div className="flex items-center justify-between pt-1">
                                            {/* Formula Pill */}
                                            <div className="bg-neutral-100 dark:bg-black/50 px-2 py-1.5 rounded-md border-2 border-transparent group-hover:border-black/10 dark:group-hover:border-white/10 transition-colors flex items-center gap-2 overflow-hidden max-w-[70%]">
                                                <div className="w-2 h-2 rounded-full bg-green-500 border border-black/20 shrink-0" />
                                                <span className="font-mono text-[11px] text-black dark:text-zinc-300 font-bold tracking-tight truncate">
                                                    {sim.formula}
                                                </span>
                                            </div>

                                            <div className="hidden items-center gap-1 rounded-md bg-neutral-100 px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-600 dark:bg-black/50 dark:text-zinc-400 sm:flex">
                                                <ListChecks className="h-3.5 w-3.5" />
                                                {sim.learning.checkpoints.length}
                                            </div>

                                            {/* Action Button */}
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border-[3px] border-black bg-white dark:bg-[#18181b] text-black dark:text-white group-hover:bg-[#FFBD2E] group-hover:text-black transition-all shadow-[2px_2px_0px_0px_#000] group-hover:shadow-[1px_1px_0px_0px_#000] group-hover:translate-x-[1px] group-hover:translate-y-[1px]">
                                                <Play className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                </ViewTransitionLink>
                            </motion.div>
                            );
                        })}

                        {filteredSims.length === 0 && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="md:col-span-2 lg:col-span-3 rounded-[8px] border-[3px] border-black bg-white p-8 text-center shadow-[5px_5px_0px_0px_#000] dark:bg-[#27272a]"
                            >
                                <h2 className="text-xl font-black uppercase tracking-tight text-black dark:text-zinc-50">
                                    Sonuç bulunamadı
                                </h2>
                                <p className="mt-2 text-sm font-bold text-neutral-500 dark:text-zinc-400">
                                    Aramayı sadeleştir veya farklı bir zorluk filtresi seç.
                                </p>
                            </motion.div>
                        )}

                        {filter === "Tümü" && search.trim().length === 0 && (
                            <motion.div
                                key="coming-soon"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full h-full"
                            >
                                <div className="h-full bg-white/50 dark:bg-[#27272a]/50 border-[3px] border-dashed border-black/30 dark:border-white/30 rounded-[8px] p-6 flex flex-col items-center justify-center text-center opacity-80 hover:opacity-100 transition-opacity cursor-default min-h-[250px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                                    <div className="w-12 h-12 bg-neutral-100 dark:bg-[#18181b] border-[3px] border-black/20 dark:border-white/20 rounded-[8px] flex items-center justify-center mb-4">
                                        <Zap className="w-6 h-6 text-neutral-400 dark:text-zinc-600 stroke-[3px]" />
                                    </div>
                                    <h3 className="font-[family-name:var(--font-outfit)] text-xl font-black text-black dark:text-zinc-50 uppercase tracking-tighter mb-1.5">
                                        YENİ DENEYLER
                                    </h3>
                                    <p className="font-[family-name:var(--font-inter)] text-xs font-bold text-neutral-500 dark:text-zinc-400 max-w-[200px]">
                                        Kuantum laboratuvarı çok yakında erişimde.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
