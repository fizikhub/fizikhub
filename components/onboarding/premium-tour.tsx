"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "@/app/auth/actions";
import { Sparkles, X, ArrowRight, ArrowUp, ArrowDown, ArrowLeft, ArrowRight as ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Screen break point for mobile check
const MOBILE_BREAKPOINT = 768;

type TourStep = {
    id: string;
    targetId?: string; // If 'none', it's a modal. If string, it's a spotlight.
    title: string;
    description: string;
    position?: "top" | "bottom" | "left" | "right" | "center";
    arrow?: "up" | "down" | "left" | "right" | "none";
};

const STEPS: TourStep[] = [
    {
        id: "intro",
        title: "HOŞ GELDİN ÇAYLAK.",
        description: "Burası FizikHub. Bilimin en samimi, bazen de en kaotik köşesi. Seni burada görmek güzel. Hadi, kısa bir turla evini gezdirelim.",
        position: "center",
        arrow: "none"
    },
    // MOBILE STEPS
    {
        id: "mobile-home",
        targetId: "nav-item-home",
        title: "ANA ÜS",
        description: "Kaybolursan buraya bas. Seni eve, güvenli bölgeye ışınlar.",
        position: "top",
        arrow: "down"
    },
    {
        id: "mobile-forum",
        targetId: "nav-item-forum",
        title: "KAOS ALANI",
        description: "Burası Forum. Soru sor, tartış, ama saçmalama. Bilim ciddi iştir (bazen).",
        position: "top",
        arrow: "down"
    },
    {
        id: "mobile-share",
        targetId: "nav-item-share",
        title: "DÜNYAYI KURTAR",
        description: "Ya da sadece bir şeyler paylaş. Makale, soru, ne varsa. Sahne senin.",
        position: "top",
        arrow: "down"
    },
    {
        id: "mobile-profile",
        targetId: "nav-item-profile",
        title: "KİMLİK KARTI",
        description: "Profilin senin izin. Avatarını koy, biyografini yaz. Anonim takılma.",
        position: "top",
        arrow: "down"
    },
    {
        id: "mobile-menu",
        targetId: "mobile-menu-trigger",
        title: "ZULA",
        description: "Gizli bölme burada. Sıralamalar, sözlük ve diğer ıvır zıvırlar.",
        position: "bottom",
        arrow: "up"
    },
    // DESKTOP STEPS
    {
        id: "desktop-nav-home",
        targetId: "desktop-nav-home",
        title: "ANA ÜS",
        description: "Geri dönmek istersen adres belli.",
        position: "bottom",
        arrow: "up"
    },
    {
        id: "desktop-search",
        targetId: "desktop-search-trigger",
        title: "HER ŞEYİ BUL",
        description: "Evrenin sırlarını ya da sadece o kaçırdığın makaleyi ara.",
        position: "bottom",
        arrow: "up"
    },
    {
        id: "desktop-zap",
        targetId: "desktop-zap-trigger",
        title: "PREMIUM GÜÇ",
        description: "Özel içerikler ve havalı özellikler için portaldan geç.",
        position: "bottom",
        arrow: "up"
    },
    {
        id: "outro",
        title: "SAHNE SENİN.",
        description: "Tur bitti. Artık bizden birisin. Git ve bir şeyler keşfet. Ya da boz. Sorun değil.",
        position: "center",
        arrow: "none"
    }
];

export function PremiumTour() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [filteredSteps, setFilteredSteps] = useState<TourStep[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Initial Filter based on visible elements
    useEffect(() => {
        setIsMounted(true);
        // Small delay to ensure layout is settled
        const timer = setTimeout(() => {
            const availableSteps = STEPS.filter(step => {
                if (!step.targetId) return true; // Always show modals (intro/outro)
                const el = document.getElementById(step.targetId);
                // Check if element exists and is visible (width > 0)
                return el && el.getBoundingClientRect().width > 0;
            });
            setFilteredSteps(availableSteps);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const currentStep = filteredSteps[currentStepIndex];

    // Update rect when step changes or resize
    const updateRect = useCallback(() => {
        if (!currentStep?.targetId) {
            setRect(null);
            return;
        }
        const el = document.getElementById(currentStep.targetId);
        if (el) {
            setRect(el.getBoundingClientRect());
        }
    }, [currentStep]);

    useEffect(() => {
        updateRect();
        window.addEventListener("resize", updateRect);
        window.addEventListener("scroll", updateRect);
        return () => {
            window.removeEventListener("resize", updateRect);
            window.removeEventListener("scroll", updateRect);
        };
    }, [updateRect, currentStep]);

    const handleNext = () => {
        if (currentStepIndex >= filteredSteps.length - 1) {
            handleComplete();
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handleComplete = async () => {
        setIsVisible(false);
        const formData = new FormData();
        await completeOnboarding(formData);
    };

    if (!isVisible || !isMounted || !currentStep) return null;

    const isModal = !currentStep.targetId;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="tour-container"
                className="fixed inset-0 z-[100] isolate pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* BACKDROP WITH HOLE (CLIP PATH) */}
                {rect ? (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <svg className="w-full h-full">
                            <defs>
                                <mask id="spotlight-mask">
                                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                    <rect
                                        x={rect.left - 8}
                                        y={rect.top - 8}
                                        width={rect.width + 16}
                                        height={rect.height + 16}
                                        rx="12"
                                        fill="black"
                                    />
                                </mask>
                            </defs>
                            <rect
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                fill="rgba(0,0,0,0.85)"
                                mask="url(#spotlight-mask)"
                            />
                        </svg>
                        {/* Glow effect around the hole */}
                        <motion.div
                            className="absolute border-2 border-[#FACC15] rounded-xl shadow-[0_0_30px_rgba(250,204,21,0.5)] bg-transparent"
                            style={{
                                left: rect.left - 8,
                                top: rect.top - 8,
                                width: rect.width + 16,
                                height: rect.height + 16
                            }}
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 20 }}
                        />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md z-0 pointer-events-auto"
                    />
                )}

                {/* CONTENT */}
                <div className="absolute inset-0 z-10 w-full h-full pointer-events-auto">
                    {/* Modal Centered Content */}
                    {isModal && (
                        <div className="flex items-center justify-center w-full h-full p-4">
                            <motion.div
                                key={currentStep.id}
                                layoutId="modal-card"
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-[#121212] border-2 border-white/20 p-8 rounded-[32px] max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FACC15] to-[#ff00ff]" />
                                <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-white/10">
                                    <Sparkles className="w-8 h-8 text-[#FACC15]" />
                                </div>
                                <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">{currentStep.title}</h2>
                                <p className="text-zinc-400 font-medium leading-relaxed mb-8">{currentStep.description}</p>
                                <button
                                    onClick={handleNext}
                                    className="w-full py-4 bg-white text-black font-black uppercase text-sm tracking-widest rounded-xl hover:bg-zinc-200 transition-colors"
                                >
                                    {currentStepIndex === filteredSteps.length - 1 ? "BAŞLA" : "DEVAM ET"}
                                </button>
                            </motion.div>
                        </div>
                    )}

                    {/* Spotlight Positioning */}
                    {!isModal && rect && (
                        <motion.div
                            key={currentStep.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: "absolute",
                                ...(currentStep.position === 'top' && {
                                    top: rect.top - 200, // Moved up to clear element
                                    left: 0, right: 0,
                                    margin: "0 auto",
                                    width: "90%",
                                    maxWidth: "320px"
                                }),
                                ...(currentStep.position === 'bottom' && {
                                    top: rect.bottom + 20,
                                    left: rect.left + rect.width / 2 - 160,
                                    width: "320px"
                                }),
                                ...(currentStep.position === 'center' && { // Fallback
                                    top: "50%", left: "50%", transform: "translate(-50%, -50%)"
                                })
                            }}
                            className="bg-[#121212] border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col gap-3 relative"
                        >
                            {/* Arrow Pointer */}
                            {currentStep.arrow === 'down' && (
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[#FACC15] animate-bounce">
                                    <ArrowDown className="w-8 h-8" />
                                </div>
                            )}
                            {currentStep.arrow === 'up' && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#FACC15] animate-bounce">
                                    <ArrowUp className="w-8 h-8" />
                                </div>
                            )}

                            <div className="flex items-start justify-between">
                                <h3 className="text-lg font-black text-white uppercase">{currentStep.title}</h3>
                                <button onClick={handleComplete} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
                            </div>
                            <p className="text-sm text-zinc-400 font-medium leading-relaxed">{currentStep.description}</p>

                            <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/10">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Adım {currentStepIndex + 1}/{filteredSteps.length}</span>
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 text-xs font-black bg-white text-black px-4 py-2 rounded-lg uppercase hover:scale-105 transition-transform"
                                >
                                    {currentStepIndex === filteredSteps.length - 1 ? "BİTİR" : "İLERİ"}
                                    <ArrowRightIcon className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
