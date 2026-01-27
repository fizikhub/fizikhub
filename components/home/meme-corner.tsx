"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from "react";

// V34: THE "PURE CODE" BTTF CARD
// No images. Pure CSS/SVG sorcery.

// --- 1. THE LIGHTNING COMPONENT ---
const Lightning = ({ delay = 0, style }: { delay?: number; style?: React.CSSProperties }) => {
    return (
        <svg
            viewBox="0 0 200 100"
            className="absolute z-20 pointer-events-none opacity-0 animate-lightning"
            style={{
                ...style,
                animationDelay: `${delay}s`,
                filter: "drop-shadow(0 0 5px #00FFFF)",
            }}
            preserveAspectRatio="none"
        >
            <path
                d="M100,0 L90,20 L110,25 L95,50 L120,55 L100,100"
                fill="none"
                stroke="#00FFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <animate
                    attributeName="d"
                    values="M100,0 L90,20 L110,25 L95,50 L120,55 L100,100; M100,0 L110,20 L90,25 L115,50 L90,55 L100,100; M100,0 L90,20 L110,25 L95,50 L120,55 L100,100"
                    dur="0.2s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    );
};

// --- 2. THE CYBER-UFO COMPONENT (SVG) ---
const CyberUFO = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
        {/* Thruster Flame Trails */}
        <path d="M20,45 L10,55" stroke="#FF4400" strokeWidth="2" className="animate-pulse" opacity="0.8" />
        <path d="M80,45 L90,55" stroke="#FF4400" strokeWidth="2" className="animate-pulse" opacity="0.8" />

        {/* Dome */}
        <path d="M35,25 Q50,10 65,25" fill="#E0F2FE" fillOpacity="0.8" stroke="#00FFFF" strokeWidth="1" />

        {/* Main Body */}
        <ellipse cx="50" cy="30" rx="40" ry="12" fill="#1e1b2e" stroke="#00FFFF" strokeWidth="1.5" />

        {/* Rim Lights */}
        <circle cx="20" cy="30" r="2" fill="#FFC800" className="animate-pulse" />
        <circle cx="50" cy="35" r="2" fill="#FFC800" className="animate-pulse" />
        <circle cx="80" cy="30" r="2" fill="#FFC800" className="animate-pulse" />

        {/* Underbody Detail */}
        <path d="M30,35 Q50,45 70,35" fill="none" stroke="#00FFFF" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
);


