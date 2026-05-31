"use client";

import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect, useRef } from "react";
import { Search, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
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
    const [isHidden, setIsHidden] = useState(false);
    const pathname = usePathname();
    const isArticleDetail = /^\/makale\/[^/]+/.test(pathname || "");
    const lastScrollYRef = useRef(0);
    const frameRef = useRef<number | null>(null);

    const [raindrops, setRaindrops] = useState<{ left: number; duration: number; delay: number; formula: string; scale: number; opacity?: number }[]>([]);

    useEffect(() => {
        const generateRain = () => {
            const isMobile = window.innerWidth < 768;
            const laneCount = isMobile ? 4 : 12;
            const dropCount = isMobile ? 6 : 30;

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
                    opacity: 0.5 + Math.random() * 0.4
                };
            });
            setRaindrops(drops);
        };

        // Defer rain generation to avoid blocking initial hydration
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(generateRain, { timeout: 2000 });
        } else {
            setTimeout(generateRain, 500);
        }
    }, []);

    useEffect(() => {
        if (!isArticleDetail) {
            return;
        }

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) return;

        const onScroll = () => {
            if (frameRef.current !== null) return;

            frameRef.current = window.requestAnimationFrame(() => {
                frameRef.current = null;
                const latest = window.scrollY;
                const diff = latest - lastScrollYRef.current;
                lastScrollYRef.current = latest;

                if (latest < 80) {
                    setIsHidden(false);
                    return;
                }

                if (diff > 6) setIsHidden(true);
                if (diff < -6) setIsHidden(false);
            });
        };

        lastScrollYRef.current = window.scrollY;
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
        };
    }, [isArticleDetail]);

    const navItems = [
        { href: "/", label: "Ana" },
        { href: "/makale", label: "Keşfet" },
        { href: "/simulasyonlar", label: "Simülasyonlar" },
        { href: "/siralamalar", label: "Lig" },
    ];

    return (
        <>
            {/* 
                V31: PREMIUM GLASS HUD (DARK MODE RESTORED)
                - Height: h-14 (56px) - Optimized for Mobile
                - Style: Dark Glass Neo-Brutalist
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 h-[60px] md:hidden transform-gpu transition-[transform,opacity,filter] duration-300 mobile-bottom-nav-transition",
                    isArticleDetail && isHidden && "-translate-y-[calc(100%+0.5rem)] opacity-0 blur-[2px]"
                )}
                role="banner"
            >
                <div
                    className={cn(
                        "h-full",
                        "flex items-center justify-between px-3 min-[390px]:px-4 sm:px-6",
                        isArticleDetail ? "bg-[#09090b]/68 backdrop-blur-md border-b border-white/[0.07] shadow-md" : "bg-[#09090b]/80 backdrop-blur-xl border-b border-white/10 shadow-lg",
                        "w-full relative"
                    )}
                >
                    {/* PHYSICS RAIN BACKGROUND (FLOWING UP) - REDUCED OPACITY & CLIPPED */}
                    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none rounded-b-xl", isArticleDetail ? "opacity-18" : "opacity-30")}>
                        {raindrops.map((drop, i) => (
                            <div
                                key={i}
                                className="absolute font-mono font-bold whitespace-nowrap will-change-transform"
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

                    {/* RULER TICKS - CSS ONLY (0 DOM Elements) */}
                    <div 
                        className="absolute bottom-0 left-0 right-0 h-1.5 pointer-events-none opacity-20 mix-blend-overlay"
                        style={{
                            background: `
                                repeating-linear-gradient(to right, white 0px, white 1px, transparent 1px, transparent 1.666%) bottom / 100% 50% no-repeat,
                                repeating-linear-gradient(to right, white 0px, white 1px, transparent 1px, transparent 16.666%) bottom / 100% 100% no-repeat
                            `
                        }}
                    />

                    {/* LEFT: BRAND */}
                    <div className="relative z-50 flex-shrink-0 pt-0.5 hover:scale-105 transition-transform duration-300">
                        <ViewTransitionLink href="/" aria-label="Ana Sayfa">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* RIGHT: COMPACT CONTROLS */}
                    <div className="relative z-50 flex items-center gap-2 min-[390px]:gap-2.5">

                        {/* Desktop Links (Will be hidden anyway since parent is md:hidden, but kept for structural purity) */}
                        <nav className="hidden md:flex items-center gap-2 mr-6" aria-label="Ana navigasyon">
                            {navItems.map((item) => (
                                <ViewTransitionLink
                                    key={item.href}
                                    id={`desktop-nav-${item.href === '/' ? 'home' : item.href.replace('/', '')}`}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-1.5 text-xs font-black uppercase border border-white/10 transition-all bg-white/5 text-zinc-300 hover:bg-white hover:text-black rounded-lg",
                                        "hover:shadow-[0px_0px_15px_rgba(255,255,255,0.2)]",
                                        pathname === item.href && "bg-white text-black shadow-[0px_0px_10px_rgba(255,255,255,0.3)]"
                                    )}
                                >
                                    {item.label}
                                </ViewTransitionLink>
                            ))}
                        </nav>

                        {/* 1. SEARCH - OPTIMIZED (32px) */}
                        <button
                            id="desktop-search-trigger"
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Ara"
                            className="flex items-center justify-center w-11 h-11 box-border bg-white border-2 border-black rounded-[8px] shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]"
                        >
                            <Search className="w-5 h-5 text-black stroke-[3px]" />
                        </button>

                        {/* 2. ZAP - OPTIMIZED (32px) */}
                        <button
                            id="desktop-zap-trigger"
                            onClick={() => setIsFactOpen(true)}
                            aria-label="Günün Hap Bilgisi"
                            className="flex items-center justify-center w-11 h-11 box-border bg-[#EAB308] border-2 border-black rounded-[8px] shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <Zap className="w-5 h-5 text-black fill-black stroke-[3px]" />
                        </button>

                        {/* 3. MOBILE MENU (FULLSCREEN REBOOT) */}
                        <div className="md:hidden relative z-[100]">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </header >

            <div className="h-[60px] md:hidden" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <PhysicsFactModal open={isFactOpen} onOpenChange={setIsFactOpen} />
        </>
    );
}
