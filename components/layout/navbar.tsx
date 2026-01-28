"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Home, BookOpen, Trophy, Atom, User, Sparkles } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const NAV_ITEMS = [
    { href: "/", label: "Home", icon: Home },
    { href: "/makale", label: "Read", icon: BookOpen },
    { href: "/siralamalar", label: "Rank", icon: Trophy },
    { href: "/ozel", label: "Lab", icon: Atom },
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
                V80: UNIVERSAL SOFT APP
                Style: "Clean Book App", Soft Rounded, Floating Elements
            */}

            {/* --- DESKTOP HEADER (Floating Island) --- */}
            <header className="hidden md:flex fixed top-6 left-0 right-0 z-50 justify-center pointer-events-none">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={cn(
                        "pointer-events-auto",
                        "h-16 px-2 pr-4 bg-white/95 backdrop-blur-xl",
                        "border border-neutral-200/60 shadow-lg shadow-neutral-200/20",
                        "rounded-full flex items-center gap-4 transition-all duration-300",
                        scrolled ? "w-[50rem]" : "w-[60rem]"
                    )}
                >
                    {/* Brand */}
                    <div className="pl-4">
                        <ViewTransitionLink href="/">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* Divider */}
                    <div className="w-[1px] h-6 bg-neutral-200" />

                    {/* Nav Pills */}
                    <nav className="flex-1 flex items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative px-5 py-2 rounded-full text-sm font-semibold transition-all hover:bg-neutral-100",
                                        isActive ? "text-slate-900" : "text-neutral-500"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="desktop-nav"
                                            className="absolute inset-0 bg-neutral-100 rounded-full"
                                            style={{ borderRadius: 999 }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <item.icon className={cn("w-4 h-4", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                                        {item.label}
                                    </span>
                                </ViewTransitionLink>
                            )
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <AuthButton />
                    </div>
                </motion.div>
            </header>

            {/* --- MOBILE HEADER (Minimal) --- */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 h-14 px-4 flex items-center justify-between">
                <ViewTransitionLink href="/">
                    <DankLogo className="scale-90 origin-left" />
                </ViewTransitionLink>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSearchOpen(true)}>
                        <Search className="w-6 h-6 text-neutral-800" />
                    </button>
                    <AuthButton />
                </div>
            </header>

            {/* --- MOBILE BOTTOM NAV (Floating Dock) --- */}
            <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50">
                <div className="bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-900/20 px-6 py-4 flex items-center justify-between">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <ViewTransitionLink
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center gap-1"
                            >
                                <div className={cn(
                                    "p-2 rounded-2xl transition-all duration-300",
                                    isActive ? "bg-white text-slate-900 -translate-y-4 shadow-lg shadow-black/10 scale-110" : "text-slate-400"
                                )}>
                                    <item.icon className="w-6 h-6 stroke-[2.5px]" />
                                </div>
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -bottom-2 text-[10px] font-bold text-white tracking-wide"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </ViewTransitionLink>
                        )
                    })}
                </div>
            </nav>

            {/* --- SPACERS --- */}
            <div className="hidden md:block h-32" /> {/* Desktop Spacer */}
            <div className="md:hidden h-20" /> {/* Mobile Top Spacer */}
            <div className="md:hidden h-28" /> {/* Mobile Bottom Spacer */}

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
