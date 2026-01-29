"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Quote, Sparkles, Brain, FlaskConical, Atom } from "lucide-react";

export function MemeCorner() {
    return (
        <div className="w-full relative group perspective-1000">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                    "relative w-full overflow-hidden",
                    "bg-[#FFC800] border-[3px] border-black shadow-[4px_4px_0px_0px_#000]",
                    "rounded-xl",
                    "flex flex-col sm:flex-row items-center justify-between",
                    "px-6 py-8 sm:py-10 gap-6 sm:gap-0",
                    "cursor-default select-none"
                )}
            >
                {/* Background Pattern - Subtle scientific grid */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Left: Branding & Message */}
                <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 max-w-lg">
                    {/* Top Label */}
                    <div className="flex items-center gap-2 mb-1">
                        <div className="px-2 py-0.5 bg-black text-white text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest rounded-sm">
                            FZH-LABS-v2.0
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            <span className="text-[10px] font-bold text-black/60 uppercase tracking-wilder">Canlı Yayın</span>
                        </div>
                    </div>

                    {/* Main Title */}
                    <div className="flex flex-col">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[0.9] tracking-tighter text-black">
                            BİLİMİ
                        </h2>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[0.9] tracking-tighter text-black relative inline-block">
                            Tİ'YE ALIYORUZ
                            {/* Underline decoration */}
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-black" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </h2>
                    </div>

                    {/* Ciddili Şekilde Badge */}
                    <div className="mt-4 transform -rotate-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] transform transition-transform group-hover:scale-105 group-hover:rotate-0">
                            <span className="text-sm sm:text-base font-black text-black tracking-tight uppercase">
                                AMA CİDDİLİ ŞEKİLDE
                            </span>
                            <Sparkles className="w-4 h-4 text-black fill-black" />
                        </div>
                    </div>
                </div>

                {/* Right: Icon Visualization - Abstract Representation of "Serious Fun" */}
                <div className="relative z-10 flex items-center justify-center shrink-0">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-black border-[3px] border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] rounded-full flex items-center justify-center overflow-hidden">
                        {/* Spinning Atom/Brain Composite */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 opacity-20"
                            style={{
                                background: 'conic-gradient(from 0deg, transparent 0%, #FFF 50%, transparent 100%)'
                            }}
                        />

                        <div className="relative z-10 text-white">
                            {/* Alternating Icon */}
                            <Atom className="w-12 h-12 sm:w-16 sm:h-16 stroke-[1.5px]" />
                        </div>

                        {/* "Approved" Stamp Effect */}
                        <motion.div
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                            className="absolute -bottom-2 -right-2 bg-white text-black text-[10px] font-bold px-2 py-0.5 border-2 border-black rotate-[-15deg] shadow-sm"
                        >
                            %100 ONAYLI
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Corners */}
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-black opacity-50" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-black opacity-50" />

            </motion.div>
        </div>
    );
}
