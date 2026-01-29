"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Stars } from "lucide-react";

// Simplified Cosmic Background
function DeepSpaceBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-[#050510]">
            {/* Nebula Gradient */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background: "radial-gradient(circle at 70% 30%, #4f46e5 0%, transparent 50%), radial-gradient(circle at 20% 80%, #ec4899 0%, transparent 50%)",
                    filter: "blur(40px)"
                }}
            />

            {/* Stars Layer 1 (Static for performance) */}
            <div
                className="absolute inset-0 opacity-70"
                style={{
                    backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    backgroundPosition: '0 0'
                }}
            />
            {/* Stars Layer 2 (Offset) */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)',
                    backgroundSize: '90px 90px',
                    backgroundPosition: '25px 25px'
                }}
            />
        </div>
    );
}

export function MemeCorner() {
    return (
        <div className="w-full relative group">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "relative w-full overflow-hidden",
                    "rounded-xl border border-white/10",
                    "shadow-[0_0_30px_-10px_rgba(79,70,229,0.3)]",
                    "aspect-[3/1] sm:aspect-[4/1]", // Compact Ratio
                    "flex items-center justify-center sm:justify-start",
                    "px-6 sm:px-10"
                )}
            >
                {/* 1. Deep Space Background */}
                <DeepSpaceBackground />

                {/* 2. Shine/Glass Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />

                {/* 3. Content */}
                <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col"
                    >
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tighter text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
                            BILIMI Ti'YE ALIYORUZ
                        </h2>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 sm:mt-2">
                            <div className="h-[1px] w-8 sm:w-12 bg-indigo-400/50" />
                            <span className="text-xs sm:text-sm font-medium text-indigo-200 tracking-[0.2em] uppercase">
                                Ama Ciddili Şekilde
                            </span>
                            <Stars className="w-3 h-3 text-indigo-300" />
                        </div>
                    </motion.div>
                </div>

                {/* 4. Decorative Planet/Orb (Right Side - Visual Balance) */}
                <div className="absolute -right-8 -top-8 w-32 h-32 sm:w-48 sm:h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute right-0 bottom-0 opacity-20 hidden sm:block">
                    {/* Abstract Geometry or Icon if needed, kept clean for now */}
                </div>

            </motion.div>
        </div>
    );
}
