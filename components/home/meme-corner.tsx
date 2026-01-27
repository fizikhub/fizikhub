"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// --- SUB-COMPONENTS FOR PURE CODE GRAPHICS ---

// 1. Floating Physics Equations (SVG/Text)
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
                opacity: [0.2, 0.4, 0.2]
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

// 2. Pure CSS Star Field & Vortex
function CosmicSwirl() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Nebula Gradient Layer - Animated */}
            <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-[spin_60s_linear_infinite]"
                style={{
                    background: "conic-gradient(from 0deg at 50% 50%, #000000 0%, #0a0a0a 20%, #1a0033 40%, #001a33 60%, #0a0a0a 80%, #000000 100%)",
                    filter: "blur(40px)",
                    opacity: 0.8
                }}
            />

            {/* Stars Layer (Generated via CSS Box Shadow usually, but let's use small divs for animation control) */}
            {Array.from({ length: 80 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: Math.random() < 0.1 ? '3px' : '1.5px',
                        height: Math.random() < 0.1 ? '3px' : '1.5px',
                    }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                />
            ))}
        </div>
    );
}

// 3. DeLorean-inspired Time Machine Icon (Pure SVG)
function TimeMachine() {
    return (
        <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]">
            <defs>
                <linearGradient id="metal" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#e0e0e0" />
                    <stop offset="50%" stopColor="#909090" />
                    <stop offset="100%" stopColor="#404040" />
                </linearGradient>
                <linearGradient id="neonBlue" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00ffff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#00ffff" />
                    <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Speed Lines / Lightning */}
            <motion.path
                d="M5,50 L-10,48 M5,52 L-15,55 M10,45 L-5,40"
                stroke="#00ffff"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0], x: [0, -20, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.2 }}
            />

            {/* Fire Trails */}
            <motion.path
                d="M10,55 Q5,58 -5,55 Q0,52 10,55"
                fill="#ffaa00"
                opacity="0.8"
                animate={{ d: ["M10,55 Q5,60 -10,55 Q0,50 10,55", "M10,55 Q5,58 -5,55 Q0,52 10,55"] }} // Wiggle
                transition={{ duration: 0.1, repeat: Infinity }}
            />

            {/* Car Body (Simplified Retro Side View) */}
            <path d="M10,40 L30,40 L40,25 L70,25 L85,40 L95,40 Q98,40 98,45 L98,50 L10,50 Z" fill="url(#metal)" stroke="#ccc" strokeWidth="0.5" />

            {/* Wheel Wells (Hover Mode - Wheels horizontal) */}
            <ellipse cx="25" cy="50" rx="8" ry="3" fill="#111" stroke="#333" />
            <ellipse cx="80" cy="50" rx="8" ry="3" fill="#111" stroke="#333" />

            {/* Neon Strips */}
            <rect x="15" y="48" width="75" height="1" fill="url(#neonBlue)" />

            {/* Flux Capacitor Glow (Visual representation inside) */}
            <circle cx="55" cy="35" r="2" fill="#ffff00" className="animate-pulse" />
        </svg>
    );
}

export function MemeCorner() {
    // --- MOUSE PARALLAX LOGIC ---
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Parallax layers
    const bgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-5%", "5%"]);
    const bgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-5%", "5%"]);

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
        <div className="w-full relative py-4 perspective-1200">
            <style jsx global>{`
                .perspective-1200 { perspective: 1200px; }
                .text-stroke { -webkit-text-stroke: 1px rgba(255,255,255,0.2); }
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
                    "bg-black rounded-2xl overflow-hidden",
                    // Hard Borders for Neo-Brutalism + Glow for Scifi
                    "border-4 border-orange-500/80",
                    "shadow-[0_0_60px_-10px_#FF8800,inset_0_0_30px_rgba(0,0,0,0.5)]",
                    "group cursor-pointer select-none"
                )}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
            >
                {/* 1. Background Layer (Cosmic Swirl + Parallax) */}
                <motion.div
                    className="absolute inset-[-20%] z-0"
                    style={{ x: bgX, y: bgY }}
                >
                    <CosmicSwirl />
                </motion.div>

                {/* 2. Floating Equations Layer */}
                <div className="absolute inset-0 z-10 overflow-hidden mix-blend-screen">
                    {equationConfigs.map((config, i) => (
                        <FloatingEquation key={i} {...config} />
                    ))}
                </div>

                {/* 3. Main Content Layer */}
                <div className="absolute inset-0 z-20 flex items-center justify-between px-6 sm:px-10 md:px-16">
                    {/* Left: Typography */}
                    <div className="flex flex-col space-y-2 z-30">
                        <motion.div
                            style={{ transform: "translateZ(60px)" }}
                            className="flex flex-col"
                        >
                            {/* "BİLİMİ" - Retro Chrome Gradient */}
                            <h1 className="flex flex-col font-black italic tracking-tighter transform -skew-x-6">
                                <span className="text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 drop-shadow-[0_2px_0_rgba(255,255,255,0.5)]">
                                    BİLİMİ
                                </span>
                                <span className="text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-[0_0_10px_rgba(0,100,255,0.8)] mt-[-5px]">
                                    Tİ'YE ALIYORUZ
                                </span>
                            </h1>

                            {/* Subtitle Badge */}
                            <div className="mt-4 self-start bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                                <span className="text-[10px] sm:text-xs font-mono text-cyan-300 tracking-[0.2em] uppercase">
                                    Ama Ciddili Şekilde
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: The Time Machine (Detailed SVG) */}
                    <motion.div
                        className="hidden sm:block w-32 h-20 md:w-64 md:h-40 z-20 opacity-90 mix-blend-lighten"
                        style={{ transform: "translateZ(40px)" }}
                        animate={{
                            y: [-5, 5, -5],
                            rotateZ: [-1, 1, -1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <TimeMachine />
                    </motion.div>
                </div>

                {/* 4. Effects Overlay */}
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-40" />

                {/* Scanlines (Old TV Effect) */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-40" />
                <div className="absolute inset-0 border-t border-white/5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-40" />

            </motion.div>
        </div>
    );
}
