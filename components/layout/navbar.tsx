"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Zap, Skull, Radiation, Orbit } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const NAV_ITEMS = [
    { href: "/makale", label: "MAKALE", icon: Skull, color: "bg-[#FF6B6B]" },
    { href: "/siralamalar", label: "LİG", icon: Zap, color: "bg-[#4ECDC4]" },
    { href: "/ozel", label: "LAB", icon: Radiation, color: "bg-[#FFE66D]" },
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    // Wiggle animation
    const wiggle = {
        hover: { rotate: [0, -2, 2, -2, 2, 0], transition: { duration: 0.4 } }
    };

    return (
        <>
            {/* 
                V70: ALIEN SCIENCE NEO-BRUTALISM
                Style: "Alien Cafe", Neon Lime, Cartoonish, Thick Borders
            */}

            <header className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-5 pointer-events-none font-sans">

                {/* CONTAINER */}
                <div className="pointer-events-auto mx-auto max-w-7xl">
                    <div className={cn(
                        "relative bg-white border-[3px] border-black rounded-3xl",
                        "shadow-[6px_6px_0px_0px_#000]", // Hard Shadow
                        "flex flex-col overflow-hidden"
                    )}>

                        {/* TOP STRIP: ALIEN GREEN */}
                        <div className="h-2 bg-[#B8FF21] border-b-[3px] border-black flex items-center justify-center overflow-hidden">
                            <div className="flex gap-4 animate-marquee whitespace-nowrap text-[10px] font-black uppercase text-black tracking-widest">
                                {Array(20).fill("👽 BİLİM İSTİLASI BAŞLADI 🛸").map((t, i) => (
                                    <span key={i}>{t}</span>
                                ))}
                            </div>
                        </div>

                        {/* MAIN BAR */}
                        <div className="h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between bg-white">

                            {/* BRAND */}
                            <motion.div whileHover="hover" variants={wiggle}>
                                <ViewTransitionLink href="/" className="block">
                                    <DankLogo />
                                </ViewTransitionLink>
                            </motion.div>

                            {/* DESKTOP NAV */}
                            <nav className="hidden md:flex items-center gap-4">
                                {NAV_ITEMS.map((item) => (
                                    <ViewTransitionLink
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "relative px-6 py-2 rounded-xl border-[3px] border-black font-black text-sm tracking-tight transition-all",
                                            "hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]",
                                            pathname === item.href
                                                ? cn("text-black -translate-y-1 shadow-[4px_4px_0px_0px_#000]", item.color)
                                                : "bg-white text-black hover:bg-neutral-100"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <item.icon className="w-4 h-4 stroke-[3px]" />
                                            {item.label}
                                        </div>
                                    </ViewTransitionLink>
                                ))}
                            </nav>

                            {/* ACTIONS */}
                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsSearchOpen(true)}
                                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#1A1A1A] text-white rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#888] hover:shadow-[4px_4px_0px_0px_#B8FF21] transition-shadow"
                                >
                                    <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px]" />
                                </motion.button>

                                {/* MOBILE MENU */}
                                <div className="md:hidden">
                                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                        <SheetTrigger asChild>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                className="w-12 h-12 flex items-center justify-center bg-[#B8FF21] rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000]"
                                            >
                                                <Menu className="w-7 h-7 stroke-[3px]" />
                                            </motion.button>
                                        </SheetTrigger>
                                        <SheetContent side="right" className="w-full bg-[#B8FF21] border-l-[4px] border-black p-0">
                                            <div className="h-full flex flex-col relative overflow-hidden">

                                                {/* CLOSE */}
                                                <button
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="absolute top-6 right-6 w-12 h-12 bg-white flex items-center justify-center rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] z-20"
                                                >
                                                    <X className="w-7 h-7 stroke-[3px]" />
                                                </button>

                                                {/* GIANT LINKS */}
                                                <div className="flex-1 flex flex-col justify-center px-10 gap-6 relative z-10">
                                                    {[
                                                        { href: "/", label: "ANA SAYFA", bg: "bg-white", color: undefined },
                                                        ...NAV_ITEMS.map(item => ({ ...item, bg: undefined }))
                                                    ].map((item, i) => (
                                                        <ViewTransitionLink
                                                            key={i}
                                                            href={item.href}
                                                            onClick={() => setIsMenuOpen(false)}
                                                            className={cn(
                                                                "group relative p-6 rounded-2xl border-[4px] border-black shadow-[8px_8px_0px_0px_#000] active:translate-y-2 active:shadow-none transition-all",
                                                                item.bg || item.color || "bg-white"
                                                            )}
                                                        >
                                                            <span className="text-3xl font-black uppercase tracking-tighter">{item.label}</span>
                                                            <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Orbit className="w-8 h-8 stroke-[3px] animate-spin" />
                                                            </div>
                                                        </ViewTransitionLink>
                                                    ))}

                                                    <div className="mt-8 p-4 bg-white border-[4px] border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
                                                        <AuthButton />
                                                    </div>
                                                </div>

                                                {/* DECORATION */}
                                                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FFE66D] rounded-full border-[4px] border-black z-0" />
                                                <div className="absolute top-20 -left-10 w-32 h-32 bg-[#FF6B6B] rounded-full border-[4px] border-black z-0" />

                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                <div className="hidden md:block">
                                    <AuthButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* SPACER */}
            <div className="h-28 sm:h-32" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
