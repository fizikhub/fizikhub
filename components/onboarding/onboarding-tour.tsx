"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "@/app/actions/onboarding";
import { MessageCircle, Feather, BookOpen, Menu, Star, ChevronRight, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const tourSteps = [
    {
        id: "welcome",
        title: "HOŞ GELDİN!",
        subtitle: "Evrenin en garip köşesine hoş geldin.",
        description: "Burada bilim ciddi, ama biz değiliz. Hazırsan hızlı bi tur atalım, kaybolmaman için.",
        icon: Sparkles,
        position: "center" as const,
    },
    {
        id: "forum",
        title: "FORUM",
        subtitle: "Tartışma Arenası",
        description: "Soru sor, cevap ver, puanları topla. Saçma sapan sorular da olur, kimse yargılamıyor (belki biraz).",
        icon: MessageCircle,
        position: "bottom" as const,
        highlight: "forum",
    },
    {
        id: "blog",
        title: "BLOG",
        subtitle: "Güncel İçerikler",
        description: "Yazarlarımızın kafasından geçenler. Uzaydan tutun kuantuma, bazen de rastgele saçmalıklara.",
        icon: Feather,
        position: "bottom" as const,
        highlight: "blog",
    },
    {
        id: "makale",
        title: "MAKALE",
        subtitle: "Ciddi İşler",
        description: "Burada işler biraz daha akademik. Ama sıkılma, hâlâ eğlenceli tutmaya çalıştık.",
        icon: BookOpen,
        position: "bottom" as const,
        highlight: "makale",
    },
    {
        id: "menu",
        title: "MENÜ",
        subtitle: "Lügat, Sıralama, Herşey",
        description: "Sağ üstteki hamburger menüsünde (evet hamburger) Lügat, Sıralama falan var. Kaybolursan oraya bak.",
        icon: Menu,
        position: "top" as const,
        highlight: "menu",
    },
    {
        id: "hubpoints",
        title: "HUB PUANI",
        subtitle: "Sıralama = Ego",
        description: "Yorum yap, cevap ver, beğeni topla. Puanın artsın, sıralamada yüksel. Basit.",
        icon: Star,
        position: "center" as const,
    },
    {
        id: "finish",
        title: "HAZIRSIN!",
        subtitle: "Artık içeriden birisin.",
        description: "Hadi bakalım, keşfetmeye başla. Sorularını merak ediyoruz.",
        icon: Sparkles,
        position: "center" as const,
    },
];

export function OnboardingTour() {
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

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = async () => {
        setIsVisible(false);
        await completeOnboarding();
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step.id}
                className="fixed inset-0 z-[200]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleSkip} />

                {/* Spotlight Effect for Bottom Nav Items */}
                {step.highlight && step.position === "bottom" && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    />
                )}

                {/* Top Spotlight for Menu */}
                {step.highlight === "menu" && (
                    <motion.div
                        className="absolute top-0 right-0 w-20 h-20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        <div className="absolute top-2 right-2 w-12 h-12 border-4 border-primary rounded-lg animate-pulse" />
                        <motion.div
                            className="absolute top-6 right-6 w-4 h-4 bg-primary rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        />
                    </motion.div>
                )}

                {/* Main Card */}
                <motion.div
                    className={cn(
                        "absolute left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md",
                        step.position === "bottom" && "bottom-24 md:bottom-32",
                        step.position === "top" && "top-20 md:top-24",
                        step.position === "center" && "top-1/2 -translate-y-1/2"
                    )}
                    initial={{ opacity: 0, y: step.position === "top" ? -50 : 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: step.position === "top" ? -50 : 50, scale: 0.9 }}
                    transition={{ type: "spring", bounce: 0.3 }}
                >
                    {/* Brutalist Card */}
                    <div className="bg-background border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden">
                        {/* Top Bar */}
                        <div className="bg-primary h-2" />

                        {/* Skip Button */}
                        <button
                            onClick={handleSkip}
                            className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="p-6 pt-4">
                            {/* Step Indicator */}
                            <div className="flex gap-1.5 mb-4">
                                {tourSteps.map((_, index) => (
                                    <motion.div
                                        key={index}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all",
                                            index === currentStep ? "bg-primary w-8" : index < currentStep ? "bg-primary/50 w-4" : "bg-muted w-4"
                                        )}
                                        layout
                                    />
                                ))}
                            </div>

                            {/* Icon */}
                            <motion.div
                                className="w-16 h-16 bg-primary/10 border-2 border-primary flex items-center justify-center mb-4"
                                initial={{ rotate: -10, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", delay: 0.1 }}
                            >
                                <Icon className="w-8 h-8 text-primary" />
                            </motion.div>

                            {/* Text */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">{step.title}</h2>
                                <p className="text-sm font-bold text-primary uppercase tracking-wide mb-3">{step.subtitle}</p>
                                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                            </motion.div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSkip}
                                    className="flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors border-2 border-transparent hover:border-muted"
                                >
                                    Geç
                                </button>
                                <motion.button
                                    onClick={handleNext}
                                    className="flex-1 py-3 px-4 text-sm font-black uppercase tracking-wide bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white flex items-center justify-center gap-2 hover:bg-primary hover:border-primary hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLastStep ? "Başla" : "İleri"}
                                    <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Arrow Pointer (for bottom positioned items) */}
                    {step.position === "bottom" && step.highlight && (
                        <motion.div
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-black dark:border-t-white" />
                        </motion.div>
                    )}
                </motion.div>

                {/* Bottom Nav Highlight Labels */}
                {step.highlight && step.position === "bottom" && (
                    <motion.div
                        className="absolute bottom-2 left-0 right-0 flex justify-around px-4 pointer-events-none md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {["makale", "blog", "forum"].map((item) => (
                            <div
                                key={item}
                                className={cn(
                                    "text-[10px] font-black uppercase tracking-wider px-2 py-1",
                                    step.highlight === item ? "bg-primary text-black" : "opacity-0"
                                )}
                            >
                                {item === "makale" && "📚"}
                                {item === "blog" && "✍️"}
                                {item === "forum" && "💬"}
                            </div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
