"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useRef, useMemo } from "react";

// V35: PREMIUM CINEMA-GRADE BTTF CARD
// Cosmic Vortex + Floating Equations + DeLorean Aesthetic

// Physics equations that float around
const EQUATIONS = [
    "E = mc²",
    "F = ma",
    "pV = nRT",
    "∇·E = ρ/ε₀",
    "ΔS ≥ 0",
    "λ = h/p",
    "Ψ(x,t)",
    "∮B·dl = μ₀I",
];

// Floating Equation Component
const FloatingEquation = ({
    equation,
    delay,
    duration,
    startX,
    startY
}: {
    equation: string;
    delay: number;
    duration: number;
    startX: string;
    startY: string;
}) => (
    <motion.span
        className="absolute text-white/30 font-mono text-xs sm:text-sm pointer-events-none select-none whitespace-nowrap"
        style={{ left: startX, top: startY }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
            opacity: [0, 0.6, 0.4, 0.6, 0],
            scale: [0.5, 1, 1, 1, 0.5],
            y: [0, -20, -40, -60, -80],
            x: [0, 10, -5, 15, 0],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        {equation}
    </motion.span>
);

// Premium Cosmic Swirl Background (Pure CSS)
const CosmicSwirl = () => (
    <div className="absolute inset-0 overflow-hidden">
        {/* Deep Space Base */}
        <div className="absolute inset-0 bg-[#0a0a1a]" />

        {/* The Vortex - Multiple rotating gradients */}
        <div
            className="absolute top-1/2 right-[15%] w-[150%] h-[300%] -translate-y-1/2 animate-spin-slow"
            style={{
                background: `
                    conic-gradient(from 0deg at 50% 50%, 
                        transparent 0deg, 
                        #1e0a3c 30deg, 
                        #0f172a 60deg, 
                        transparent 90deg,
                        #1e3a5f 120deg,
                        transparent 150deg,
                        #2d1b4e 180deg,
                        transparent 210deg,
                        #0c2340 240deg,
                        transparent 270deg,
                        #1a0f30 300deg,
                        transparent 330deg,
                        #0f2847 360deg
                    )`,
                filter: 'blur(30px)',
            }}
        />

        {/* Nebula Clouds */}
        <div className="absolute top-0 left-0 w-full h-full opacity-60">
            <div className="absolute top-[20%] left-[10%] w-[40%] h-[60%] bg-[radial-gradient(ellipse_at_center,_#4c1d95_0%,_transparent_70%)] blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-[10%] right-[20%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,_#1e3a8a_0%,_transparent_70%)] blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[40%] right-[10%] w-[30%] h-[40%] bg-[radial-gradient(ellipse_at_center,_#7c3aed_0%,_transparent_70%)] blur-2xl opacity-50 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        {/* Star Field - Dense */}
        {[...Array(80)].map((_, i) => (
            <div
                key={i}
                className="absolute rounded-full bg-white animate-twinkle"
                style={{
                    width: Math.random() * 3 + 1 + 'px',
                    height: Math.random() * 3 + 1 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 3 + 's',
                    opacity: Math.random() * 0.8 + 0.2,
                }}
            />
        ))}

        {/* Speed Lines / Warp Effect */}
        <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
                <div
                    key={`line-${i}`}
                    className="absolute h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-warp-line"
                    style={{
                        width: Math.random() * 100 + 50 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        transform: `rotate(${Math.random() * 30 - 15}deg)`,
                        animationDelay: Math.random() * 2 + 's',
                    }}
                />
            ))}
        </div>
    </div>
);

// Premium DeLorean-style Vehicle (Detailed SVG)
const TimeMachine = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]">
        {/* Warp Trails */}
        <defs>
            <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF4400" />
                <stop offset="50%" stopColor="#FFAA00" />
                <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Flame Trails */}
        <path d="M10,55 Q-20,55 -50,55" stroke="url(#flameGrad)" strokeWidth="8" fill="none" opacity="0.8">
            <animate attributeName="d" values="M10,55 Q-20,55 -50,55; M10,55 Q-30,50 -60,60; M10,55 Q-20,55 -50,55" dur="0.3s" repeatCount="indefinite" />
        </path>
        <path d="M10,65 Q-20,65 -50,65" stroke="url(#flameGrad)" strokeWidth="8" fill="none" opacity="0.8">
            <animate attributeName="d" values="M10,65 Q-20,65 -50,65; M10,65 Q-30,70 -60,60; M10,65 Q-20,65 -50,65" dur="0.3s" repeatCount="indefinite" />
        </path>

        {/* Car Body - Sleek DeLorean Shape */}
        <g filter="url(#glow)">
            {/* Main Body */}
            <path
                d="M20,70 L40,50 L160,50 L180,60 L180,75 L170,80 L30,80 L20,75 Z"
                fill="#2a2a3a"
                stroke="#00FFFF"
                strokeWidth="1"
            />

            {/* Windshield */}
            <path
                d="M50,50 L70,35 L130,35 L150,50"
                fill="#1a1a2e"
                stroke="#00FFFF"
                strokeWidth="1"
            />

            {/* Hood Details */}
            <line x1="60" y1="55" x2="140" y2="55" stroke="#00FFFF" strokeWidth="0.5" opacity="0.5" />
            <line x1="70" y1="60" x2="130" y2="60" stroke="#00FFFF" strokeWidth="0.5" opacity="0.3" />

            {/* Gull-Wing Door Hints */}
            <line x1="80" y1="50" x2="80" y2="35" stroke="#00FFFF" strokeWidth="0.5" />
            <line x1="120" y1="50" x2="120" y2="35" stroke="#00FFFF" strokeWidth="0.5" />
        </g>

        {/* Wheels with Glow */}
        <circle cx="50" cy="82" r="10" fill="#111" stroke="#00FFFF" strokeWidth="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="82" r="10" fill="#111" stroke="#00FFFF" strokeWidth="2">
            <animate attributeName="stroke-opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
        </circle>

        {/* Flux Capacitor Glow */}
        <circle cx="100" cy="60" r="5" fill="#00FFFF" opacity="0.8">
            <animate attributeName="r" values="5;7;5" dur="0.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;1;0.8" dur="0.5s" repeatCount="indefinite" />
        </circle>

        {/* Lightning Around Car */}
        <path d="M30,30 L40,45 L35,45 L50,65" stroke="#00FFFF" strokeWidth="2" fill="none" opacity="0.7">
            <animate attributeName="opacity" values="0;1;0" dur="0.2s" repeatCount="indefinite" />
        </path>
        <path d="M170,25 L160,40 L165,40 L150,60" stroke="#00FFFF" strokeWidth="2" fill="none" opacity="0.7">
            <animate attributeName="opacity" values="0;1;0" dur="0.3s" repeatCount="indefinite" />
        </path>
    </svg>
);

