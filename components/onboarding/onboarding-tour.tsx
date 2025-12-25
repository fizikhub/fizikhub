"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "@/app/actions/onboarding";
import { MessageCircle, Feather, BookOpen, Menu, Star, ChevronRight, X, Sparkles, Home, User } from "lucide-react";
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
        bottomNavIndex: 3, // Forum is 4th item (0-indexed)
    },
    {
        id: "blog",
        title: "BLOG",
        subtitle: "Senin Köşen",
        description: "Sadece veri tüketme, sen de üret! Kendi blogunu oluştur, araştırmalarını paylaş, toplulukla buluş.",
        icon: Feather,
        position: "bottom" as const,
        bottomNavIndex: 2, // Blog is 3rd item
    },
    {
        id: "makale",
        title: "MAKALE",
        subtitle: "Ciddi İşler",
        description: "Burada işler biraz daha akademik. Ama sıkılma, hâlâ eğlenceli tutmaya çalıştık.",
        icon: BookOpen,
        position: "bottom" as const,
        bottomNavIndex: 1, // Makale is 2nd item
    },
    {
        id: "menu",
        title: "MENÜ",
        subtitle: "Lügat, Sıralama, Herşey",
        description: "Sağ üstteki hamburger menüsünde Lügat (terimleri öğren), Sıralama (en iyileri gör) ve daha fazlası var.",
        icon: Menu,
        position: "top" as const,
    },
    {
        id: "hubpoints",
        title: "HUB PUANI",
        subtitle: "Katkın = Puanın",
        description: "Yorum yaz (+2), soru sor (+5), cevap ver (+3), beğeni al (+1). Ne kadar katkı, o kadar puan. Sıralamada yüksel, rozet kazan!",
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

// Bottom nav items matching the actual component
const bottomNavItems = [
    { label: "ANA SAYFA", icon: Home },
    { label: "MAKALE", icon: BookOpen },
    { label: "BLOG", icon: Feather },
    { label: "FORUM", icon: MessageCircle },
    { label: "PROFİL", icon: User },
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
                transition={{ duration: 0.15 }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/85" onClick={handleSkip} />

                {/* Top Spotlight for Menu */}
                {step.id === "menu" && (
                    <motion.div
                        className="absolute top-2 right-2 md:hidden"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-14 h-14 border-4 border-primary rounded-lg flex items-center justify-center bg-background/20 backdrop-blur-sm">
                            <Menu className="w-6 h-6 text-primary" />
                        </div>
                        <motion.div
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45"
                            animate={{ y: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                        />
                    </motion.div>
                )}

                {/* Main Card */}
                <motion.div
                    className={cn(
                        "absolute left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md",
                        step.position === "bottom" && "bottom-28 md:bottom-32",
                        step.position === "top" && "top-24 md:top-28",
                        step.position === "center" && "top-1/2 -translate-y-1/2"
                    )}
                    initial={{ opacity: 0, y: step.position === "top" ? -30 : 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
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
                                    <div
                                        key={index}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all duration-200",
                                            index === currentStep ? "bg-primary w-8" : index < currentStep ? "bg-primary/50 w-4" : "bg-muted w-4"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Icon */}
                            <motion.div
                                className="w-16 h-16 bg-primary/10 border-2 border-primary flex items-center justify-center mb-4"
                                initial={{ rotate: -10, scale: 0.8 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Icon className="w-8 h-8 text-primary" />
                            </motion.div>

                            {/* Text */}
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">{step.title}</h2>
                                <p className="text-sm font-bold text-primary uppercase tracking-wide mb-3">{step.subtitle}</p>
                                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSkip}
                                    className="flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors border-2 border-transparent hover:border-muted"
                                >
                                    Geç
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex-1 py-3 px-4 text-sm font-black uppercase tracking-wide bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white flex items-center justify-center gap-2 hover:bg-primary hover:border-primary hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                                >
                                    {isLastStep ? "Başla" : "İleri"}
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Arrow Pointer for bottom nav items */}
                    {step.position === "bottom" && step.bottomNavIndex !== undefined && (
                        <motion.div
                            className="absolute -bottom-6 md:hidden"
                            style={{
                                left: `${(step.bottomNavIndex / 4) * 100 - 10}%`,
                            }}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <motion.div
                                animate={{ y: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6 }}
                            >
                                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white" />
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Actual Bottom Nav Replica (only on mobile and for bottom steps) */}
                {step.position === "bottom" && step.bottomNavIndex !== undefined && (
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 md:hidden z-[201]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="bg-background/95 backdrop-blur-xl border-t-2 border-black dark:border-white">
                            <div className="flex h-14 items-center justify-around px-2">
                                {bottomNavItems.map((item, index) => {
                                    const NavIcon = item.icon;
                                    const isHighlighted = index === step.bottomNavIndex;

                                    return (
                                        <div
                                            key={item.label}
                                            className={cn(
                                                "relative flex flex-col items-center justify-center gap-0.5 px-2 py-1 transition-all",
                                                isHighlighted ? "text-primary" : "text-muted-foreground/50"
                                            )}
                                        >
                                            {/* Highlight ring for active item */}
                                            {isHighlighted && (
                                                <motion.div
                                                    className="absolute inset-0 border-2 border-primary rounded-lg bg-primary/10"
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}

                                            <NavIcon className={cn(
                                                "h-5 w-5 relative z-10",
                                                isHighlighted && "stroke-[2.5px]"
                                            )} />

                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-wider relative z-10",
                                                isHighlighted ? "text-primary" : "opacity-50"
                                            )}>
                                                {item.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
