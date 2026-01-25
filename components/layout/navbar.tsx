"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, Zap, Rocket, Flame } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const clickVariant = {
    tap: { y: 2, x: 2, boxShadow: "0px 0px 0px 0px #000" },
    hover: { y: -2, x: -2, boxShadow: "3px 3px 0px 0px #000" }
};

const physicsTicker = [
    "E = mc²", "F = ma", "ΔS ≥ 0", "iℏ∂ψ/∂t = Ĥψ", "G = 6.67×10⁻¹¹",
    "∇⋅E = ρ/ε₀", "pV = nRT", "λ = h/p", "S = k ln Ω", "c = 299,792,458 m/s"
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const navItems = [
        { href: "/", label: "Ana" },
        { href: "/makale", label: "Keşfet" },
        { href: "/siralamalar", label: "Lig" },
    ];

    return (
        <>
            {/* 
                V21: SCIENCE CONSOLE (SLIM + PHYSICS TICKER)
                - Fixed Height (h-14)
                - Animated Physics Equations Background
                - Rocket with Thrust
                - Ruler Ticks
            */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 pointer-events-none">
                <div
                    className={cn(
                        "pointer-events-auto h-full",
                        "flex items-center justify-between px-3 sm:px-4",
                        "bg-[#3B82F6] border-b-[3px] border-black",
                        "shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]",
                        "w-full relative overflow-hidden"
                    )}
                >
                    {/* PHYSICS TICKER BACKGROUND */}
                    <div className="absolute inset-0 flex items-center opacity-20 overflow-hidden pointer-events-none select-none">
                        <motion.div
                            className="flex gap-8 whitespace-nowrap text-xs sm:text-sm font-mono font-bold text-black"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        >
                            {[...physicsTicker, ...physicsTicker, ...physicsTicker].map((eq, i) => (
                                <span key={i} className="inline-block">{eq}</span>
                            ))}
                        </motion.div>
                    </div>

                    {/* ROCKET PATROL WITH FIRE */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -left-10 z-0"
                        animate={{ x: ["-10vw", "110vw"] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 1 }}
                    >
                        <div className="relative">
                            <Rocket className="w-5 h-5 sm:w-6 sm:h-6 rotate-90 fill-white stroke-black stroke-[1.5px] relative z-10" />
                            {/* Fire Trail */}
                            <motion.div
                                className="absolute top-1.5 -left-3 w-4 h-2 bg-orange-500 rounded-full blur-[2px]"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 0.1, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute top-2 -left-5 w-3 h-1 bg-yellow-400 rounded-full blur-[1px]"
                                animate={{ scale: [1, 1.2, 1], x: [-1, -3, -1] }}
                                transition={{ duration: 0.15, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>

                    {/* RULER TICKS (Bottom Edge) */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 flex justify-between px-1 pointer-events-none opacity-40">
                        {[...Array(40)].map((_, i) => (
                            <div key={i} className="w-[1px] bg-black h-full" style={{ height: i % 5 === 0 ? '100%' : '50%' }} />
                        ))}
                    </div>

                    {/* LEFT: COMPACT BRAND */}
                    <div className="relative z-10 flex-shrink-0">
                        <Link href="/">
                            <DankLogo />
                        </Link>
                    </div>

                    {/* RIGHT: COMPACT CONTROLS */}
                    <div className="relative z-10 flex items-center gap-2">

                        {/* Desktop Links - Minimal Tabs */}
                        <div className="hidden md:flex items-center gap-1 mr-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-3 py-1 text-xs font-black uppercase border-[2px] border-black transition-all bg-white text-black hover:bg-[#FFC800]",
                                        pathname === item.href && "bg-[#FFC800]"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* 1. SEARCH */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            variants={clickVariant}
                            whileTap="tap"
                            whileHover="hover"
                            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-black"
                        >
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                        </motion.button>

                        {/* 2. ZAP (Mobile) */}
                        <Link href="/ozel" className="md:hidden">
                            <motion.div
                                variants={clickVariant}
                                whileTap="tap"
                                whileHover="hover"
                                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#FFC800] border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-black"
                            >
                                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-black stroke-[2.5px]" />
                            </motion.div>
                        </Link>

                        {/* 3. MENU */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    variants={clickVariant}
                                    whileTap="tap"
                                    whileHover="hover"
                                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#111] border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-white"
                                >
                                    <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                                </motion.button>
                            </SheetTrigger>
                            <SheetContent side="top" className="w-full min-h-[50vh] bg-[#3B82F6] border-b-[4px] border-black p-0 overflow-hidden">
                                <div className="absolute inset-0 opacity-20"
                                    style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '32px 32px' }}
                                />

                                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 pt-12 gap-6">
                                    <DankLogo />
                                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                                        {[
                                            { href: "/", label: "ANA SAYFA", bg: "bg-white" },
                                            { href: "/makale", label: "KEŞFET", bg: "bg-[#FFC800]" },
                                            { href: "/blog", label: "BLOG", bg: "bg-cyan-300" },
                                            { href: "/profil", label: "PROFİL", bg: "bg-[#F472B6]" },
                                        ].map((link, i) => (
                                            <Link
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
                                            </Link>
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
            </header>

            <div className="h-[56px] sm:h-[64px]" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
