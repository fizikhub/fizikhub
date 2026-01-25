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

    // V16: Add mounting check to prevent hydration mismatch on random animations
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* 
                V16: HYPER-NEO NAVBAR
                - "One Level Up" from V15.
                - Cleaner, darker, punchier.
            */}
            <header className="fixed top-3 left-0 right-0 z-50 flex justify-center px-3 pointer-events-none">
                <motion.div
                    initial={{ y: -120, scale: 0.9 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                    className={cn(
                        "pointer-events-auto",
                        "flex items-center justify-between pl-5 pr-3 py-2.5",
                        "bg-[#050505] border-[3px] border-black", // Deep Black Body
                        "rounded-2xl",
                        // THE YELLOW LIP SHADOW (As seen in screenshot)
                        "shadow-[0px_6px_0px_0px_#FFC800]",
                        "w-full max-w-7xl relative overflow-hidden"
                    )}
                >
                    {/* Background Noise Texture for "Premium" Feel */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none z-0"
                        style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '4px 4px' }}
                    />

                    {/* LEFT: HYPER BRAND */}
                    <div className="relative z-10 flex-shrink-0">
                        <Link href="/">
                            <DankLogo />
                        </Link>
                    </div>

                    {/* RIGHT: CYBER ACTIONS */}
                    <div className="relative z-10 flex items-center gap-3">

                        {/* 1. SEARCH - Glassy Dark */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ y: -2 }}
                            className="flex items-center justify-center w-11 h-11 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </motion.button>

                        {/* 2. SPECIAL - Electric Yellow */}
                        <Link href="/ozel">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ y: -2, boxShadow: "0px 0px 20px rgba(255, 200, 0, 0.4)" }}
                                className="flex items-center justify-center w-11 h-11 bg-[#FFC800] border-[2px] border-black rounded-xl shadow-[2px_2px_0px_0px_#000]"
                            >
                                <Zap className="w-6 h-6 text-black fill-black" />
                            </motion.div>
                        </Link>

                        {/* 3. MENU - Stark White */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ y: -2 }}
                                    className="flex items-center justify-center w-11 h-11 bg-white border-[2px] border-black rounded-xl shadow-[2px_2px_0px_0px_#000]"
                                >
                                    <Menu className="w-6 h-6 text-black stroke-[3px]" />
                                </motion.button>
                            </SheetTrigger>
                            <SheetContent side="top" className="w-full h-[80vh] bg-[#050505] border-b-[6px] border-[#FFC800] rounded-b-[48px] p-0 text-white overflow-hidden">

                                {/* Menu Background */}
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay" />
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#FFC800]/10 to-transparent opacity-50" />
                                </div>

                                <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 gap-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1, type: "spring" }}
                                    >
                                        <DankLogo />
                                    </motion.div>

                                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                        {[
                                            { href: "/", label: "ANA SAYFA", icon: "🏠" },
                                            { href: "/makale", label: "KEŞFET", icon: "🧭" },
                                            { href: "/blog", label: "BLOG", icon: "📝" },
                                            { href: "/profil", label: "PROFİL", icon: "👤" },
                                        ].map((link, i) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="group relative flex flex-col items-center justify-center h-24 bg-[#111] border-[2px] border-[#222] hover:border-[#FFC800] hover:bg-[#FFC800] rounded-2xl transition-all duration-300"
                                            >
                                                <span className="text-2xl mb-1 group-hover:scale-125 transition-transform duration-300">{link.icon}</span>
                                                <span className="font-black text-sm text-zinc-500 group-hover:text-black tracking-widest">{link.label}</span>
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

            {/* SPACER */}
            <div className="h-[20px] sm:h-[40px]" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
