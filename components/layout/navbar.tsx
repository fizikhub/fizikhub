"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, Zap } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
                    opacity: 0.2 + Math.random() * 0.3
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
                V29: PREMIUM SCIENCE HUD
                - Height: h-14 (56px) - Optimized for Mobile
                - Style: Sharp Neo-Brutalist, Blue Base
            */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 pointer-events-none">
                <div
                    className={cn(
                        "pointer-events-auto h-full",
                        "flex items-center justify-between px-4 sm:px-6",
                        "bg-[#3B82F6] border-b-[3px] border-black",
                        "shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]", // Thicker shadow
                        "w-full relative overflow-hidden"
                    )}
                >
                    {/* PHYSICS RAIN BACKGROUND (FLOWING UP) - REDUCED OPACITY */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-60">
                        {raindrops.map((drop, i) => (
                            <motion.div
                                key={i}
                                className="absolute font-mono font-bold whitespace-nowrap will-change-transform translate-z-0"
                                style={{
                                    left: `${drop.left}%`,
                                    fontSize: `${10 * drop.scale}px`,
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

                    {/* RULER TICKS - SHARPER */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 flex justify-between px-1 pointer-events-none opacity-40 mix-blend-overlay">
                        {[...Array(60)].map((_, i) => (
                            <div key={i} className="w-[1px] bg-black h-full" style={{ height: i % 10 === 0 ? '100%' : '50%' }} />
                        ))}
                    </div>

                    {/* LEFT: BRAND */}
                    <div className="relative z-10 flex-shrink-0 pt-1 hover:scale-105 transition-transform duration-300">
                        <ViewTransitionLink href="/">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* RIGHT: COMPACT CONTROLS */}
                    <div className="relative z-10 flex items-center gap-2.5">

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-2 mr-6">
                            {navItems.map((item) => (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-1.5 text-xs font-black uppercase border-[2px] border-black transition-all bg-white text-black hover:bg-[#FFC800]",
                                        "shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
                                        pathname === item.href && "bg-[#FFC800] translate-x-[1px] translate-y-[1px] shadow-[1px_1px_0px_0px_#000]"
                                    )}
                                >
                                    {item.label}
                                </ViewTransitionLink>
                            ))}
                        </div>

                        {/* 1. SEARCH */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            variants={clickVariant}
                            whileTap="tap"
                            whileHover="hover"
                            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-black"
                        >
                            <Search className="w-4 h-4 stroke-[2.5px]" />
                        </motion.button>

                        {/* 2. ZAP */}
                        <ViewTransitionLink href="/ozel" className="md:hidden">
                            <motion.div
                                variants={clickVariant}
                                whileTap="tap"
                                whileHover="hover"
                                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#FFC800] border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-black"
                            >
                                <Zap className="w-4 h-4 fill-black stroke-[2.5px]" />
                            </motion.div>
                        </ViewTransitionLink>

                        {/* 3. MENU */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    variants={clickVariant}
                                    whileTap="tap"
                                    whileHover="hover"
                                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#111] border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-white"
                                >
                                    <Menu className="w-4 h-4 stroke-[2.5px]" />
                                </motion.button>
                            </SheetTrigger>
                            <SheetContent side="top" className="w-full min-h-[50vh] bg-[#3B82F6] border-b-[4px] border-black p-0 overflow-hidden">
                                <div className="absolute inset-0 opacity-20"
                                    style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '32px 32px' }}
                                />
                                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 pt-12 gap-6">
                                    <div className="scale-125">
                                        <DankLogo />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                                        {[
                                            { href: "/", label: "ANA SAYFA", bg: "bg-white" },
                                            { href: "/makale", label: "KEŞFET", bg: "bg-[#FFC800]" },
                                            { href: "/blog", label: "BLOG", bg: "bg-cyan-300" },
                                            { href: "/profil", label: "PROFİL", bg: "bg-[#F472B6]" },
                                        ].map((link, i) => (
                                            <ViewTransitionLink
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={cn(
                                                    "group relative h-16 border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all",
                                                    link.bg
                                                )}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="font-black text-sm sm:text-base text-black tracking-wider uppercase drop-shadow-sm">
                                                        {link.label}
                                                    </span>
                                                </div>
                                            </ViewTransitionLink>
                                        ))}
                                    </div>
                                    <div className="w-full max-w-[200px]">
                                        <AuthButton />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header >

            <div className="h-[56px] sm:h-[64px]" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
