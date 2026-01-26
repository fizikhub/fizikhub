"use client";

import Link from "next/link";
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
    "∇⋅E = ρ/ε₀", "pV = nRT", "λ = h/p", "S = k ln Ω", "c = 299,792,458 m/s"
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => setMounted(true), []);

    const navItems = [
        { href: "/", label: "Ana" },
        { href: "/makale", label: "Keşfet" },
        { href: "/siralamalar", label: "Lig" },
    ];

    return (
        <>
            {/* 
                V24: CHALKBOARD NAVBAR (MOBILE FOCUSED)
                - Blackboard texture
                - Chalk formulas
            */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 pointer-events-none">
                <div
                    className={cn(
                        "pointer-events-auto h-full",
                        "flex items-center justify-between px-3 sm:px-4",
                        // Background: Dark Gray/Blackboard + Border
                        "bg-[#252525] border-b-[3px] border-[#e0e0e0]/50",
                        "shadow-[0px_4px_10px_0px_rgba(0,0,0,0.5)]",
                        "w-full relative overflow-hidden"
                    )}
                >
                    {/* CHALKBOARD TEXTURE */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    {/* PHYSICS TICKER BACKGROUND (CHALK STYLE) */}
                    <div className="absolute inset-0 flex items-center opacity-40 overflow-hidden pointer-events-none select-none">
                        <motion.div
                            className="flex gap-12 whitespace-nowrap text-lg sm:text-xl font-handwriting font-bold text-white/80 blur-[0.5px]"
                            style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }} // Fallback to "Chalkboard SE" on Mac
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        >
                            {[...physicsTicker, ...physicsTicker, ...physicsTicker, ...physicsTicker].map((eq, i) => (
                                <span key={i} className="inline-block" style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}>
                                    {eq}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* DUST/NOISE OVERLAY */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />


                    {/* LEFT: BRAND */}
                    <div className="relative z-10 flex-shrink-0 pt-0.5">
                        <Link href="/">
                            <DankLogo />
                        </Link>
                    </div>

                    {/* RIGHT: COMPACT CONTROLS */}
                    <div className="relative z-10 flex items-center gap-2">

                        {/* Desktop Links */}
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
                            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-black"
                        >
                            <Search className="w-4 h-4 stroke-[2.5px]" />
                        </motion.button>

                        {/* 2. ZAP */}
                        <Link href="/ozel" className="md:hidden">
                            <motion.div
                                variants={clickVariant}
                                whileTap="tap"
                                whileHover="hover"
                                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#FFC800] border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-black"
                            >
                                <Zap className="w-4 h-4 fill-black stroke-[2.5px]" />
                            </motion.div>
                        </Link>

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
