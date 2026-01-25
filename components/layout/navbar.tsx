"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, Zap, Rocket } from "lucide-react";
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
                V22: ULTRA SLIM SCIENCE CONSOLE
                - Height: h-12 (48px) - Requested "Thinner"
                - Rocket: Sine Wave Trajectory (Curved Path) + Dynamic Rotation
                - Fire: Enhanced visual
            */}
            <header className="fixed top-0 left-0 right-0 z-50 h-12 sm:h-14 pointer-events-none">
                <div
                    className={cn(
                        "pointer-events-auto h-full",
                        "flex items-center justify-between px-3 sm:px-4",
                        "bg-[#3B82F6] border-b-[3px] border-black",
                        "shadow-[0px_3px_0px_0px_rgba(0,0,0,1)]",
                        "w-full relative overflow-hidden"
                    )}
                >
                    {/* PHYSICS TICKER BACKGROUND */}
                    <div className="absolute inset-0 flex items-center opacity-15 overflow-hidden pointer-events-none select-none">
                        <motion.div
                            className="flex gap-8 whitespace-nowrap text-[10px] sm:text-xs font-mono font-bold text-black"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        >
                            {[...physicsTicker, ...physicsTicker, ...physicsTicker, ...physicsTicker].map((eq, i) => (
                                <span key={i} className="inline-block">{eq}</span>
                            ))}
                        </motion.div>
                    </div>

                    {/* SINE WAVE ROCKET */}
                    <motion.div
                        className="absolute left-0 top-1/2 z-0 pointer-events-none"
                        initial={{ x: "-10vw" }}
                        animate={{
                            x: "110vw",
                            y: [0, -12, 0, 12, 0, -12, 0], // Sine Wave
                        }}
                        transition={{
                            x: { duration: 12, repeat: Infinity, ease: "linear" },
                            y: { duration: 12, repeat: Infinity, ease: "linear" } // Synced with X
                        }}
                    >
                        <motion.div
                            animate={{ rotate: [0, -15, 0, 15, 0, -15, 0] }} // Rotate with slope
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="relative">
                                {/* The Rocket */}
                                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 rotate-90 fill-white stroke-black stroke-[1.5px] relative z-10" />

                                {/* MEGA FIRE THRUST (Pulsating) */}
                                <motion.div
                                    className="absolute top-1.5 -left-4 w-6 h-2 bg-[#FF4500] rounded-l-full blur-[2px]"
                                    animate={{ scaleX: [1, 1.5, 0.8, 1.2], opacity: [0.8, 1, 0.7] }}
                                    transition={{ duration: 0.2, repeat: Infinity }}
                                />
                                <motion.div
                                    className="absolute top-2 -left-3 w-4 h-1.5 bg-[#FFD700] rounded-l-full blur-[1px]"
                                    animate={{ scaleX: [1, 1.3, 0.9], x: [0, -2, 0] }}
                                    transition={{ duration: 0.15, repeat: Infinity }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* RULER TICKS (Condensed for slim bar) */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 flex justify-between px-1 pointer-events-none opacity-30">
                        {[...Array(60)].map((_, i) => (
                            <div key={i} className="w-[1px] bg-black h-full" style={{ height: i % 10 === 0 ? '100%' : '50%' }} />
                        ))}
                    </div>

                    {/* LEFT: BRAND (Scaled Down) */}
                    <div className="relative z-10 flex-shrink-0">
                        <Link href="/">
                            <DankLogo />
                        </Link>
                    </div>

                    {/* RIGHT: COMPACT CONTROLS */}
                    <div className="relative z-10 flex items-center gap-1.5">

                        {/* Desktop Links - Tiny Tabs */}
                        <div className="hidden md:flex items-center gap-1 mr-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-2.5 py-0.5 text-[10px] sm:text-xs font-black uppercase border-[2px] border-black transition-all bg-white text-black hover:bg-[#FFC800]",
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
                            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-black"
                        >
                            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5px]" />
                        </motion.button>

                        {/* 2. ZAP */}
                        <Link href="/ozel" className="md:hidden">
                            <motion.div
                                variants={clickVariant}
                                whileTap="tap"
                                whileHover="hover"
                                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-[#FFC800] border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-black"
                            >
                                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black stroke-[2.5px]" />
                            </motion.div>
                        </Link>

                        {/* 3. MENU */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    variants={clickVariant}
                                    whileTap="tap"
                                    whileHover="hover"
                                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-[#111] border-[2px] border-black shadow-[2px_2px_0px_0px_#000] text-white"
                                >
                                    <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5px]" />
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

            <div className="h-[48px] sm:h-[56px]" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
