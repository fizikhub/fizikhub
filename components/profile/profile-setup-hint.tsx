"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Sparkles, Camera, Edit2 } from "lucide-react";
import Link from "next/link";

export function ProfileSetupHint() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has seen this hint before
        const hasSeen = localStorage.getItem("has_seen_profile_hint");
        if (!hasSeen) {
            // Delay slightly to not overwhelm
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("has_seen_profile_hint", "true");
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0.3 }}
                    className="w-full mb-6 relative z-10"
                >
                    <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-black to-black p-1 shadow-2xl">
                        {/* Animated Glow Border Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />

                        <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5">
                            {/* Icon/Visual */}
                            <div className="shrink-0 w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                                <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-white font-black uppercase tracking-tight text-lg mb-1">
                                    Profilini Özelleştir
                                </h3>
                                <p className="text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed">
                                    Kapak fotoğrafını, avatarını ve biyografini düzenleyerek tarzını yansıt. Kimliğin, senin imzan.
                                </p>
                            </div>

                            {/* Action Button */}
                            <Link href="/profil/duzenle" onClick={handleDismiss}>
                                <button className="group relative px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-lg hover:bg-zinc-200 transition-all overflow-hidden">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Düzenle
                                        <Edit2 className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                </button>
                            </Link>

                            {/* Close Button */}
                            <button
                                onClick={handleDismiss}
                                className="absolute top-2 right-2 text-zinc-600 hover:text-white transition-colors p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
