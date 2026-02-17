"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, ArrowRight, UserCog } from "lucide-react";
import Link from "next/link";

export function ProfileSetupHint() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem("has_seen_profile_hint_v2");
        if (!hasSeen) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("has_seen_profile_hint_v2", "true");
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-8 md:w-[400px]"
                >
                    <div className="relative bg-[#FF6B00] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col gap-3">
                        {/* Header & Dismiss */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div className="bg-black text-[#FF6B00] p-1.5 border border-black">
                                    <UserCog className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-black tracking-tighter text-lg uppercase leading-none">
                                    Profilini<br />Özelleştir
                                </h3>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="p-1 hover:bg-black hover:text-[#FF6B00] transition-colors border border-transparent hover:border-black"
                            >
                                <X className="w-6 h-6 text-black hover:text-[#FF6B00]" />
                            </button>
                        </div>

                        {/* Description - Larger as requested */}
                        <p className="text-black font-bold text-sm leading-snug">
                            Kapak fotoğrafını, avatarını ve biyografini düzenleyerek tarzını herkese göster.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-1">
                            <Link href="/profil/duzenle" onClick={handleDismiss} className="flex-1">
                                <button className="w-full py-2 bg-black text-white font-black uppercase tracking-wider text-sm hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 group">
                                    Düzenle
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-2 border-2 border-black text-black font-bold uppercase text-sm hover:bg-black/10 transition-colors"
                            >
                                Sonra
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
