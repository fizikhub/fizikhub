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
                V27: COSMIC SPACE THEME
                - Deep Space Background (Black/Purple/Blue Gradient)
                - Twinkling Stars
                - Constellation Formulas
            */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 pointer-events-none">
                <div
                    className={cn(
                        "pointer-events-auto h-full",
                        "flex items-center justify-between px-3 sm:px-4",
                        // Background: Deep Space
                        "bg-[#020617] border-b-[3px] border-indigo-500/30",
                        "shadow-[0px_4px_20px_0px_rgba(79,70,229,0.3)]",
                        "w-full relative overflow-hidden"
                    )}
                >
                    {/* SPACE BACKGROUND LAYERS */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#020617] to-[#020617] pointer-events-none" />

                    {/* STARS (CSS Generated) */}
                    <div className="absolute inset-0 opacity-80 pointer-events-none mix-blend-screen"
                        style={{
                            backgroundImage: `
                                radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
                                radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
                                radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px)
                            `,
                            backgroundSize: '550px 550px, 350px 350px, 250px 250px',
                            backgroundPosition: '0 0, 40px 60px, 130px 270px'
                        }}
                    />

                    {/* NEBULA CLOUDS */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none animate-pulse" />

                    {/* PHYSICS TICKER BACKGROUND (CONSTELLATION STYLE) */}
                    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none">
                        <motion.div
                            className="flex gap-24 whitespace-nowrap text-lg sm:text-2xl font-serif italic text-indigo-100/60"
                            style={{
                                textShadow: '0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(99, 102, 241, 0.5)' // Star glow
                            }}
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                        >
                            {[...physicsTicker, ...physicsTicker, ...physicsTicker, ...physicsTicker].map((eq, i) => (
                                <span key={i} className="inline-block relative">
                                    {/* Connection Line (Constellation Link) */}
                                    <span className="absolute top-1/2 -left-12 w-12 h-[1px] bg-indigo-500/30 -translate-y-1/2" />
                                    {eq}
                                    {/* Star Dots on corners */}
                                    <span className="absolute -top-1 -right-1 w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white]" />
                                    <span className="absolute -bottom-1 -left-1 w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white]" />
                                </span>
                            ))}
                        </motion.div>
                    </div>




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
