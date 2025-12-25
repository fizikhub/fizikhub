"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "@/app/actions/onboarding";
import { ArrowUpLeft, X } from "lucide-react"; // Using Lucide icons as base, will style to look hand-drawn

export function OnboardingTour() {
    const [step, setStep] = useState<"start" | "menu-open" | "finished">("start");
    const [isVisible, setIsVisible] = useState(true);

    const handleComplete = async () => {
        setIsVisible(false);
        await completeOnboarding();
    };

    // Hand-drawn arrow SVG
    const HandDrawnArrow = ({ className }: { className?: string }) => (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10,90 Q50,50 90,10" className="animate-draw" />
            <path d="M90,10 L70,15" />
            <path d="M90,10 L85,30" />
        </svg>
    );

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {step === "start" && (
                <div className="fixed inset-0 z-[100] pointer-events-none">
                    {/* Dark overlay with hole for menu button (approximate position) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Spotlight on Menu Button (Top Left) */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-full pointer-events-auto" />

                    <motion.div
                        initial={{ opacity: 0, y: 20, rotate: -5 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="absolute top-24 left-10 max-w-xs text-white"
                    >
                        <div className="relative">
                            <HandDrawnArrow className="absolute -top-16 -left-4 w-24 h-24 text-red-500 -rotate-12" />

                            <div className="bg-white text-black p-4 rounded-lg shadow-xl font-handwriting transform -rotate-2 border-2 border-gray-200">
                                <h3 className="font-bold text-lg mb-1 font-mono">Hey Çaylak! 👋</h3>
                                <p className="text-sm leading-relaxed font-medium text-gray-700">
                                    Evrenin sırlarına giden kapı tam şurada. Tıklamazsan asla bilemezsin.
                                </p>
                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={() => setStep("menu-open")}
                                        className="text-xs bg-black text-white px-3 py-1 rounded hover:scale-105 transition-transform"
                                    >
                                        Tamam, sakin ol
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {step === "menu-open" && (
                <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                        onClick={handleComplete}
                    />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative z-10 max-w-md w-full mx-4"
                    >
                        <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                            {/* Graffiti / Sticker Effect */}
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-500 rotate-12 z-0 opacity-20 blur-xl" />

                            <button
                                onClick={handleComplete}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white pointer-events-auto"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative z-10 text-center">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-4xl mb-4 inline-block"
                                >
                                    🚀
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2 font-mono">Keşif Başlasın!</h3>
                                <p className="text-gray-400 mb-6 text-sm">
                                    Menüde aradığın her şeyi bulacaksın. Kaybolursan... eh, uzayda kaybolmak gibisi yoktur. İyi şanslar!
                                </p>

                                <button
                                    onClick={handleComplete}
                                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] pointer-events-auto"
                                >
                                    Anlaşıldı, Işınla Beni!
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
