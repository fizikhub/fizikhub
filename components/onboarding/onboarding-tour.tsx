"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "@/app/actions/onboarding";
import { Rocket, Zap, Navigation, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function OnboardingTour() {
    const [step, setStep] = useState<"init" | "nav" | "mission" | "complete">("init");
    const [isVisible, setIsVisible] = useState(true);

    const handleComplete = async () => {
        setIsVisible(false);
        await completeOnboarding();
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {/* Step 1: System Initialization */}
            {step === "init" && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="relative max-w-md w-full">
                        {/* Scanning Effect */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-black/40 border border-primary/30 rounded-lg p-8 relative overflow-hidden backdrop-blur-xl"
                        >
                            {/* Decorative Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />

                            <div className="text-center space-y-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full mx-auto"
                                />

                                <div>
                                    <h2 className="text-2xl font-mono font-bold text-white mb-2 tracking-widest">SİSTEM BAŞLATILIYOR</h2>
                                    <p className="text-primary/80 font-mono text-xs">Fizikhub Arayüzü v3.1 Yükleniyor...</p>
                                </div>

                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    className="h-1 bg-primary rounded-full"
                                />

                                <button
                                    onClick={() => setStep("nav")}
                                    className="group relative px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 transition-all rounded w-full font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                    <span>Giriş Yap</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {/* Step 2: Navigation Module */}
            {step === "nav" && (
                <div className="fixed inset-0 z-[100]">
                    {/* Dark Overlay with "Hole" (Simulated via overlay pieces) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/80 pointer-events-auto backdrop-blur-[2px]"
                        onClick={() => setStep("mission")}
                    />

                    {/* Spotlight Highlight (Top Left - Approximate Navbar Button Position) */}
                    {/* Note: In a real spotlight scenario we might use mix-blend-mode or clip-path, but simple highlighting works for stability */}
                    <motion.div
                        className="absolute top-2 left-2 w-16 h-16 rounded-full border-2 border-primary shadow-[0_0_50px_rgba(234,88,12,0.5)] z-50 pointer-events-none"
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />

                    {/* Holographic Tooltip */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-24 left-8 max-w-sm z-50"
                    >
                        <div className="relative">
                            {/* Connecting Line */}
                            <div className="absolute -top-12 left-4 w-px h-12 bg-gradient-to-b from-primary/0 to-primary" />
                            <div className="absolute -top-12 left-4 w-4 h-[1px] bg-primary" /> // L-shape connector

                            <div className="bg-black/90 p-6 rounded-lg border border-white/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                                {/* Holographic Sheen */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-white/5 to-transparent pointer-events-none" />

                                <div className="flex items-start gap-4 relaitve z-10">
                                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                                        <Navigation className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold font-mono text-lg mb-1">NAVİGASYON MODÜLÜ</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Evrenin derinliklerine açılan portal burası. Makaleler, simülasyonlar ve topluluk verilerine tek tıkla erişin.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setStep("mission")}
                                        className="text-white text-xs font-mono border-b border-primary pb-1 hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        ANLAŞILDI <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Step 3: Mission Ready */}
            {step === "mission" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/80 pointer-events-auto backdrop-blur-sm"
                        onClick={handleComplete}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="relative z-50 max-w-lg w-full mx-4 pointer-events-auto"
                    >
                        {/* Futuristic Card */}
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_100px_rgba(234,88,12,0.15)] overflow-hidden relative">
                            {/* Top Bar */}
                            <div className="h-1 bg-gradient-to-r from-primary via-white to-primary opacity-50" />

                            <div className="p-8 relative">
                                {/* Ambient Glow */}
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

                                <div className="flex flex-col items-center text-center relative z-10">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6"
                                    >
                                        <Rocket className="w-10 h-10 text-primary" />
                                    </motion.div>

                                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">GÖREVİNİZ HAZIR</h2>
                                    <p className="text-lg text-gray-400 mb-8 max-w-sm">
                                        Keşfedilecek binlerce veri var kaptan. Motorları çalıştırın ve bilim dünyasına dalış yapın.
                                    </p>

                                    <button
                                        onClick={handleComplete}
                                        className="w-full group relative overflow-hidden bg-white text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        <span className="relative flex items-center justify-center gap-2">
                                            MOTORLARI ÇALIŞTIR <Zap className="w-4 h-4 fill-black" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
