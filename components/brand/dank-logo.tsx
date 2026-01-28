"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DankLogoProps {
    className?: string;
}

export function DankLogo({ className }: DankLogoProps) {
    return (
        <div className={cn("flex items-center gap-2 select-none cursor-pointer group", className)}>

            {/* ICON: ABSTRACT HUB */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 19v-4" />
                    <path d="M12 9V5" />
                    <path d="M19 12h-4" />
                    <path d="M9 12H5" />
                </svg>
            </div>

            {/* TEXT: CLEAN SANS */}
            <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    FizikHub
                </span>
            </div>

        </div>
    );
}
