"use client";

import { useState, useEffect } from "react";
import { GetWellCard } from "./get-well-card";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GetWellOverlayProps {
    shouldShow: boolean;
}

export function GetWellOverlay({ shouldShow }: GetWellOverlayProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (shouldShow) {
            // Check session storage to avoid annoyance on every refresh (optional, but good UX)
            // For now, let's show it every time ensuring they see it, or use a session flag.
            // User request is "when they enter the site".
            const hasSeen = sessionStorage.getItem("seen_get_well_card");
            if (!hasSeen) {
                setIsVisible(true);
            }
        }
    }, [shouldShow]);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem("seen_get_well_card", "true");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
                >
                    <div className="absolute top-6 right-6 z-[110]">
                        <button
                            onClick={handleClose}
                            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/20"
                        >
                            <X className="w-6 h-6" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>

                    <div className="w-full h-full">
                        <GetWellCard />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
