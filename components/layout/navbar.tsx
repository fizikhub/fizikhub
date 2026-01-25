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

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

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
                V15: DANK NEO-NAVBAR
                - Layout: Wide Floating Bar (Left Logo, Right Actions).
                - Style: High Contrast, Animated, "Cool".
            */}
            <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none">
                <motion.div
                    initial={{ y: -100, rotateX: 90 }}
                    animate={{ y: 0, rotateX: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={cn(
                        "pointer-events-auto",
                        "flex items-center justify-between pl-4 pr-2 py-2",
                        "bg-[#111]/95 backdrop-blur-xl border-[3px] border-black",
                        "rounded-2xl shadow-[4px_4px_0px_0px_#FFC800]", // YELLOW SHADOW VIBE
                        "w-full max-w-7xl", // Full width container
                    )}
                >
                    {/* LEFT: ANIMATED BRAND */}
                    <Link href="/" className="group">
                        <DankLogo />
                    </Link>

                    {/* RIGHT: ACTIONS */}
                    <div className="flex items-center gap-2">

                        {/* Desktop Links (Hidden on Mobile) */}
                        <div className="hidden md:flex items-center gap-1 mr-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 font-bold uppercase rounded-lg border-2 border-transparent hover:border-black hover:bg-[#FFC800] hover:text-black transition-all",
                                        pathname === item.href ? "text-[#FFC800]" : "text-gray-400"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Search Button */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center justify-center w-10 h-10 bg-[#1a1a1a] border-2 border-transparent hover:border-[#FFC800] rounded-xl text-white transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </motion.button>

                        {/* Special Action (Mobile) */}
                        <Link href="/ozel" className="md:hidden">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center justify-center w-10 h-10 bg-[#FFC800] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#fff]"
                            >
                                <Zap className="w-5 h-5 text-black fill-black" />
                            </motion.div>
                        </Link>

                        {/* MENU TRIGGER */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center justify-center w-10 h-10 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000]"
                                >
                                    <Menu className="w-6 h-6 text-black stroke-[3px]" />
                                </motion.button>
                            </SheetTrigger>
                            <SheetContent side="top" className="w-full h-auto min-h-[60vh] bg-[#0a0a0a] border-b-[4px] border-[#FFC800] rounded-b-[40px] p-0 text-white overflow-hidden">

                                {/* Menu Background / Doodles? */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(#FFC800 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                                />

                                <div className="relative z-10 p-8 pt-24 flex flex-col gap-6 items-center">
                                    <DankLogo />

                                    <div className="w-full h-1 bg-[#FFC800]/20 rounded-full" />

                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        {[
                                            { href: "/", label: "Ana Sayfa", color: "bg-blue-400" },
                                            { href: "/makale", label: "Keşfet", color: "bg-green-400" },
                                            { href: "/blog", label: "Blog", color: "bg-purple-400" },
                                            { href: "/profil", label: "Profil", color: "bg-orange-400" },
                                        ].map((link, i) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="group relative flex items-center justify-center h-20 bg-[#151515] border-[3px] border-[#333] hover:border-[#FFC800] rounded-2xl overflow-hidden transition-all"
                                            >
                                                <span className="relative z-10 font-black text-xl uppercase italic tracking-tighter group-hover:scale-110 transition-transform">{link.label}</span>
                                                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity", link.color)} />
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="mt-4 w-full">
                                        <AuthButton />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </motion.div>
            </header>

            {/* SPACER for Content */}
            <div className="h-[20px] sm:h-[40px]" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
