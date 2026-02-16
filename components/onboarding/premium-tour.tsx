"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "@/app/auth/actions";
import { Rocket, Sparkles, Menu, Star, User, ChevronRight, X, Zap, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const tourSteps = [
    {
        id: "intro",
        title: "KAPTAN KÖŞKÜ YÜKLENİYOR...",
        subtitle: "Hazır mısın Çırak?",
        description: "Evrenin en garip köşesine hoş geldin. Burası FizikHub. Bilim ciddi iş ama biz o kadar değiliz. Kısa bir turla sana etrafı gösterelim, sonra seni kara deliğin içine bırakırız.",
        icon: Rocket,
        position: "center" as const,
        highlight: "none"
    },
    {
        id: "bottom-nav",
        title: "NAVİGASYON PANELİ",
        subtitle: "Kaybolmaman İçin",
        description: "Aşağıdaki çubuk senin pusulan. Akış, Makaleler, Bloglar... Kaybolursan 'Ev' ikonuna bas, seni başlangıca ışınlar.",
        icon: Cpu,
        position: "bottom" as const,
        highlight: "bottom-bar"
    },
    {
        id: "menu",
        title: "GİZLİ BÖLMELER",
        subtitle: "Hamburger Menü",
        description: "Sağ üstteki o üç çizgi var ya? Orası hazine sandığı. Sıralamalar, Bilim Sözlüğü ve daha fazlası orada saklı.",
        icon: Menu,
        position: "top" as const,
        highlight: "top-right"
    },
    {
        id: "points",
        title: "YILDIZ TOZU (PUANLAR)",
        subtitle: "Statü Meselesi",
        description: "Soru sor, cevap ver, millete sataş (şaka şaka, bilimsel tartış). Her katkı sana puan kazandırır. Puanlar prestijdir, harcanmaz ama havalıdır.",
        icon: Star,
        position: "center" as const,
        highlight: "none"
    },
    {
        id: "profile",
        title: "KİMLİK KARTI",
        subtitle: "Profilin Burası",
        description: "Alttaki 'İnsan' ikonuna basarsan profiline gidersin. Orada 'Profili Düzenle' butonu var. Avatarını, biyografini oradan ayarla. Bize kendini tanıt.",
        icon: User,
        position: "bottom" as const,
        highlight: "bottom-right"
    },
    {
        id: "outro",
        title: "SİSTEMLER AKTİF!",
        subtitle: "Artık Bizden Birisin",
        description: "Tamam, eğitim bitti. Şimdi git ve evrenin sırlarını çözmeye çalış. Ya da kedi videoları izle, senin tercihin.",
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
        await completeOnboarding(new FormData());
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="overlay"
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            <motion.div
                key={step.id}
                className={cn(
                    "fixed z-[101] w-full px-4 md:w-auto md:max-w-md",
                    step.position === "center" && "inset-0 flex items-center justify-center pointer-events-none",
                    step.position === "bottom" && "bottom-24 left-0 right-0 md:left-1/2 md:-translate-x-1/2",
                    step.position === "top" && "top-24 left-0 right-0 md:left-1/2 md:-translate-x-1/2"
                )}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* Spotlight Effects */}
                {step.highlight === "bottom-bar" && (
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 h-20 bg-primary/20 z-[-1] blur-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
                {step.highlight === "top-right" && (
                    <motion.div
                        className="fixed top-0 right-0 w-24 h-24 bg-primary/20 z-[-1] blur-3xl rounded-bl-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
                {step.highlight === "bottom-right" && (
                    <motion.div
                        className="fixed bottom-0 right-0 w-32 h-24 bg-primary/20 z-[-1] blur-3xl rounded-tl-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}

                {/* Main Card */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] pointer-events-auto relative overflow-hidden group">

                    {/* Background Noise & Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />

                    {/* Top Glow Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />

                    {/* Close Button */}
                    <button
                        onClick={handleComplete}
                        className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Icon Container */}
                        <motion.div
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl"
                            initial={{ rotate: -10, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                        >
                            <Icon className="w-8 h-8 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                        </motion.div>

                        {/* Text Content */}
                        <h2 className="text-2xl font-black text-white tracking-tight mb-2 uppercase">
                            {step.title}
                        </h2>
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                            {step.subtitle}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-[280px]">
                            {step.description}
                        </p>

                        {/* Controls */}
                        <div className="flex items-center gap-4 w-full">
                            {/* Step Indicators */}
                            <div className="flex gap-1.5 flex-1 justify-center">
                                {tourSteps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all duration-300",
                                            idx === currentStep ? "w-8 bg-white" : "w-1.5 bg-white/20"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Action Button */}
                            <motion.button
                                onClick={handleNext}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-white text-black font-black text-sm uppercase tracking-wide rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                            >
                                {isLastStep ? "Başla" : "Devam"}
                                <ChevronRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
