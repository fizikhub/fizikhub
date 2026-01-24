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
import { motion, AnimatePresence } from "framer-motion";

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
        { href: "/", label: "Anasayfa", icon: Home, desc: "Keşfet" },
        { href: "/makale", label: "Makale", icon: Feather, desc: "Oku" },
        { href: "/blog", label: "Blog", icon: Compass, desc: "Düşün" },
        { href: "/forum", label: "Forum", icon: MessageCircle, desc: "Tartış" },
        { href: "/sozluk", label: "Lügat", icon: Library, desc: "Öğren" },
        { href: "/siralamalar", label: "Sıralama", icon: Trophy, desc: "Yarış" },
    ];

    return (
        <>
            {/* 
                V11 NEO-SWISS NAVBAR
                - Concept: "Editorial / Magazine"
                - Style: Clean, Bold, Minimalist
                - Mobile: Full Screen Overlay
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    "border-b-2 border-black dark:border-white", // Solid 2px Border
                    "bg-[#FAF9F6]/90 backdrop-blur-md dark:bg-[#18181b]/90", // Frosted Glass
                    scrolled ? "h-16" : "h-20"
                )}
            >
                <div className="container max-w-7xl mx-auto px-6 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* 1. BRAND - Pure & Bold */}
                        <Link href="/" className="flex items-center gap-3 group relative z-50">
                            <div className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg group-hover:rotate-6 transition-transform">
                                <SiteLogo className="w-6 h-6 fill-current bg-white dark:bg-black" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-black dark:text-white uppercase leading-none">
                                FİZİK<span className="text-[#FFC800]">HUB</span>
                            </span>
                        </Link>

                        {/* 2. DESKTOP NAV - Minimal Links */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "text-sm font-black uppercase tracking-wide transition-colors relative group py-2",
                                            isActive
                                                ? "text-black dark:text-white"
                                                : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                                        )}
                                    >
                                        {link.label}
                                        <span className={cn(
                                            "absolute bottom-0 left-0 w-full h-[2px] bg-[#FFC800] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300",
                                            isActive && "scale-x-100"
                                        )} />
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* 3. ACTIONS */}
                        <div className="flex items-center gap-4">

                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <Search className="w-5 h-5 text-black dark:text-white" />
                            </button>

                            {/* Auth */}
                            <div className="hidden lg:block">
                                <AuthButton />
                            </div>

                            {/* MOBILE MENU TRIGGER - Simple & Bold */}
                            <div className="lg:hidden">
                                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                    <SheetTrigger asChild>
                                        <button className="flex items-center gap-2 group">
                                            <span className="font-bold text-sm uppercase hidden sm:block">Menü</span>
                                            <div className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg group-active:scale-95 transition-transform">
                                                <Menu className="w-6 h-6" />
                                            </div>
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-full sm:w-[400px] bg-[#FAF9F6] dark:bg-[#0D0D0D] border-l-2 border-black dark:border-white p-0 overflow-hidden z-[100]">

                                        <div className="flex flex-col h-full">
                                            {/* DRAWER HEADER */}
                                            <div className="p-6 flex items-center justify-between border-b-2 border-black dark:border-white">
                                                <span className="text-xl font-black uppercase text-black dark:text-white">Navigasyon</span>
                                                <SheetClose className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg hover:rotate-90 transition-transform">
                                                    <X className="w-6 h-6" />
                                                </SheetClose>
                                            </div>

                                            {/* DRAWER LINKS - Huge Typography */}
                                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 ">
                                                {navLinks.map((link, idx) => (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="group flex flex-col border-b-2 border-gray-200 dark:border-zinc-800 pb-4 last:border-0"
                                                    >
                                                        <span className="text-[10px] font-bold text-[#FFC800] uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                                            {link.desc}
                                                        </span>
                                                        <span className={cn(
                                                            "text-4xl font-black uppercase tracking-tighter text-black dark:text-white transition-all group-hover:text-black dark:group-hover:text-white group-hover:pl-4",
                                                            pathname === link.href ? "text-[#FFC800] dark:text-[#FFC800]" : ""
                                                        )}>
                                                            {link.label}
                                                        </span>
                                                    </Link>
                                                ))}

                                                <div className="mt-auto">
                                                    <AuthButton />
                                                </div>
                                            </div>

                                            {/* DRAWER FOOTER */}
                                            <div className="p-6 bg-black dark:bg-white text-white dark:text-black">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold uppercase tracking-widest text-xs">FizikHub v2.0</span>
                                                    <div className="flex gap-2 text-xs opacity-60">
                                                        <span>Gizlilik</span>
                                                        <span>•</span>
                                                        <span>Şartlar</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </SheetContent>
                                </Sheet>
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer to prevent content jump */}
            <div className={scrolled ? "h-16" : "h-20"} />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
