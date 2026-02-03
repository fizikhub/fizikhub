"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Zap } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
// Sheet imports removed
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
            const isMobile = window.innerWidth < 768;
            const laneCount = isMobile ? 8 : 20; // Distinct lanes to prevent overlap
            const dropCount = isMobile ? 12 : 30;

            const drops = Array.from({ length: dropCount }).map((_, i) => {
                // Assign to a random lane to prevent horizontal overlap
                const lane = Math.floor(Math.random() * laneCount);
                const laneWidth = 80 / laneCount; // Use inner 80% of screen
                const left = 10 + (lane * laneWidth) + (Math.random() * (laneWidth * 0.8)); // 10% padding on sides

                return {
                    left: left,
                    duration: 5 + Math.random() * 8, // 5s-13s
                    delay: Math.random() * 15, // Spread out start times
                    formula: physicsTicker[Math.floor(Math.random() * physicsTicker.length)],
                    scale: isMobile ? 0.6 + Math.random() * 0.3 : 0.7 + Math.random() * 0.4,
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

    return (
        <>
            {/* 
                V31: STEALTH LUXE HUD
                - Height: h-14 (56px) - Optimized for Mobile
                - Style: Matte Black, Gold Accents, Minimalist
            */}
            <header className="fixed top-0 left-0 right-0 z-40 h-14 sm:h-16 pointer-events-none">
                <div
                    className={cn(
                        "pointer-events-auto h-full",
                        "flex items-center justify-between px-4 sm:px-6",
                        "bg-[#050505] border-b border-[#FACC15]/20", // Stealth Black + Subtle Gold Border
                        "w-full relative overflow-hidden transition-all duration-300"
                    )}
                >
                    {/* PHYSICS RAIN BACKGROUND (FLOWING UP) - GOLD DATA STREAM */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-10">
                        {raindrops.map((drop, i) => (
                            <motion.div
                                key={i}
                                className="absolute font-mono font-bold whitespace-nowrap will-change-transform translate-z-0"
                                style={{
                                    left: `${drop.left}%`,
                                    fontSize: `${10 * drop.scale}px`,
                                    color: '#FACC15', // Gold Data Stream
                                    filter: 'blur(0.4px)'
                                }}
                                initial={{ y: 60, opacity: 0 }}
                                animate={{ y: -20, opacity: [0, 0.8, 0] }}
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

                    {/* LEFT: BRAND */}
                    <div className="relative z-10 flex-shrink-0 pt-1 hover:scale-105 transition-transform duration-300 active:scale-95">
                        <ViewTransitionLink href="/">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* RIGHT: COMPACT CONTROLS */}
                    <div className="relative z-10 flex items-center gap-3 pb-0.5">

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-2 mr-6">
                            {navItems.map((item) => (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-1.5 text-xs font-bold uppercase transition-all rounded-full",
                                        "text-zinc-400 hover:text-[#FACC15] hover:bg-[#FACC15]/10",
                                        pathname === item.href && "text-[#FACC15] bg-[#FACC15]/10"
                                    )}
                                >
                                    {item.label}
                                </ViewTransitionLink>
                            ))}
                        </div>

                        {/* 1. SEARCH */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center justify-center w-9 h-9 text-zinc-400 transition-all hover:text-[#FACC15] active:text-white"
                        >
                            <Search className="w-5 h-5 stroke-[2px]" />
                        </motion.button>

                        {/* 2. ZAP - Mobile Only */}
                        <motion.button
                            onClick={() => window.location.href = '/ozel'}
                            whileTap={{ scale: 0.9 }}
                            className="flex md:hidden items-center justify-center w-9 h-9 text-[#FACC15] transition-all bg-[#FACC15]/10 rounded-full border border-[#FACC15]/20"
                        >
                            <Zap className="w-4 h-4 fill-[#FACC15] stroke-[2px]" />
                        </motion.button>

                        {/* 3. MOBILE MENU (RIGHT SHEET) */}
                        <div className="md:hidden">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </header >

            <div className="h-[56px] sm:h-[64px]" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
