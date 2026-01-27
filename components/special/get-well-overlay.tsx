"use client";

import { useState, useEffect } from "react";
import { GetWellCard } from "./get-well-card";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { createClient } from "@supabase/supabase-js";

export function GetWellOverlay() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const hasSeen = sessionStorage.getItem("seen_get_well_card");
            if (hasSeen) return;

            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single();

                if (profile && ['silginim', 'baranbozkurt'].includes(profile.username)) {
                    setIsVisible(true);
                }
            }
        };

        checkUser();
    }, []);

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