export function MemeCorner() {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse Parallax
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

    const bgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-3%", "3%"]);
    const bgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-3%", "3%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / rect.width - 0.5);
        y.set(mouseY / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Generate equation positions
    const equationConfigs = useMemo(() => EQUATIONS.map((eq, i) => ({
        equation: eq,
        delay: i * 0.8,
        duration: 6 + Math.random() * 4,
        startX: `${10 + Math.random() * 80}%`,
        startY: `${20 + Math.random() * 60}%`,
    })), []);

    return (
        <div className="w-full relative py-4 perspective-1200">
            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 1; }
                }
                @keyframes warp-line {
                    0% { transform: translateX(-100%) scaleX(0); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translateX(200%) scaleX(1.5); opacity: 0; }
                }
                .animate-spin-slow {
                    animation: spin-slow 60s linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                .animate-twinkle {
                    animation: twinkle 2s ease-in-out infinite;
                }
                .animate-warp-line {
                    animation: warp-line 3s ease-in-out infinite;
                }
                .perspective-1200 {
                    perspective: 1200px;
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
                    "rounded-2xl overflow-hidden",
                    "border-4 border-orange-500/80",
                    "shadow-[0_0_60px_-10px_#FF8800,inset_0_0_30px_rgba(0,0,0,0.5)]",
                    "group cursor-pointer select-none"
                )}
            >
                {/* Background */}
                <motion.div
                    className="absolute inset-[-20%]"
                    style={{ x: bgX, y: bgY }}
                >
                    <CosmicSwirl />
                </motion.div>

                {/* Floating Equations */}
                <div className="absolute inset-0 z-10 overflow-hidden">
                    {equationConfigs.map((config, i) => (
                        <FloatingEquation key={i} {...config} />
                    ))}
                </div>

                {/* Main Content */}
                <div className="absolute inset-0 z-20 flex items-center justify-between px-6 sm:px-10 md:px-16">

                    {/* Typography - BTTF Style */}
                    <motion.div
                        className="flex flex-col items-start z-10 max-w-[60%] sm:max-w-[50%]"
                        style={{ transform: "translateZ(60px)" }}
                    >
                        {/* Main Title */}
                        <div className="relative transform -skew-x-[10deg]">
                            {/* Glow behind text */}
                            <div className="absolute -inset-4 bg-orange-500/20 blur-2xl rounded-full" />

                            <h1 className="relative text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter leading-[0.9]">
                                {/* BİLİMİ - Orange Gradient */}
                                <span
                                    className="block drop-shadow-[3px_3px_0px_#000] sm:drop-shadow-[4px_4px_0px_#000]"
                                    style={{
                                        background: 'linear-gradient(180deg, #FFD700 0%, #FF8C00 40%, #FF4500 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '0 0 30px rgba(255,140,0,0.5)',
                                    }}
                                >
                                    BİLİMİ
                                </span>

                                {/* Tİ'YE ALIYORUZ - Cyan Gradient */}
                                <span
                                    className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl mt-1"
                                    style={{
                                        background: 'linear-gradient(180deg, #E0FFFF 0%, #00CED1 50%, #0077BE 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '0 0 20px rgba(0,206,209,0.5)',
                                    }}
                                >
                                    Tİ'YE ALIYORUZ
                                </span>
                            </h1>
                        </div>

                        {/* Badge */}
                        <motion.div
                            className="mt-3 sm:mt-4 transform skew-x-[10deg]"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="relative inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-orange-500/50 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold text-orange-300 uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(255,140,0,0.3)]">
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                Ama Ciddili Şekilde
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Time Machine */}
                    <motion.div
                        className="hidden sm:block w-40 h-28 md:w-56 md:h-36 lg:w-72 lg:h-44 relative z-10"
                        animate={{
                            y: [0, -10, 0],
                            x: [0, 5, 0],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{ transform: "translateZ(40px)" }}
                    >
                        <TimeMachine />
                    </motion.div>
                </div>

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/50 to-transparent z-30 pointer-events-none" />

                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%)] pointer-events-none z-30" />

                {/* Scanlines Effect */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] pointer-events-none z-30 opacity-30" />

            </motion.div>
        </div>
    );
}
