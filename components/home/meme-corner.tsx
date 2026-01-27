"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import Image from "next/image";

// V33: THE "FUTURE" BANNER - HIGH FIDELITY
// A premium, 3D-interactive, animated banner inspired by Back to the Future.

export function MemeCorner() {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse interaction for 3D Tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="w-full relative py-6 perspective-1000">
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={cn(
                    "relative w-full aspect-[21/9] sm:aspect-[3/1] md:aspect-[3.5/1]",
                    "rounded-xl sm:rounded-2xl overflow-hidden",
                    "border-[3px] border-[#FFC800]/50",
                    "shadow-[0_0_30px_-5px_#FFC800aa]",
                    "group cursor-pointer select-none"
                )}
            >
                {/* === BACKGROUND LAYER === */}
                <div className="absolute inset-0 bg-[#050505] z-0">
                    {/* Deep Space Gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#050505] to-[#050505]" />

                    {/* Stars / Dust */}
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                </div>

                {/* === IMAGE LAYER (The Vibe) === */}
                {/* We use the provided asset for the core visual */}
                <div className="absolute inset-0 z-10 opacity-60 mix-blend-screen overflow-hidden">
                    <Image
                        src="/assets/meme-card/banner.png"
                        alt="Background Texture"
                        fill
                        className="object-cover object-center scale-110 group-hover:scale-105 transition-transform duration-700"
                        priority
                    />
                </div>
                <div className="absolute inset-0 z-10 opacity-40 mix-blend-lighten overflow-hidden">
                    <Image
                        src="/assets/meme-card/bttf-poster.png"
                        alt="Lightning Texture"
                        fill
                        className="object-cover object-center scale-125 opacity-30 mix-blend-color-dodge"
                    />
                </div>


                {/* === LIGHTNING FX === */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <svg className="absolute w-full h-full opacity-0 group-hover:opacity-40 transition-opacity duration-100" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <path d="M0,50 Q50,40 100,50 T200,50 T300,50 T400,50" fill="none" stroke="#00FFFF" strokeWidth="2" className="animate-pulse">
                            <animate attributeName="d" values="M0,50 Q50,30 100,70 T200,20 T300,80 T400,50; M0,50 Q50,70 100,30 T200,80 T300,20 T400,50; M0,50 Q50,30 100,70 T200,20 T300,80 T400,50" dur="0.2s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>

                {/* === CONTENT LAYER === */}
                <div className="relative z-30 w-full h-full flex flex-col items-center justify-center text-center p-4">

                    {/* MAIN TITLE - BTTF STYLE */}
                    <motion.div
                        className="relative"
                        style={{ transform: "translateZ(50px)" }}
                    >
                        {/* Text Shadow / Stroke effect simulation */}
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic tracking-tighter leading-none transform -skew-x-12 relative z-10">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#FFC800] via-[#FF8800] to-[#FF4400] drop-shadow-[2px_4px_0px_rgba(0,0,0,1)] stroke-black"
                                style={{ WebkitTextStroke: "1px #5c0000" }}
                            >
                                BİLİMİ
                            </span>
                            <span className="block text-3xl sm:text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-blue-300 via-blue-500 to-blue-700 drop-shadow-[2px_4px_0px_rgba(0,0,0,1)] mt-1"
                                style={{ WebkitTextStroke: "1px #000033" }}
                            >
                                Tİ'YE ALIYORUZ
                            </span>
                        </h1>
                    </motion.div>

                    {/* SUBTITLE */}
                    <motion.div
                        className="mt-2 sm:mt-4"
                        style={{ transform: "translateZ(30px)" }}
                    >
                        <div className="bg-black/80 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transform -skew-x-12 shadow-[0_0_15px_#00FFFF66]">
                            <span className="text-[#00FFFF] text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] uppercase drop-shadow-[0_0_5px_#00FFFF]">
                                Ama Ciddili Şekilde
                            </span>
                        </div>
                    </motion.div>

                </div>

                {/* === FLAME TRAILS (Bottom) === */}
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#FF4400]/40 to-transparent mix-blend-screen z-20 group-hover:h-12 transition-all duration-300" />

                {/* === SCANLINES === */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[25] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

            </motion.div>
        </div>
    );
}
