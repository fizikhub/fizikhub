"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, Zap } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const clickVariant = {
    tap: { y: 4, x: 4, boxShadow: "0px 0px 0px 0px #000" },
    hover: { y: -2, x: -2, boxShadow: "6px 6px 0px 0px #000" }
};

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { href: "/", label: "Ana" },
        { href: "/makale", label: "Keşfet" },
        { href: "/siralamalar", label: "Lig" },
    ];

    return (
        <>
            {/* 
                V19: MOSKO SCIENCE CONSOLE
                - Vibe: Retro Lab / Edutainment
                - Base: Royal Blue (#3B82F6) -> Fixes "Gloomy Black"
                - Style: Thick Strokes, Mechanical Buttons, Grid Texture
            */}
            <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3 pointer-events-none">
                <motion.div
                    initial={{ y: -150 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={cn(
                        "pointer-events-auto",
                        "flex items-center justify-between pl-5 pr-4 py-3",
                        // MOSKO BLUE BASE
                        "bg-[#3B82F6] border-[3px] border-black",
                        "rounded-none sm:rounded-xl", // Squared vs rounded
                        // HARD SHADOW
                        "shadow-[6px_6px_0px_0px_#000]",
                        "w-full max-w-7xl relative overflow-hidden"
                    )}
                >
                    {/* Retro Grid Pattern Overlay (Science Vibe) */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                    />

                    {/* "Screws" in corners (Industrial Vibe) */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-black/30" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-black/30" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-black/30" />
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-black/30" />

                    {/* LEFT: MOSKO BRAND */}
                    <div className="relative z-10 flex-shrink-0">
                        <Link href="/">
                            <DankLogo />
                        </Link>
                    </div>

                    {/* RIGHT: MECHANICAL CONTROLS */}
                    <div className="relative z-10 flex items-center gap-3">

                        {/* Desktop Links - "File Folder" Tabs */}
                        <div className="hidden md:flex items-center gap-2 mr-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 font-black uppercase border-[2.5px] border-black transition-all transform shadow-[3px_3px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_#000] bg-white text-black",
                                        pathname === item.href
                                            ? "bg-[#FFC800]" // Active Yellow
                                            : "hover:bg-cyan-200"
                                    )}
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }} // Just rect for now, kept simple
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* 1. SEARCH: WHITE BLOCK */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            variants={clickVariant}
                            whileTap="tap"
                            whileHover="hover"
                            className="flex items-center justify-center w-12 h-12 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] text-black"
                        >
                            <Search className="w-6 h-6 stroke-[3px]" />
                        </motion.button>

                        {/* 2. ZAP: YELLOW BLOCK */}
                        <Link href="/ozel" className="md:hidden">
                            <motion.div
                                variants={clickVariant}
                                whileTap="tap"
                                whileHover="hover"
                                className="flex items-center justify-center w-12 h-12 bg-[#FFC800] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] text-black"
                            >
                                <Zap className="w-6 h-6 fill-black stroke-[3px]" />
                            </motion.div>
                        </Link>

                        {/* 3. MENU: BLACK BLOCK */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    variants={clickVariant}
                                    whileTap="tap"
                                    whileHover="hover"
                                    className="flex items-center justify-center w-12 h-12 bg-[#111] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] text-white"
                                >
                                    <Menu className="w-6 h-6 stroke-[3px]" />
                                </motion.button>
                            </SheetTrigger>

                            {/* DRAWER: BLUEPRINT STYLE */}
                            <SheetContent side="top" className="w-full h-auto min-h-[70vh] bg-[#3B82F6] border-b-[6px] border-black p-0 overflow-hidden">
                                {/* Grid BG */}
                                <div className="absolute inset-0 opacity-20"
                                    style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '32px 32px' }}
                                />

                                <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 gap-8">
                                    <div className="scale-125">
                                        <DankLogo />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
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
                                                    "group relative h-24 border-[3px] border-black shadow-[6px_6px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all",
                                                    link.bg
                                                )}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="font-black text-xl text-black tracking-wider uppercase drop-shadow-sm">
                                                        {link.label}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="w-full max-w-xs">
                                        <AuthButton />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </motion.div>
            </header>

            <div className="h-[20px] sm:h-[40px]" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
