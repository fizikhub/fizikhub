"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useRef } from "react";

// Dynamically import the heavy 3D canvas
const MemeCornerCanvas = dynamic(() => import("@/components/home/meme-corner-canvas"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black/50 animate-pulse" />
});

export function MemeCorner() {
    return (
        <div className="w-full relative group">
            {/* GLOBAL STYLES for animations */}
            <style jsx global>{`
                @keyframes gradient-flow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%) rotate(25deg); }
                    100% { transform: translateX(200%) rotate(25deg); }
                }
                @keyframes badge-wiggle {
                    0%, 100% { transform: rotate(-3deg); }
                    50% { transform: rotate(1deg); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.7; }
                }
            `}</style>

            <div
                className={cn(
                    "relative w-full overflow-hidden cursor-pointer",
                    // NEO-BRUTALIST TOKENS
                    "rounded-[8px]",
                    "border-[3px] border-black",
                    "shadow-[4px_4px_0px_0px_#000]",
                    "transition-shadow duration-200 hover:shadow-[6px_6px_0px_0px_#000]",
                    // Size & Background
                    "h-[180px] sm:h-[240px]",
                    "bg-[radial-gradient(120%_120%_at_50%_50%,_#2a0a45_0%,_#050514_50%,_#000000_100%)]",
                )}
            >
                {/* HUD CORNERS - Enhanced with Glow */}
                <svg className="absolute top-2 right-2 w-6 h-6 text-cyan-400/40 z-20 animate-[pulse-glow_3s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 9V1H15" />
                </svg>
                <svg className="absolute bottom-2 left-2 w-6 h-6 text-cyan-400/40 z-20 animate-[pulse-glow_3s_ease-in-out_infinite_0.5s]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 15V23H9" />
                </svg>
                <svg className="absolute bottom-2 right-2 w-6 h-6 text-purple-400/30 z-20 animate-[pulse-glow_3s_ease-in-out_infinite_1s]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 15V23H15" />
                </svg>

                {/* SCANLINES - Retro Effect */}
                <div
                    className="absolute inset-0 z-[2] pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`
                    }}
                />

                {/* SHIMMER EFFECT */}
                <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
                    <div
                        className="absolute inset-0 w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_4s_ease-in-out_infinite]"
                        style={{ top: '-50%' }}
                    />
                </div>

                {/* VISUAL NOISE - Reduced to 5% for clarity */}
                <div
                    className="absolute inset-0 z-[1] opacity-5 pointer-events-none mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                />

                {/* 3D Canvas - Loaded dynamically */}
                <div className="absolute inset-0 z-0">
                    <MemeCornerCanvas />
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

                {/* TEXT OVERLAY */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none pointer-events-none p-4 pb-8 sm:pb-12">

                    {/* Main Title */}
                    <div className="flex flex-col items-center justify-center">
                        {/* Top: Spaced Out */}
                        <h2 className="font-head text-sm sm:text-lg font-bold tracking-[0.6em] text-blue-200/80 uppercase mb-1 sm:mb-2 ml-1 drop-shadow-lg">
                            BİLİMİ
                        </h2>

                        {/* Bottom: Animated Gradient Text */}
                        <h2
                            className="font-head text-4xl sm:text-7xl font-black tracking-tighter leading-[0.9] pt-2 pb-2 pl-2 pr-2 whitespace-nowrap"
                            style={{
                                background: 'linear-gradient(90deg, #fff, #93c5fd, #c084fc, #fff)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'gradient-flow 4s ease infinite',
                                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                            }}
                        >
                            Tİ'YE ALIYORUZ
                        </h2>

                        {/* BADGE - Mood below text */}
                        <div className="mt-2 sm:mt-3 transform origin-center animate-[badge-wiggle_3s_ease-in-out_infinite]">
                            <span className="inline-block bg-[#FFC800] border-[2px] border-black text-black px-3 py-1 sm:px-4 sm:py-1.5 font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:scale-110 transition-transform">
                                AMA CİDDİLİ ŞEKİLDE
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
