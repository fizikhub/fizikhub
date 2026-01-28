"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Rocket, Sparkles, Book, Trophy, Atom, ChevronRight } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const NAV_ITEMS = [
    { href: "/makale", label: "MAKALE", icon: Book, color: "text-blue-500", bg: "bg-blue-100" },
    { href: "/siralamalar", label: "LİG", icon: Trophy, color: "text-yellow-600", bg: "bg-yellow-100" },
    { href: "/ozel", label: "LAB", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-100" },
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => setMounted(true), []);

    // Bouncy animation variants
    const springHover = { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } as const };
    const springTap = { scale: 0.95 };

    return (
        <>
            {/* 
                V50: SUPER-APP SCIENCE NAVBAR (The Duolingo Vibe)
                Style: Ultra-Rounded, Juicy, Playful, High-Fidelity
            */}
            <header className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-5 pointer-events-none font-sans">

                {/* CAPSULE CONTAINER */}
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={cn(
                        "pointer-events-auto mx-auto max-w-5xl relative",
                        "h-16 sm:h-20 bg-white/90 backdrop-blur-xl",
                        "rounded-full border-[3px] border-slate-900/10", // Soft but thick border
                        "shadow-[0px_8px_40px_-12px_rgba(0,0,0,0.1)]", // Soft elevated shadow
                        "flex items-center justify-between px-3 sm:px-6",
                        "transition-all duration-300"
                    )}
                >

                    {/* 1. LOGO (Left) */}
                    <div className="flex-shrink-0 pl-2">
                        <ViewTransitionLink href="/" className="block">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* 2. PILL NAVIGATION (Center - Desktop) */}
                    <nav className="hidden md:flex items-center gap-2 p-1 bg-slate-100 rounded-full border border-slate-200/60">
                        {[{ href: "/", label: "ANA SAYFA" }, ...NAV_ITEMS].map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <ViewTransitionLink
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative px-5 py-2.5 rounded-full text-sm font-bold tracking-tight transition-all z-10",
                                        isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-white shadow-sm rounded-full border border-black/5"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            style={{ zIndex: -1 }}
                                        />
                                    )}
                                    {link.label}
                                </ViewTransitionLink>
                            )
                        })}
                    </nav>

                    {/* 3. ACTIONS (Right) */}
                    <div className="flex items-center gap-2 sm:gap-3 pr-1">

                        {/* SEARCH BTN */}
                        <motion.button
                            whileHover={springHover}
                            whileTap={springTap}
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white border-2 border-slate-200 rounded-full text-slate-600 hover:border-blue-400 hover:text-blue-500 transition-colors shadow-sm"
                        >
                            <Search className="w-5 h-5 stroke-[2.5px]" />
                        </motion.button>

                        {/* DESKTOP AUTH */}
                        <div className="hidden md:block">
                            <AuthButton />
                        </div>

                        {/* MOBILE MENU BTN */}
                        <div className="md:hidden">
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <motion.button
                                        whileHover={springHover}
                                        whileTap={springTap}
                                        className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full border-2 border-slate-900 shadow-lg shadow-slate-900/20"
                                    >
                                        <Menu className="w-5 h-5 stroke-[3px]" />
                                    </motion.button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-[95dvh] rounded-t-[40px] border-t-0 p-0 overflow-hidden bg-slate-50">
                                    <div className="flex flex-col h-full">

                                        {/* DRAGGABLE HANDLE */}
                                        <div className="w-full h-8 flex items-center justify-center pt-4 pb-2">
                                            <div className="w-16 h-1.5 bg-slate-300 rounded-full" />
                                        </div>

                                        {/* HEADER */}
                                        <div className="px-8 pb-6 flex items-center justify-between">
                                            <span className="text-2xl font-black tracking-tight text-slate-900">MENÜ</span>
                                            <button
                                                onClick={() => setIsMenuOpen(false)}
                                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200"
                                            >
                                                <X className="w-5 h-5 text-slate-500" />
                                            </button>
                                        </div>

                                        {/* GRID LINKS */}
                                        <div className="flex-1 px-6 pb-8 overflow-y-auto">
                                            <div className="grid grid-cols-1 gap-3">
                                                {[{ href: "/", label: "ANA SAYFA", icon: Rocket, color: "text-slate-900", bg: "bg-white" }, ...NAV_ITEMS].map((item, i) => (
                                                    <ViewTransitionLink
                                                        key={i}
                                                        href={item.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className={cn(
                                                            "group flex items-center justify-between p-4 rounded-3xl border-2 border-transparent transition-all",
                                                            "bg-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                                                            "hover:border-slate-200"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.bg || "bg-slate-100")}>
                                                                <item.icon className={cn("w-6 h-6 stroke-[2.5px]", item.color)} />
                                                            </div>
                                                            <span className="text-lg font-bold text-slate-700 group-hover:text-slate-900">{item.label}</span>
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                                            <ChevronRight className="w-4 h-4" />
                                                        </div>
                                                    </ViewTransitionLink>
                                                ))}
                                            </div>

                                            <div className="mt-6 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-4">
                                                <div className="w-full flex items-center gap-3">
                                                    <div className="flex-1 h-[1px] bg-slate-100" />
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hesap</span>
                                                    <div className="flex-1 h-[1px] bg-slate-100" />
                                                </div>
                                                <AuthButton />
                                            </div>
                                        </div>

                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                </motion.div>
            </header>

            {/* SPACER */}
            <div className="h-28 sm:h-32" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
