"use client";

import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { DankLogo } from "@/components/brand/dank-logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import dynamic from "next/dynamic";

// Dynamically import heavy modals to reduce initial bundle size
const CommandPalette = dynamic(() => import("@/components/ui/command-palette").then(mod => mod.CommandPalette), { ssr: false });
const PhysicsFactModal = dynamic(() => import("@/components/ui/physics-fact-modal").then(mod => mod.PhysicsFactModal), { ssr: false });

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
    const [isFactOpen, setIsFactOpen] = useState(false);

    const [raindrops, setRaindrops] = useState<{ left: number; duration: number; delay: number; formula: string; scale: number; opacity?: number }[]>([]);

    useEffect(() => {
        const generateRain = () => {
            const connection = (navigator as Navigator & {
                connection?: { saveData?: boolean; effectiveType?: string };
            }).connection;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            if (connection?.saveData || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType || "")) return;

            const isMobile = window.innerWidth < 768;
            const laneCount = isMobile ? 6 : 12;
            const dropCount = isMobile ? 8 : 18;

            const drops = Array.from({ length: dropCount }).map(() => {
                const lane = Math.floor(Math.random() * laneCount);
                const laneWidth = 80 / laneCount;
                const left = 10 + (lane * laneWidth) + (Math.random() * (laneWidth * 0.8));

                return {
                    left: left,
                    duration: 5 + Math.random() * 8,
                    delay: -1 * Math.random() * 20,
                    formula: physicsTicker[Math.floor(Math.random() * physicsTicker.length)],
                    scale: isMobile ? 0.6 + Math.random() * 0.3 : 0.7 + Math.random() * 0.4,
                    opacity: 0.46 + Math.random() * 0.34
                };
            });
            setRaindrops(drops);
        };

        // Defer rain generation to avoid blocking initial hydration
        if ('requestIdleCallback' in window) {
            const idleId = window.requestIdleCallback(generateRain, { timeout: 2000 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = globalThis.setTimeout(generateRain, 500);
        return () => globalThis.clearTimeout(timeoutId);
    }, []);

    return (
        <>
            {/* 
                V31: PREMIUM GLASS HUD (DARK MODE RESTORED)
                - Height: h-14 (56px) - Optimized for Mobile
                - Style: Dark Glass Neo-Brutalist
            */}
            <header className="fixed top-0 left-0 right-0 z-50 h-[53px] sm:h-16 md:hidden" role="banner">
                <div
                    className={cn(
                        "h-full",
                        "flex items-center justify-between px-4 sm:px-6",
                        "bg-[#09090b]/82 backdrop-blur-xl border-b border-white/10",
                        "shadow-[0_10px_28px_rgba(0,0,0,0.34)]",
                        "w-full relative overflow-hidden"
                    )}
                >
                    {/* PHYSICS RAIN BACKGROUND (FLOWING UP) - REDUCED OPACITY & CLIPPED */}
                    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-30 rounded-b-xl">
                        {raindrops.map((drop, i) => (
                            <div
                                key={i}
                                className="absolute font-mono font-bold whitespace-nowrap will-change-transform transform-gpu"
                                style={{
                                    left: `${drop.left}%`,
                                    fontSize: `${13 * drop.scale}px`,
                                    color: `rgba(255,255,255,${drop.opacity || 0.3})`,
                                    animation: `physicsRainUp ${drop.duration}s linear ${drop.delay}s infinite`,
                                }}
                            >
                                {drop.formula}
                            </div>
                        ))}
                    </div>

                    {/* RULER TICKS - SHARPER */}
                    <div
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 right-0 h-1.5 pointer-events-none opacity-20 mix-blend-overlay"
                        style={{
                            backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.95) 0 1px, transparent 1px 12px)",
                            maskImage: "linear-gradient(to bottom, #000 0 55%, transparent 55% 100%)",
                            WebkitMaskImage: "linear-gradient(to bottom, #000 0 55%, transparent 55% 100%)",
                        }}
                    />

                    {/* LEFT: BRAND */}
                    <div className="relative z-50 flex-shrink-0 pt-0.5 hover:scale-105 transition-transform duration-300">
                        <ViewTransitionLink href="/" aria-label="Ana Sayfa">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* RIGHT: COMPACT CONTROLS */}
                    <div className="relative z-50 flex items-center gap-2">

                        {/* 1. SEARCH - OPTIMIZED (32px) */}
                        <button
                            id="desktop-search-trigger"
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Ara"
                            className="no-min-size flex items-center justify-center w-8 h-8 box-border bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000,0_0_0_1px_rgba(255,255,255,0.28)] cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all p-0"
                        >
                            <Search className="w-4 h-4 text-black stroke-[3px]" />
                        </button>

                        {/* 2. ZAP - OPTIMIZED (32px) */}
                        <button
                            id="desktop-zap-trigger"
                            onClick={() => setIsFactOpen(true)}
                            aria-label="Günün Hap Bilgisi"
                            className="no-min-size flex items-center justify-center w-8 h-8 box-border bg-[#FACC15] border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000,0_0_14px_rgba(250,204,21,0.18)] cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all mr-1 p-0"
                        >
                            <Zap className="w-4 h-4 text-black fill-black stroke-[3px]" />
                        </button>

                        {/* 3. MOBILE MENU (FULLSCREEN REBOOT) */}
                        <div className="md:hidden relative z-[100]">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </header >

            <div className="h-[53px] sm:h-[64px] md:hidden" />
            {isSearchOpen && <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
            {isFactOpen && <PhysicsFactModal open={isFactOpen} onOpenChange={setIsFactOpen} />}
        </>
    );
}
