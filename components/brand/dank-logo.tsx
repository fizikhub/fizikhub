"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DankLogoProps {
    className?: string;
}

export function DankLogo({ className }: DankLogoProps) {
    return (
        <div className={cn("flex items-center gap-1 select-none cursor-pointer group", className)}>

            {/* ICON: SPARKLE BUTTON */}
            <div className="w-9 h-9 bg-[#A388EE] border-2 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_#000] group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_0px_#000] transition-all">
                <Sparkles className="w-5 h-5 text-white fill-current" />
            </div>

            {/* TEXT: CHUNKY */}
            <div className="flex flex-col leading-none ml-1">
                <span className="text-xl px-1 font-[900] tracking-tighter text-black bg-white border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000]">
                    FIZIK<span className="text-[#A388EE]">HUB</span>
                </span>
            </div>

        </div>
    );
}
