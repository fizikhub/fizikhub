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
                    delay: -1 * Math.random() * 20, // Start "in the past" so they are visible immediately
                    formula: physicsTicker[Math.floor(Math.random() * physicsTicker.length)],
                    scale: isMobile ? 0.6 + Math.random() * 0.3 : 0.7 + Math.random() * 0.4,
                    opacity: 0.5 + Math.random() * 0.4
                };
            });
            setRaindrops(drops);
        };

        generateRain();
    }, []);

    const navItems = [
        { href: "/", label: "Ana" },
        { href: "/makale", label: "Keşfet" },
        { href: "/simulasyonlar", label: "Simülasyonlar" },
        { href: "/siralamalar", label: "Lig" },
    ];

    return (
        <>
            {/* 
                V32: VIVID & SOFT NAVBAR
                - Background: #27272a (Lighter Dark)
                - Borders: 3px Black (Neo-Brutalist)
                - Rounded: Corners maintained where possible inside
            */}
            <header className="fixed top-0 left-0 right-0 z-50 h-[60px] sm:h-20" role="banner">
                <div
                    className={cn(
                        "h-full",
                        "flex items-center justify-between px-4 sm:px-6",
                        "bg-[#27272a]/90 backdrop-blur-xl border-b-[3px] border-black",
                        "shadow-lg",
                        "w-full relative"
                    )}
                >
                    {/* PHYSICS RAIN BACKGROUND (FLOWING UP) - REDUCED OPACITY & CLIPPED */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-20 rounded-b-xl">
                        {raindrops.map((drop, i) => (
                            <motion.div
                                key={i}
                                className="absolute font-mono font-bold whitespace-nowrap will-change-transform translate-z-0"
                                style={{
                                    left: `${drop.left}%`,
                                    fontSize: `${13 * drop.scale}px`,
                                    color: `rgba(255,255,255,${drop.opacity || 0.3})`,
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
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 flex justify-between px-1 pointer-events-none opacity-20 mix-blend-overlay">
                        {[...Array(60)].map((_, i) => (
                            <div key={i} className="w-[1px] bg-white h-full" style={{ height: i % 10 === 0 ? '100%' : '50%' }} />
                        ))}
                    </div>

                    {/* LEFT: BRAND */}
                    <div className="relative z-50 flex-shrink-0 pt-0.5 hover:scale-105 transition-transform duration-300">
                        <ViewTransitionLink href="/">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* RIGHT: COMPACT CONTROLS */}
                    <div className="relative z-50 flex items-center gap-3">

                        {/* Desktop Links */}
                        <nav className="hidden md:flex items-center gap-2 mr-6" aria-label="Ana navigasyon">
                            {navItems.map((item) => (
                                <ViewTransitionLink
                                    key={item.href}
                                    id={`desktop-nav-${item.href === '/' ? 'home' : item.href.replace('/', '')}`}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 text-xs font-black uppercase border-2 border-transparent transition-all rounded-xl",
                                        "text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20",
                                        pathname === item.href && "bg-[#FACC15] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:text-black hover:bg-[#FACC15] hover:border-black"
                                    )}
                                >
                                    {item.label}
                                </ViewTransitionLink>
                            ))}
                        </nav>

                        {/* 1. SEARCH - VIVID BLUE */}
                        <button
                            id="desktop-search-trigger"
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Ara"
                            className="no-min-size flex items-center justify-center w-10 h-10 box-border bg-[#4169E1] border-[3px] border-black rounded-xl shadow-[3px_3px_0px_0px_#000] cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all p-0 group"
                        >
                            <Search className="w-5 h-5 text-white stroke-[3px] group-hover:scale-110 transition-transform" />
                        </button>

                        {/* 2. ZAP - VIVID YELLOW */}
                        <button
                            id="desktop-zap-trigger"
                            onClick={() => window.location.href = '/ozel'}
                            aria-label="Premium özellikler"
                            className="no-min-size flex items-center justify-center w-10 h-10 box-border bg-[#FACC15] border-[3px] border-black rounded-xl shadow-[3px_3px_0px_0px_#000] cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all mr-1 p-0 group"
                        >
                            <Zap className="w-5 h-5 text-black fill-black stroke-[3px] group-hover:rotate-12 transition-transform" />
                        </button>

                        {/* 3. MOBILE MENU */}
                        <div className="md:hidden relative z-[100]">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </header >

            <div className="h-[60px] sm:h-20" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
