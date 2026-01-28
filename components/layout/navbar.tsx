"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Home, BookOpen, Trophy, Atom, User } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const NAV_ITEMS = [
    { href: "/", label: "ANA SAYFA", icon: Home },
    { href: "/makale", label: "MAKALE", icon: BookOpen },
    { href: "/siralamalar", label: "LİG", icon: Trophy },
    { href: "/ozel", label: "LAB", icon: Atom },
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* 
                V60: DARK NEO-BRUTALIST APP
                Style: "The Monolith", Void Black, Stark White, Bottom Nav
            */}

            {/* --- DESKTOP TOP BAR --- */}
            <header className={cn(
                "hidden md:flex fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/20" : "bg-transparent"
            )}>
                <div className="max-w-7xl mx-auto w-full h-20 px-6 flex items-center justify-between">

                    {/* LOGO */}
                    <ViewTransitionLink href="/" className="group flex items-center gap-2">
                        <DankLogo />
                    </ViewTransitionLink>

                    {/* DESKTOP NAV */}
                    <nav className="flex items-center gap-1 bg-black border border-white p-1 rounded-full">
                        {NAV_ITEMS.map((item) => (
                            <ViewTransitionLink
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-bold tracking-widest transition-all",
                                    pathname === item.href
                                        ? "bg-white text-black shadow-[0px_0px_15px_rgba(255,255,255,0.5)]"
                                        : "text-white hover:bg-neutral-900"
                                )}
                            >
                                {item.label}
                            </ViewTransitionLink>
                        ))}
                    </nav>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 rounded-full border border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <AuthButton />
                    </div>

                </div>
            </header>

            {/* --- MOBILE TOP BAR --- */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/20 h-16 px-4 flex items-center justify-between">
                <ViewTransitionLink href="/">
                    <DankLogo className="scale-75 origin-left" />
                </ViewTransitionLink>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="w-9 h-9 border border-white/30 rounded-lg flex items-center justify-center text-white"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                    <div className="scale-90 origin-right">
                        <AuthButton />
                    </div>
                </div>
            </header>

            {/* --- MOBILE BOTTOM TAB BAR (THE APP FEEL) --- */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/20 pb-safe">
                <div className="grid grid-cols-4 h-16">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <ViewTransitionLink
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center gap-1 touch-manipulation group"
                            >
                                <div className={cn(
                                    "p-1.5 rounded-lg transition-all",
                                    isActive ? "bg-white text-black" : "text-neutral-400 group-active:scale-90"
                                )}>
                                    <item.icon className="w-5 h-5 stroke-[2.5px]" />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold tracking-wide",
                                    isActive ? "text-white" : "text-neutral-500"
                                )}>
                                    {item.label}
                                </span>
                            </ViewTransitionLink>
                        )
                    })}
                </div>
            </nav>

            {/* --- SPACERS --- */}
            {/* Desktop spacer */}
            <div className="hidden md:block h-20" />
            {/* Mobile spacer (Top + Bottom) */}
            <div className="md:hidden h-16" />
            <div className="md:hidden h-16" /> {/* For bottom bar */}

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
