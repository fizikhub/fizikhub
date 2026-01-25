"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, Zap, Star } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const popVariants = {
    tap: { scale: 0.9, y: 2, boxShadow: "0px 0px 0px 0px #000" },
    hover: { scale: 1.05, y: -2 }
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
                V18: RETRO POP "STICKER" NAVBAR
                - Vibe: 90s Asset Store / "Mosko Mappa"
                - Base: Cream (#FEFCE8) to act as a "window" on the dark page
                - Colors: Blue, Pink, Orange accents
                - Borders: SUPER THICK (3px)
            */}
            <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3 pointer-events-none">
                <motion.div
                    initial={{ y: -120, rotate: -2 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 12 }}
                    className={cn(
                        "pointer-events-auto",
                        "flex items-center justify-between pl-4 pr-3 py-2.5",
                        // THE CREAM WINDOW BASE
                        "bg-[#FEFCE8] border-[3px] border-black",
                        "rounded-2xl",
                        // DEEP HARD SHADOW
                        "shadow-[5px_5px_0px_0px_#000]",
                        "w-full max-w-7xl relative overflow-visible"
                    )}
                >
                    {/* Decorative "Window Controls" (Like in the Mac/Win95 image) */}
                    <div className="absolute -top-3 left-6 flex gap-1.5 z-20">
                        <div className="w-3 h-3 rounded-full bg-[#FF6B6B] border border-black" />
                        <div className="w-3 h-3 rounded-full bg-[#FFD93D] border border-black" />
                        <div className="w-3 h-3 rounded-full bg-[#6BCB77] border border-black" />
                    </div>

                    {/* LEFT: RETRO BRAND */}
                    <div className="relative z-10 flex-shrink-0 pt-1">
                        <Link href="/">
                            <DankLogo />
                        </Link>
                    </div>

                    {/* RIGHT: CHUNKY CONTROLS */}
                    <div className="relative z-10 flex items-center gap-2.5">

                        {/* Desktop Links - styled like tags */}
                        <div className="hidden md:flex items-center gap-2 mr-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 font-black uppercase rounded-lg border-2 border-black transition-all transform shadow-[2px_2px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]",
                                        pathname === item.href
                                            ? "bg-[#FFC800] text-black"
                                            : "bg-white text-black hover:bg-[#A5F3FC]"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* 1. SEARCH: RETRO BLUE */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            variants={popVariants}
                            whileTap="tap"
                            whileHover="hover"
                            className="flex items-center justify-center w-11 h-11 bg-[#60A5FA] border-[3px] border-black rounded-xl shadow-[3px_3px_0px_0px_#000] text-white overflow-hidden relative group"
                        >
                            <Search className="w-6 h-6 stroke-[3px] relative z-10" />
                            {/* Halftone pattern overlay */}
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:4px_4px]" />
                        </motion.button>

                        {/* 2. ZAP: ORANGE */}
                        <Link href="/ozel" className="md:hidden">
                            <motion.div
                                variants={popVariants}
                                whileTap="tap"
                                whileHover="hover"
                                className="flex items-center justify-center w-11 h-11 bg-[#FB923C] border-[3px] border-black rounded-xl shadow-[3px_3px_0px_0px_#000] text-white relative overflow-hidden"
                            >
                                <Zap className="w-6 h-6 fill-white stroke-[3px] relative z-10" />
                                <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-300 rounded-bl-full border-l-2 border-b-2 border-black" />
                            </motion.div>
                        </Link>

                        {/* 3. MENU: HOT PINK */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    variants={popVariants}
                                    whileTap="tap"
                                    whileHover="hover"
                                    className="flex items-center justify-center w-11 h-11 bg-[#F472B6] border-[3px] border-black rounded-xl shadow-[3px_3px_0px_0px_#000] text-white relative"
                                >
                                    <Menu className="w-6 h-6 stroke-[3px]" />
                                </motion.button>
                            </SheetTrigger>

                            {/* DRAWER: PAPER STYLE */}
                            <SheetContent side="top" className="w-full h-auto min-h-[70vh] bg-[#FEFCE8] border-b-[6px] border-black rounded-b-[48px] p-0 overflow-hidden">
                                {/* Grid Pattern BG */}
                                <div className="absolute inset-0 opacity-10"
                                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                                />

                                <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 gap-8">
                                    <div className="scale-125">
                                        <DankLogo />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                        {[
                                            { href: "/", label: "ANA SAYFA", bg: "bg-[#60A5FA]" }, // Blue
                                            { href: "/makale", label: "KEŞFET", bg: "bg-[#4ADE80]" }, // Green
                                            { href: "/blog", label: "BLOG", bg: "bg-[#A78BFA]" }, // Purple
                                            { href: "/profil", label: "PROFİL", bg: "bg-[#FB923C]" }, // Orange
                                        ].map((link, i) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={cn(
                                                    "group relative h-24 border-[3px] border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all",
                                                    link.bg
                                                )}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="font-black text-xl text-white tracking-wider uppercase stroke-black drop-shadow-md pb-1 border-b-2 border-white/40">
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
