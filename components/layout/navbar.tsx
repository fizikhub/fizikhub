"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
                V9 NEO-BRUTALIST NAVBAR 
                - Height: 64px (h-16)
                - Border: 3px Black
                - Background: Soft Grey / Dark Soft Grey
                - Interaction: Tactile Buttons
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    "h-16 border-b-[3px] border-black dark:border-black", // Fixed height & border
                    "bg-[#FAF9F6] dark:bg-[#18181b]", // V9 Colors
                    scrolled ? "shadow-md" : ""
                )}
            >
                <div className="container max-w-7xl mx-auto px-4 md:px-6 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* 1. BRAND - Tighter, Cleaner */}
                        <Link href="/" className="flex items-center gap-2 group relative z-50">
                            <div className="relative w-10 h-10 flex items-center justify-center bg-[#FFC800] border-[3px] border-black shadow-[2px_2px_0px_0px_#000] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
                                <SiteLogo className="w-5 h-5 text-black fill-current" />
                            </div>
                            <span className="text-xl md:text-2xl font-black tracking-tight text-black dark:text-white uppercase">
                                FİZİK<span className="text-black bg-[#FFC800] px-1 border-[2px] border-black ml-0.5 shadow-[1px_1px_0px_0px_#000]">HUB</span>
                            </span>
                        </Link>

                        {/* 2. DESKTOP NAV - Sticker Style */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "px-3 py-1.5 text-sm font-bold border-[2px] rounded-md transition-all duration-200 uppercase tracking-wide",
                                            isActive
                                                ? "bg-[#FFC800] border-black text-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5"
                                                : "bg-transparent border-transparent text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#27272a] hover:border-black hover:text-black dark:hover:text-white hover:shadow-[2px_2px_0px_0px_#000]"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* 3. ACTIONS - Unified Button Sizes */}
                        <div className="flex items-center gap-2 md:gap-3">

                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#27272a] border-[2px] border-black text-black dark:text-white hover:bg-[#FFC800] dark:hover:bg-[#FFC800] hover:text-black dark:hover:text-black transition-colors rounded-md"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Notifications */}
                            <div className="hidden sm:flex w-10 h-10 items-center justify-center bg-white dark:bg-[#27272a] border-[2px] border-black text-black dark:text-white hover:bg-[#FFC800] dark:hover:bg-[#FFC800] hover:text-black dark:hover:text-black transition-colors rounded-md">
                                <NotificationBell />
                            </div>

                            {/* Desktop Auth */}
                            <div className="hidden lg:block">
                                <AuthButton />
                            </div>

                            {/* Mobile Menu Trigger */}
                            <div className="lg:hidden">
                                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                    <SheetTrigger asChild>
                                        <button className="w-10 h-10 flex items-center justify-center bg-[#FFC800] border-[2px] border-black text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all rounded-md">
                                            <Menu className="w-6 h-6 stroke-[3px]" />
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[85vw] sm:w-[400px] bg-[#FAF9F6] border-l-[3px] border-black p-0 text-black dark:bg-[#18181b] dark:text-white dark:border-black overflow-hidden z-[100]">
                                        <div className="h-full flex flex-col">
                                            {/* Mobile Header */}
                                            <div className="h-16 px-6 border-b-[3px] border-black bg-[#FFC800] flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 flex items-center justify-center bg-black text-[#FFC800]">
                                                        <SiteLogo className="w-5 h-5 fill-current" />
                                                    </div>
                                                    <span className="text-xl font-black text-black uppercase tracking-tight">MENÜ</span>
                                                </div>
                                                <SheetClose className="w-8 h-8 flex items-center justify-center bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-colors">
                                                    <X className="w-5 h-5" />
                                                </SheetClose>
                                            </div>

                                            {/* Mobile Links */}
                                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                                {navLinks.map((link) => {
                                                    const isActive = pathname === link.href;
                                                    return (
                                                        <Link
                                                            key={link.href}
                                                            href={link.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={cn(
                                                                "flex items-center gap-4 p-3 border-[2px] rounded-lg transition-all font-bold text-lg uppercase",
                                                                isActive
                                                                    ? "bg-[#FFC800] border-black text-black shadow-[3px_3px_0px_0px_#000]"
                                                                    : "bg-white dark:bg-[#27272a] border-black dark:border-black text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                            )}
                                                        >
                                                            <link.icon className="w-5 h-5" />
                                                            {link.label}
                                                        </Link>
                                                    )
                                                })}

                                                <div className="my-4 border-t-[3px] border-black dark:border-zinc-700" />

                                                {/* Mobile Auth */}
                                                <div className="flex flex-col gap-3">
                                                    <AuthButton />
                                                </div>
                                            </div>

                                            {/* Mobile Footer Decor */}
                                            <div className="p-4 bg-black text-white text-center border-t-[3px] border-black">
                                                <p className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-80">
                                                    FizikHub &copy; 2026
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

            {/* Spacer for Fixed Header */}
            <div className="h-16" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
