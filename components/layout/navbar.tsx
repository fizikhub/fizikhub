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
                V15.5: SLIMMER HERO
                - Reverted to V15 Monochrome (Yellow/Black)
                - Reduced vertical padding (py-1.5)
                - Smaller buttons on mobile (h-9 w-9)
            */}
            <header className="fixed top-2 left-0 right-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none">
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={cn(
                        "pointer-events-auto",
                        "flex items-center justify-between pl-3 pr-2 py-1.5 sm:py-2.5", // Reduced Padding
                        "bg-[#111]/95 backdrop-blur-xl border-[2px] sm:border-[3px] border-black",
                        "rounded-xl sm:rounded-2xl shadow-[3px_3px_0px_0px_#FFC800]", // Smaller Shadow
                        "w-full max-w-7xl relative overflow-hidden"
                    )}
                >
                    {/* LEFT: COMPACT BRAND */}
                    <div className="flex-shrink-0 pt-0.5">
                        <Link href="/" className="group">
                            <DankLogo />
                        </Link>
                    </div>

                    {/* RIGHT: COMPACT ACTIONS */}
                    <div className="flex items-center gap-1.5 sm:gap-2">

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-1 mr-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-3 py-1.5 font-bold uppercase rounded-md border-2 border-transparent hover:border-black hover:bg-[#FFC800] hover:text-black transition-all text-sm",
                                        pathname === item.href ? "text-[#FFC800]" : "text-gray-400"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* 1. SEARCH */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#1a1a1a] border-[1.5px] sm:border-2 border-zinc-800 hover:border-[#FFC800] rounded-lg text-white transition-colors"
                        >
                            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>

                        {/* 2. ZAP (Mobile) */}
                        <Link href="/ozel" className="md:hidden">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#FFC800] border-[1.5px] sm:border-2 border-black rounded-lg shadow-[1px_1px_0px_0px_#fff]"
                            >
                                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-black fill-black" />
                            </motion.div>
                        </Link>

                        {/* 3. MENU */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-white border-[1.5px] sm:border-2 border-black rounded-lg shadow-[1px_1px_0px_0px_#000]"
                                >
                                    <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[3px]" />
                                </motion.button>
                            </SheetTrigger>
                            <SheetContent side="top" className="w-full h-auto min-h-[60vh] bg-[#0a0a0a] border-b-[4px] border-[#FFC800] rounded-b-[32px] p-0 text-white overflow-hidden">
                                <div className="absolute inset-0 opacity-10 pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(#FFC800 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                                />

                                <div className="relative z-10 p-6 pt-20 flex flex-col gap-6 items-center">
                                    <DankLogo />

                                    <div className="w-full h-px bg-[#FFC800]/20" />

                                    <div className="grid grid-cols-2 gap-3 w-full">
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
                                                className="group relative flex items-center justify-center h-16 bg-[#151515] border-2 border-[#333] hover:border-[#FFC800] rounded-xl overflow-hidden transition-all"
                                            >
                                                <span className="relative z-10 font-bold text-lg uppercase italic tracking-tight group-hover:scale-110 transition-transform">{link.label}</span>
                                                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity", link.color)} />
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="mt-2 w-full">
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
