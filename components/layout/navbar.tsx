"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Terminal, ChevronRight, Zap } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const physicsTicker = [
    "E = mc²", "F = ma", "ΔS ≥ 0", "iℏ∂ψ/∂t = Ĥψ", "G = 6.67×10⁻¹¹",
    "∇⋅E = ρ/ε₀", "pV = nRT", "λ = h/p", "S = k ln Ω", "c = 299,792,458 m/s",
    "ENTROPY INCREASING", "SYSTEM: ONLINE", "FIZIKHUB v3.0"
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => setMounted(true), []);

    const navItems = [
        { href: "/", label: "ANA KOMUTA" },
        { href: "/makale", label: "VERİ AKIŞI" },
        { href: "/siralamalar", label: "LİDER TABLOSU" },
    ];

    return (
        <>
            {/* 
                ULTIMATE SCIENCE NEO-BRUTALIST NAVBAR v3
                Dark Matter Theme with Blueprint Aesthetics
            */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 pointer-events-none font-mono">
                <div
                    className={cn(
                        "pointer-events-auto h-full",
                        "flex items-center justify-between px-4 sm:px-6",
                        "bg-[#09090b] text-white border-b-4 border-white", // Void Black + Stark White Border
                        "w-full relative overflow-hidden"
                    )}
                >
                    {/* === LAYERS: GRID & NOISE === */}
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    />

                    {/* === LED TICKER (Top Edge) === */}
                    <div className="absolute top-0 left-0 right-0 h-[14px] bg-black border-b border-white/20 overflow-hidden flex items-center z-10">
                        <motion.div
                            className="flex gap-12 whitespace-nowrap text-[9px] font-bold text-emerald-400 tracking-widest"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        >
                            {[...physicsTicker, ...physicsTicker, ...physicsTicker].map((eq, i) => (
                                <span key={i} className="inline-flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    {eq}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* === LEFT: BRAND IDENTITY === */}
                    <div className="relative z-20 flex flex-col justify-center pt-3 h-full">
                        <ViewTransitionLink href="/" className="group flex items-center gap-3">
                            <div className="bg-white text-black p-1 border-2 border-transparent group-hover:border-emerald-400 group-hover:bg-black group-hover:text-emerald-400 transition-colors duration-300">
                                <DankLogo className="w-8 h-8 sm:w-10 sm:h-10" />
                            </div>
                            <div className="hidden sm:flex flex-col leading-none">
                                <span className="text-xl font-black tracking-tighter group-hover:text-emerald-400 transition-colors">FIZIKHUB</span>
                                <span className="text-[9px] text-zinc-500 tracking-[0.3em] group-hover:text-emerald-500/70">QUANTUM_LAB</span>
                            </div>
                        </ViewTransitionLink>
                    </div>

                    {/* === CENTER: DECORATIVE HUD (Desktop Only) === */}
                    <div className="hidden lg:flex items-center gap-1 opacity-30 pt-3">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        <div className="h-[1px] w-12 bg-white" />
                        <span className="text-[10px] tracking-widest">SYS.READY</span>
                        <div className="h-[1px] w-12 bg-white" />
                        <div className="w-2 h-2 bg-white border border-white" />
                    </div>

                    {/* === RIGHT: CONTROL PANEL === */}
                    <div className="relative z-20 flex items-center gap-3 sm:gap-4 pt-3 h-full">

                        {/* DESKTOP NAV BUTTONS */}
                        <div className="hidden md:flex items-center gap-2 mr-2">
                            {navItems.map((item) => (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative px-4 py-2 text-xs font-bold border border-white/20 bg-black hover:bg-white hover:text-black transition-all duration-200 overflow-hidden group",
                                        pathname === item.href && "bg-white text-black border-white"
                                    )}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {pathname === item.href && <Terminal className="w-3 h-3" />}
                                        {item.label}
                                    </span>
                                </ViewTransitionLink>
                            ))}
                        </div>

                        {/* SEARCH MODULE */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsSearchOpen(true)}
                            className="relative w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-700 hover:border-emerald-400 hover:text-emerald-400 transition-colors group"
                        >
                            <Search className="w-5 h-5" />
                            {/* Decorative liquid corner or ticks */}
                            <div className="absolute top-0 right-0 w-1 h-1 bg-white opacity-0 group-hover:opacity-100" />
                            <div className="absolute bottom-0 left-0 w-1 h-1 bg-white opacity-0 group-hover:opacity-100" />
                        </motion.button>

                        {/* MOBILE/MEGA MENU TRIGGER */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative w-10 h-10 flex items-center justify-center bg-white text-black border border-white hover:bg-emerald-400 hover:border-emerald-400 transition-colors"
                                >
                                    <Menu className="w-6 h-6 stroke-[3px]" />
                                </motion.button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:w-[400px] bg-black border-l-4 border-white p-0 text-white font-mono flex flex-col">
                                <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>

                                {/* MEGA MENU HEADER */}
                                <div className="h-20 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50">
                                    <span className="text-xl font-black tracking-widest text-emerald-400">NAV.SYSTEM</span>
                                    <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white hover:text-black transition-colors border border-transparent hover:border-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* MENU LINKS GRID */}
                                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                                    {[
                                        { href: "/", label: "ANA KOMUTA", sub: "Main Dashboard" },
                                        { href: "/makale", label: "MAKALE AKIŞI", sub: "Data stream" },
                                        { href: "/blog", label: "BLOG & YAZILAR", sub: "Personal Logs" },
                                        { href: "/profil", label: "KİMLİK KARTI", sub: "User Identity" },
                                        { href: "/siralamalar", label: "LİDERLİK LİGİ", sub: "Rankings" },
                                    ].map((link, i) => (
                                        <ViewTransitionLink
                                            key={i}
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="group relative p-4 border border-zinc-700 hover:border-emerald-400 hover:bg-zinc-900 transition-all flex items-center justify-between"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black tracking-wider group-hover:text-emerald-400 transition-colors">{link.label}</span>
                                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400">{link.sub}</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />

                                            {/* Hover Corner Accent */}
                                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-emerald-400 transition-all" />
                                        </ViewTransitionLink>
                                    ))}

                                    <div className="mt-8 pt-8 border-t border-zinc-800">
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 block">AUTHENTICATION</span>
                                        <AuthButton />
                                    </div>
                                </div>

                                {/* DECORATIVE FOOTER */}
                                <div className="h-12 bg-emerald-500/10 border-t border-emerald-500/30 flex items-center justify-center">
                                    <span className="text-[10px] text-emerald-400 tracking-[0.5em] animate-pulse">SYSTEM OPTIMAL</span>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* === DECORATIVE BOTTOM RULER (The "Science" Part) === */}
                <div className="absolute bottom-[-1px] left-0 right-0 h-2 z-40 pointer-events-none flex justify-between px-2">
                    {[...Array(40)].map((_, i) => (
                        <div key={i} className="w-[1px] bg-white/40 h-full" />
                    ))}
                </div>
            </header>

            {/* SPACER FOR FIXED HEADER */}
            <div className="h-16 sm:h-20" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
