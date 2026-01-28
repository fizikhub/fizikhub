"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Home, BookOpen, Trophy, Atom, Menu, X, Sparkles } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const NAV_ITEMS = [
    { href: "/", label: "Home", icon: Home, color: "hover:bg-[#A388EE]" }, // Violet
    { href: "/makale", label: "Read", icon: BookOpen, color: "hover:bg-[#FABE28]" }, // Yellow
    { href: "/siralamalar", label: "Rank", icon: Trophy, color: "hover:bg-[#88EEA3]" }, // Mint
    { href: "/ozel", label: "Lab", icon: Atom, color: "hover:bg-[#EE8888]" }, // Salmon
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const pathname = usePathname();

    // Hide top navbar on mobile since we have bottom tabs, but show a minimal brand header
    return (
        <>
            {/* 
                V120: NEO-BRUTALIST APP
                Style: "Trendy Mobile App", Bottom Tabs, Floating Dock, Squircles
            */}

            {/* --- MOBILE TOP HEADER (Brand Only) --- */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 bg-white/90 backdrop-blur-md border-b-2 border-black flex items-center justify-between">
                <ViewTransitionLink href="/">
                    <DankLogo className="scale-90 origin-left" />
                </ViewTransitionLink>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="w-10 h-10 bg-[#FABE28] border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    <div className="scale-90 origin-right">
                        <AuthButton />
                    </div>
                </div>
            </header>

            {/* --- MOBILE BOTTOM TAB BAR (True App Experience) --- */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-black pb-safe">
                <div className="grid grid-cols-4 h-16">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        // Map nav item color to active background for mobile
                        const activeBg = isActive && item.href === "/" ? "bg-[#A388EE]" :
                            isActive && item.href === "/makale" ? "bg-[#FABE28]" :
                                isActive && item.href === "/siralamalar" ? "bg-[#88EEA3]" :
                                    isActive && item.href === "/ozel" ? "bg-[#EE8888]" : "";

                        return (
                            <ViewTransitionLink
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center gap-1 touch-manipulation group"
                            >
                                <div className={cn(
                                    "p-1.5 rounded-xl border-2 border-transparent transition-all duration-300",
                                    isActive ? cn("border-black -translate-y-4 shadow-[3px_3px_0px_0px_#000]", activeBg) : "text-neutral-400 group-active:scale-95"
                                )}>
                                    <item.icon className={cn("w-6 h-6 stroke-[2.5px]", isActive ? "text-black" : "text-neutral-400")} />
                                </div>
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute bottom-1 text-[10px] font-black tracking-wide text-black"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </ViewTransitionLink>
                        )
                    })}
                </div>
            </nav>

            {/* --- DESKTOP FLOATING DOCK --- */}
            <header className="hidden md:flex fixed top-6 left-0 right-0 z-50 justify-center pointer-events-none">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="pointer-events-auto bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-6 py-3 flex items-center gap-6"
                >
                    {/* Brand */}
                    <div className="pr-4 border-r-2 border-neutral-200">
                        <ViewTransitionLink href="/" className="hover:scale-110 transition-transform block">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex items-center gap-3">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all",
                                        "hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_#000] hover:border-black",
                                        item.color, // Hover color
                                        isActive
                                            ? "bg-black text-white border-black shadow-[3px_3px_0px_0px_#888] pointer-events-none"
                                            : "bg-transparent border-transparent text-neutral-600"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon className="w-4 h-4 stroke-[3px]" />
                                        <span>{item.label}</span>
                                    </div>
                                </ViewTransitionLink>
                            )
                        })}
                    </nav>

                    {/* Actions Spacer */}
                    <div className="w-[1px] h-8 bg-neutral-200" />

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 rounded-lg border-2 border-black bg-neutral-100 flex items-center justify-center hover:bg-[#FABE28] hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_#000] transition-all"
                        >
                            <Search className="w-5 h-5 stroke-[3px]" />
                        </button>
                        <AuthButton />
                    </div>

                </motion.div>
            </header>

            {/* --- SPACERS --- */}
            <div className="hidden md:block h-32" /> {/* Desktop Spacer */}
            <div className="md:hidden h-20" /> {/* Mobile Top Spacer */}
            <div className="md:hidden h-24" /> {/* Mobile Bottom Spacer */}

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
