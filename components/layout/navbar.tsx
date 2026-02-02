"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Zap } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";
import { MobileMenu } from "@/components/layout/mobile-menu";

const clickVariant = {
    tap: { y: 2, x: 2, boxShadow: "0px 0px 0px 0px #000" },
    hover: { y: -2, x: -2, boxShadow: "3px 3px 0px 0px #000" }
};

const physicsTicker = [
    "E = mc²", "F = ma", "ΔS ≥ 0", "iℏ∂ψ/∂t = Ĥψ", "G = 6.67×10⁻¹¹",
    "∇⋅E = ρ/ε₀", "pV = nRT", "λ = h/p", "S = k ln Ω", "c = 3×10⁸",
    "e^(iπ) + 1 = 0", "∇×B = μ₀J + μ₀ε₀∂E/∂t", "H = -Σ pᵢ log pᵢ",
    "ΔxΔp ≥ ℏ/2", "R_uv - 1/2Rg_uv = 8πGT_uv", "KE = 1/2mv²",
    "F = G(m₁m₂)/r²", "L = T - V", "ds² = -(1-2M/r)dt² + ...",
    "Q = mcΔT", "U = 3/2nRT", "P = IV", "V = IR"
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    const [raindrops, setRaindrops] = useState<{ left: number; duration: number; delay: number; formula: string; scale: number; opacity?: number }[]>([]);

    useEffect(() => {
        setMounted(true);

        const generateRain = () => {
            // ONLY GENERATE RAIN ON DESKTOP
            if (window.innerWidth < 768) return;

            const laneCount = 20;
            const dropCount = 30;

            const drops = Array.from({ length: dropCount }).map((_, i) => {
                const lane = Math.floor(Math.random() * laneCount);
                const laneWidth = 80 / laneCount;
                const left = 10 + (lane * laneWidth) + (Math.random() * (laneWidth * 0.8));

                return {
                    left: left,
                    duration: 5 + Math.random() * 8,
                    delay: Math.random() * 15,
                    formula: physicsTicker[Math.floor(Math.random() * physicsTicker.length)],
                    scale: 0.7 + Math.random() * 0.4,
                    opacity: 0.5 + Math.random() * 0.4
                };
            });
            setRaindrops(drops);
        };

        if ('requestIdleCallback' in window) {
            (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(generateRain);
        } else {
            setTimeout(generateRain, 100);
        }
    }, []);

    const navItems = [
        { href: "/", label: "Ana" },
        { href: "/makale", label: "Keşfet" },
        { href: "/siralamalar", label: "Lig" },
    ];

    const buttonClass = cn(
        "flex items-center justify-center w-[36px] h-[36px] sm:w-10 sm:h-10",
        "bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]",
        "text-black transition-all",
        // Active/Hover states handled by framer-motion or CSS
    );

    return (
        <>
            {/* 
                V30: CLEAN NEO-BRUTALIST NAVBAR
                - Increased height slightly for better touch targets if needed, but keeping h-14 is standard.
                - Removed mobile distractions.
            */}
            <header className="fixed top-0 left-0 right-0 z-40 h-16 pointer-events-none">
                <div
                    className={cn(
                        "pointer-events-auto h-full",
                        "flex items-center justify-between px-4 sm:px-6",
                        "bg-[#3B82F6] border-b-[3px] border-black",
                        "shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]",
                        "w-full relative overflow-hidden"
                    )}
                >
                    {/* DESKTOP ONLY: PHYSICS RAIN BACKGROUND */}
                    <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none select-none opacity-80">
                        {raindrops.map((drop, i) => (
                            <motion.div
                                key={i}
                                className="absolute font-mono font-bold whitespace-nowrap will-change-transform translate-z-0"
                                style={{
                                    left: `${drop.left}%`,
                                    fontSize: `${13 * drop.scale}px`,
                                    color: `rgba(0,0,0,${drop.opacity || 0.3})`,
                                    filter: 'blur(0.3px)'
                                }}
                                initial={{ y: 60, opacity: 0 }}
                                animate={{ y: -20, opacity: [0, 1, 0] }}
                                transition={{
                                    duration: drop.duration,
                                    repeat: Infinity,
                                    delay: drop.delay,
                                    ease: "linear"
                                }}
                            >
                                {drop.formula}
                            </motion.div>
                        ))}
                    </div>

                    {/* DECORATIVE: DOT GRID OVERLAY (SUBTLE TEXTURE) */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />

                    {/* LEFT: BRAND */}
                    <div className="relative z-10 flex-shrink-0 hover:scale-105 transition-transform duration-300">
                        <ViewTransitionLink href="/">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* RIGHT: COMPACT CONTROLS */}
                    <div className="relative z-10 flex items-center gap-2 sm:gap-3">

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-2 mr-6">
                            {navItems.map((item) => (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 text-xs font-black uppercase border-[2px] border-black transition-all bg-white text-black hover:bg-[#FFC800]",
                                        "shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
                                        pathname === item.href && "bg-[#FFC800] translate-x-[1px] translate-y-[1px] shadow-[1px_1px_0px_0px_#000]"
                                    )}
                                >
                                    {item.label}
                                </ViewTransitionLink>
                            ))}
                        </div>

                        {/* 1. SEARCH - Tactile Button */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            variants={clickVariant}
                            whileTap="tap"
                            whileHover="hover"
                            className={buttonClass}
                        >
                            <Search className="w-5 h-5 sm:w-5 sm:h-5 stroke-[2.5px]" />
                        </motion.button>

                        {/* 2. ZAP - Mobile Only - Unified Style */}
                        <motion.button
                            onClick={() => window.location.href = '/ozel'}
                            variants={clickVariant}
                            whileTap="tap"
                            whileHover="hover"
                            className={cn(buttonClass, "md:hidden bg-[#FFC800]")} // Yellow highlight for special content
                        >
                            <Zap className="w-5 h-5 fill-black stroke-[2.5px]" />
                        </motion.button>

                        {/* 3. MOBILE MENU (RIGHT SHEET) */}
                        <div className="md:hidden">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </header >

            {/* Spacer for Fixed Header */}
            <div className="h-[64px]" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
