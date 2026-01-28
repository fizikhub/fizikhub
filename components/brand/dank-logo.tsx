"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DankLogoProps {
    className?: string;
}

export function DankLogo({ className }: DankLogoProps) {
    return (
        <div className={cn("flex items-center gap-2 select-none cursor-pointer group", className)}>

            {/* ICON: CUSTOM PLANET SVG */}
            <motion.div
                className="relative w-9 h-9 sm:w-10 sm:h-10"
                whileHover={{ rotate: 10, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Planet Body */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                    <circle cx="50" cy="50" r="45" fill="#4F46E5" /> {/* Indigo-600 */}
                    <circle cx="50" cy="50" r="45" fill="url(#grad1)" opacity="0.8" />

                    {/* Ring */}
                    <path
                        d="M 15 65 Q 50 90 85 65"
                        fill="none"
                        stroke="#818CF8"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="opacity-90"
                    />

                    {/* Crater/Shine */}
                    <circle cx="30" cy="35" r="8" fill="white" opacity="0.3" />
                    <circle cx="70" cy="60" r="4" fill="white" opacity="0.2" />

                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#818CF8', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#4338CA', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>

            {/* TEXT: CHUNKY SANS */}
            <div className="flex flex-col leading-none">
                <span className="text-xl sm:text-2xl font-[850] tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
                    FizikHub
                </span>
            </div>

        </div>
    );
}
