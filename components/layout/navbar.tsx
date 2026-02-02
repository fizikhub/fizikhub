"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Zap } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";
import { MobileMenu } from "@/components/layout/mobile-menu";

// RETRO-FUTURE HUD: Data Block Animations
const hudVariant: Variants = {
    tap: { scale: 0.95 },
    hover: {
        backgroundColor: "#FFC800",
        color: "#000000",
        textShadow: "0px 0px 8px rgba(255, 200, 0, 0.8)",
        transition: { duration: 0.1 }
    }
};

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { href: "/", label: "ANA_MODÜL" },
        { href: "/makale", label: "VERİ_AKISI" },
        { href: "/siralamalar", label: "LİDER_TABLOSU" },
    ];

    // Square, precise, machine-like button style
    const buttonClass = cn(
        "flex items-center justify-center w-[36px] h-[36px] sm:w-10 sm:h-10",
        "bg-white border-[2px] border-black", // Sharp edges, no rounded
        "text-black transition-all font-mono", // Monospace for HUD feel
        "hover:shadow-[0px_0px_10px_rgba(255,255,255,0.5)]" // Glow effect
    );

    return (
        <>
            {/* 
                V34: RETRO-FUTURE HUD NAVBAR
                - Concept: Sci-Fi, Data-Driven, Cyber
                - Background: Digital Grid + Scanline
                - Interactive: Monospace Data Blocks
            */}
            <header className="fixed top-0 left-0 right-0 z-40 h-14 sm:h-16 pointer-events-none">
                <div
                    className={cn(
                        "pointer-events-auto h-full",
                        "flex items-center justify-between px-4 sm:px-6",
                        "bg-[#0a0a0a] border-b-[2px] border-[#333]", // Darker tech background
                        "w-full relative overflow-hidden"
                    )}
                >
                    {/* HUD BACKGROUND: DIGITAL GRID & SCANLINE */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                        {/* Static Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#444_1px,transparent_1px),linear-gradient(to_bottom,#444_1px,transparent_1px)] bg-[size:24px_24px]" />

                        {/* Moving Scanline */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFC800] to-transparent opacity-10"
                            animate={{ top: ["-100%", "200%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            style={{ height: "50%", width: "100%" }}
                        />
                    </div>

                    {/* LEFT: BRAND */}
                    <div className="relative z-10 flex-shrink-0">
                        <ViewTransitionLink href="/">
                            {/* In HUD mode, logo might need a tech filter or stick to brutalist */}
                            <div className="filter contrast-125 brightness-110 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                                <DankLogo />
                            </div>
                        </ViewTransitionLink>
                    </div>

                    {/* RIGHT: HUD CONTROLS */}
                    <div className="relative z-10 flex items-center gap-3">

                        {/* Desktop Links - Data Blocks */}
                        <div className="hidden md:flex items-center gap-1 mr-4">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <ViewTransitionLink
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "relative px-4 py-2 text-[10px] font-mono font-bold tracking-widest uppercase border-[1px] border-transparent transition-all",
                                            "text-white hover:text-[#FFC800] hover:border-[#FFC800] hover:bg-black/50",
                                            isActive && "text-[#FFC800] border-[#FFC800] bg-black/50 shadow-[0_0_10px_rgba(255,200,0,0.3)]"
                                        )}
                                    >
                                        {/* Brackets appearing on hover/active could be CSS based or part of text */}
                                        <span className={isActive ? "block" : ""}>
                                            {isActive ? `[ ${item.label} ]` : item.label}
                                        </span>
                                    </ViewTransitionLink>
                                )
                            })}
                        </div>

                        {/* 1. SEARCH - DATA BLOCK */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            variants={hudVariant}
                            whileTap="tap"
                            whileHover="hover"
                            className={cn(buttonClass, "border-white bg-black text-white hover:border-[#FFC800]")}
                        >
                            <Search className="w-5 h-5 stroke-[2px]" />
                        </motion.button>

                        {/* 2. ZAP - DATA BLOCK */}
                        <motion.button
                            onClick={() => window.location.href = '/ozel'}
                            variants={hudVariant}
                            whileTap="tap"
                            whileHover="hover"
                            className={cn(buttonClass, "md:hidden bg-[#FFC800] text-black border-[#FFC800]")}
                        >
                            <Zap className="w-5 h-5 fill-black stroke-[2px]" />
                        </motion.button>

                        {/* 3. MOBILE MENU */}
                        <div className="md:hidden">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </header >

            {/* Spacer */}
            <div className="h-[56px] sm:h-[64px]" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
