"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeoCardProps {
    title: string;
    category: string;
    image?: string; // Optional for now
    readTime?: string;
    color?: string; // Accent color
}

export function NeoCard({
    title = "SCHRÖDINGER'İN KEDİSİ VE KUANTUM SÜPERPOZİSYONU",
    category = "FİZİK",
    readTime = "5 DK",
    color = "bg-[#facc15]"
}: NeoCardProps) {
    return (
        <motion.div
            className="group relative w-full bg-[#1f2937] border-[3px] border-black shadow-neo rounded-xl overflow-hidden cursor-pointer"
            whileTap={{ scale: 0.98, x: 2, y: 2, boxShadow: "0px 0px 0px 0px #000" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* 
        ATOM KURAL 3: RENK KİMYASI (Dark Card Background #1f2937)
        ATOM KURAL 2: SINIR MATEMATİĞİ (3px Borders Everywhere)
      */}

            {/* Image Container */}
            <div className="h-48 w-full bg-gray-800 border-b-[3px] border-black relative">
                {/* Placeholder Pattern until real image logic is hooked up */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '10px 10px' }}></div>

                {/* Badge */}
                <div className={cn("absolute top-3 left-3 px-3 py-1 border-[2px] border-black shadow-neo-sm text-xs font-black tracking-widest text-black", color)}>
                    {category}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-3">
                <h3 className="text-xl font-black text-white leading-tight uppercase font-heading">
                    {title}
                </h3>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-gray-400 font-mono">
                        OKUMA SÜRESİ: <span className="text-white">{readTime}</span>
                    </span>

                    <div className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black text-black shadow-neo-sm group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                        <ArrowUpRight className="w-5 h-5 stroke-[3px]" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
