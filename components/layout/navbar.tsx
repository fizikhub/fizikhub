"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Atom, Zap, BookOpen, Trophy, Home } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const NAV_ITEMS = [
    { href: "/makale", label: "MAKALE", icon: BookOpen, color: "bg-blue-400" },
    { href: "/siralamalar", label: "LİG", icon: Trophy, color: "bg-yellow-400" },
    { href: "/ozel", label: "LAB", icon: Zap, color: "bg-purple-400" },
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => setMounted(true), []);

    // Spring animation for buttons
    const tapAnimation = { scale: 0.95, y: 2, x: 2, boxShadow: "0px 0px 0px 0px #000" };
    const hoverAnimation = { y: -2, x: -2, boxShadow: "4px 4px 0px 0px #000" };

    return (
        <>
            {/* 
                V30: POP-SCIENCE NEO-BRUTALIST APP BAR
                Style: "Fun Science", Education App, High Contrast, Tactile
            */}
            <header className="fixed top-0 left-0 right-0 z-50 p-2 sm:p-4 pointer-events-none">
                <div className="max-w-7xl mx-auto w-full pointer-events-auto">

                    {/* NAV CONTAINER (Floating Island) */}
                    <div className={cn(
                        "relative flex items-center justify-between",
                        "h-16 sm:h-20 px-4 sm:px-6 rounded-2xl",
                        "bg-white border-[3px] border-black",
                        "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]", // Hard shadow
                        "transition-all duration-300"
                    )}>

                        {/* LEFT: BRAND (Logo + Badge) */}
                        <div className="flex items-center gap-3">
                            <ViewTransitionLink href="/" className="group relative z-10">
                                <DankLogo className="scale-100 sm:scale-110 origin-left transition-transform group-hover:scale-110" />
                            </ViewTransitionLink>

                            {/* "APP" Badge */}
                            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-neutral-100 border-2 border-black rounded-lg transform -rotate-2 hover:rotate-0 transition-transform">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse border border-black" />
                                <span className="text-[10px] font-black uppercase tracking-wider">v3.0.0</span>
                            </div>
                        </div>

                        {/* CENTER: DESKTOP PILLS */}
                        <nav className="hidden md:flex items-center gap-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            {NAV_ITEMS.map((item) => (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative group flex items-center gap-2 px-5 py-2.5 rounded-xl border-[3px] border-black bg-white transition-all",
                                        "hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]",
                                        pathname === item.href && "bg-neutral-100 translate-y-[2px] shadow-none"
                                    )}
                                >
                                    <div className={cn("p-1 rounded-md border border-black text-black", item.color)}>
                                        <item.icon className="w-4 h-4 stroke-[3px]" />
                                    </div>
                                    <span className="font-black text-sm tracking-tight">{item.label}</span>
                                </ViewTransitionLink>
                            ))}
                        </nav>

                        {/* RIGHT: ACTIONS */}
                        <div className="flex items-center gap-2 sm:gap-3">

                            {/* SEARCH BUTTON */}
                            <motion.button
                                whileHover={hoverAnimation}
                                whileTap={tapAnimation}
                                onClick={() => setIsSearchOpen(true)}
                                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#FFC800] border-[3px] border-black rounded-xl shadow-[2px_2px_0px_0px_#000]"
                            >
                                <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px]" />
                            </motion.button>

                            {/* MOBILE MENU TRIGGER */}
                            <div className="md:hidden">
                                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                    <SheetTrigger asChild>
                                        <motion.button
                                            whileHover={hoverAnimation}
                                            whileTap={tapAnimation}
                                            className="w-10 h-10 flex items-center justify-center bg-white border-[3px] border-black rounded-xl shadow-[2px_2px_0px_0px_#000]"
                                        >
                                            <Menu className="w-6 h-6 stroke-[3px]" />
                                        </motion.button>
                                    </SheetTrigger>
                                    <SheetContent side="top" className="h-screen w-full bg-[#FFFBF0] p-0 border-none rounded-none focus:outline-none">

                                        {/* MOBILE MENU HEADER */}
                                        <div className="h-20 flex items-center justify-between px-6 border-b-[3px] border-black bg-white">
                                            <DankLogo />
                                            <button
                                                onClick={() => setIsMenuOpen(false)}
                                                className="w-10 h-10 flex items-center justify-center bg-red-500 text-white border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
                                            >
                                                <X className="w-6 h-6 stroke-[3px]" />
                                            </button>
                                        </div>

                                        {/* MOBILE MENU ITEMS */}
                                        <div className="p-6 flex flex-col gap-4">
                                            {[
                                                { href: "/", label: "ANA SAYFA", color: "bg-white", icon: Home },
                                                ...NAV_ITEMS
                                            ].map((item, i) => (
                                                <ViewTransitionLink
                                                    key={i}
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className={cn(
                                                        "w-full flex items-center justify-between p-4 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all",
                                                        "text-xl font-black tracking-tight",
                                                        item.color || "bg-white"
                                                    )}
                                                >
                                                    {item.label}
                                                    <div className="bg-black text-white rounded-full p-1">
                                                        <item.icon className="w-5 h-5 stroke-[3px]" />
                                                    </div>
                                                </ViewTransitionLink>
                                            ))}

                                            {/* AUTH SECTION MOBILE */}
                                            <div className="mt-4 p-4 rounded-xl border-[3px] border-black bg-neutral-100 border-dashed">
                                                <AuthButton />
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* DESKTOP AUTH (Hidden on mobile) */}
                            <div className="hidden md:block">
                                <AuthButton />
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            {/* SPACER */}
            <div className="h-24 sm:h-32" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
