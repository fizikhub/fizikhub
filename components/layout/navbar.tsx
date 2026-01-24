"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { SiteLogo } from "@/components/icons/site-logo";
import { Menu, Search, Home, Feather, MessageCircle, Library, Trophy, Compass, X, Sparkles, ChevronRight } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthButton } from "@/components/auth/auth-button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [supabase] = useState(() => createClient());
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { href: "/", label: "Anasayfa", icon: Home },
        { href: "/makale", label: "Makale", icon: Feather },
        { href: "/blog", label: "Blog", icon: Compass },
        { href: "/forum", label: "Forum", icon: MessageCircle },
        { href: "/sozluk", label: "Lügat", icon: Library },
        { href: "/siralamalar", label: "Sıralama", icon: Trophy },
    ];

    return (
        <LayoutGroup>
            {/* 
                V12 LIQUID MORPH NAVBAR
                - Concept: "Dynamic Island" / Organic Fluidity
                - Tech: Framer Motion Layout Transitions
                - Style: Glassmorphism, Borderless, Soft Shadows
            */}

            {/* DESKTOP: Floating Glass Strip */}
            <motion.header
                className={cn(
                    "hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
                    scrolled ? "pt-4" : "pt-6"
                )}
            >
                <motion.div
                    layout
                    className={cn(
                        "mx-auto flex items-center justify-between px-2 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]",
                        scrolled
                            ? "max-w-5xl h-14 rounded-full"
                            : "max-w-7xl h-16 rounded-2xl"
                    )}
                >
                    {/* 1. BRAND */}
                    <Link href="/" className="flex items-center gap-3 pl-4 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#FFC800] blur-[10px] opacity-0 group-hover:opacity-40 transition-opacity rounded-full" />
                            <SiteLogo className="relative w-8 h-8 mask-image-none" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                            fizik<span className="text-[#FFC800]">hub</span>
                        </span>
                    </Link>

                    {/* 2. NAV */}
                    <nav className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors",
                                        isActive ? "text-black dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                                    )}
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="desktop-nav-pill"
                                            className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full shadow-sm z-[-1]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* 3. ACTIONS */}
                    <div className="flex items-center gap-2 pr-2">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <AuthButton />
                    </div>
                </motion.div>
            </motion.header>


            {/* MOBILE: The "Liquid Morph" Dynamic Header */}
            <div className="lg:hidden fixed top-4 left-4 right-4 z-50 pointer-events-none flex flex-col items-center">
                <motion.div
                    layout
                    initial={false}
                    animate={isMobileMenuOpen ? "open" : "closed"}
                    className={cn(
                        "pointer-events-auto overflow-hidden bg-white/80 dark:bg-[#121212]/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
                        isMobileMenuOpen ? "w-full rounded-[32px]" : "w-full rounded-full"
                    )}
                    style={{
                        originY: 0,
                    }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                >
                    {/* CLOSED STATE HEADER (Visible always, morphs) */}
                    <div className="h-16 flex items-center justify-between px-4">
                        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <SiteLogo className="w-8 h-8" />
                            <span className="text-lg font-bold text-black dark:text-white">
                                fizik<span className="text-[#FFC800]">hub</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-2">
                            {!isMobileMenuOpen && (
                                <motion.button
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    onClick={() => setIsSearchOpen(true)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10"
                                >
                                    <Search className="w-5 h-5 text-black dark:text-white" />
                                </motion.button>
                            )}

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={cn(
                                    "px-5 h-10 flex items-center gap-2 rounded-full transition-colors font-medium text-sm",
                                    isMobileMenuOpen
                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                        : "bg-black/5 dark:bg-white/10 text-black dark:text-white"
                                )}
                            >
                                {isMobileMenuOpen ? (
                                    <>
                                        <span>Kapat</span>
                                        <X className="w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        <span>Menü</span>
                                        <Menu className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* EXPANDED MENU CONTENT */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="px-4 pb-6"
                            >
                                <div className="space-y-2 pt-2">
                                    {navLinks.map((link, i) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white shadow-sm">
                                                    <link.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-lg font-semibold text-black dark:text-white">
                                                    {link.label}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5">
                                    <AuthButton />
                                    <div className="mt-4 flex justify-center">
                                        <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-[#FFC800]" />
                                            Designed for Exploration
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </LayoutGroup>
    );
}
