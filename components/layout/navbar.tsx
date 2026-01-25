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
    hover: { y: -2, x: -2, boxShadow: "4px 4px 0px 0px #000" }
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
                V20: FULL WIDTH MOSKO SCIENCE
                - Edge to Edge (No gaps)
                - Slimmer Mobile Profile
                - "Rocket" Animation
            */}
            <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={cn(
                        "pointer-events-auto",
                        "flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3", // Slimmer Padding
                        "bg-[#3B82F6] border-b-[3px] border-black", // Only bottom border needed for full width
                        "shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]", // Hard straight shadow
                        "w-full relative overflow-hidden"
                    )}
                >
                    {/* ROCKET PATROL ANIMATION */}
                    <motion.div
                        className="absolute top-1 -left-8 text-white z-0"
                        animate={{ x: ["0vw", "100vw"] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <Rocket className="w-5 h-5 rotate-90 fill-white stroke-black stroke-[1px]" />
                        <div className="absolute top-1.5 -left-4 w-4 h-1 bg-white/50 blur-[2px]" /> {/* Trail */}
                    </motion.div>

                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none z-0"
                        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />

                    {/* LEFT: BRAND */}
                    <div className="relative z-10 flex-shrink-0 pt-1">
                        <Link href="/">
                            <DankLogo />
                        </Link>
                    </div>

                    {/* RIGHT: COMPACT CONTROLS */}
                    <div className="relative z-10 flex items-center gap-2 sm:gap-3">

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-2 mr-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-3 py-1.5 text-sm font-black uppercase border-[2px] border-black transition-all transform shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] bg-white text-black",
                                        pathname === item.href
                                            ? "bg-[#FFC800]"
                                            : "hover:bg-cyan-200"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* 1. SEARCH: Compact Block */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            variants={clickVariant}
                            whileTap="tap"
                            whileHover="hover"
                            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white border-[2.5px] border-black shadow-[3px_3px_0px_0px_#000] text-black"
                        >
                            <Search className="w-5 h-5 stroke-[3px]" />
                        </motion.button>

                        {/* 2. ZAP: Yellow Compact */}
                        <Link href="/ozel" className="md:hidden">
                            <motion.div
                                variants={clickVariant}
                                whileTap="tap"
                                whileHover="hover"
                                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-[#FFC800] border-[2.5px] border-black shadow-[3px_3px_0px_0px_#000] text-black"
                            >
                                <Zap className="w-5 h-5 fill-black stroke-[3px]" />
                            </motion.div>
                        </Link>

                        {/* 3. MENU: Black Compact */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    variants={clickVariant}
                                    whileTap="tap"
                                    whileHover="hover"
                                    className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-[#111] border-[2.5px] border-black shadow-[3px_3px_0px_0px_#000] text-white"
                                >
                                    <Menu className="w-5 h-5 stroke-[3px]" />
                                </motion.button>
                            </SheetTrigger>
                            <SheetContent side="top" className="w-full h-auto min-h-[60vh] bg-[#3B82F6] border-b-[6px] border-black p-0 overflow-hidden">
                                <div className="absolute inset-0 opacity-20"
                                    style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '32px 32px' }}
                                />

                                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 pt-16 gap-6">
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
                                                    "group relative h-20 border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all",
                                                    link.bg
                                                )}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="font-black text-lg text-black tracking-wider uppercase drop-shadow-sm">
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
                </motion.div>
            </header>

            <div className="h-[60px]" /> {/* Spacer for fixed header */}
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
