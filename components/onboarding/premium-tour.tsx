"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "@/app/auth/actions";
import { Sparkles, Menu, User, X, Zap, ArrowRight, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const tourSteps = [
    {
        id: "intro",
        title: "Hoş Geldin.",
        subtitle: "Yolculuk Başlıyor",
        description: "Burası FizikHub. Bilimin en samimi, bazen de en kaotik köşesi. Seni burada görmek güzel. Hadi, kısa bir turla evini gezdirelim.",
        icon: Sparkles,
        position: "center" as const,
        highlight: "none"
    },
    {
        id: "bottom-nav",
        title: "Pusulan Burada.",
        subtitle: "Hızlı Erişim",
        description: "Aşağıdaki bar senin ana portalın. Akış, forum ve makaleler arasında tek tıkla ışınlanabilirsin. Kaybolursan 'Ev' ikonu seni kurtarır.",
        icon: Rocket,
        position: "bottom" as const,
        highlight: "bottom-bar"
    },
    {
        id: "menu",
        title: "Detaylarda Gizli.",
        subtitle: "Hazine Sandığı",
        description: "Sağ üstteki menüde sözlükten sıralamalara kadar her şey saklı. Orayı kurcalamayı sakın unutma.",
        icon: Menu,
        position: "top" as const,
        highlight: "top-right"
    },
    {
        id: "profile",
        title: "Senin İmzan.",
        subtitle: "Dijital Kimlik",
        description: "Profilin senin evrendeki izin. Avatarını ve biyografini ekle, bilim dünyasında yerini al. Her şey senin elinde.",
        icon: User,
        position: "bottom" as const,
        highlight: "bottom-right"
    },
    {
        id: "outro",
        title: "Sahne Senin.",
        subtitle: "Her Şey Hazır",
        description: "Tur bitti. Şimdi merakına güven ve keşfetmeye başla. Bir sorun olursa buralardayız. Görüşürüz!",
        icon: Zap,
        position: "center" as const,
        highlight: "none"
    }
];

export function PremiumTour() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const step = tourSteps[currentStep];
    const isLastStep = currentStep === tourSteps.length - 1;
    const Icon = step.icon;

    const handleNext = () => {
        if (isLastStep) {
            handleComplete();
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleComplete = async () => {
        setIsVisible(false);
        const formData = new FormData();
        await completeOnboarding(formData);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="overlay"
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[12px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            <motion.div
                key={step.id}
                className={cn(
                    "fixed z-[101] w-full px-4 md:w-auto md:max-w-[400px]",
                    step.position === "center" && "inset-0 flex items-center justify-center pointer-events-none",
                    step.position === "bottom" && "bottom-28 left-0 right-0 md:left-1/2 md:-translate-x-1/2",
                    step.position === "top" && "top-28 left-0 right-0 md:left-1/2 md:-translate-x-1/2"
                )}
                initial={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, y: -10, filter: "blur(10px)" }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 0.4
                }}
            >
                {/* Spotlight Shadows */}
                {step.highlight !== "none" && (
                    <motion.div
                        className={cn(
                            "fixed pointer-events-none z-[-1]",
                            step.highlight === "bottom-bar" && "bottom-0 left-0 right-0 h-32 bg-orange-500/10 blur-[120px]",
                            step.highlight === "top-right" && "top-0 right-0 w-48 h-48 bg-orange-500/10 blur-[120px]",
                            step.highlight === "bottom-right" && "bottom-0 right-0 w-48 h-48 bg-orange-500/10 blur-[120px]"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}

                {/* The Card */}
                <div className="bg-[#0D0D0D]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] pointer-events-auto relative overflow-hidden">
                    {/* Neo-Brutalist Border Accent */}
                    <div className="absolute inset-0 border-2 border-white/5 rounded-[32px] pointer-events-none" />

                    {/* Subtle Grain Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

                    {/* Content Section */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <motion.div
                            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6"
                            initial={{ rotate: -5, scale: 0.9 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                        >
                            <Icon className="w-6 h-6 text-white" />
                        </motion.div>

                        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                            {step.title}
                        </h2>
                        <h3 className="text-[11px] font-black text-orange-500/80 uppercase tracking-[0.3em] mb-4">
                            {step.subtitle}
                        </h3>
                        <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-[260px] font-medium">
                            {step.description}
                        </p>

                        {/* Controls Container */}
                        <div className="flex items-center gap-6 w-full pt-2">
                            {/* Progress Dots */}
                            <div className="flex gap-2">
                                {tourSteps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "h-1 rounded-full transition-all duration-500",
                                            idx === currentStep ? "w-6 bg-white" : "w-1 bg-white/10"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleNext}
                                className="ml-auto group relative flex items-center"
                            >
                                <div className="absolute inset-0 bg-white/10 blur-xl group-hover:bg-white/20 transition-all rounded-full" />
                                <div className="relative h-12 px-6 bg-white text-black font-black text-[11px] uppercase tracking-widest rounded-full flex items-center gap-2 transition-transform active:scale-95">
                                    {isLastStep ? "Bitir" : "Devam Et"}
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Skip Option */}
                <button
                    onClick={handleComplete}
                    className="mt-6 mx-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white/60 transition-colors pointer-events-auto"
                >
                    Turu Atla <X className="w-3 h-3" />
                </button>
            </motion.div>
        </AnimatePresence>
    );
}
