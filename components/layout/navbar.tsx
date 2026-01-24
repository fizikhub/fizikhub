"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { SiteLogo } from "@/components/icons/site-logo";
import { Menu, Search, Home, Feather, MessageCircle, Library, Trophy, Compass, X } from "lucide-react";
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
                AUTHENTIC NEO-BRUTALIST NAVBAR 
                - Amber Yellow (#FFC800) Brand
                - Hard Black Borders
                - Hard Shadows (4px)
                - No Blur/Glass Effects
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-black dark:border-white",
                    "bg-[#FAF9F6] dark:bg-[#0D0D0D]",
                    scrolled ? "py-2" : "py-4"
                )}
            >
                <div className="container max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-16">

                        {/* 1. BRAND - Hard Box */}
                        <Link href="/" className="flex items-center gap-3 group relative z-50">
                            <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#FFC800] border-2 border-black shadow-[4px_4px_0px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_0px_#000] transition-all dark:border-white dark:shadow-[4px_4px_0px_0px_#fff] dark:group-hover:shadow-[2px_2px_0px_0px_#fff]">
                                <SiteLogo className="w-6 h-6 md:w-7 md:h-7 text-black fill-current" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-black dark:text-white uppercase hidden sm:block">
                                FİZİK<span className="text-black bg-[#FFC800] px-1 border-2 border-black ml-1 shadow-[2px_2px_0px_0px_#000] dark:border-white dark:shadow-[2px_2px_0px_0px_#fff]">HUB</span>
                            </span>
                        </Link>

                        {/* 2. DESKTOP NAV - Hard Buttons */}
                        <nav className="hidden lg:flex items-center gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 text-sm font-bold border-2 transition-all duration-200 uppercase",
                                        pathname === link.href
                                            ? "bg-[#FFC800] border-black text-black shadow-[4px_4px_0px_0px_#000] -translate-y-1 dark:border-white dark:shadow-[4px_4px_0px_0px_#fff]"
                                            : "bg-white border-black text-black hover:bg-[#FFC800] hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 dark:bg-black dark:text-white dark:border-white dark:hover:bg-[#FFC800] dark:hover:text-black dark:hover:shadow-[4px_4px_0px_0px_#fff]"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* 3. ACTIONS */}
                        <div className="flex items-center gap-4">

                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border-2 border-black text-black hover:bg-[#FFC800] hover:shadow-[4px_4px_0px_0px_#000] transition-all group dark:bg-black dark:border-white dark:text-white dark:hover:bg-[#FFC800] dark:hover:text-black dark:hover:shadow-[4px_4px_0px_0px_#fff]"
                            >
                                <Search className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                            </button>

                            {/* Notifications */}
                            <div className="hidden sm:flex w-10 h-10 md:w-12 md:h-12 items-center justify-center bg-white border-2 border-black hover:bg-[#FFC800] hover:shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-y-1 dark:bg-black dark:border-white dark:hover:bg-[#FFC800] dark:hover:shadow-[4px_4px_0px_0px_#fff]">
                                <NotificationBell />
                            </div>

                            {/* Mobile Menu Trigger */}
                            <div className="lg:hidden">
                                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                    <SheetTrigger asChild>
                                        <button className="w-10 h-10 flex items-center justify-center bg-[#FFC800] border-2 border-black text-black shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all dark:border-white dark:shadow-[4px_4px_0px_0px_#fff]">
                                            <Menu className="w-6 h-6 stroke-[3px]" />
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[85vw] sm:w-[400px] bg-[#FAF9F6] border-l-4 border-black p-0 text-black dark:bg-[#0D0D0D] dark:text-white dark:border-white overflow-hidden">
                                        <div className="h-full flex flex-col">
                                            {/* Mobile Header */}
                                            <div className="p-6 border-b-4 border-black bg-[#FFC800] dark:border-white">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                                            <SiteLogo className="w-6 h-6 text-black" />
                                                        </div>
                                                        <span className="text-xl font-black text-black">MENÜ</span>
                                                    </div>
                                                    <SheetClose className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_#000]">
                                                        <X className="w-6 h-6 text-black hover:text-white" />
                                                    </SheetClose>
                                                </div>
                                            </div>

                                            {/* Mobile Links */}
                                            <div className="flex-1 overflow-y-auto p-6 space-y-3">
                                                {navLinks.map((link) => (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-4 p-4 border-2 transition-all font-black text-lg uppercase",
                                                            pathname === link.href
                                                                ? "bg-[#FFC800] border-black text-black shadow-[4px_4px_0px_0px_#000] -translate-y-1 dark:border-white dark:shadow-[4px_4px_0px_0px_#fff]"
                                                                : "bg-white border-black text-black hover:bg-[#FFC800] hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 dark:bg-black dark:text-white dark:border-white dark:hover:bg-[#FFC800] dark:hover:text-black dark:hover:shadow-[4px_4px_0px_0px_#fff]"
                                                        )}
                                                    >
                                                        <link.icon className="w-6 h-6" />
                                                        {link.label}
                                                    </Link>
                                                ))}

                                                <div className="my-6 border-t-4 border-black dark:border-white" />

                                                {/* Mobile Auth */}
                                                <div className="flex flex-col gap-4">
                                                    <AuthButton />
                                                </div>
                                            </div>

                                            {/* Mobile Footer Decor */}
                                            <div className="p-4 bg-black text-white border-t-4 border-black dark:bg-white dark:text-black dark:border-white">
                                                <p className="font-bold text-center text-xs uppercase tracking-widest">
                                                    Bilimi Ti'ye Alıyoruz
                                                </p>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* Desktop Auth */}
                            <div className="hidden lg:block relative z-50">
                                <AuthButton />
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
