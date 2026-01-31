"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Download, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "fizikhub_install_prompt_shown";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    const dismissPrompt = useCallback(() => {
        setShowPrompt(false);
        localStorage.setItem(STORAGE_KEY, "true");
    }, []);

    useEffect(() => {
        // Check if already shown
        if (localStorage.getItem(STORAGE_KEY) === "true") {
            return;
        }

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    // Auto-dismiss after 11 seconds
    useEffect(() => {
        if (!showPrompt) return;

        const timer = setTimeout(() => {
            dismissPrompt();
        }, 11000);

        return () => clearTimeout(timer);
    }, [showPrompt, dismissPrompt]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-8 md:bottom-8 md:w-96"
                >
                    <div className="bg-black/80 backdrop-blur-xl border border-amber-500/30 p-4 rounded-2xl shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-amber-500/5 z-0" />

                        <button
                            onClick={dismissPrompt}
                            className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative z-10 flex gap-4 items-start">
                            <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-500/20">
                                <Download className="w-6 h-6 text-amber-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white text-lg mb-1">Uygulamayı Yükle</h3>
                                <p className="text-white/60 text-sm mb-3">
                                    FizikHub'ı ana ekranına ekle, çevrimdışı olduğunda bile makaleleri oku.
                                </p>
                                <Button
                                    onClick={handleInstall}
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white border-0"
                                >
                                    Yükle
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
