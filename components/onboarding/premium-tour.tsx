"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "@/app/auth/actions";
import { X, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

type TourStep = {
    id: string;
    targetId?: string; // If 'none', it's a modal.
    title: string;
    description: string;
    // We will dynamically calculate position based on screen half, but 'force' overrides
    forcePosition?: "top" | "bottom";
};

const STEPS: TourStep[] = [
    {
        id: "intro",
        title: "HOŞ GELDİN.",
        description: "Burası FizikHub. Bilimin en samimi köşesi. Hadi kısa bir turla siteyi gezdirelim.",
    },
    // MOBILE STEPS
    {
        id: "mobile-home",
        targetId: "nav-item-home",
        title: "ANA SAYFA",
        description: "Akışın, gönderilerin ve evrenin merkezi burası.",
        forcePosition: "top"
    },
    {
        id: "mobile-forum",
        targetId: "nav-item-forum",
        title: "FORUM",
        description: "Soru sor, tartış, fikirlerini paylaş. Bilim paylaştıkça çoğalır.",
        forcePosition: "top"
    },
    {
        id: "mobile-share",
        targetId: "nav-item-share",
        title: "PAYLAŞ",
        description: "Makale, soru veya sadece bir düşünce. Sahne senin.",
        forcePosition: "top"
    },
    {
        id: "mobile-profile",
        targetId: "nav-item-profile",
        title: "PROFIL",
        description: "Kimliğin, yazıların ve sana dair her şey burada.",
        forcePosition: "top"
    },
    {
        id: "mobile-menu",
        targetId: "mobile-menu-trigger",
        title: "MENÜ",
        description: "Sıralamalar, sözlük ve diğer araçlar bu zulada.",
        forcePosition: "bottom" // Menu is usually at top right, so bottom is safe
    },
    // DESKTOP STEPS
    {
        id: "desktop-nav-home",
        targetId: "desktop-nav-home",
        title: "ANA SAYFA",
        description: "Her zaman başlangıça dönmek için.",
        forcePosition: "bottom"
    },
    {
        id: "desktop-search",
        targetId: "desktop-search-trigger",
        title: "ARAMA",
        description: "Evrenin sırlarını ya da o kaçırdığın makaleyi bul.",
        forcePosition: "bottom"
    },
    {
        id: "outro",
        title: "HAZIRSIN.",
        description: "Tur bitti. Artık keşfetme sırası sende. İyi eğlenceler!",
    }
];

export function PremiumTour() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [filteredSteps, setFilteredSteps] = useState<TourStep[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // For smart positioning
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    // Initial Filter based on visible elements
    useEffect(() => {
        setIsMounted(true);
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });

        const timer = setTimeout(() => {
            const availableSteps = STEPS.filter(step => {
                if (!step.targetId) return true; // Always show modals (intro/outro)
                const el = document.getElementById(step.targetId);
                return el && el.getBoundingClientRect().width > 0;
            });
            setFilteredSteps(availableSteps);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const currentStep = filteredSteps[currentStepIndex];

    // Update rect when step changes or resize
    const updateRect = useCallback(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
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

    // --- POSITIONING LOGIC ---
    const isMobile = windowSize.width < 768; // Simple mobile check
    const MARGIN = 16;
    const CARD_WIDTH = isMobile ? windowSize.width - (MARGIN * 2) : 320;

    let top = 0;
    let left = 0;
    let xOffset = 0; // For arrow positioning relative to card
    let arrowDirection = "none";
    let isPositioned = false;

    if (rect && !isModal) {
        // 1. Determine Vertical Position (Top or Bottom)
        const isTopHalf = rect.top < windowSize.height / 2;
        const showOnTop = currentStep.forcePosition === "top" || (!currentStep.forcePosition && !isTopHalf);

        if (showOnTop) {
            top = rect.top - 16; // 16px gap above target
            // We'll translate Y -100% in CSS to sit above
            arrowDirection = "down";
        } else {
            top = rect.bottom + 16; // 16px gap below target
            // We'll translate Y 0 in CSS
            arrowDirection = "up";
        }

        // 2. Determine Horizontal Position
        if (isMobile) {
            // MOBILE: Always center the card horizontally with fixed margins
            left = MARGIN;

            // Calculate arrow position based on target center relative to screen
            const targetCenter = rect.left + (rect.width / 2);
            // Arrow needs to be at 'targetCenter' relative to screen
            // Card starts at 'MARGIN' (16px) relative to screen
            // xOffset (inside card) = targetCenter - cardLeft
            xOffset = targetCenter - MARGIN;

            // Clamp arrow so it doesn't detach from card
            if (xOffset < 10) xOffset = 10;
            if (xOffset > CARD_WIDTH - 10) xOffset = CARD_WIDTH - 10;

        } else {
            // DESKTOP: Center on target with clamping
            const targetCenter = rect.left + (rect.width / 2);
            left = targetCenter - (CARD_WIDTH / 2);

            // Clamp to screen edges
            if (left < MARGIN) {
                left = MARGIN;
            } else if (left + CARD_WIDTH > windowSize.width - MARGIN) {
                left = windowSize.width - CARD_WIDTH - MARGIN;
            }

            // Arrow X = targetCenter - left.
            xOffset = targetCenter - left;
        }

        isPositioned = true;
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="tour-container"
                className="fixed inset-0 z-[100] isolate pointer-events-none font-sans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* BACKDROP WITH HOLE */}
                {rect && isPositioned ? (
                    <div className="absolute inset-0 z-0 overflow-hidden transition-all duration-500 ease-out">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                        {/* We can't easily do a true 'hole' with simpler React without a heavy library. 
                             Instead, let's just highlight the target with a border overlay. 
                             The user can see the target through the semi-transparent black.
                          */}

                        {/* Target Highlighter */}
                        <motion.div
                            className="absolute border-4 border-[#FF6B00] bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
                            style={{
                                left: rect.left - 4,
                                top: rect.top - 4,
                                width: rect.width + 8,
                                height: rect.height + 8,
                                borderRadius: currentStep.targetId?.includes('profile') ? '9999px' : '12px'
                            }}
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0 pointer-events-auto"
                    />
                )}

                {/* MODAL CONTENT (Intro/Outro) */}
                {isModal && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center p-6 pointer-events-auto">
                        <motion.div
                            key={currentStep.id}
                            initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border-4 border-black p-8 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
                        >
                            {/* Decorative Tape */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#FF6B00]/20 rotate-1 border border-black/10" />

                            <h2 className="text-4xl font-black text-black mb-4 uppercase leading-[0.9] tracking-tighter">
                                {currentStep.title}
                            </h2>
                            <p className="text-black text-lg font-bold leading-tight mb-8">
                                {currentStep.description}
                            </p>

                            <button
                                onClick={handleNext}
                                className="w-full py-4 bg-black text-white font-black uppercase text-xl transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,107,0,1)] border-2 border-transparent"
                            >
                                {currentStepIndex === filteredSteps.length - 1 ? "Keşfetmeye Başla" : "Başlayalım"}
                            </button>
                        </motion.div>
                    </div>
                )}

                {/* SPOTLIGHT CARD */}
                {!isModal && isPositioned && (
                    <motion.div
                        key={currentStep.id}
                        layoutId="tour-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            position: "absolute",
                            top: top,
                            left: left,
                            width: CARD_WIDTH,
                            // Transform Y only for positioning above/below
                            y: arrowDirection === 'down' ? '-100%' : '0%'
                        }}
                        className="pointer-events-auto z-20"
                    >
                        <div className="bg-white border-2 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
                            {/* Arrow */}
                            {arrowDirection === 'down' && (
                                <div
                                    className="absolute bottom-0 w-4 h-4 bg-white border-b-2 border-r-2 border-black rotate-45 translate-y-1/2 z-10"
                                    style={{ left: xOffset - 8 }} // Center arrow roughly
                                />
                            )}
                            {arrowDirection === 'up' && (
                                <div
                                    className="absolute top-0 w-4 h-4 bg-white border-t-2 border-l-2 border-black rotate-45 -translate-y-1/2 z-10"
                                    style={{ left: xOffset - 8 }}
                                />
                            )}

                            <div className="flex justify-between items-start mb-2 relative z-20">
                                <div className="inline-block bg-[#FF6B00] text-black text-xs font-black px-2 py-1 border border-black mb-1 rotate-1">
                                    ADIM {currentStepIndex + 1}/{filteredSteps.length}
                                </div>
                                <button onClick={handleComplete} className="text-black hover:scale-110 transition-transform">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <h3 className="text-2xl font-black text-black uppercase leading-none tracking-tighter mb-2">
                                {currentStep.title}
                            </h3>
                            <p className="text-black text-sm font-bold leading-snug mb-4">
                                {currentStep.description}
                            </p>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleNext}
                                    className="bg-black text-white px-6 py-2 font-black uppercase text-sm hover:bg-[#FF6B00] hover:text-black transition-colors border-2 border-black"
                                >
                                    {currentStepIndex === filteredSteps.length - 1 ? "BİTİR" : "İLERİ"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

            </motion.div>
        </AnimatePresence>
    );
}
