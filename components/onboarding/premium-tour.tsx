"use client";

import { useState, useEffect, useCallback } from "react";
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
    // Removed Premium Step as requested
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
        }, 800);
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

    // Calculate Position
    let top = "50%";
    let left = "50%";
    let transform = "translate(-50%, -50%)";
    let arrowDirection = "none";

    if (rect && !isModal) {
        // Default logic: if element is in top half, show bottom. If in bottom half, show top.
        const isTopHalf = rect.top < window.innerHeight / 2;

        if (currentStep.forcePosition === "top" || (!currentStep.forcePosition && !isTopHalf)) {
            // SHOW ABOVE ELEMENT
            top = `${rect.top - 24}px`; // 24px gap
            left = `${rect.left + rect.width / 2}px`;
            transform = "translate(-50%, -100%)";
            arrowDirection = "down";
        } else {
            // SHOW BELOW ELEMENT
            top = `${rect.bottom + 24}px`; // 24px gap
            left = `${rect.left + rect.width / 2}px`;
            transform = "translate(-50%, 0)";
            arrowDirection = "up";
        }

        // Horizontal Clamping to prevent cut-off
        // We do this via CSS max-width/left clamping usually, but let's be smarter
        // If left is too close to edge?
        // Actually, let's use a simpler "Center relative to screen horizontally" approach for mobile bottom nav
        // IF it's a mobile nav item (usually spans width), centering on element is fine.
        // But if it's the right-most element (Profile), it might clip.

        // Dynamic Edge Detection
        /* 
           We will use standard positioning but verify constraints in render style.
           For now, let's rely on `left` + translate.
           If `rect.left` is > window.width - 160 (`w-80` = 320px / 2 = 160), we need to shift.
        */
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
                {/* BACKDROP WITH HOLE (CLIP PATH) */}
                {rect ? (
                    <div className="absolute inset-0 z-0 overflow-hidden transition-all duration-500 ease-out">
                        <svg className="w-full h-full">
                            <defs>
                                <mask id="spotlight-mask">
                                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                    <rect
                                        x={rect.left - 4} // Tighter fit
                                        y={rect.top - 4}
                                        width={rect.width + 8}
                                        height={rect.height + 8}
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
                                fill="rgba(0,0,0,0.8)"
                                mask="url(#spotlight-mask)"
                            />
                        </svg>
                        {/* Pulse Ring */}
                        <motion.div
                            className="absolute rounded-xl border-2 border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.4)]"
                            style={{
                                left: rect.left - 4,
                                top: rect.top - 4,
                                width: rect.width + 8,
                                height: rect.height + 8
                            }}
                            initial={{ scale: 1.05, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
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

                {/* CONTENT */}
                <div className="absolute inset-0 z-10 w-full h-full pointer-events-auto">
                    {/* Modal Centered Content */}
                    {isModal && (
                        <div className="flex items-center justify-center w-full h-full p-6">
                            <motion.div
                                key={currentStep.id}
                                layoutId="modal-card"
                                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-transparent pointer-events-none" />

                                <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">
                                    {currentStep.title}
                                </h2>
                                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                                    {currentStep.description}
                                </p>

                                <button
                                    onClick={handleNext}
                                    className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {currentStepIndex === filteredSteps.length - 1 ? "Keşfetmeye Başla" : "Başlayalım"}
                                </button>
                            </motion.div>
                        </div>
                    )}

                    {/* Spotlight Positioning */}
                    {!isModal && rect && (
                        <motion.div
                            key={currentStep.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            style={{
                                position: "absolute",
                                top: top,
                                left: left,
                                transform: transform,
                                width: "300px",  // Fixed width for consistency
                                maxWidth: "90vw" // Fallback for tiny screens
                            }}
                            className="group"
                        >
                            {/* The Card */}
                            <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl relative">
                                {/* Arrow Pointer */}
                                {arrowDirection === 'down' && (
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full">
                                        <ArrowDown className="w-6 h-6 text-orange-500 animate-bounce" />
                                    </div>
                                )}
                                {arrowDirection === 'up' && (
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full">
                                        <ArrowUp className="w-6 h-6 text-orange-500 animate-bounce" />
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                                        {currentStep.title}
                                    </h3>
                                    <button
                                        onClick={handleComplete}
                                        className="text-zinc-600 hover:text-white transition-colors p-1"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-6">
                                    {currentStep.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                        {currentStepIndex + 1} / {filteredSteps.length}
                                    </span>
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-2 text-xs font-black bg-white text-black px-5 py-2.5 rounded-lg uppercase hover:bg-zinc-200 transition-colors"
                                    >
                                        {currentStepIndex === filteredSteps.length - 1 ? "BİTİR" : "İLERİ"}
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
