"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { SiteLogo } from "@/components/icons/site-logo";
import { Menu, Search, Home, Feather, MessageCircle, Library, Trophy, Compass, X, ChevronRight, LogOut, User } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthButton } from "@/components/auth/auth-button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

    const navLinks = [
        { href: "/", label: "Anasayfa", icon: Home },
        { href: "/makale", label: "Makale", icon: Feather },
        { href: "/blog", label: "Blog", icon: Compass },
        { href: "/forum", label: "Forum", icon: MessageCircle },
        { href: "/sozluk", label: "Lügat", icon: Library },
        { href: "/siralamalar", label: "Sıralama", icon: Trophy },
    ];

    return (
        <>
            {/* 
                V13 REFINED NEO-BRUTALIST NAVBAR
                - Style: Sharp, Clean, Functional.
                - Borders: 2px Black (Elegant Brutalism).
                - Branding: Corrected (No "Hub" Box).
                - Mobile: Clean Sheet Menu.
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    "h-16 border-b-2 border-black dark:border-white", // Fixed 64px height
                    "bg-[#FAF9F6] dark:bg-[#09090b]", // Solid background
                    scrolled ? "shadow-[0_4px_0_0_rgba(0,0,0,1)]" : "" // Hard shadow on scroll
                )}
            >
                <div className="container max-w-7xl mx-auto px-4 md:px-6 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* 1. BRAND - Corrected & Visible */}
                        <Link href="/" className="flex items-center gap-3 group relative z-50">
                            {/* Logo Icon - Black Box for Visibility */}
                            <div className="relative w-10 h-10 flex items-center justify-center bg-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
                                <SiteLogo className="w-6 h-6 bg-[#FFC800]" />
                            </div>
                            {/* Text Logo - NO YELLOW BOX on 'HUB' */}
                            <span className="text-xl md:text-2xl font-black tracking-tight text-black dark:text-white uppercase select-none">
                                FİZİK<span className="text-[#FFC800]">HUB</span>
                            </span>
                        </Link>

                        {/* 2. DESKTOP NAV - Clean & Bold */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "px-4 py-2 text-sm font-bold border-2 rounded-md transition-all duration-200 uppercase tracking-wide",
                                            isActive
                                                ? "bg-[#FFC800] border-black text-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5"
                                                : "bg-transparent border-transparent text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-900 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff]"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* 3. ACTIONS */}
                        <div className="flex items-center gap-2 md:gap-3">

                            {/* Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 border-2 border-black dark:border-white text-black dark:text-white hover:bg-[#FFC800] dark:hover:bg-[#FFC800] hover:text-black dark:hover:text-black transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none rounded-md"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Notifications */}
                            <div className="hidden sm:flex w-10 h-10 items-center justify-center bg-white dark:bg-zinc-900 border-2 border-black dark:border-white text-black dark:text-white hover:bg-[#FFC800] dark:hover:bg-[#FFC800] hover:text-black dark:hover:text-black transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none rounded-md">
                                <NotificationBell />
                            </div>

                            {/* Desktop Auth */}
                            <div className="hidden lg:block relative z-50">
                                <AuthButton />
                            </div>

                            {/* MOBILE MENU TRIGGER - Standard Neo-Brutalist Button */}
                            <div className="lg:hidden">
                                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                    <SheetTrigger asChild>
                                        <button className="h-10 px-3 flex items-center gap-2 bg-[#FFC800] border-2 border-black text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all rounded-md">
                                            <span className="text-sm font-black uppercase">Menü</span>
                                            <Menu className="w-5 h-5 stroke-[3px]" />
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[85vw] sm:w-[380px] bg-[#FAF9F6] dark:bg-[#09090b] border-l-2 border-black dark:border-white p-0 overflow-y-auto z-[100]">
                                        <div className="flex flex-col min-h-full">

                                            {/* DRAWER HEADER */}
                                            <div className="h-16 px-6 border-b-2 border-black dark:border-white bg-[#FFC800] flex items-center justify-between sticky top-0 z-10">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 flex items-center justify-center bg-black border-2 border-black shadow-[2px_2px_0px_0px_white]">
                                                        <SiteLogo className="w-5 h-5 bg-[#FFC800]" />
                                                    </div>
                                                    <span className="text-lg font-black text-black uppercase tracking-tight">NAVİGASYON</span>
                                                </div>
                                                <SheetClose className="w-8 h-8 flex items-center justify-center bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-colors shadow-[2px_2px_0px_0px_white]">
                                                    <X className="w-5 h-5" />
                                                </SheetClose>
                                            </div>

                                            {/* DRAWER LINKS */}
                                            <div className="p-6 space-y-3 flex-1">
                                                {navLinks.map((link) => {
                                                    const isActive = pathname === link.href;
                                                    return (
                                                        <Link
                                                            key={link.href}
                                                            href={link.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={cn(
                                                                "flex items-center justify-between p-4 border-2 rounded-lg transition-all font-bold text-base uppercase",
                                                                isActive
                                                                    ? "bg-[#FFC800] border-black text-black shadow-[4px_4px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                                                                    : "bg-white dark:bg-zinc-900 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-[#FFC800] dark:hover:bg-white dark:hover:text-black hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_#fff]"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <link.icon className="w-5 h-5" />
                                                                {link.label}
                                                            </div>
                                                            <ChevronRight className="w-5 h-5" />
                                                        </Link>
                                                    )
                                                })}

                                                <div className="my-6 border-t-2 border-black dark:border-zinc-800" />

                                                {/* Mobile Auth */}
                                                <div className="flex flex-col gap-3">
                                                    <div className="p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white rounded-lg shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
                                                        <span className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Kullanıcı İşlemleri</span>
                                                        <AuthButton />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* FOOTER DECOR */}
                                            <div className="p-4 bg-black text-white text-center border-t-2 border-black dark:border-white">
                                                <p className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-80">
                                                    Bilimi Ti'ye Alıyoruz
                                                </p>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            {/* SPACER for fixed header */}
            <div className="h-16" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
