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

const jellyVariants = {
    tap: { scale: 0.85, rotate: -5 },
    hover: { scale: 1.05, rotate: 2 }
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
                V17: THE "WORLD'S BEST" NEO-NAVBAR
                - Multi-Color: Cyan, Yellow, Pink
                - Physics: Jelly/Rubberband
                - Style: Maximum Personality
            */}
            <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none">
                <motion.div
                    initial={{ y: -150, borderRadius: "50%" }}
                    animate={{ y: 0, borderRadius: "16px" }}
                    transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.2 }}
                    className={cn(
                        "pointer-events-auto",
                        "flex items-center justify-between pl-4 pr-3 py-2.5",
                        "bg-[#111]/95 backdrop-blur-xl border-[3px] border-black",
                        // SHADOW: Rainbow Gradient Shadow via pseudo-element simulation or just solid distinct color
                        "shadow-[4px_4px_0px_0px_#000]",
                        "w-full max-w-7xl relative overflow-hidden"
                    )}
                >
                    {/* RAINBOW BORDER BOTTOM */}
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 z-20" />

                    {/* LEFT: V17 BRAND */}
                    <Link href="/" className="group relative z-30">
                        <DankLogo />
                        {/* Sparkles on hover */}
                        <div className="absolute -top-2 -right-2 text-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity">✨</div>
                    </Link>

                    {/* RIGHT: MULTI-COLOR ACTIONS */}
                    <div className="flex items-center gap-3 relative z-30">

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-1 mr-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 font-bold uppercase rounded-lg border-2 border-transparent hover:border-black hover:bg-white hover:text-black transition-all",
                                        pathname === item.href ? "text-[#FFC800]" : "text-gray-400"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* 1. SEARCH: CYAN */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            variants={jellyVariants}
                            whileTap="tap"
                            whileHover="hover"
                            className="flex items-center justify-center w-11 h-11 bg-[#22D3EE] border-[2px] border-black rounded-xl shadow-[2px_2px_0px_0px_#000] text-black"
                        >
                            <Search className="w-6 h-6 stroke-[3px]" />
                        </motion.button>

                        {/* 2. ZAP: YELLOW */}
                        <Link href="/ozel" className="md:hidden">
                            <motion.div
                                variants={jellyVariants}
                                whileTap="tap"
                                whileHover="hover"
                                className="flex items-center justify-center w-11 h-11 bg-[#FFC800] border-[2px] border-black rounded-xl shadow-[2px_2px_0px_0px_#000] text-black"
                            >
                                <Zap className="w-6 h-6 fill-black stroke-[3px]" />
                            </motion.div>
                        </Link>

                        {/* 3. MENU: PINK */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    variants={jellyVariants}
                                    whileTap="tap"
                                    whileHover="hover"
                                    className="flex items-center justify-center w-11 h-11 bg-[#F472B6] border-[2px] border-black rounded-xl shadow-[2px_2px_0px_0px_#000] text-black"
                                >
                                    <Menu className="w-6 h-6 stroke-[3px]" />
                                </motion.button>
                            </SheetTrigger>

                            {/* MENU DRAWER */}
                            <SheetContent side="top" className="w-full h-auto min-h-[70vh] bg-[#0a0a0a] border-b-[6px] border-pink-500 rounded-b-[48px] p-0 text-white overflow-hidden">
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                </div>

                                <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 gap-8">
                                    <DankLogo />

                                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                        {[
                                            { href: "/", label: "ANA SAYFA", color: "bg-cyan-400" },
                                            { href: "/makale", label: "KEŞFET", color: "bg-green-400" },
                                            { href: "/blog", label: "BLOG", color: "bg-purple-400" },
                                            { href: "/profil", label: "PROFİL", color: "bg-pink-400" },
                                        ].map((link, i) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="group relative h-28 border-[3px] border-black rounded-2xl overflow-hidden hover:scale-105 transition-transform"
                                            >
                                                <div className={cn("absolute inset-0 border-b-4 border-black/20", link.color)} />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="font-black text-xl italic text-black/90 tracking-tighter uppercase drop-shadow-sm group-hover:tracking-widest transition-all">
                                                        {link.label}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="w-full max-w-xs p-1 bg-white border-2 border-black rounded-xl">
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