export function MemeCorner() {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse Parallax Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Parallax Layers
    const bgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-5%", "5%"]);
    const bgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-5%", "5%"]);
    const textX = useTransform(mouseXSpring, [-0.5, 0.5], ["2%", "-2%"]);
    const textY = useTransform(mouseYSpring, [-0.5, 0.5], ["2%", "-2%"]);

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
            <style jsx global>{`
                @keyframes lightning {
                    0%, 100% { opacity: 0; }
                    5%, 20% { opacity: 1; }
                    30% { opacity: 0; }
                    50% { opacity: 0.5; }
                    60% { opacity: 0; }
                }
                .animate-lightning {
                    animation: lightning 3s infinite;
                }
                .text-gradient-bttf {
                    background: linear-gradient(180deg, #FFC800 20%, #FF8800 50%, #FF4400 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .text-stroke-bttf {
                    filter: drop-shadow(2px 2px 0px #5c0000);
                }
                 .text-gradient-cyan {
                    background: linear-gradient(180deg, #E0F2FE 0%, #00FFFF 50%, #0000FF 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

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
                    "relative w-full aspect-[21/9] sm:aspect-[3/1]",
                    "rounded-2xl overflow-hidden",
                    "border-[4px] border-[#FF8800] border-t-white/50 border-l-white/50", // Beveled look
                    "shadow-[0_0_50px_-10px_#FF4400aa]", // Glowing orange shadow
                    "group cursor-pointer select-none bg-black"
                )}
            >
                {/* === LAYER 1: DYNAMIC BACKGROUND (Pure CSS Nebula) === */}
                <motion.div
                    className="absolute inset-[-10%]"
                    style={{ x: bgX, y: bgY, scale: 1.1 }}
                >
                    {/* Deep Space Base */}
                    <div className="absolute inset-0 bg-black" />

                    {/* Nebula Clouds */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-60 mix-blend-screen bg-[radial-gradient(circle_at_30%_50%,_#3b0764_0%,_transparent_60%)]" />
                    <div className="absolute bottom-0 right-0 w-full h-full opacity-60 mix-blend-screen bg-[radial-gradient(circle_at_70%_50%,_#0c4a6e_0%,_transparent_60%)]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_50%_50%,_#ff00ff_0%,_transparent_50%)]" />

                    {/* Star Field (CSS Generated) */}
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: 'radial-gradient(white 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.5) 2px, transparent 2px)',
                            backgroundSize: '50px 50px, 120px 120px',
                            backgroundPosition: '0 0, 25px 25px'
                        }}
                    />
                </motion.div>

                {/* === LAYER 2: THE FX === */}
                {/* Lightning Bolts */}
                <Lightning style={{ top: '10%', left: '10%', width: '30%', height: '80%', transform: 'rotate(-10deg)' }} delay={0} />
                <Lightning style={{ top: '20%', right: '5%', width: '20%', height: '60%', transform: 'scaleX(-1) rotate(5deg)' }} delay={1.5} />

                {/* Grid Floor */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[linear-gradient(transparent_0%,_#FF4400_100%)] opacity-20 transform perspective-500 rotateX(60deg) origin-bottom" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 68, 0, .3) 25%, rgba(255, 68, 0, .3) 26%, transparent 27%, transparent 74%, rgba(255, 68, 0, .3) 75%, rgba(255, 68, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 68, 0, .3) 25%, rgba(255, 68, 0, .3) 26%, transparent 27%, transparent 74%, rgba(255, 68, 0, .3) 75%, rgba(255, 68, 0, .3) 76%, transparent 77%, transparent)' }} />


                {/* === LAYER 3: CONTENT (Text & UFO) === */}
                <div className="absolute inset-0 z-30 flex items-center justify-between px-6 sm:px-16 overflow-hidden">

                    {/* Typographic Hero */}
                    <motion.div
                        className="flex flex-col items-start z-10"
                        style={{ x: textX, y: textY, transform: "translateZ(50px)" }}
                    >
                        {/* Retro Sun Gradient Effect behind text */}
                        <div className="absolute -inset-10 bg-orange-500/20 blur-3xl rounded-full z-[-1]" />

                        <div className="relative transform -skew-x-[12deg]">
                            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] filter drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                                <span className="block text-gradient-bttf text-stroke-bttf">
                                    BİLİMİ
                                </span>
                                <span className="block text-2xl sm:text-4xl md:text-6xl text-gradient-cyan mt-1 sm:mt-2" style={{ WebkitTextStroke: "1px #000080" }}>
                                    Tİ'YE ALIYORUZ
                                </span>
                            </h1>

                            {/* Badge */}
                            <div className="mt-4 inline-block transform skew-x-[12deg]">
                                <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#500724_50%,#E2E8F0_100%)]" />
                                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950/90 px-4 py-1 text-xs sm:text-sm font-bold text-white backdrop-blur-3xl uppercase tracking-widest border border-white/10">
                                        Ama Ciddili Şekilde
                                    </span>
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Animated UFO (Right Side) */}
                    <motion.div
                        className="hidden sm:block w-32 h-20 md:w-64 md:h-40 relative z-10"
                        style={{ x: bgX, y: bgY, rotate: 10 }} // Parallax opposite to text
                        animate={{
                            y: [0, -15, 0],
                            rotate: [10, 5, 15, 10]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <CyberUFO />
                    </motion.div>
                </div>

                {/* === FOREGROUND PARTICLES / DUST === */}
                <div className="absolute inset-0 pointer-events-none z-40 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                <div className="absolute inset-0 z-50 bg-gradient-to-r from-black/0 via-white/5 to-black/0 skew-x-12 translate-x-[-100%] group-hover:animate-shine" />

            </motion.div>
        </div>
    );
}

// Add Tailwind custom animation for shine
// Note: In a real project, this would go in tailwind.config.ts, but here we can rely on standard utility classes or inline styles.
