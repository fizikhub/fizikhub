"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

// --- SUB-COMPONENTS ---

// 1. Floating Physics Equations (Background Ambience)
const equationConfigs = [
    { text: "E = mc²", top: "10%", left: "10%", delay: 0, rotate: -15, scale: 1.2 },
    { text: "F = ma", top: "20%", left: "80%", delay: 2, rotate: 10, scale: 0.9 },
    { text: "∇·E = ρ/ε₀", top: "70%", left: "15%", delay: 4, rotate: 5, scale: 0.8 },
    { text: "iℏ∂ψ/∂t = Ĥψ", top: "80%", left: "75%", delay: 1, rotate: -5, scale: 1.0 },
    { text: "S = k ln Ω", top: "40%", left: "50%", delay: 3, rotate: 20, scale: 0.7 },
];

function FloatingEquation({ text, top, left, delay, rotate, scale }: { text: string; top: string; left: string; delay: number; rotate: number; scale: number; }) {
    return (
        <motion.div
            className="absolute font-mono text-white/20 select-none pointer-events-none z-0"
            style={{ top, left, fontSize: `${scale}rem` }}
            animate={{
                y: [0, -20, 0],
                rotate: [rotate, rotate + 5, rotate],
                opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
        >
            {text}
        </motion.div>
    );
}

// 2. Cosmic Background (The swirl/vortex feel)
function CosmicSwirl() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
            {/* Nebula Gradient Layer */}
            <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-[spin_60s_linear_infinite]"
                style={{
                    background: "conic-gradient(from 0deg at 50% 50%, #000 0%, #080214 20%, #1a0033 40%, #001a33 60%, #0a0a0a 80%, #000 100%)",
                    filter: "blur(50px)",
                    opacity: 0.9
                }}
            />

            {/* Stars */}
            {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.9)]"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: Math.random() < 0.2 ? '3px' : '1px',
                        height: Math.random() < 0.2 ? '3px' : '1px',
                    }}
                    animate={{ opacity: [0.1, 1, 0.1], scale: [0.5, 1.5, 0.5] }}
                    transition={{
                        duration: 1 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 3
                    }}
                />
            ))}
        </div>
    );
}

export function MemeCorner() {
    // --- PARALLAX LOGIC ---
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    // Parallax layers movement
    const bgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-3%", "3%"]);
    const bgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-3%", "3%"]);
    const carX = useTransform(mouseXSpring, [-0.5, 0.5], ["-10px", "10px"]);
    const carY = useTransform(mouseYSpring, [-0.5, 0.5], ["-10px", "10px"]);
    const textZ = useTransform(mouseXSpring, [-0.5, 0.5], ["20px", "40px"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="w-full relative py-4 perspective-1000 group">
            {/* Global Styles for Custom Gradients/Text */}
            <style jsx global>{`
                .bttf-gradient-text {
                    background: linear-gradient(to bottom, #FFF33B 0%, #FFC800 40%, #FF5A00 55%, #CF0000 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(4px 4px 0px #000);
                }
                .bttf-stroke {
                    position: relative;
                }
                .bttf-stroke::before {
                    content: attr(data-text);
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: -1;
                    width: 100%;
                    height: 100%;
                    -webkit-text-stroke: 8px #2A68CC; /* Blue outline */
                    background: linear-gradient(to bottom, #2A68CC, #1D4E9E);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    transform: translateY(2px);
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
                    "relative w-full aspect-[21/9] sm:aspect-[3/1] md:aspect-[3.5/1]",
                    "bg-black rounded-xl overflow-visible", // Overflow visible for pop-out
                    "border-[3px] border-[#FF8800] shadow-[0_0_40px_-5px_#FF5500]",
                    "cursor-pointer select-none"
                )}
            >
                {/* 1. Background (Cropped inside card) */}
                <div className="absolute inset-0 overflow-hidden rounded-xl bg-black">
                    <motion.div className="absolute inset-[-10%]" style={{ x: bgX, y: bgY }}>
                        <CosmicSwirl />
                    </motion.div>

                    {/* Floating Equations */}
                    <div className="absolute inset-0 pointer-events-none">
                        {equationConfigs.map((config, i) => (
                            <FloatingEquation key={i} {...config} />
                        ))}
                    </div>
                </div>

                {/* 2. Content Container (Z-Index Layers) */}
                <div className="absolute inset-0 z-20 flex items-center justify-between px-6 sm:px-10 md:px-16 pointer-events-none">

                    {/* LEFT: Typography (BTTF Style) */}
                    <motion.div
                        className="flex flex-col z-30 transform-gpu"
                        style={{ translateZ: textZ }}
                    >
                        {/* 'BILIMI' - Skewed & Gradient */}
                        <div className="transform -skew-x-[12deg] origin-bottom-left">
                            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.85] tracking-tighter filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]">
                                <span className="bttf-gradient-text block" data-text="BİLİMİ">
                                    BİLİMİ
                                </span>
                            </h2>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[0.85] tracking-tighter filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] ml-4">
                                <span className="bttf-gradient-text block" data-text="Tİ'YE ALIYORUZ">
                                    Tİ'YE ALIYORUZ
                                </span>
                            </h2>
                        </div>

                        {/* Subtitle Badge */}
                        <div className="mt-4 ml-2 transform -skew-x-[12deg]">
                            <div className="bg-black/40 backdrop-blur border border-cyan-400/50 px-3 py-1 inline-block rounded skew-x-[12deg] shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                                <span className="text-[10px] sm:text-xs font-mono text-cyan-300 tracking-[0.3em] font-bold uppercase drop-shadow-[0_0_5px_cyan]">
                                    Ama Ciddili Şekilde
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: DeLorean (Popping Out) - Clean PNG */}
                    <div className="absolute right-[-10%] sm:right-[-2%] md:right-[2%] top-[15%] sm:top-[-10%] md:top-[-15%] w-[45%] sm:w-[50%] h-[100%] sm:h-[130%] z-50 pointer-events-none">
                        <motion.div
                            className="w-full h-full"
                            style={{ x: carX, y: carY, scale: 1.1 }}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
                        >
                            {/* Filter: Normal visibility with Linear Mask to hide right-side checkerboard */}
                            <div className="relative w-full h-full" style={{
                                maskImage: "linear-gradient(to right, black 0%, black 60%, transparent 90%)",
                                WebkitMaskImage: "linear-gradient(to right, black 0%, black 60%, transparent 90%)"
                            }}>
                                <Image
                                    src="/assets/delorean-popout.png"
                                    alt="DeLorean Time Machine"
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                    unoptimized
                                />
                                {/* Engine Glow */}
                                <div className="absolute right-[35%] bottom-[35%] w-10 h-10 bg-cyan-500/50 blur-xl animate-pulse mix-blend-screen" />
                                <div className="absolute left-[25%] bottom-[25%] w-12 h-12 bg-blue-500/40 blur-xl animate-pulse delay-75 mix-blend-screen" />
                            </div>
                        </motion.div>
                    </div>

                </div>

                {/* Overlays (Scanlines, Vignette) */}
                <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden z-40">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                    <div className="absolute inset-0 border-t border-white/5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                </div>

            </motion.div>
        </div>
    );
}
